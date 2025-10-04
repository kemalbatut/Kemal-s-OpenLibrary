// components/Layout.js
import { Container } from 'react-bootstrap';
import MainNav from './MainNav';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <MainNav />
      <Container className="app-content maxw">
        {children}
      </Container>
      <Footer />
    </div>
  );
}
