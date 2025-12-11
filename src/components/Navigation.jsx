import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="app-title">
          📊 Customer Insights Workbench
        </Link>
        <nav>
          <ul>
            <li>
              <Link 
                to="/search" 
                className={location.pathname === '/search' || location.pathname === '/' ? 'active' : ''}
              >
                Search
              </Link>
            </li>
            <li>
              <Link 
                to="/upload" 
                className={location.pathname === '/upload' ? 'active' : ''}
              >
                Upload
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navigation
