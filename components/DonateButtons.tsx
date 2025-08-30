'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, CreditCard, Banknote } from 'lucide-react'

export function DonateButtons() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const amounts = [
    { value: 5, label: '5 USDT', description: 'Coffee fund' },
    { value: 10, label: '10 USDT', description: 'Popular choice', popular: true },
    { value: 25, label: '25 USDT', description: 'Great support' },
    { value: 50, label: '50 USDT', description: 'Major impact' }
  ]

  const handleDonate = (amount: number) => {
    setSelectedAmount(amount)
    // Here you would integrate with payment processor
    console.log(`Donating ${amount} USDT`)
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          Support Our Cause
        </CardTitle>
        <p className="text-muted-foreground">
          Your donations help us advocate for democratic reform in the UK
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* One-time Donations */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            One-time Donation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amounts.map((amount) => (
              <Button
                key={amount.value}
                variant={selectedAmount === amount.value ? "default" : "outline"}
                onClick={() => handleDonate(amount.value)}
                className="relative h-auto p-4 flex-col gap-1"
              >
                {amount.popular && (
                  <Badge className="absolute -top-2 -right-2 text-xs px-1 py-0">
                    Popular
                  </Badge>
                )}
                <span className="text-lg font-bold">{amount.label}</span>
                <span className="text-xs text-muted-foreground">
                  {amount.description}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Monthly Donations */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Monthly Support
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amounts.map((amount) => (
              <Button
                key={`monthly-${amount.value}`}
                variant="outline"
                onClick={() => handleDonate(amount.value)}
                className="relative h-auto p-4 flex-col gap-1"
              >
                <span className="text-lg font-bold">{amount.label}</span>
                <span className="text-xs text-muted-foreground">per month</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Or enter a custom amount
          </p>
          <div className="flex gap-2 max-w-xs mx-auto">
            <input
              type="number"
              placeholder="Amount"
              className="flex-1 px-3 py-2 border rounded-md"
              min="1"
            />
            <Button variant="outline" className="px-4">
              Donate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
