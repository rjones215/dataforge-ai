export type Domain = 'technical' | 'government' | 'coding'
export type Source = 'reddit' | 'arxiv' | 'stackoverflow'

export interface Dataset {
  id: string
  title: string
  description: string
  domain: Domain
  source: Source
  size: string
  qualityScore: number
  price: number
  downloadCount: number
  createdAt: string
}

export interface PricingTier {
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}
