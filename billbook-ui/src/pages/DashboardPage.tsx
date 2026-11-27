import { useEffect, useState } from 'react'
import { getDashboard } from '@/api/dashboard'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage } from '@/lib/api'
import type { DashboardData } from '@/types'

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getDashboard({ months: 6 })
      .then((res) => {
        if (!cancelled) {
          setData(res)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load dashboard data'))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <PageContainer title="Dashboard">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((slot) => (
              <Card key={slot}>
                <CardContent className="p-5">
                  <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="mt-3 h-7 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
    )
  }

  if (error || !data) {
    return (
      <PageContainer title="Dashboard">
        <Card>
          <CardContent className="text-sm text-red-600 dark:text-red-400">
            {error ?? 'Unable to load dashboard.'}
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-6">
        <OverviewCards overview={data.overview} currency={data.currency} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueChart data={data.monthlyRevenue} currency={data.currency} />
          <ExpenseChart data={data.expensesByCategory} currency={data.currency} />
        </div>
        <RecentActivity rows={data.recentActivity} />
      </div>
    </PageContainer>
  )
}
