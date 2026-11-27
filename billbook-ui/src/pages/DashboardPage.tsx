import { PageContainer } from '@/components/layout'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

export function DashboardPage() {
  return (
    <PageContainer title="Dashboard">
      <div className="space-y-6">
        <OverviewCards />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueChart />
          <ExpenseChart />
        </div>
        <RecentActivity />
      </div>
    </PageContainer>
  )
}
