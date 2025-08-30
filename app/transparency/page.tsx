import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LedgerChart } from '@/components/LedgerChart'
import { mockLedgerEntries } from '@/lib/database'

export default function TransparencyPage() {
  // Get current month
  const currentMonth = new Date().toISOString().slice(0, 7) // yyyy-mm format
  
  // Calculate ledger data for current month
  const entries = mockLedgerEntries.filter(entry => entry.month === currentMonth)
  const totalSpent = entries.reduce((sum, entry) => sum + entry.amountUsd, 0)
  const remainingBudget = Math.max(0, 1000 - totalSpent)
  
  const categoryTotals = entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.amountUsd
    return acc
  }, {} as Record<string, number>)

  const ledgerData = {
    month: currentMonth,
    totalSpent,
    remainingBudget,
    monthlyCap: 1000,
    categoryTotals
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
                Financial Transparency
              </h1>
              <p className="text-xl text-gray-600">
                Complete transparency in our operations and spending. Every penny is accounted for.
              </p>
            </div>

            <div className="space-y-8">
              {/* Monthly Budget Overview */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-black">
                  Monthly Operating Budget
                </h2>
                <LedgerChart data={ledgerData} />
              </div>

              {/* Recent Transactions */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-black">
                  Recent Transactions
                </h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {entries.map((entry, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {entry.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              £{entry.amountUsd.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {entry.note}
                            </td>
                          </tr>
                        ))}
                        {entries.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                              No transactions for this month
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Transparency Principles */}
              <div className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-black">
                  Our Transparency Principles
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black">Public Ledger</h3>
                    <p className="text-gray-600">
                      All financial transactions are publicly visible and verifiable. We maintain a real-time ledger of all income and expenses.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black">Monthly Caps</h3>
                    <p className="text-gray-600">
                      We operate under strict monthly spending limits to ensure sustainable operations and maintain donor trust.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black">Categorized Spending</h3>
                    <p className="text-gray-600">
                      All expenses are categorized into infrastructure, legal, tools, and communications for clear accountability.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black">Regular Audits</h3>
                    <p className="text-gray-600">
                      Our financial records are regularly audited and reviewed by independent parties to ensure accuracy and compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
