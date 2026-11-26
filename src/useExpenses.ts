import { useState } from 'react'

export interface Expense {
  id: string
  description: string
  amount: number
  date: string
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...expense, id: Date.now().toString() }])
  }

  const editExpense = (id: string, updatedExpense: Partial<Omit<Expense, 'id'>>) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, ...updatedExpense } : exp))
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  return { expenses, addExpense, editExpense, deleteExpense }
}
