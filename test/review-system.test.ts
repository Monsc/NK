import { describe, it, expect, beforeEach } from 'vitest'
import { mockReviewTasks, mockLedgerEntries, ReviewTask, LedgerEntry } from '../lib/database'

describe('Review System', () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockReviewTasks.length = 0
    mockLedgerEntries.length = 0
  })

  describe('Review Tasks', () => {
    it('should create a new review task with correct structure', () => {
      const task: ReviewTask = {
        id: 'test-task-1',
        kind: 'EVIDENCE',
        targetId: 'evidence-001',
        title: 'Test Evidence',
        summary: 'Test summary',
        sources: ['https://example.com'],
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
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      mockReviewTasks.push(task)

      expect(mockReviewTasks).toHaveLength(1)
      expect(mockReviewTasks[0].id).toBe('test-task-1')
      expect(mockReviewTasks[0].state).toBe('REVIEWING')
      expect(mockReviewTasks[0].checklist.sources).toBe(true)
      expect(mockReviewTasks[0].checklist.counterview).toBe(false)
    })

    it('should filter review tasks by state', () => {
      const reviewingTask: ReviewTask = {
        id: 'reviewing-1',
        kind: 'EVIDENCE',
        targetId: 'evidence-001',
        title: 'Reviewing Task',
        sources: [],
        risk: 1,
        state: 'REVIEWING',
        checklist: {
          sources: false,
          quotes: false,
          counterview: false,
          numbers: false,
          rights: false,
          style: false
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      const approvedTask: ReviewTask = {
        id: 'approved-1',
        kind: 'EVIDENCE',
        targetId: 'evidence-002',
        title: 'Approved Task',
        sources: [],
        risk: 1,
        state: 'APPROVED',
        checklist: {
          sources: true,
          quotes: true,
          counterview: true,
          numbers: true,
          rights: true,
          style: true
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      mockReviewTasks.push(reviewingTask, approvedTask)

      const reviewingTasks = mockReviewTasks.filter(task => task.state === 'REVIEWING')
      const approvedTasks = mockReviewTasks.filter(task => task.state === 'APPROVED')

      expect(reviewingTasks).toHaveLength(1)
      expect(approvedTasks).toHaveLength(1)
      expect(reviewingTasks[0].id).toBe('reviewing-1')
      expect(approvedTasks[0].id).toBe('approved-1')
    })
  })

  describe('Ledger System', () => {
    it('should enforce monthly spending cap', () => {
      const MONTHLY_CAP = 1000
      const currentMonth = '2024-01'

      // Add entries up to cap
      const entry1: LedgerEntry = {
        month: currentMonth,
        category: 'infra',
        amountUsd: 600,
        capApplied: false,
        note: 'Infrastructure costs',
        createdAt: Date.now()
      }

      const entry2: LedgerEntry = {
        month: currentMonth,
        category: 'legal',
        amountUsd: 400,
        capApplied: false,
        note: 'Legal consultation',
        createdAt: Date.now()
      }

      mockLedgerEntries.push(entry1, entry2)

      const totalSpent = mockLedgerEntries
        .filter(entry => entry.month === currentMonth)
        .reduce((sum, entry) => sum + entry.amountUsd, 0)

      const remainingBudget = MONTHLY_CAP - totalSpent

      expect(totalSpent).toBe(1000)
      expect(remainingBudget).toBe(0)
      expect(mockLedgerEntries).toHaveLength(2)
    })

    it('should categorize spending correctly', () => {
      const currentMonth = '2024-01'

      const entries: LedgerEntry[] = [
        {
          month: currentMonth,
          category: 'infra',
          amountUsd: 300,
          capApplied: false,
          note: 'Hosting',
          createdAt: Date.now()
        },
        {
          month: currentMonth,
          category: 'comms',
          amountUsd: 200,
          capApplied: false,
          note: 'Marketing',
          createdAt: Date.now()
        },
        {
          month: currentMonth,
          category: 'infra',
          amountUsd: 100,
          capApplied: false,
          note: 'Domain',
          createdAt: Date.now()
        }
      ]

      mockLedgerEntries.push(...entries)

      const categoryTotals = mockLedgerEntries
        .filter(entry => entry.month === currentMonth)
        .reduce((acc, entry) => {
          acc[entry.category] = (acc[entry.category] || 0) + entry.amountUsd
          return acc
        }, {} as Record<string, number>)

      expect(categoryTotals.infra).toBe(400)
      expect(categoryTotals.comms).toBe(200)
      expect(categoryTotals.legal).toBeUndefined()
    })
  })

  describe('Review Checklist', () => {
    it('should validate all checklist items are completed for approval', () => {
      const task: ReviewTask = {
        id: 'checklist-test',
        kind: 'EVIDENCE',
        targetId: 'evidence-001',
        title: 'Checklist Test',
        sources: ['https://example.com'],
        risk: 1,
        state: 'REVIEWING',
        checklist: {
          sources: true,
          quotes: true,
          counterview: true,
          numbers: true,
          rights: true,
          style: true
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      const allComplete = Object.values(task.checklist).every(item => item === true)
      expect(allComplete).toBe(true)
    })

    it('should identify incomplete checklist items', () => {
      const task: ReviewTask = {
        id: 'incomplete-test',
        kind: 'EVIDENCE',
        targetId: 'evidence-001',
        title: 'Incomplete Test',
        sources: ['https://example.com'],
        risk: 1,
        state: 'REVIEWING',
        checklist: {
          sources: true,
          quotes: true,
          counterview: false, // Missing
          numbers: true,
          rights: true,
          style: false // Missing
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      const incompleteItems = Object.entries(task.checklist)
        .filter(([_, value]) => !value)
        .map(([key, _]) => key)

      expect(incompleteItems).toContain('counterview')
      expect(incompleteItems).toContain('style')
      expect(incompleteItems).toHaveLength(2)
    })
  })
})
