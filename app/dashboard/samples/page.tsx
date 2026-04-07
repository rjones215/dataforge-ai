'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type SourceOption = 'all' | 'arxiv' | 'reddit' | 'stackoverflow'
type DomainOption = 'all' | 'technical' | 'government' | 'coding'

interface DataSampleRow {
  id: string | number
  prompt: string | null
  response_a?: string | null
  response_b?: string | null
  preferred_response?: string | null
  rejected_response?: string | null
  source: string | null
  domain: string | null
  quality_score: number | string | null
}

interface DataSample {
  id: string | number
  prompt: string
  preferredResponse: string
  rejectedResponse: string
  source: string
  domain: string
  qualityScore: number
}

const SOURCE_OPTIONS: SourceOption[] = ['all', 'arxiv', 'reddit', 'stackoverflow']
const DOMAIN_OPTIONS: DomainOption[] = ['all', 'technical', 'government', 'coding']

const sourceStyles: Record<string, string> = {
  arxiv: 'border-red-500/50 bg-red-500/20 text-red-300',
  reddit: 'border-orange-500/50 bg-orange-500/20 text-orange-300',
  stackoverflow: 'border-amber-500/50 bg-amber-500/20 text-amber-300',
}

const domainStyles: Record<string, string> = {
  technical: 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300',
  government: 'border-sky-500/50 bg-sky-500/20 text-sky-300',
  coding: 'border-violet-500/50 bg-violet-500/20 text-violet-300',
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength)}...`
}

function normalizeSample(row: DataSampleRow): DataSample {
  const parsedScore = Number(row.quality_score ?? 0)
  const safeScore = Number.isFinite(parsedScore) ? parsedScore : 0

  return {
    id: row.id,
    prompt: row.prompt ?? '',
    preferredResponse: row.preferred_response ?? row.response_a ?? '',
    rejectedResponse: row.rejected_response ?? row.response_b ?? '',
    source: (row.source ?? 'unknown').toLowerCase(),
    domain: (row.domain ?? 'unknown').toLowerCase(),
    qualityScore: Math.max(0, Math.min(100, safeScore)),
  }
}

export default function SamplesPage() {
  const [samples, setSamples] = useState<DataSample[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSource, setSelectedSource] = useState<SourceOption>('all')
  const [selectedDomain, setSelectedDomain] = useState<DomainOption>('all')
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set())
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const fetchSamples = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedSource !== 'all') {
          params.set('source', selectedSource)
        }
        if (selectedDomain !== 'all') {
          params.set('domain', selectedDomain)
        }

        const query = params.toString()
        const endpoint = query ? `/api/samples?${query}` : '/api/samples'
        const response = await fetch(endpoint)

        if (!response.ok) {
          setSamples([])
          return
        }

        const json = await response.json()
        const rows = Array.isArray(json) ? (json as DataSampleRow[]) : []
        setSamples(rows.map(normalizeSample))
      } catch {
        setSamples([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSamples()
  }, [selectedDomain, selectedSource])

  const toggleExpanded = (key: string) => {
    setExpandedResponses((current) => {
      const next = new Set(current)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const downloadFreeSample = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch('/api/samples?limit=50')
      if (!response.ok) {
        return
      }

      const json = await response.json()
      const rows = Array.isArray(json) ? (json as DataSampleRow[]) : []
      const jsonLines = rows.map((row) => JSON.stringify(row)).join('\n')

      const blob = new Blob([jsonLines], { type: 'application/x-ndjson;charset=utf-8' })
      const downloadUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = 'dataforge-free-sample.jsonl'
      anchor.click()
      URL.revokeObjectURL(downloadUrl)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Sample Data Preview</h1>
            <p className="mt-1 text-slate-300">
              Browse real RLHF preference pairs before you buy
            </p>
          </div>
          <Button
            type="button"
            onClick={downloadFreeSample}
            disabled={isDownloading}
            className="bg-indigo-500 text-white hover:bg-indigo-400"
          >
            {isDownloading ? 'Preparing Download...' : 'Download Free Sample (50 rows)'}
          </Button>
        </div>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">Filter by Domain</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DOMAIN_OPTIONS.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDomain(option)}
                  className={
                    selectedDomain === option
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                  }
                >
                  {option === 'all' ? 'All Domains' : option}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">Filter by Source</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOURCE_OPTIONS.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedSource(option)}
                  className={
                    selectedSource === option
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                  }
                >
                  {option === 'all' ? 'All Sources' : option}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/60 py-16">
            <p className="text-lg font-medium text-slate-100">Loading samples...</p>
          </div>
        ) : samples.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/60 py-16">
            <p className="text-lg font-medium text-slate-100">No sample data available</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            {samples.map((sample) => {
              const sampleId = String(sample.id)
              const preferredKey = `${sampleId}-preferred`
              const rejectedKey = `${sampleId}-rejected`
              const isPreferredExpanded = expandedResponses.has(preferredKey)
              const isRejectedExpanded = expandedResponses.has(rejectedKey)
              const preferredShouldTruncate = sample.preferredResponse.length > 200
              const rejectedShouldTruncate = sample.rejectedResponse.length > 200

              return (
                <Card key={sampleId} className="border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/40">
                  <CardHeader>
                    <div className="flex flex-col gap-4">
                      <CardTitle className="text-lg font-bold leading-snug text-slate-100">
                        {truncateText(sample.prompt, 120)}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={sourceStyles[sample.source] ?? 'border-slate-700 bg-slate-800 text-slate-200'}
                        >
                          {sample.source}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={domainStyles[sample.domain] ?? 'border-slate-700 bg-slate-800 text-slate-200'}
                        >
                          {sample.domain}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-300">
                        <span>Quality Score</span>
                        <span>{sample.qualityScore}/100</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${sample.qualityScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 p-4">
                        <p className="text-sm font-semibold text-emerald-300">Preferred Response</p>
                        <p className="mt-2 text-sm leading-6 text-slate-100">
                          {isPreferredExpanded
                            ? sample.preferredResponse
                            : truncateText(sample.preferredResponse, 200)}
                        </p>
                        {preferredShouldTruncate && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="mt-2 h-auto px-0 text-indigo-300 hover:bg-transparent hover:text-indigo-200"
                            onClick={() => toggleExpanded(preferredKey)}
                          >
                            {isPreferredExpanded ? 'Show less' : 'Show more'}
                          </Button>
                        )}
                      </div>

                      <div className="rounded-lg border border-rose-500/60 bg-rose-500/10 p-4">
                        <p className="text-sm font-semibold text-rose-300">Rejected Response</p>
                        <p className="mt-2 text-sm leading-6 text-slate-100">
                          {isRejectedExpanded
                            ? sample.rejectedResponse
                            : truncateText(sample.rejectedResponse, 200)}
                        </p>
                        {rejectedShouldTruncate && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="mt-2 h-auto px-0 text-indigo-300 hover:bg-transparent hover:text-indigo-200"
                            onClick={() => toggleExpanded(rejectedKey)}
                          >
                            {isRejectedExpanded ? 'Show less' : 'Show more'}
                          </Button>
                        )}
                      </div>
                    </div>
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
