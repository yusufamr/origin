import { useState, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button, buttonVariants } from '#/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/components/ui/command'
import { cn } from '#/lib/utils'
import { $createProject } from '#/server/projects'
import { $listClients } from '#/server/clients'
import { getSession } from '#/lib/auth'

type Client = { id: number; firstName: string; lastName: string; phone: string }

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUSES = [
  { value: 'sent' as const, label: 'Sent' },
  { value: 'done' as const, label: 'Done' },
]

const CITIES = [
  { value: 'cairo' as const, label: 'Cairo' },
  { value: 'alex' as const, label: 'Alexandria' },
  { value: 'giza' as const, label: 'Giza' },
]

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const router = useRouter()

  const [clients, setClients] = useState<Client[]>([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'sent' | 'done' | null>(null)
  const [selectedCity, setSelectedCity] = useState<'cairo' | 'alex' | 'giza' | null>(null)
  const [comboOpen, setComboOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [error, setError] = useState('')

  // Fetch clients whenever the dialog opens
  useEffect(() => {
    if (open) {
      $listClients().then(setClients)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedClientId || !selectedCity) return
    setError('')
    try {
      const session = getSession()
      await $createProject({
        data: {
          clientId: selectedClientId,
          userId: session?.id ? Number(session.id) : null,
          name: name.trim(),
          address: address.trim(),
          city: selectedCity,
          status: selectedStatus ?? 'sent',
        },
      })
      setName('')
      setAddress('')
      setSelectedClientId(null)
      setSelectedStatus(null)
      setSelectedCity(null)
      onOpenChange(false)
      router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    }
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId)

  const triggerClass = cn(
    buttonVariants({ variant: 'outline' }),
    'w-full justify-between font-normal',
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="e.g. Villa North Wing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="e.g. 12 Nile St, Cairo"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            {/* Status */}
            <div className="flex flex-1 flex-col gap-1.5">
              <Label>Status</Label>
              <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                <PopoverTrigger
                  className={triggerClass}
                  role="combobox"
                  aria-expanded={statusOpen}
                >
                  {selectedStatus
                    ? STATUSES.find((s) => s.value === selectedStatus)?.label
                    : 'Select status...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-40 p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {STATUSES.map((s) => (
                          <CommandItem
                            key={s.value}
                            value={s.value}
                            onSelect={() => {
                              setSelectedStatus(s.value)
                              setStatusOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedStatus === s.value ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {s.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* City */}
            <div className="flex flex-1 flex-col gap-1.5">
              <Label>City</Label>
              <Popover open={cityOpen} onOpenChange={setCityOpen}>
                <PopoverTrigger
                  className={triggerClass}
                  role="combobox"
                  aria-expanded={cityOpen}
                >
                  {selectedCity
                    ? CITIES.find((c) => c.value === selectedCity)?.label
                    : 'Select city...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-44 p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {CITIES.map((c) => (
                          <CommandItem
                            key={c.value}
                            value={c.value}
                            onSelect={() => {
                              setSelectedCity(c.value)
                              setCityOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedCity === c.value ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {c.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Client */}
          <div className="flex flex-col gap-1.5">
            <Label>Assign to Client</Label>
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
              <PopoverTrigger
                className={cn(triggerClass, 'w-full')}
                role="combobox"
                aria-expanded={comboOpen}
              >
                {selectedClient
                  ? `${selectedClient.firstName} ${selectedClient.lastName} — ${selectedClient.phone}`
                  : 'Select a client...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search by name or phone..." />
                  <CommandList>
                    <CommandEmpty>No clients found.</CommandEmpty>
                    <CommandGroup>
                      {clients.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={`${c.firstName} ${c.lastName} ${c.phone}`}
                          onSelect={() => {
                            setSelectedClientId(c.id)
                            setComboOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedClientId === c.id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          <span className="font-medium">
                            {c.firstName} {c.lastName}
                          </span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {c.phone}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button
            type="submit"
            className="mt-2"
            disabled={!selectedClientId || !selectedCity}
          >
            Create Project
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
