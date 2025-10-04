// components/MainNav.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

export default function MainNav({ theme = 'light', onToggleTheme = () => {} }) {
  const router = useRouter();

  // Show Back on specific routes (extend if you want)
  const showBack = ['/book-search', '/author-search', '/browse'].includes(router.pathname);

  const handleBack = () => {
    // For search/browse, going Home is the clearest action
    if (showBack) router.push('/');
    else router.back();
  };

  return (
    <Navbar expand="lg" sticky="top" className="navbar-glass">
      <Container className="maxw">
        <div className="d-flex align-items-center gap-2">
          {showBack && (
            <Button
              size="sm"
              variant="outline-secondary"
              className="back-button-nav"
              aria-label="Go back"
              onClick={handleBack}
              title="Go back"
            >
              ← Back
            </Button>
          )}
          <Navbar.Brand as={Link} href="/" className="fw-semibold">
            Kemal’s OpenLibrary
          </Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/book-search" className="nav-link-modern">Book Search</Nav.Link>
            <Nav.Link as={Link} href="/author-search" className="nav-link-modern">Author Search</Nav.Link>
            <Nav.Link as={Link} href="/browse" className="nav-link-modern">Browse</Nav.Link>
            <Nav.Link as={Link} href="/about" className="nav-link-modern">About</Nav.Link>
          </Nav>

          <div className="d-flex">
            <Button size="sm" variant="outline-secondary" onClick={onToggleTheme}>
              {theme === 'dark' ? 'Light' : 'Dark'} mode
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
