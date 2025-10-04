// components/Footer.js
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="app-footer mt-auto">
      <Container className="maxw">
        <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap text-center small">
          <span>© {new Date().getFullYear()} Kemal’s OpenLibrary</span>
          <span className="opacity-50">•</span>
          <span className="text-muted">
            Icon:&nbsp;
            <a
              href="https://www.flaticon.com/free-icons/open-book"
              title="open book icons"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open book icons
            </a>{' '}
            by Karyative — Flaticon
          </span>
        </div>
      </Container>
    </footer>
  );
}
