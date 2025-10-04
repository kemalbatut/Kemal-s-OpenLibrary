import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useRouter } from 'next/router';

const THEME_KEY = 'theme';

function NavLink({ href, children }) {
  const router = useRouter();
  const active = router.pathname === href;
  return (
    <Nav.Link
      as={Link}
      href={href}
      className={`nav-link-modern ${active ? 'active' : ''}`}
    >
      {children}
    </Nav.Link>
  );
}

export default function MainNav() {
  const [theme, setTheme] = useState('light');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(THEME_KEY) : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial = saved === 'dark' || saved === 'light' ? saved : (prefersDark ? 'dark' : 'light');

    setTheme(initial);
    document.body.setAttribute('data-theme', initial);
    document.documentElement.setAttribute('data-bs-theme', initial);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);

  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <Navbar
        expand="lg"
        className="fixed-top navbar-glass border-0"
        bg={isDark ? 'dark' : 'light'}
        variant={isDark ? 'dark' : 'light'}
      >
        <Container className="maxw">
          <Navbar.Brand className="fw-bold">
            <i className="bi bi-book-half me-2" aria-hidden /> Kemal&apos;s OpenLibrary
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNav" onClick={() => setShow(true)} />
          <Navbar.Offcanvas
            id="offcanvasNav"
            placement="end"
            show={show}
            onHide={() => setShow(false)}
            className="offcanvas-modern"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="fw-semibold">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="me-auto gap-1">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/browse">Browse</NavLink>
                <NavLink href="/book-search">Book Search</NavLink>
                <NavLink href="/author-search">Author Search</NavLink>
                <NavLink href="/about">About</NavLink>
              </Nav>
              <div className="d-flex align-items-center gap-2">
                <Button
                  size="sm"
                  variant={isDark ? 'outline-light' : 'outline-dark'}
                  onClick={toggleTheme}
                >
                  {isDark ? '☀️ Light' : '🌙 Dark'}
                </Button>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <div style={{ height: 72 }} />
    </>
  );
}
