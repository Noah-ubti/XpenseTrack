import React, { FormEvent, useMemo, useState } from 'react'
import { Expense, useExpenses } from './useExpenses'

const inputStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '6px',
}

export const ExpenseList: React.FC = () => {
  const { expenses, addExpense, editExpense, deleteExpense } = useExpenses()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const sortedExpenses = useMemo(
    () => [...expenses].sort((a, b) => b.date.localeCompare(a.date)),
    [expenses],
  )

  const groupedExpenses = useMemo(() => {
    return sortedExpenses.reduce((acc, expense) => {
      const month = /^\d{4}-\d{2}/.test(expense.date)
        ? expense.date.substring(0, 7)
        : 'Unknown date'
      acc[month] ??= []
      acc[month].push(expense)
      return acc
    }, {} as Record<string, Expense[]>)
  }, [sortedExpenses])

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  )

  const resetForm = () => {
    setDescription('')
    setAmount('')
    setDate(new Date().toISOString().substring(0, 10))
    setEditingId(null)
    setError('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const parsedAmount = Number(amount)
    if (!description.trim()) {
      setError('Description is required.')
      return
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than zero.')
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError('A valid date is required.')
      return
    }

    const expense = {
      description: description.trim(),
      amount: parsedAmount,
      date,
    }

    if (editingId) editExpense(editingId, expense)
    else addExpense(expense)

    resetForm()
  }

  const beginEdit = (expense: Expense) => {
    setEditingId(expense.id)
    setDescription(expense.description)
    setAmount(expense.amount.toString())
    setDate(expense.date)
    setError('')
  }

  return (
    <div>
      <section style={{ marginBottom: '24px' }}>
        <h2>{editingId ? 'Edit expense' : 'Add expense'}</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'center' }}
        >
          <input
            aria-label="Description"
            placeholder="Description"
            value={description}
            onChange={event => setDescription(event.target.value)}
            style={inputStyle}
          />
          <input
            aria-label="Amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={event => setAmount(event.target.value)}
            style={inputStyle}
          />
          <input
            aria-label="Date"
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            style={inputStyle}
          />
          <button type="submit">{editingId ? 'Save' : 'Add'}</button>
        </form>
        {editingId && (
          <button type="button" onClick={resetForm} style={{ marginTop: '8px' }}>
            Cancel
          </button>
        )}
        {error && <p role="alert" style={{ color: '#b00020' }}>{error}</p>}
      </section>

      <section id="dashboard-summary" style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
        <strong>Total:</strong> ${total.toFixed(2)}
      </section>

      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        Object.entries(groupedExpenses).map(([month, exps]) => (
          <section key={month} style={{ marginBottom: '20px' }}>
            <h3>{month}</h3>
            <ul>
              {exps.map(expense => (
                <li key={expense.id} style={{ marginBottom: '8px' }}>
                  {expense.date}: {expense.description} - ${expense.amount.toFixed(2)}{' '}
                  <button type="button" onClick={() => beginEdit(expense)}>Edit</button>{' '}
                  <button type="button" onClick={() => deleteExpense(expense.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
