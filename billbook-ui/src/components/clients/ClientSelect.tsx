import { Select } from '@/components/ui'
import type { Client } from '@/types'

interface ClientSelectProps {
  clients: Client[]
  value: string
  onChange: (clientId: string) => void
  label?: string
  error?: string
}

export function ClientSelect({
  clients,
  value,
  onChange,
  label = 'Client',
  error,
}: ClientSelectProps) {
  const options = [
    { value: '', label: 'Select a client...' },
    ...clients.map((client) => ({
      value: client.id,
      label: client.email ? `${client.name} (${client.email})` : client.name,
    })),
  ]

  return (
    <Select
      label={label}
      name="clientId"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      error={error}
    />
  )
}
