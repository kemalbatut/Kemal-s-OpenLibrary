// components/Footer.js
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="app-footer">
      <Container className="text-center">
        <small>© {new Date().getFullYear()} Kemal Batu Turgut · Built with Next.js & React-Bootstrap</small>
      </Container>
    </footer>
  );
}
