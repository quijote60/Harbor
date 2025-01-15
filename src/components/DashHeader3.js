import React from 'react'
import {Nav, Navbar, Container, NavDropdown} from 'react-bootstrap';  

const DashHeader3 = () => {
  return (
    <Navbar
            className="navbar-main navbar-transparent navbar-light headroom"
            expand="lg"
            id="navbar-main"
          >
  <Container fluid className="justify-content-start">
    <Navbar.Brand href="#home" style={{ color: "white", marginRight: "2rem" }}>Navbar</Navbar.Brand>
    <Nav>
      <Nav.Link href="#home" style={{ color: "white" }}>Home</Nav.Link>
      <Nav.Link href="#features" style={{ color: "white" }}>Features</Nav.Link>
      <Nav.Link href="#pricing" style={{ color: "white" }}>Pricing</Nav.Link>
    </Nav>
  </Container>
</Navbar>
  )
}

export default DashHeader3
