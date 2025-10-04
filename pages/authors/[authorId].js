import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from 'next/error';
import { Alert, Button, Col, Form, Pagination, Row, Table } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';
import AuthorDetails from '../../components/AuthorDetails';
import SeoHead from '../../components/SeoHead';


const PAGE_SIZE = 10;

function extractYear(dateLike) {
  if (!dateLike) return null;
  const match = String(dateLike).match(/^(\d{4})/);
  return match ? Number(match[1]) : null;
}

export default function AuthorPage() {
  const router = useRouter();
  const { authorId } = router.query;

  const { data: author, error: authorErr } = useSWR(
    authorId ? `https://openlibrary.org/authors/${authorId}.json` : null
  );
  const { data: worksData, error: worksErr } = useSWR(
    authorId ? `https://openlibrary.org/authors/${authorId}/works.json?limit=200` : null
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('year');
  const [sortDir, setSortDir] = useState('desc');

  const entries = Array.isArray(worksData?.entries) ? worksData.entries : [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((w) => (w?.title || '').toLowerCase().includes(q));
  }, [entries, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const factor = sortDir === 'asc' ? 1 : -1;
    return arr.sort((a, b) => {
      if (sortField === 'year') {
        const ya = extractYear(a?.first_publish_date);
        const yb = extractYear(b?.first_publish_date);
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

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(start, start + PAGE_SIZE);

  if (authorErr || worksErr) return <Error statusCode={404} />;

  return (
    <>
      <SeoHead title={`${author?.name || 'Author'} — Profile`} description="Author profile and works" />
      <PageHeader text={author?.name || 'Author'} />

      {author && <AuthorDetails author={author} />}

      <hr />

      <Row className="g-2 mb-3">
        <Col xs={12} md={4}>
          <Form.Control
            placeholder="Filter by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs={6} md={4}>
          <Form.Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="year">Sort by Year</option>
            <option value="title">Sort by Title</option>
          </Form.Select>
        </Col>
        <Col xs={6} md={4}>
          <Form.Select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </Form.Select>
        </Col>
      </Row>

      {sorted.length === 0 ? (
        <Alert variant="info">No works found.</Alert>
      ) : (
        <>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th style={{ width: 180 }}>First Published</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((w) => {
                const workId = w?.key?.split('/').pop();
                return (
                  <tr key={w.key} onClick={() => router.push(`/works/${workId}`)} role="button">
                    <td>{w?.title || 'Untitled'}</td>
                    <td>{extractYear(w?.first_publish_date) ?? 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
            <Pagination.Item active>{page}</Pagination.Item>
            <Pagination.Next onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
          </Pagination>
        </>
      )}

      <div className="text-center mt-4">
        <Button variant="secondary" onClick={() => router.push('/author-search')}>
          ← Back to Author Search
        </Button>
      </div>
    </>
  );
}
