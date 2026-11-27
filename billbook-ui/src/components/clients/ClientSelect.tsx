import { Select } from '@/components/ui'

const clientOptions = [
  { value: '1', label: 'Acme Solutions Pvt Ltd' },
  { value: '2', label: 'Priya Nair' },
  { value: '3', label: 'Rohan Kulkarni' },
  { value: '4', label: 'Ananya Iyer' },
]

interface ClientSelectProps {
  label?: string
  defaultValue?: string
}

export function ClientSelect({ label = 'Client', defaultValue = '1' }: ClientSelectProps) {
  return <Select label={label} name="clientId" defaultValue={defaultValue} options={clientOptions} />
}
