import {Container, Nav, Navbar, NavDropdown, Row} from "react-bootstrap";
import logo from "../images/logo.png";
function NavBarContainer() {
  return (
        <div className={'nav-bar-container'}>
            <Navbar bg="dark" expand="lg" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home"><img src={logo} alt="" width="60" height="auto" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Dashboard</Nav.Link>
                            <Nav.Link href="#link">Projects</Nav.Link>
                        </Nav>
                        <Nav >
                            <NavDropdown title="User detail" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Sarvesh Mahajan</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Role: admin</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Sign out
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
  );
}
export default NavBarContainer;
