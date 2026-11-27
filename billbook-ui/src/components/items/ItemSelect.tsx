import { Select } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import type { ItemTemplate } from '@/types'

interface ItemSelectProps {
  items: ItemTemplate[]
  currency?: string
  onSelect: (item: ItemTemplate) => void
}

export function ItemSelect({ items, currency = 'INR', onSelect }: ItemSelectProps) {
  const options = [
    { value: '', label: 'Insert saved item...' },
    ...items.map((item) => ({
      value: item.id,
      label: `${item.name} (${formatCurrency(item.defaultRate, currency, 0)} / ${item.unit})`,
    })),
  ]

  return (
    <Select
      name="itemTemplateId"
      value=""
      onChange={(e) => {
        const selected = items.find((item) => item.id === e.target.value)
        if (selected) {
          onSelect(selected)
        }
      }}
      options={options}
    />
  )
}
