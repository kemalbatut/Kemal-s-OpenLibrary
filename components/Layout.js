// components/Layout.js
import { useEffect, useState } from 'react';
import MainNav from './MainNav';
import { Container } from 'react-bootstrap';

export default function Layout({ children }) {

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = stored || (prefersDark ? 'dark' : 'light');
    setTheme(next);
    document.documentElement.setAttribute('data-bs-theme', next);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-bs-theme', next);
    if (typeof window !== 'undefined') localStorage.setItem('theme', next);
  };

  // Add a 'scrolled' class to body for animated header/nav shadows
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 8) document.body.classList.add('scrolled');
      else document.body.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="app-shell">
      <MainNav theme={theme} onToggleTheme={toggleTheme} />
      <main className="app-content">
        <Container className="py-3 maxw">
          {children}
        </Container>
      </main>
      {/* footer is rendered via Layout wrapper in _app.js */}
    </div>
  );
}
