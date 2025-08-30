import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SupportPage() {
  const currentDonations = 28450
  const monthlyTarget = 50000
  const tiers = [
    { amount: 10, label: 'Supporter' },
    { amount: 25, label: 'Advocate' },
    { amount: 50, label: 'Champion' }
  ]

  return (
    <div className="container-responsive py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Transparency</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Every contribution is accounted for and publicly verifiable. We publish transaction hashes and provide regular updates.
            </p>
            <div className="mt-4 text-2xl font-bold text-red-600">
              {currentDonations} USDT / {monthlyTarget} USDT
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tiers.map((tier) => (
              <div key={tier.amount} className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold text-red-600">{tier.amount} USDT</CardTitle>
                <Button asChild>
                  <a href={`/donate/${tier.amount}`}>Donate {tier.amount} USDT</a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
