import { cn } from '@/lib/utils'

interface CurrencyDisplayProps {
  amount: number | string
  currencySymbol?: string
  className?: string
}

export function CurrencyDisplay({
  amount,
  currencySymbol = '₹',
  className,
}: CurrencyDisplayProps) {
  return (
    <span className={cn('tabular-nums', className)}>
      {typeof amount === 'number' ? `${currencySymbol}${amount.toLocaleString('en-IN')}` : amount}
    </span>
  )
}
