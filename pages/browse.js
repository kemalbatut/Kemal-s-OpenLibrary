/*********************************************************************************
* WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Kemal Batu Turgut Student ID: 122277239 Date: 1/10/25
*
********************************************************************************/
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Alert, Badge, Button, Card, Col, Form, Pagination, Row, Table, Placeholder } from 'react-bootstrap';
import PageHeader from '../components/PageHeader';
import SeoHead from '../components/SeoHead';

export default function Browse() {
  const author = 'Terry Pratchett'; // personalize this
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('year'); // 'year' or 'title'
  const [sortDir, setSortDir] = useState('desc'); // 'asc' or 'desc'
  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&page=${page}&limit=10`
  );

  useEffect(() => {
    if (data) setPageData(data);
  }, [data]);

  const filteredDocs = useMemo(() => {
    const docs = pageData?.docs || [];
    const q = search.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((b) => (b.title || '').toLowerCase().includes(q));
  }, [pageData, search]);

  const sortedDocs = useMemo(() => {
    const arr = [...(filteredDocs || [])];
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
  }, [filteredDocs, sortField, sortDir]);

  return (
    <>
      <SeoHead title={`Browse — ${author}`} description={`Explore books by ${author}`} />
      <PageHeader text={`Browse — ${author}`} />

      <Card className="card-glass mb-3">
        <Card.Body className="p-3 p-md-4">
          <Row className="g-2 align-items-end">
            <Col xs={12} md={6}>
              <Form.Label className="small text-muted">Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by title…"
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
            <Col xs={6} md={3}>
              <Form.Label className="small text-muted">Direction</Form.Label>
              <Form.Select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="card-glass">
        <Card.Body className="p-0">
          <Table hover responsive className="align-middle table-modern m-0">
            <thead>
              <tr>
                <th>Title</th>
                <th className="text-end" style={{ width: 180 }}>
                  First Published
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <Placeholder as="div" animation="glow">
                        <Placeholder xs={8} /> <Placeholder xs={4} />
                      </Placeholder>
                    </td>
                    <td className="text-end">
                      <Placeholder as="div" animation="glow">
                        <Placeholder xs={4} />
                      </Placeholder>
                    </td>
                  </tr>
                ))
              )}

              {!isLoading && error && (
                <tr>
                  <td colSpan="2">
                    <Alert variant="danger" className="m-3">Failed to load books.</Alert>
                  </td>
                </tr>
              )}

              {!isLoading && !error && sortedDocs.length === 0 && (
                <tr>
                  <td colSpan="2">
                    <div className="empty-state my-4">
                      <i className="bi bi-inboxes mb-2" aria-hidden />
                      <p className="m-0">No titles match your search.</p>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && !error && sortedDocs.map((book) => {
                const workId = book?.key?.split('/').pop();
                const year = Number.isFinite(book.first_publish_year) ? book.first_publish_year : null;
                return (
                  <tr
                    key={book.key}
                    onClick={() => router.push(`/works/${workId}`)}
                    role="button"
                    className="row-click"
                    title="Open details"
                  >
                    <td>
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <span>{book.title}</span>
                        <i className="bi bi-chevron-right opacity-50" aria-hidden />
                      </div>
                    </td>
                    <td className="text-end">
                      {year ? <Badge bg="secondary" pill>{year}</Badge> : <span className="text-muted">N/A</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} />
        <Pagination.Item active>{page}</Pagination.Item>
        <Pagination.Next onClick={() => setPage((p) => p + 1)} />
      </Pagination>

      <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
        <Button variant="secondary" onClick={() => router.push('/')}>
          ← Back Home
        </Button>
      </div>
    </>
  );
}