'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import type { Domain, Source } from '@/lib/types'

interface DatasetFiltersProps {
  selectedDomains: Domain[]
  selectedSources: Source[]
  onDomainChange: (domains: Domain[]) => void
  onSourceChange: (sources: Source[]) => void
}

const domains: { value: Domain; label: string }[] = [
  { value: 'technical', label: 'Technical' },
  { value: 'government', label: 'Government' },
  { value: 'coding', label: 'Coding' },
]

const sources: { value: Source; label: string }[] = [
  { value: 'reddit', label: 'Reddit' },
  { value: 'arxiv', label: 'arXiv' },
  { value: 'stackoverflow', label: 'Stack Overflow' },
]

export function DatasetFilters({
  selectedDomains,
  selectedSources,
  onDomainChange,
  onSourceChange,
}: DatasetFiltersProps) {
  const toggleDomain = (domain: Domain) => {
    if (selectedDomains.includes(domain)) {
      onDomainChange(selectedDomains.filter((d) => d !== domain))
    } else {
      onDomainChange([...selectedDomains, domain])
    }
  }

  const toggleSource = (source: Source) => {
    if (selectedSources.includes(source)) {
      onSourceChange(selectedSources.filter((s) => s !== source))
    } else {
      onSourceChange([...selectedSources, source])
    }
  }

  const clearFilters = () => {
    onDomainChange([])
    onSourceChange([])
  }

  const hasFilters = selectedDomains.length > 0 || selectedSources.length > 0

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Domain</h3>
        <div className="flex flex-wrap gap-2">
          {domains.map((domain) => (
            <Badge
              key={domain.value}
              variant={selectedDomains.includes(domain.value) ? 'default' : 'outline'}
              className="cursor-pointer transition-colors"
              onClick={() => toggleDomain(domain.value)}
            >
              {domain.label}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Source</h3>
        <div className="flex flex-wrap gap-2">
          {sources.map((source) => (
            <Badge
              key={source.value}
              variant={selectedSources.includes(source.value) ? 'default' : 'outline'}
              className="cursor-pointer transition-colors"
              onClick={() => toggleSource(source.value)}
            >
              {source.label}
            </Badge>
          ))}
        </div>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
