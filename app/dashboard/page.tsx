import Link from 'next/link'
import { DatasetCard } from '@/components/dataset-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { datasets } from '@/lib/data'
import { ArrowRight, CreditCard, Database, Download, Key } from 'lucide-react'

const stats = [
  { name: 'Available Credits', value: '2,500', icon: CreditCard, change: '+12%' },
  { name: 'Datasets Purchased', value: '14', icon: Database, change: '+3' },
  { name: 'Total Downloads', value: '47', icon: Download, change: '+8' },
  { name: 'API Calls Today', value: '1,234', icon: Key, change: '+156' },
]

export default function DashboardPage() {
  const recentDatasets = datasets.slice(0, 6)

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Welcome back! Here&apos;s an overview of your account.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/datasets" className="gap-2">
              Browse Datasets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-primary">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">API Keys</h3>
                <p className="text-sm text-muted-foreground">Manage your API access</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Downloads</h3>
                <p className="text-sm text-muted-foreground">View download history</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Billing</h3>
                <p className="text-sm text-muted-foreground">Manage your subscription</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Datasets */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Recent Datasets</h2>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/datasets" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
