import React, { useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import IndexPage from './pages/index'
import OrderPage from './pages/order'
import './styles/global.css'

function App() {
  const [route, setRoute] = useState<{ page: 'search' } | { page: 'order'; flightId: string }>({ page: 'search' })

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      const orderMatch = hash.match(/^#\/order\/(.+)$/)
      if (orderMatch) {
        setRoute({ page: 'order', flightId: orderMatch[1] })
      } else {
        setRoute({ page: 'search' })
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const navigateToOrder = useCallback((flightId: string) => {
    window.location.hash = '#/order/' + flightId
  }, [])

  const navigateToSearch = useCallback(() => {
    window.location.hash = ''
  }, [])

  if (route.page === 'order') {
    return <OrderPage flightId={route.flightId} onBack={navigateToSearch} />
  }

  return <IndexPage onNavigateToOrder={navigateToOrder} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
