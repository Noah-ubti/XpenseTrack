import { ExpenseList } from './ExpenseList'

const App = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <nav className="navbar" aria-label="Main navigation">
          <div className="brand">
            <span className="brand-mark" />
            <span>XpenseTrack</span>
          </div>
          <div className="nav-actions">
            <button type="button" className="nav-button" onClick={() => scrollTo('overview')}>Overview</button>
            <button type="button" className="nav-button" onClick={() => scrollTo('expenses')}>Expenses</button>
            <button type="button" className="nav-button primary" onClick={() => scrollTo('expense-form')}>Add expense</button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="status-pill">Personal finance, simplified</div>
          <h1>Know what your <em>money</em> is telling you</h1>
          <p>Connect clarity to every purchase. Track your spending, understand patterns, and move toward what matters next.</p>
          <div className="hero-actions">
            <button type="button" className="accent" onClick={() => scrollTo('expense-form')}>Start tracking</button>
            <button type="button" className="ghost" onClick={() => scrollTo('overview')}>View overview</button>
          </div>
        </div>
      </header>

      <main id="expenses">
        <ExpenseList />
      </main>
    </div>
  )
}

export default App
