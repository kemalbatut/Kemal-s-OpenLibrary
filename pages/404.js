// pages/404.js
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import PageHeader from '../components/PageHeader';
import SeoHead from '../components/SeoHead';

export default function NotFound() {
  return (
    <>
      <SeoHead title="404 — Page Not Found" description="Oops — this page does not exist." />
      <PageHeader text="Page not found" />
      <p className="mb-4">The page you’re looking for doesn’t exist or has moved.</p>
      <Button as={Link} href="/" variant="primary">Go back home</Button>
    </>
  );
}
