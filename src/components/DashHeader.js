
import React, { useState , useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faPerson,
    faPersonCirclePlus,
    faSquarePlus,
    faSquare,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';
//import '../shared.js';
const DASH_REGEX = /^\/dash(\/)?$/
const CATEGORIES_REGEX = /^\/dash\/categories(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/
const MEMBERS_REGEX = /^\/dash\/members(\/)?$/
const CONTRIBUTIONS_REGEX = /^\/dash\/contributions(\/)?$/


const DashHeader = () => {
    const { isManager, isAdmin } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); 
    const toggleButtonRef = useRef(null); 
    const mobileNavRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only run this code if both refs are available
            if (toggleButtonRef.current && mobileNavRef.current) {
                if (!toggleButtonRef.current.contains(event.target) && 
                    !mobileNavRef.current.contains(event.target)) {
                    setIsMobileNavOpen(false);
                }
            }
        };

        // Only add the listener if the elements exist
        if (toggleButtonRef.current && mobileNavRef.current) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup function
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); 

    const onNewContributionClicked = () => navigate('/dash/contributions/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onNewCategoryClicked = () => navigate('/dash/categories/new')
    const onNewMemberClicked = () => navigate('/dash/members/new')
    const onCategoriesClicked = () => navigate('/dash/categories')
    const onMembersClicked = () => navigate('/dash/members')
    const onContributionsClicked = () => navigate('/dash/contributions')
    const onUsersClicked = () => navigate('/dash/users')

    

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !CATEGORIES_REGEX.test(pathname) && !USERS_REGEX.test(pathname) && !MEMBERS_REGEX.test(pathname) && !CONTRIBUTIONS_REGEX.test(pathname) ) {
        dashClass = "dash-header__container--small"
    }

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    let newContributionButton = null
    if (CONTRIBUTIONS_REGEX.test(pathname)) {
        newContributionButton = (
            <Nav.Link href="/dash/contributions/new" style={{ color: "white" }}>New Contribution</Nav.Link>
        )
    }
    

    let newCategoryButton = null
    if (isManager || isAdmin) {
        if (CATEGORIES_REGEX.test(pathname)) {
            newCategoryButton = (
                <Nav.Link href="/dash/categories/new" style={{ color: "white" }}>New Category</Nav.Link>
             )
        }
    }

    let newUserButton = null
    if (isManager || isAdmin) {
        if (USERS_REGEX.test(pathname)) {
            newUserButton = (
                <Nav.Link href="/dash/users/new" style={{ color: "white" }}>New User</Nav.Link>
             )
        }
    }

    let newMemberButton = null
    if (MEMBERS_REGEX.test(pathname)) {
        newMemberButton = (
            <Nav.Link href="/dash/members/new" style={{ color: "white" }}>New Member</Nav.Link>
        )
    }
    let contributionButton = null
    if (!CONTRIBUTIONS_REGEX.test(pathname)&& pathname.includes('/dash')) {
        contributionButton = (
            <Nav.Link href="/dash/contributions" style={{ color: "white" }}>Contributions</Nav.Link>
        )
    }
    let reportButton = null
    if (pathname.includes('/dash')) {
        reportButton = (
            <Nav.Link href="/dash/contributions/report" style={{ color: "white" }}>Report</Nav.Link>
        )
    }

    let categoryButton = null
    if (!CATEGORIES_REGEX.test(pathname)&& pathname.includes('/dash')) {
        categoryButton = (
            <Nav.Link href="/dash/categories" style={{ color: "white" }}>Categories</Nav.Link>
        )
    }
    let memberButton = null
    
        if (!MEMBERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            memberButton = (
                <Nav.Link href="/dash/members" style={{ color: "white" }}>Members</Nav.Link>
            )
        }
     

    let userButton = null
    
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <Nav.Link href="/dash/users" style={{ color: "white" }}>Users</Nav.Link>
            )
        }
    

    const errClass = isError ? "errmsg" : "offscreen"

    let buttonContent
    if (isLoading) {
        buttonContent = <p>Logging Out...</p>
    } else {
        buttonContent = (
            <>
                {newContributionButton}
                
                {newMemberButton}
                {newCategoryButton}
                {newUserButton}
                {contributionButton}
                {reportButton}
                {memberButton}
                {categoryButton}
                {userButton}
                {logoutButton}
            </>
        )
    }

    const handleToggleClick = () => {
        setIsMobileNavOpen(prev => !prev);
    };

    const createMobileNavItems = () => {
        const navItems = [];
        
        if (!CONTRIBUTIONS_REGEX.test(pathname) && pathname.includes('/dash')) {
            navItems.push({ to: '/dash/contributions', text: 'Contributions' });
        }

        if (!CONTRIBUTIONS_REGEX.test(pathname) && pathname.includes('/dash')) {
            navItems.push({ to: '/dash/contributions/report', text: 'Report' });
        }
        
        if (!MEMBERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            navItems.push({ to: '/dash/members', text: 'Members' });
        }
        
        if (!CATEGORIES_REGEX.test(pathname) && pathname.includes('/dash')) {
            navItems.push({ to: '/dash/categories', text: 'Categories' });
        }
        
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            navItems.push({ to: '/dash/users', text: 'Users' });
        }

        // Add "New" buttons when on respective pages
        if (CONTRIBUTIONS_REGEX.test(pathname)) {
            navItems.push({ to: '/dash/contributions/new', text: 'New Contribution' });
        }
        
        if (MEMBERS_REGEX.test(pathname)) {
            navItems.push({ to: '/dash/members/new', text: 'New Member' });
        }
        
        if (CATEGORIES_REGEX.test(pathname) && (isManager || isAdmin)) {
            navItems.push({ to: '/dash/categories/new', text: 'New Category' });
        }
        
        if (USERS_REGEX.test(pathname) && (isManager || isAdmin)) {
            navItems.push({ to: '/dash/users/new', text: 'New User' });
        }

        return navItems.map((item, index) => (
            <li key={index} className="mobile-nav__item">
                <Link 
                    to={item.to} 
                    onClick={() => setIsMobileNavOpen(false)}
                >
                    {item.text}
                </Link>
            </li>
        ));
    };

    const content = (
        <>
        
        
        <header className="dash-header">
        
            <div >
                
                <Navbar 
                    
                    className = "custom-navbar bg-transparent" variant="dark" expand="lg" >
                <Container fluid> 
                <button className="toggle-button" onClick={handleToggleClick} ref={toggleButtonRef} > 
                <span className="toggle-button__bar"></span>
                <span className="toggle-button__bar"></span>
                <span className="toggle-button__bar"></span>
                </button>     
               
                <p className={errClass}>{error?.data?.message}</p>
                <Navbar.Brand href="/dash"style={{ color: "white", marginRight: "2rem", display: "flex", alignItems: "center" }}>
                <img
                    src="/light.png"
                    width="50"
                    height="50"
                    className="d-inline-block align-top"
                    alt="lighthouse icon"
                    style={{ marginRight: "10px" }}
                />
                    Harbor Bible Church</Navbar.Brand>
                
                <Nav className="ms-auto flex-column flex-md-row" >
                    {/* add more buttons later */}
                    {buttonContent}
                    </Nav>
                    
                    </Container>  
                    
                </Navbar>
            </div>
        </header>
        
        <nav className={`mobile-nav ${isMobileNavOpen ? 'open' : ''}`} ref={mobileNavRef}>
                <ul className="mobile-nav__items">
                    {createMobileNavItems()}
                    <li className="mobile-nav__item mobile-nav__logout">
                        {logoutButton}
                    </li>
                </ul>
            </nav>

     
    </>
  );

  return content
}
export default DashHeader;