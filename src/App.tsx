import { ExpenseList } from './ExpenseList'

const App = () => {
  const navigateTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>XpenseTrack Dashboard</h1>
      <nav aria-label="Main navigation" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
        <button type="button" onClick={() => navigateTo('expenses')}>Expenses</button>
        <button type="button" onClick={() => navigateTo('dashboard-summary')}>Dashboard</button>
      </nav>
      <section id="expenses">
        <ExpenseList />
      </section>
    </main>
  )
}

export default App
