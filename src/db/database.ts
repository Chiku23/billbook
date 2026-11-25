import Dexie, { type Table } from 'dexie'
import type { Document } from '@/features/invoices/types'
import type { Client } from '@/features/clients/types'
import type { ItemTemplate } from '@/features/items/types'
import type { Expense } from '@/features/expenses/types'

export class BillBookDB extends Dexie {
  invoices!: Table<Document>
  clients!: Table<Client>
  items!: Table<ItemTemplate>
  expenses!: Table<Expense>

  constructor() {
    super('BillBookDB')
    this.version(1).stores({
      invoices: 'id, type, status, clientId, number, issueDate, dueDate, updatedAt',
      clients: 'id, name, email',
      items: 'id, name',
      expenses: 'id, date, category, vendor',
    })
  }
}

export const db = new BillBookDB()
