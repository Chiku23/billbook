import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Database } from 'lucide-react'
import type { Theme } from '@/App'
import { getSettings } from '@/api/settings'
import { checkHealth, type HealthResponse } from '@/api/system'
import { PageContainer } from '@/components/layout'
import { BusinessProfileForm } from '@/components/settings/BusinessProfileForm'
import { DefaultsForm } from '@/components/settings/DefaultsForm'
import { ThemeToggle } from '@/components/settings/ThemeToggle'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { getApiErrorMessage } from '@/lib/api'
import type { SettingsData } from '@/types'

interface SettingsPageProps {
  theme: Theme
  settings: SettingsData | null
  onChangeTheme: (theme: Theme) => void
  onSettingsUpdated: (updated: SettingsData) => void
}

export function SettingsPage({
  theme,
  settings,
  onChangeTheme,
  onSettingsUpdated,
}: SettingsPageProps) {
  const [fetchedSettings, setFetchedSettings] = useState<SettingsData | null>(null)
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(!settings)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    checkHealth()
      .then((res) => {
        if (!cancelled) setHealth(res)
      })
      .catch(() => {
        if (!cancelled) setHealth(null)
      })

    if (settings) {
      return () => {
        cancelled = true
      }
    }

    getSettings()
      .then((data) => {
        if (!cancelled) {
          setFetchedSettings(data)
          onSettingsUpdated(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load settings'))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [settings, onSettingsUpdated])

  const activeSettings = settings ?? fetchedSettings

  const handleSaved = (updated: SettingsData) => {
    setFetchedSettings(updated)
    onSettingsUpdated(updated)
  }

  return (
    <PageContainer title="Settings">
      <div className="max-w-4xl space-y-6">
        {loading && !activeSettings && (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Loading settings...
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="text-sm text-red-600 dark:text-red-400">{error}</CardContent>
          </Card>
        )}

        {activeSettings && (
          <>
            <BusinessProfileForm
              key={`profile-${activeSettings.updatedAt ?? 'init'}`}
              initialData={activeSettings.businessProfile}
              onSaved={handleSaved}
            />
            <DefaultsForm
              key={`defaults-${activeSettings.updatedAt ?? 'init'}`}
              initialData={activeSettings.invoiceDefaults}
              onSaved={handleSaved}
            />
          </>
        )}

        <ThemeToggle theme={theme} onChangeTheme={onChangeTheme} />

        <Card>
          <CardHeader>
            <CardTitle>Data & Backup</CardTitle>
            <CardDescription>
              Export all workspace data as JSON or CSV, or restore from a previous backup.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <Database className="h-4 w-4 text-slate-400" />
              <span>BillBook Laravel API</span>
              {health ? (
                <Badge variant="success" dot>
                  {health.database === 'connected' ? 'API & DB Connected' : 'API Online'}
                </Badge>
              ) : (
                <Badge variant="danger" dot>
                  API Unreachable
                </Badge>
              )}
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
