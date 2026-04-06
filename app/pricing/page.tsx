import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { pricingTiers } from '@/lib/data'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Choose the plan that fits your needs. All plans include access to our API and core features.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative flex flex-col border-border bg-card ${
                    tier.highlighted
                      ? 'border-primary shadow-lg shadow-primary/10'
                      : ''
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-foreground">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">
                        ${tier.price}
                      </span>
                      {tier.price > 0 && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={tier.highlighted ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href="/register">{tier.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="mt-12 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Can I switch plans at any time?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we&apos;ll prorate any billing differences.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  What payment methods do you accept?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  We accept all major credit cards, PayPal, and wire transfers for Enterprise plans. All payments are processed securely through Stripe.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Is there a free trial for Pro?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Yes! All new Pro subscriptions include a 14-day free trial. No credit card required to start.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  What&apos;s included in Enterprise support?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Enterprise customers get a dedicated account manager, 24/7 support, custom SLAs, and priority access to new datasets and features.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
