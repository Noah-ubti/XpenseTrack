import React, { useMemo } from 'react'
import { useExpenses } from './useExpenses'

export const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense } = useExpenses()
  
  const groupedExpenses = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      const month = exp.date.substring(0, 7)
      if (!acc[month]) acc[month] = []
      acc[month].push(exp)
      return acc
    }, {} as Record<string, typeof expenses>)
  }, [expenses])

  return (
    <div>
      {Object.entries(groupedExpenses).map(([month, exps]) => (
        <div key={month} style={{ marginBottom: '20px' }}>
          <h3>{month}</h3>
          <ul>
            {exps.map(exp => (
              <li key={exp.id}>
                {exp.date}: {exp.description} - ${exp.amount.toFixed(2)}
                <button onClick={() => deleteExpense(exp.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
