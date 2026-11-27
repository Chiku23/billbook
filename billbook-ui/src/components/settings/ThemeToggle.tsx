import { Moon, Sun } from 'lucide-react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export function ThemeToggle() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose between light and dark interface themes.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Button variant="outline">
          <Sun className="h-4 w-4" />
          Light
        </Button>
        <Button variant="outline">
          <Moon className="h-4 w-4" />
          Dark
        </Button>
      </CardContent>
    </Card>
  )
}
