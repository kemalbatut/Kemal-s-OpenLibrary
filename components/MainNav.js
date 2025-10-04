// components/MainNav.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

const THEME_KEY = 'theme'; // 'light' | 'dark'

export default function MainNav() {
  const [theme, setTheme] = useState('light');

  // initialize theme (saved or system)
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(THEME_KEY) : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial = saved === 'dark' || saved === 'light' ? saved : (prefersDark ? 'dark' : 'light');

    setTheme(initial);
    document.body.setAttribute('data-theme', initial);
    document.documentElement.setAttribute('data-bs-theme', initial); // Bootstrap theming
  }, []);

  // keep attributes + storage in sync
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';

  return (
    <>
      <Navbar bg={isDark ? 'dark' : 'light'} variant={isDark ? 'dark' : 'light'} expand="md" className="fixed-top shadow-sm">
        <Container>
          <Navbar.Brand>Kemal's OpenLibrary</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/">Home</Nav.Link>
              <Nav.Link as={Link} href="/browse">Browse</Nav.Link>
              <Nav.Link as={Link} href="/book-search">Book Search</Nav.Link>
              <Nav.Link as={Link} href="/author-search">Author Search</Nav.Link>
              <Nav.Link as={Link} href="/about">About</Nav.Link>
            </Nav>
            <div className="d-flex align-items-center gap-2">
              <Button size="sm" variant={isDark ? 'outline-light' : 'outline-dark'} onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* spacer for fixed-top navbar */}
      <div style={{ height: 64 }} />
    </>
  );
}
