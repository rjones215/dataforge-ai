'use client'

import { useState, useMemo } from 'react'
import { DatasetCard } from '@/components/dataset-card'
import { DatasetFilters } from '@/components/dataset-filters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { datasets } from '@/lib/data'
import type { Domain, Source } from '@/lib/types'
import { Filter, Search } from 'lucide-react'

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomains, setSelectedDomains] = useState<Domain[]>([])
  const [selectedSources, setSelectedSources] = useState<Source[]>([])

  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchesSearch =
        searchQuery === '' ||
        dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDomain =
        selectedDomains.length === 0 || selectedDomains.includes(dataset.domain)

      const matchesSource =
        selectedSources.length === 0 || selectedSources.includes(dataset.source)

      return matchesSearch && matchesDomain && matchesSource
    })
  }, [searchQuery, selectedDomains, selectedSources])

  const activeFilterCount = selectedDomains.length + selectedSources.length

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Datasets</h1>
          <p className="mt-1 text-muted-foreground">
            Explore our collection of premium RLHF training datasets.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 lg:hidden">
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <DatasetFilters
                  selectedDomains={selectedDomains}
                  selectedSources={selectedSources}
                  onDomainChange={setSelectedDomains}
                  onSourceChange={setSelectedSources}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="mt-8 flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Filters</h2>
              <DatasetFilters
                selectedDomains={selectedDomains}
                selectedSources={selectedSources}
                onDomainChange={setSelectedDomains}
                onSourceChange={setSelectedSources}
              />
            </div>
          </aside>

          {/* Dataset Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredDatasets.length} of {datasets.length} datasets
              </p>
            </div>

            {filteredDatasets.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                <p className="text-lg font-medium text-foreground">No datasets found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredDatasets.map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
