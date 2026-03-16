import { Badge } from '#/components/ui/badge'

type Status = 'sent' | 'done'

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      className={
        status === 'done'
          ? 'bg-green-100 text-green-700 border-green-200'
          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
      }
    >
      {status === 'done' ? 'Done' : 'Sent'}
    </Badge>
  )
}
