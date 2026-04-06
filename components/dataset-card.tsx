import { Dataset } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Database, Download, Star } from 'lucide-react'

const domainColors: Record<string, string> = {
  technical: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  government: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  coding: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
}

const sourceIcons: Record<string, string> = {
  reddit: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  arxiv: 'bg-red-500/20 text-red-400 border-red-500/30',
  stackoverflow: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

interface DatasetCardProps {
  dataset: Dataset
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={domainColors[dataset.domain]}>
              {dataset.domain}
            </Badge>
            <Badge variant="outline" className={sourceIcons[dataset.source]}>
              {dataset.source}
            </Badge>
          </div>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
          {dataset.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {dataset.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Size</p>
            <p className="text-sm font-medium text-foreground">{dataset.size}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Downloads</p>
            <p className="text-sm font-medium text-foreground">{dataset.downloadCount.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Quality Score</p>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-semibold text-foreground">{dataset.qualityScore}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <Progress value={dataset.qualityScore} className="mt-2 h-1.5" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-4">
        <div>
          <span className="text-2xl font-bold text-foreground">${dataset.price}</span>
          <span className="text-sm text-muted-foreground"> USD</span>
        </div>
        <Button size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}
