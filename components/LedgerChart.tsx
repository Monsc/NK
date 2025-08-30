'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface LedgerData {
  month: string
  totalSpent: number
  remainingBudget: number
  monthlyCap: number
  categoryTotals: Record<string, number>
}

interface LedgerChartProps {
  data: LedgerData
}

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']

export function LedgerChart({ data }: LedgerChartProps) {
  const progressPercentage = (data.totalSpent / data.monthlyCap) * 100
  
  // Convert category totals to chart data
  const pieData = Object.entries(data.categoryTotals).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount
  }))

  return (
    <div className="space-y-6">
      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Spent: £{data.totalSpent.toLocaleString()}</span>
              <span>Remaining: £{data.remainingBudget.toLocaleString()}</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-center text-sm text-gray-600">
              {progressPercentage.toFixed(1)}% of £{data.monthlyCap.toLocaleString()} monthly cap
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {pieData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`£${value.toLocaleString()}`, 'Amount']}
                    labelFormatter={(label) => `${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
