'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DataSample {
  id: string | number
  prompt: string
  response_a: string
  response_b: string
  source: 'arxiv' | 'reddit' | 'stackoverflow' | string
  domain: string
  quality_score: number | string
}

const sourceStyles: Record<string, string> = {
  arxiv: 'bg-red-500/20 text-red-400 border-red-500/30',
  reddit: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  stackoverflow: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

function truncatePrompt(prompt: string, maxLength: number) {
  if (prompt.length <= maxLength) {
    return prompt
  }
  return `${prompt.slice(0, maxLength)}...`
}

export default function SamplesPage() {
  const [samples, setSamples] = useState<DataSample[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch('/api/samples')
        if (!response.ok) {
          setSamples([])
          return
        }

        const json = await response.json()
        const rows = Array.isArray(json) ? (json as DataSample[]) : []
        setSamples(rows)
      } catch {
        setSamples([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSamples()
  }, [])

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sample Data</h1>
          <p className="mt-1 text-muted-foreground">
            Review curated preference pairs from our data sources.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <p className="text-lg font-medium text-foreground">Loading samples...</p>
          </div>
        ) : samples.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <p className="text-lg font-medium text-foreground">No sample data available</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            {samples.map((sample) => {
              const sampleId = String(sample.id)
              const isExpanded = expandedIds.has(sampleId)

              return (
                <Card key={sampleId} className="border-border bg-card">
                  <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <CardTitle className="leading-snug">
                        {truncatePrompt(sample.prompt, 100)}
                      </CardTitle>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant="outline"
                          className={sourceStyles[sample.source] ?? 'border-border text-muted-foreground'}
                        >
                          {sample.source}
                        </Badge>
                        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/20 text-blue-400">
                          {sample.domain}
                        </Badge>
                        <Badge variant="outline">Quality {Number(sample.quality_score)}</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Button variant="outline" onClick={() => toggleExpanded(sampleId)}>
                      {isExpanded ? 'Hide Pair' : 'View Pair'}
                    </Button>

                    {isExpanded && (
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                            Response A (Preferred)
                          </p>
                          <p className="mt-2 text-sm text-foreground">{sample.response_a}</p>
                        </div>
                        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-rose-400">
                            Response B (Rejected)
                          </p>
                          <p className="mt-2 text-sm text-foreground">{sample.response_b}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
