import { ExpenseList } from './ExpenseList'

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>XpenseTrack Dashboard</h1>
      <nav style={{ marginBottom: '20px' }}>
        <button>Home</button>
        <button>Expenses</button>
        <button>Dashboard</button>
      </nav>
      <ExpenseList />
    </div>
  )
}

export default App
