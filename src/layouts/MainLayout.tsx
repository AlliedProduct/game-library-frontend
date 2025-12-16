import { Container, Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="mb-4">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Game Library</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Games</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/games/new">
                <Nav.Link>Add Game</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mb-5">
        <Outlet />
      </Container>
    </>
  );
}
