import { Select } from '@/components/ui'

const itemOptions = [
  { value: '', label: 'Select saved item...' },
  { value: 'web-dev', label: 'Web Development (₹45,000 / project)' },
  { value: 'logo', label: 'Logo Design (₹15,000 / unit)' },
  { value: 'hosting', label: 'Hosting Setup (₹4,000 / unit)' },
]

export function ItemSelect() {
  return <Select name="itemTemplateId" defaultValue="" options={itemOptions} />
}
