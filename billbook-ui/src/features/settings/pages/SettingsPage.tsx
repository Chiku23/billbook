import { Link } from 'react-router-dom'
import { Database, ArrowRight } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { BusinessProfileForm } from '../components/BusinessProfileForm'
import { DefaultsForm } from '../components/DefaultsForm'
import { ThemeToggle } from '../components/ThemeToggle'

export function SettingsPage() {
  return (
    <PageContainer title="Settings">
      <div className="max-w-4xl space-y-6">
        <BusinessProfileForm />
        <DefaultsForm />
        <ThemeToggle />

        <Card>
          <CardHeader>
            <CardTitle>Data & Backup</CardTitle>
            <CardDescription>
              Export all workspace data as JSON or CSV, or restore from a previous backup.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <Database className="h-4 w-4 text-slate-400" />
              <span>Connected to BillBook Laravel API</span>
            </div>
            <Link to="/settings/backup">
              <Button variant="outline">
                Manage Backup
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
