import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUsers, 
  faList, 
  faDollarSign, 
  faSearch, 
  faChartLine,
  faCog,
  faUserPlus,
  faFileAlt,
  faCalendarAlt,
  faReceipt
} from '@fortawesome/free-solid-svg-icons'

const Welcome = () => {
    const { username, isManager, isAdmin } = useAuth()
    useTitle(`Harbor Bible: ${username}`)
    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    // Group the menu items by category
    const memberSection = [
        { to: "/dash/members", text: "View Members", icon: faUsers },
        { to: "/dash/members/new", text: "Add New Member", icon: faUserPlus }
    ];

    const categorySection = isManager || isAdmin ? [
        { to: "/dash/categories", text: "View Categories", icon: faList },
        { to: "/dash/categories/new", text: "Add New Category", icon: faList }
    ] : [];

    const contributionSection = [
        { to: "/dash/contributions", text: "View Contributions", icon: faDollarSign },
        { to: "/dash/contributions/new", text: "Add New Contribution", icon: faDollarSign },
        { to: "/dash/contributions/search", text: "Search Contributions", icon: faSearch },
        { to: "/dash/contributions/chart", text: "Contributions Chart", icon: faChartLine }
    ];

    const reportSection = [
        { to: "/dash/contributions/report", text: "Report", icon: faFileAlt },
        { to: "/dash/contributions/annual", text: "Annual Report", icon: faCalendarAlt },
        { to: "/dash/contributions/tax", text: "Tax Report", icon: faReceipt }
    ];

    const userSection = [
        { to: "/dash/users", text: "View User Settings", icon: faCog },
        { to: "/dash/users/new", text: "Add New User", icon: faUserPlus }
    ];

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
                    {/* Members Section */}
                    <div className="dashboard-section">
                        <h3 className="section-title">Members</h3>
                        <div className="section-grid">
                            {memberSection.map((item, index) => (
                                <Link to={item.to} key={index} className="dash-card">
                                    <FontAwesomeIcon icon={item.icon} className="card-icon" />
                                    <h2>{item.text}</h2>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Categories Section */}
                    {(isManager || isAdmin) && (
                        <div className="dashboard-section">
                            <h3 className="section-title">Categories</h3>
                            <div className="section-grid">
                                {categorySection.map((item, index) => (
                                    <Link to={item.to} key={index} className="dash-card">
                                        <FontAwesomeIcon icon={item.icon} className="card-icon" />
                                        <h2>{item.text}</h2>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contributions Section */}
                    <div className="dashboard-section">
                        <h3 className="section-title">Contributions</h3>
                        <div className="section-grid">
                            {contributionSection.map((item, index) => (
                                <Link to={item.to} key={index} className="dash-card">
                                    <FontAwesomeIcon icon={item.icon} className="card-icon" />
                                    <h2>{item.text}</h2>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Reports Section */}
                    <div className="dashboard-section">
                        <h3 className="section-title">Reports</h3>
                        <div className="section-grid">
                            {reportSection.map((item, index) => (
                                <Link to={item.to} key={index} className="dash-card">
                                    <FontAwesomeIcon icon={item.icon} className="card-icon" />
                                    <h2>{item.text}</h2>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Users Section */}
                    <div className="dashboard-section">
                        <h3 className="section-title">Users</h3>
                        <div className="section-grid">
                            {userSection.map((item, index) => (
                                <Link to={item.to} key={index} className="dash-card">
                                    <FontAwesomeIcon icon={item.icon} className="card-icon" />
                                    <h2>{item.text}</h2>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Welcome