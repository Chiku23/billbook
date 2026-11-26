export interface BusinessProfile {
  companyName: string
  logoBase64: string | null
  logoUrl?: string | null
  address: string
  email: string
  phone: string
  taxId: string
  website: string
}

export interface InvoiceDefaults {
  currency: string
  defaultTaxPercent: number
  paymentTermsDays: number
  defaultNotes: string
  defaultTerms: string
  invoicePrefix: string
  quotePrefix: string
}

export interface SettingsData {
  theme: 'light' | 'dark'
  businessProfile: BusinessProfile
  invoiceDefaults: InvoiceDefaults
  updatedAt?: string
}
