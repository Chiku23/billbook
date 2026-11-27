import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Trash2, Upload } from 'lucide-react'
import { updateBusinessProfile } from '@/api/settings'
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
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import type { BusinessProfile, SettingsData } from '@/types'

interface BusinessProfileFormProps {
  initialData: BusinessProfile
  onSaved: (updated: SettingsData) => void
}

export function BusinessProfileForm({ initialData, onSaved }: BusinessProfileFormProps) {
  const [form, setForm] = useState<BusinessProfile>(initialData)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData.logoUrl ?? initialData.logoBase64 ?? null,
  )
  const [removeLogo, setRemoveLogo] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setRemoveLogo(false)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    setRemoveLogo(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setFeedback(null)

    const formData = new FormData()
    formData.append('companyName', form.companyName)
    formData.append('taxId', form.taxId)
    formData.append('email', form.email)
    formData.append('phone', form.phone)
    formData.append('website', form.website)
    formData.append('address', form.address)

    if (logoFile) {
      formData.append('logo', logoFile)
    }
    if (removeLogo) {
      formData.append('removeLogo', '1')
    }

    try {
      const updated = await updateBusinessProfile(formData)
      onSaved(updated)
      setFeedback({ type: 'success', text: 'Business profile saved.' })
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFeedback({
        type: 'error',
        text: getApiErrorMessage(err, 'Failed to save business profile.'),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
        <CardDescription>Appears on the header of every generated invoice and quote.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              {logoPreview ? (
                <img src={logoPreview} alt="Company logo" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Logo
                </Button>
                {logoPreview && (
                  <Button variant="ghost" size="sm" onClick={handleRemoveLogo}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PNG, JPG, WEBP or SVG up to 5MB
              </p>
              {errors.logo?.[0] && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.logo[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Company Name"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              error={errors.companyName?.[0]}
            />
            <Input
              label="Tax ID / GSTIN"
              name="taxId"
              placeholder="29ABCDE1234F1Z5"
              value={form.taxId}
              onChange={handleChange}
              error={errors.taxId?.[0]}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email?.[0]}
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone?.[0]}
            />
          </div>

          <Input
            label="Website"
            name="website"
            placeholder="https://acmestudio.in"
            value={form.website}
            onChange={handleChange}
            error={errors.website?.[0]}
          />
          <Textarea
            label="Business Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            error={errors.address?.[0]}
            rows={2}
          />
        </CardContent>
        <CardFooter>
          {feedback && (
            <span
              className={
                feedback.type === 'success'
                  ? 'mr-auto text-sm text-emerald-600 dark:text-emerald-400'
                  : 'mr-auto text-sm text-red-600 dark:text-red-400'
              }
            >
              {feedback.text}
            </span>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
