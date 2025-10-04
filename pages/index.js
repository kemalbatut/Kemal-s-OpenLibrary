// pages/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Col, Row } from 'react-bootstrap';
import PageHeader from '../components/PageHeader';
import QuickCard from '../components/QuickCard';
import SeoHead from '../components/SeoHead';

export default function Home() {
  const [recentWorks, setRecentWorks] = useState([]);
  const [recentAuthors, setRecentAuthors] = useState([]);

  useEffect(() => {
    try {
      const w = JSON.parse(localStorage.getItem('recentWorks') || '[]');
      const a = JSON.parse(localStorage.getItem('recentAuthors') || '[]');
      setRecentWorks(Array.isArray(w) ? w.slice(0, 5) : []);
      setRecentAuthors(Array.isArray(a) ? a.slice(0, 5) : []);
    } catch {}
  }, []);

  return (
    <>
      <SeoHead
        title="OpenLibrary Explorer — Home"
        description="Find books and authors fast. Search by URL/ID/title or browse curated lists."
      />

      {/* HERO */}
      <div className="hero bg-gradient-primary text-light rounded-4 p-4 p-md-5 mb-4 shadow-sm">
        <h1 className="display-6 fw-bold mb-2">OpenLibrary Explorer</h1>
        <p className="lead mb-4">
          Search books by URL, ID, or title; look up authors; and browse a curated list.
        </p>
        <div className="d-flex gap-2 flex-wrap">
          <Button as={Link} href="/book-search" variant="light">Find a Book</Button>
          <Button as={Link} href="/author-search" variant="outline-light">Find an Author</Button>
          <Button as={Link} href="/browse" variant="outline-light">Browse</Button>
        </div>
      </div>

      <PageHeader text="Quick Actions" />
      <Row xs={1} md={3} className="g-3 mb-4">
        <Col>
          <QuickCard
            title="Book Search"
            description="Paste a book URL/ID (OL…W / OL…M) or type a title—jump to details fast."
            href="/book-search"
            footer="Go to Book Search"
          />
        </Col>
        <Col>
          <QuickCard
            title="Author Search"
            description="Paste an author URL/ID (OL…A) or type a name—see profile and works."
            href="/author-search"
            footer="Go to Author Search"
          />
        </Col>
        <Col>
          <QuickCard
            title="Browse"
            description="Explore books by a chosen author with pagination & filtering."
            href="/browse"
            footer="Start Browsing"
          />
        </Col>
      </Row>

      {(recentWorks.length > 0 || recentAuthors.length > 0) && (
        <>
          <PageHeader text="Recently Viewed" />
          <Row className="g-3">
            {recentWorks.length > 0 && (
              <Col xs={12} lg={6}>
                <h5 className="mb-3">Books</h5>
                <ul className="list-unstyled m-0">
                  {recentWorks.map((w) => (
                    <li key={w.id} className="mb-2">
                      <Link href={`/works/${w.id}`}>{w.title || w.id}</Link>
                    </li>
                  ))}
                </ul>
              </Col>
            )}
            {recentAuthors.length > 0 && (
              <Col xs={12} lg={6}>
                <h5 className="mb-3">Authors</h5>
                <ul className="list-unstyled m-0">
                  {recentAuthors.map((a) => (
                    <li key={a.id} className="mb-2">
                      <Link href={`/authors/${a.id}`}>{a.name || a.id}</Link>
                    </li>
                  ))}
                </ul>
              </Col>
            )}
          </Row>
        </>
      )}
    </>
  );
}
