import { useEffect, useState } from 'react'

export interface Expense {
  id: string
  description: string
  amount: number
  date: string
}

const STORAGE_KEY = 'xpensetrack.expenses'

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`

const readStoredExpenses = (): Expense[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const expenses = JSON.parse(stored)
    if (!Array.isArray(expenses)) return []

    return expenses.filter((expense): expense is Expense =>
      typeof expense?.id === 'string' &&
      typeof expense?.description === 'string' &&
      typeof expense?.amount === 'number' &&
      Number.isFinite(expense.amount) &&
      typeof expense?.date === 'string',
    )
  } catch {
    return []
  }
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(readStoredExpenses)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses(current => [...current, { ...expense, id: createId() }])
  }

  const editExpense = (id: string, updatedExpense: Partial<Omit<Expense, 'id'>>) => {
    setExpenses(current =>
      current.map(expense =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense,
      ),
    )
  }

  const deleteExpense = (id: string) => {
    setExpenses(current => current.filter(expense => expense.id !== id))
  }

  return { expenses, addExpense, editExpense, deleteExpense }
}
