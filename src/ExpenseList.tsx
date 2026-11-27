import React, { FormEvent, useMemo, useState } from 'react'
import { Expense, useExpenses } from './useExpenses'

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

  const monthCount = Object.keys(groupedExpenses).length
  const formatInr = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)

  return (
    <div className="dashboard">
      <section id="overview" className="stats-grid" aria-label="Expense overview">
        <article className="stat-card">
          <div className="stat-label">Total spent</div>
          <div className="stat-value">{formatInr(total)}</div>
          <div className="stat-foot">Across {expenses.length} expense{expenses.length === 1 ? '' : 's'}</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Active months</div>
          <div className="stat-value">{monthCount}</div>
          <div className="stat-foot">Spending activity</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Average expense</div>
          <div className="stat-value">{formatInr(expenses.length ? total / expenses.length : 0)}</div>
          <div className="stat-foot">Per transaction</div>
        </article>
      </section>

      <div className="content-grid">
        <section id="expense-form" className="panel">
          <div className="panel-heading">
            <h2>{editingId ? 'Edit expense' : 'Add an expense'}</h2>
          </div>
          <form className="expense-form" onSubmit={handleSubmit}>
            <input
              className="field"
              aria-label="Description"
              placeholder="Description"
              value={description}
              onChange={event => setDescription(event.target.value)}
            />
            <input
              className="field"
              aria-label="Amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={event => setAmount(event.target.value)}
            />
            <input
              className="field"
              aria-label="Date"
              type="date"
              value={date}
              onChange={event => setDate(event.target.value)}
            />
            <button className="submit-button" type="submit">{editingId ? 'Save' : 'Add'}</button>
          </form>
          {editingId && (
            <button className="cancel-button" type="button" onClick={resetForm}>Cancel editing</button>
          )}
          {error && <p className="error-message" role="alert">{error}</p>}

          {expenses.length === 0 ? (
            <div className="empty-state">No expenses yet. Your first entry will appear here.</div>
          ) : (
            Object.entries(groupedExpenses).map(([month, exps]) => (
              <section className="month-section" key={month}>
                <h3 className="month-heading">{month}</h3>
                <ul className="expense-list">
                  {exps.map(expense => (
                    <li className="expense-row" key={expense.id}>
                      <span className="expense-icon">↗</span>
                      <div>
                        <div className="expense-name">{expense.description}</div>
                        <div className="expense-date">{expense.date}</div>
                      </div>
                      <div className="expense-amount">{formatInr(expense.amount)}</div>
                      <div className="row-actions">
                        <button className="row-button" type="button" onClick={() => beginEdit(expense)}>Edit</button>
                        <button className="row-button delete" type="button" onClick={() => deleteExpense(expense.id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </section>

        <aside className="panel insight-card">
          <div className="panel-heading"><h2>Spending rhythm</h2></div>
          <div className="insight-visual">
            <div className="chart-bars" aria-hidden="true">
              <i /><i /><i /><i /><i />
            </div>
          </div>
          <h3>Clarity comes from context</h3>
          <p>Review your monthly expenses and recurring patterns to make each decision more intentional.</p>
        </aside>
      </div>
    </div>
  )
}
