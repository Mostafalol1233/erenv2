import { formatComparePrice, formatPrice } from "@/lib/catalog"

type PriceDisplayProps = {
  price: number
  compact?: boolean
}

export default function PriceDisplay({ price, compact = false }: PriceDisplayProps) {
  return (
    <span className={`price-display${compact ? " price-display-compact" : ""}`} aria-label={`السعر ${formatPrice(price)}`}>
      <del className="price-before">{formatComparePrice(price)}</del>
      <strong className="price-current">{formatPrice(price)}</strong>
    </span>
  )
}
