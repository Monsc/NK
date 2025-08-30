// Mock data interfaces and implementations
export interface Donation {
  id: string
  amount: number
  currency: string
  donor: string
  message?: string
  timestamp: string
  transactionHash: string
  verified: boolean
}

export interface Expense {
  id: string
  description: string
  amount: number
  currency: string
  category: string
  timestamp: string
  transactionHash: string
  approvedBy: string[]
  status: 'pending' | 'approved' | 'rejected'
}

export interface Subscriber {
  id: string
  email: string
  subscribedAt: string
  preferences: {
    newsletter: boolean
    updates: boolean
    events: boolean
  }
  status: 'active' | 'unsubscribed'
}

export interface MonthlyStats {
  month: string
  totalDonations: number
  totalExpenses: number
  currency: string
  activeSubscribers: number
  newSubscribers: number
  projectsFunded: number
}

// Review System Data Models
export interface ReviewTask {
  id: string
  kind: 'EVIDENCE' | 'TEMPLATE' | 'NEWS' | 'LEDGER_REPORT'
  targetId: string
  title: string
  summary?: string
  sources: string[]
  risk: number
  state: 'REVIEWING' | 'APPROVED' | 'REJECTED'
  checklist: {
    sources: boolean
    quotes: boolean
    counterview: boolean
    numbers: boolean
    rights: boolean
    style: boolean
  }
  notes?: string
  reviewer?: string
  createdAt: number
  updatedAt: number
}

export interface AuditLog {
  id: string
  actor: string
  action: 'CREATE' | 'EDIT' | 'APPROVE' | 'PUBLISH' | 'REJECT' | 'ROLLBACK'
  target: string
  diff?: any
  createdAt: number
}

export interface LedgerEntry {
  month: string // yyyy-mm
  category: string
  amountUsd: number
  capApplied: boolean
  note?: string
  createdAt: number
}

export interface GrantProposal {
  id: string
  title: string
  summary: string
  budgetUsd: number
  milestones: any
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'EXECUTING' | 'DONE'
  publicUpdates?: any
  createdAt: number
}

// Mock data
export const mockDonations: Donation[] = [
  {
    id: '1',
    amount: 100,
    currency: 'USDT',
    donor: '0x1234...5678',
    message: 'Supporting the cause',
    timestamp: '2024-01-15T10:30:00Z',
    transactionHash: '0xabc123...def456',
    verified: true
  },
  {
    id: '2',
    amount: 50,
    currency: 'USDT',
    donor: '0x8765...4321',
    timestamp: '2024-01-14T15:45:00Z',
    transactionHash: '0xdef456...abc123',
    verified: true
  }
]

export const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Website hosting and maintenance',
    amount: 200,
    currency: 'USDT',
    category: 'Operations',
    timestamp: '2024-01-10T09:00:00Z',
    transactionHash: '0xexp123...def456',
    approvedBy: ['0xadmin1', '0xadmin2'],
    status: 'approved'
  },
  {
    id: '2',
    description: 'Community event materials',
    amount: 150,
    currency: 'USDT',
    category: 'Events',
    timestamp: '2024-01-08T14:20:00Z',
    transactionHash: '0xexp456...abc123',
    approvedBy: ['0xadmin1'],
    status: 'approved'
  }
]

export const mockSubscribers: Subscriber[] = [
  {
    id: '1',
    email: 'supporter@example.com',
    subscribedAt: '2024-01-01T00:00:00Z',
    preferences: {
      newsletter: true,
      updates: true,
      events: false
    },
    status: 'active'
  }
]

export const mockMonthlyStats: MonthlyStats[] = [
  {
    month: '2024-01',
    totalDonations: 1500,
    totalExpenses: 800,
    currency: 'USDT',
    activeSubscribers: 1250,
    newSubscribers: 150,
    projectsFunded: 8
  }
]

// Mock Review Tasks
export const mockReviewTasks: ReviewTask[] = [
  {
    id: '1',
    kind: 'EVIDENCE',
    targetId: 'evidence-001',
    title: 'Monarchy Annual Cost Analysis 2024',
    summary: 'Comprehensive analysis of taxpayer costs for maintaining the British monarchy',
    sources: ['https://republic.org.uk/costs', 'https://www.parliament.uk/monarchy-costs'],
    risk: 2,
    state: 'REVIEWING',
    checklist: {
      sources: true,
      quotes: true,
      counterview: false,
      numbers: true,
      rights: true,
      style: true
    },
    notes: 'Need to add counter-arguments section',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now()
  }
]

// Mock Ledger Entries
export const mockLedgerEntries: LedgerEntry[] = [
  {
    month: '2024-01',
    category: 'infra',
    amountUsd: 150,
    capApplied: false,
    note: 'Website hosting and domain renewal',
    createdAt: Date.now()
  },
  {
    month: '2024-01',
    category: 'legal',
    amountUsd: 300,
    capApplied: false,
    note: 'Legal consultation on advocacy materials',
    createdAt: Date.now()
  }
]

// Mock Grant Proposals
export const mockGrantProposals: GrantProposal[] = [
  {
    id: '1',
    title: 'Community Outreach Program',
    summary: 'Local events and educational materials for democratic reform advocacy',
    budgetUsd: 500,
    milestones: [
      { name: 'Event Planning', completed: true },
      { name: 'Material Creation', completed: false },
      { name: 'Community Events', completed: false }
    ],
    status: 'EXECUTING',
    createdAt: Date.now() - 604800000
  }
]

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    actor: 'reviewer-1',
    action: 'CREATE',
    target: 'evidence-001',
    createdAt: Date.now() - 86400000
  }
]
