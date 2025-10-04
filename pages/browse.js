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
import { Button, Col, Form, Pagination, Row, Table } from 'react-bootstrap';
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

  const { data, error } = useSWR(
    `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&page=${page}&limit=10`
  );

  useEffect(() => {
    if (data) setPageData(data);
  }, [data]);

  // filter by title
  const filteredDocs = useMemo(() => {
    const docs = pageData?.docs || [];
    const q = search.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((b) => (b.title || '').toLowerCase().includes(q));
  }, [pageData, search]);

  // sort by year or title
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

      <Row className="g-2 mb-3">
        <Col xs={12} md={4}>
          <Form.Control
            type="text"
            placeholder="Search by title…"
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

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th style={{ width: 180 }}>First Published</th>
          </tr>
        </thead>
        <tbody>
          {sortedDocs.map((book) => {
            const workId = book?.key?.split('/').pop();
            return (
              <tr key={book.key} onClick={() => router.push(`/works/${workId}`)} role="button">
                <td>{book.title}</td>
                <td>{Number.isFinite(book.first_publish_year) ? book.first_publish_year : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} />
        <Pagination.Item active>{page}</Pagination.Item>
        <Pagination.Next onClick={() => setPage((p) => p + 1)} />
      </Pagination>

      <div className="text-center mt-4">
        <Button variant="secondary" onClick={() => router.push('/')}>
          ← Back Home
        </Button>
      </div>
    </>
  );
}
