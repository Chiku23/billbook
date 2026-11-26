import { Upload } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from '@/components/ui'

export function BusinessProfileForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
        <CardDescription>Appears on the header of every generated invoice and quote.</CardDescription>
      </CardHeader>
      <form>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              <Upload className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <Button variant="outline" size="sm">
                Upload Logo
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PNG or JPG, recommended 256x256px
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Company Name" name="companyName" defaultValue="Acme Studio" />
            <Input label="Tax ID / GSTIN" name="taxId" placeholder="29ABCDE1234F1Z5" />
            <Input label="Email" name="email" type="email" defaultValue="billing@acmestudio.in" />
            <Input label="Phone" name="phone" type="tel" defaultValue="+91 98765 43210" />
          </div>

          <Input label="Website" name="website" placeholder="https://acmestudio.in" />
          <Textarea
            label="Business Address"
            name="address"
            defaultValue="223 Indiranagar, Bengaluru, India"
            rows={2}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Profile</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
