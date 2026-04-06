import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DatasetCard } from '@/components/dataset-card'
import { Button } from '@/components/ui/button'
import { datasets } from '@/lib/data'
import { ArrowRight, Database, Key, Shield, Sparkles, Zap } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Human Verified',
    description: 'Every dataset is validated by domain experts for accuracy and relevance.',
  },
  {
    icon: Zap,
    title: 'Ready to Train',
    description: 'Pre-processed and formatted for immediate use with popular ML frameworks.',
  },
  {
    icon: Database,
    title: 'Diverse Sources',
    description: 'Curated from Reddit, arXiv, StackOverflow, and proprietary collections.',
  },
  {
    icon: Sparkles,
    title: 'Quality Scored',
    description: 'Transparent quality metrics so you know exactly what you are getting.',
  },
]

export default function HomePage() {
  const featuredDatasets = datasets.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Trusted by 500+ AI Labs Worldwide</span>
              </div>
              
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Premium RLHF Datasets for AI Labs
              </h1>
              
              <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
                Access the highest-quality human feedback datasets to train your next-generation AI models. 
                Curated, verified, and ready for production.
              </p>
              
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/dashboard/datasets" className="gap-2">
                    Browse Datasets
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/dashboard" className="gap-2">
                    <Key className="h-4 w-4" />
                    Get API Key
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Why DataForge AI?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The most comprehensive RLHF dataset marketplace built for AI researchers.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Datasets Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                  Featured Datasets
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Top-rated datasets chosen by our community.
                </p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/dashboard/datasets" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredDatasets.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>

            <div className="mt-8 flex justify-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/dashboard/datasets" className="gap-2">
                  View All Datasets
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Ready to Build Better AI?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join hundreds of AI labs using DataForge to train state-of-the-art models.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
