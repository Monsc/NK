import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import DataVisualization from '@/components/DataVisualization'

export default function AdminExpensesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Royal Expenses</h1>
        <DataVisualization 
          title="Monthly Expenses"
          data={[
            { name: 'Jan', value: 1200 },
            { name: 'Feb', value: 980 },
            { name: 'Mar', value: 1450 },
            { name: 'Apr', value: 1100 }
          ]}
          type="bar"
        />
      </main>
      <Footer />
    </div>
  )
}
