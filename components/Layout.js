// components/Layout.js
import { Container } from 'react-bootstrap';
import MainNav from './MainNav';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <MainNav />
      <Container className="mt-3 app-content">{children}</Container>
      <Footer />
    </div>
  );
}
