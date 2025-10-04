/*********************************************************************************
* WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Kemal Batu Turgut Student ID: 122277239 Date: Last Updated 3/10/25
*
********************************************************************************/
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {Alert,Badge,Button,Card,Col,Form,Row,Spinner,} from 'react-bootstrap';
import PageHeader from '../components/PageHeader';
import SeoHead from '../components/SeoHead';

const SUBJECTS = [
  'fantasy', 'science_fiction', 'mystery', 'romance', 'history', 'biography',
  'children', 'young_adult', 'horror', 'poetry', 'art', 'travel', 'music',
  'humor', 'business', 'technology', 'computers', 'psychology', 'philosophy'
];

// Simple fetcher for SWR
const fetcher = (url) => fetch(url).then((r) => {
  if (!r.ok) throw new Error(`Failed: ${r.status}`);
  return r.json();
});

// Build cover URL with fallback
const cover = (coverId, size = 'M') =>
  coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
    : 'https://placehold.co/300x450?text=No+Cover';

export default function Browse() {
  const router = useRouter();

  // pick a subject; store in state so it persists until shuffle
  const [subject, setSubject] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('year'); // 'year' | 'title'
  const [sortDir, setSortDir] = useState('desc');     // 'asc' | 'desc'

  // choose subject on first load
  useEffect(() => {
    const pick = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    setSubject(pick);
  }, []);

  // fetch works for the selected subject
  const { data, error, isLoading, mutate } = useSWR(
    subject ? `https://openlibrary.org/subjects/${encodeURIComponent(subject)}.json?limit=60` : null,
    fetcher
  );

  // Works array (subject endpoint shape)
  const works = Array.isArray(data?.works) ? data.works : [];

  // filter by title
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return works;
    return works.filter((w) => (w?.title || '').toLowerCase().includes(q));
  }, [works, search]);

  // sort by title or first_publish_year (desc default)
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const factor = sortDir === 'asc' ? 1 : -1;
    return arr.sort((a, b) => {
      if (sortField === 'year') {
        const ya = Number.isFinite(a?.first_publish_year) ? a.first_publish_year : null;
        const yb = Number.isFinite(b?.first_publish_year) ? b.first_publish_year : null;
        if (ya === yb) return 0;
        if (ya === null) return 1;
        if (yb === null) return -1;
        return (ya - yb) * factor;
      } else {
        const ta = (a?.title || '').toLowerCase();
        const tb = (b?.title || '').toLowerCase();
        return ta.localeCompare(tb) * factor;
      }
    });
  }, [filtered, sortField, sortDir]);

  const shuffle = () => {
    const pick = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    setSubject(pick);
    // SWR will refetch due to key change; reset UI inputs
    setSearch('');
    setSortField('year');
    setSortDir('desc');
  };

  return (
    <>
      <SeoHead
        title="Browse — Random Books with Covers"
        description="Discover random books with cover photos from OpenLibrary subjects. Filter, sort, and explore."
      />
      <PageHeader
        text="Discover Books"
        sub={subject ? `Showing: ${subject.replaceAll('_', ' ')}` : 'Loading subjects…'}
      />

      {/* Controls */}
      <Card className="card-glass mb-3">
        <Card.Body className="p-3 p-md-4">
          <Row className="g-2 align-items-end">
            <Col xs={12} md={5}>
              <Form.Label className="small text-muted">Search</Form.Label>
              <Form.Control
                placeholder="Filter by title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col xs={6} md={3}>
              <Form.Label className="small text-muted">Sort field</Form.Label>
              <Form.Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                <option value="year">Year</option>
                <option value="title">Title</option>
              </Form.Select>
            </Col>
            <Col xs={6} md={2}>
              <Form.Label className="small text-muted">Direction</Form.Label>
              <Form.Select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Form.Select>
            </Col>
            <Col xs={12} md={2} className="text-md-end">
              <Button onClick={shuffle} variant="primary" className="w-100">
                🔀 Shuffle
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Grid */}
      {isLoading && (
        <div className="py-5 text-center">
          <Spinner animation="border" role="status" className="me-2" />
          Loading books…
        </div>
      )}

      {error && (
        <Alert variant="danger">
          Could not load books for <strong>{subject}</strong>. Try Shuffle again.
        </Alert>
      )}

      {!isLoading && !error && sorted.length === 0 && (
        <div className="empty-state my-4">
          <i className="bi bi-inboxes mb-2" aria-hidden />
          <p className="m-0">No titles match your filter.</p>
        </div>
      )}

      <Row xs={2} sm={3} md={4} lg={6} className="g-3">
        {sorted.map((w) => {
          const workKey = w?.key; // "/works/OLxxxxW"
          const workId = typeof workKey === 'string' ? workKey.split('/').pop() : null;
          const year = Number.isFinite(w?.first_publish_year) ? w.first_publish_year : null;
          const img = cover(w?.cover_id, 'M');

          return (
            <Col key={w.key}>
              <Card className="h-100 border-0 shadow-sm card-glass">
                <Card.Img
                  variant="top"
                  src={img}
                  alt={`${w?.title || 'Book'} cover`}
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x450?text=No+Cover'; }}
                  className="img-fluid"
                />
                <Card.Body className="d-flex flex-column">
                  <div className="fw-semibold mb-1 text-truncate" title={w?.title || 'Untitled'}>
                    {w?.title || 'Untitled'}
                  </div>
                  <div className="small text-muted text-truncate">
                    {(w?.authors?.[0]?.name) || 'Unknown author'}
                  </div>
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                    <Badge bg="secondary">{year ?? 'N/A'}</Badge>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => workId && router.push(`/works/${workId}`)}
                    >
                      Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
        <Button variant="secondary" onClick={() => router.push('/')}>
          ← Back Home
        </Button>
      </div>
    </>
  );
}
