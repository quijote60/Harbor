import { Link } from 'react-router-dom'
import { Container, Row,Col,Card ,CardBody} from 'react-bootstrap'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
const Welcome = () => {
    const { username, isManager, isAdmin } = useAuth()
    useTitle(`Harbor Bible: ${username}`)
    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)


    return (
      <section className="welcome-section">
          <div className="shape shape-style-1 shape-default">
              {[...Array(8)].map((_, i) => (
                  <span key={i} />
              ))}
          </div>
          
          <div className="welcome-container">
              <div className="welcome-header">
                  <h1>Welcome {username}!</h1>
                  <p className="date">{today}</p>
              </div>

              <div className="dashboard-grid">
                  <Link to="/dash/members" className="dash-card">
                      <h2>View Members</h2>
                  </Link>
                  
                  <Link to="/dash/members/new" className="dash-card">
                      <h2>Add New Member</h2>
                  </Link>

                  {(isManager || isAdmin) && (
                      <>
                          <Link to="/dash/categories" className="dash-card">
                              <h2>View Categories</h2>
                          </Link>
                          <Link to="/dash/categories/new" className="dash-card">
                              <h2>Add New Category</h2>
                          </Link>
                      </>
                  )}

                  <Link to="/dash/contributions" className="dash-card">
                      <h2>View Contributions</h2>
                  </Link>

                  <Link to="/dash/contributions/new" className="dash-card">
                      <h2>Add New Contributions</h2>
                  </Link>

                  <Link to="/dash/contributions/search" className="dash-card">
                      <h2>Search Contributions</h2>
                  </Link>

                  <Link to="/dash/contributions/chart" className="dash-card">
                      <h2>Contributions Chart</h2>
                  </Link>

                  <Link to="/dash/users" className="dash-card">
                      <h2>View User Settings</h2>
                  </Link>

                  <Link to="/dash/users/new" className="dash-card">
                      <h2>Add New User</h2>
                  </Link>

                  <Link to="/dash/contributions/report" className="dash-card">
                      <h2>Report</h2>
                  </Link>
                  <Link to="/dash/contributions/annual" className="dash-card">
                      <h2>Annual Report</h2>
                  </Link>
                  <Link to="/dash/contributions/tax" className="dash-card">
                      <h2>Tax Report</h2>
                  </Link>
              </div>
          </div>
      </section>
  );
};
export default Welcome