import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BusinessProfile {
  companyName: string
  logoBase64: string | null
  address: string
  email: string
  phone: string
  taxId: string
  website: string
}

interface InvoiceDefaults {
  currency: string
  defaultTaxPercent: number
  paymentTermsDays: number
  defaultNotes: string
  defaultTerms: string
  invoicePrefix: string
  quotePrefix: string
}

interface SettingsState {
  theme: 'light' | 'dark'
  businessProfile: BusinessProfile
  invoiceDefaults: InvoiceDefaults
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void
  updateInvoiceDefaults: (defaults: Partial<InvoiceDefaults>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      businessProfile: {
        companyName: '',
        logoBase64: null,
        address: '',
        email: '',
        phone: '',
        taxId: '',
        website: '',
      },
      invoiceDefaults: {
        currency: 'INR',
        defaultTaxPercent: 18,
        paymentTermsDays: 30,
        defaultNotes: '',
        defaultTerms: '',
        invoicePrefix: 'INV',
        quotePrefix: 'QT',
      },
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        set({ theme })
      },
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', next === 'dark')
          return { theme: next }
        }),
      updateBusinessProfile: (profile) =>
        set((state) => ({
          businessProfile: { ...state.businessProfile, ...profile },
        })),
      updateInvoiceDefaults: (defaults) =>
        set((state) => ({
          invoiceDefaults: { ...state.invoiceDefaults, ...defaults },
        })),
    }),
    { name: 'billbook-settings' },
  ),
)
