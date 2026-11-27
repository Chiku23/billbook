import { Moon, Sun } from 'lucide-react'
import type { Theme } from '@/App'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

interface ThemeToggleProps {
  theme: Theme
  onChangeTheme: (theme: Theme) => void
}

export function ThemeToggle({ theme, onChangeTheme }: ThemeToggleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose between light and dark interface themes.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Button
          variant={theme === 'light' ? 'primary' : 'outline'}
          onClick={() => onChangeTheme('light')}
        >
          <Sun className="h-4 w-4" />
          Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'primary' : 'outline'}
          onClick={() => onChangeTheme('dark')}
        >
          <Moon className="h-4 w-4" />
          Dark
        </Button>
      </CardContent>
    </Card>
  )
}
