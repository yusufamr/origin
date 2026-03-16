import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
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

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

// Placeholder until server functions are wired up
const mockClients = [
  { id: 1, firstName: 'Ahmed', lastName: 'Hassan', phone: '+201001234567' },
  { id: 2, firstName: 'Sara', lastName: 'Ali', phone: '+201112345678' },
  { id: 3, firstName: 'Mohamed', lastName: 'Khaled', phone: '+201223456789' },
]

function RootComponent() {
  const [clientOpen, setClientOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)
  const [comboOpen, setComboOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'sent' | 'done' | null>(null)
  const [selectedCity, setSelectedCity] = useState<'cairo' | 'alex' | 'giza' | null>(null)

  const selectedClient = mockClients.find((c) => c.id === selectedClientId)

  const statuses = [
    { value: 'sent' as const, label: 'Sent' },
    { value: 'done' as const, label: 'Done' },
  ]

  const cities = [
    { value: 'cairo' as const, label: 'Cairo' },
    { value: 'alex' as const, label: 'Alexandria' },
    { value: 'giza' as const, label: 'Giza' },
  ]

  return (
    <>
      <header className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--header-bg)] px-6 py-3 backdrop-blur">
        <Link to="/">
          <Button variant="ghost">Home</Button>
        </Link>
        <Button onClick={() => setClientOpen(true)}>New Client</Button>
        <Button onClick={() => setProjectOpen(true)}>New Project</Button>
      </header>

      <Outlet />

      {/* New Client Dialog */}
      <Dialog open={clientOpen} onOpenChange={setClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1234567890" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone2">Phone Number 2 <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="phone2" type="tel" placeholder="+1234567890" />
            </div>
            <Button type="submit" className="mt-2">Create Client</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={projectOpen} onOpenChange={setProjectOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="projectName">Project Name</Label>
              <Input id="projectName" placeholder="e.g. Villa North Wing" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="e.g. 12 Nile St, Cairo" />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label>Status</Label>
                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={statusOpen}
                      className="w-full justify-between font-normal"
                    >
                      {selectedStatus
                        ? statuses.find((s) => s.value === selectedStatus)?.label
                        : 'Select status...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {statuses.map((s) => (
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

              <div className="flex flex-1 flex-col gap-1.5">
                <Label>City</Label>
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={cityOpen}
                      className="w-full justify-between font-normal"
                    >
                      {selectedCity
                        ? cities.find((c) => c.value === selectedCity)?.label
                        : 'Select city...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44 p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {cities.map((c) => (
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

            <div className="flex flex-col gap-1.5">
              <Label>Assign to Client</Label>
              <Popover open={comboOpen} onOpenChange={setComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboOpen}
                    className="w-full justify-between font-normal"
                  >
                    {selectedClient
                      ? `${selectedClient.firstName} ${selectedClient.lastName} — ${selectedClient.phone}`
                      : 'Select a client...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search by name or phone..." />
                    <CommandList>
                      <CommandEmpty>No clients found.</CommandEmpty>
                      <CommandGroup>
                        {mockClients.map((c) => (
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

            <Button type="submit" className="mt-2" disabled={!selectedClientId || !selectedCity}>
              Create Project
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
