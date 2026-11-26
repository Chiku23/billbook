import { PageContainer } from '@/components/layout'
import { OverviewCards } from '../components/OverviewCards'
import { RevenueChart } from '../components/RevenueChart'
import { ExpenseChart } from '../components/ExpenseChart'
import { RecentActivity } from '../components/RecentActivity'

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
