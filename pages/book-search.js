// pages/book-search.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Form } from 'react-bootstrap';
import PageHeader from '../components/PageHeader';
import SeoHead from '../components/SeoHead';
import Typeahead from '../components/Typeahead';

const parseWorkOrEdition = (value) => {
  if (!value) return null;
  const v = value.trim();
  const work = v.match(/OL\d+W/);
  const edition = v.match(/OL\d+M/);
  return work?.[0] || edition?.[0] || null;
};

const titleSuggest = async (q) => {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&fields=title&limit=10`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return (json?.docs || []).map(d => d?.title).filter(Boolean);
};

export default function BookSearch() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const resolveEditionToWork = async (editionId) => {
    const url = `https://openlibrary.org/books/${editionId}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Edition lookup failed');
    const data = await res.json();
    const workKey = Array.isArray(data?.works) && data.works[0]?.key;
    const workId = workKey?.split('/').pop();
    if (!workId) throw new Error('No parent work for edition');
    return workId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = parseWorkOrEdition(input);
    try {
      setBusy(true);
      if (token) {
        if (token.endsWith('W')) return router.push(`/works/${token}`);
        if (token.endsWith('M')) {
          const workId = await resolveEditionToWork(token);
          return router.push(`/works/${workId}`);
        }
      }
      // Fallback: title search → first matching work
      const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(input)}&fields=key,title&limit=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      const key = data?.docs?.[0]?.key;
      const workId = key?.includes('/works/') ? key.split('/').pop() : null;
      if (!workId) throw new Error('No matching work');
      router.push(`/works/${workId}`);
    } catch (err) {
      setError('Sorry, no matching book/work found.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SeoHead title="Book Search" description="Find books by ID, URL, or title." />
      <PageHeader
        as="h1"
        text="Book Search"
        sub="Paste a work/edition URL/ID or type a title."
        showBack
        backHref="/"
      />

      <Card className="card-glass">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Label className="small text-muted">Book</Form.Label>
            <div className="position-relative">
              <Form.Control
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. https://openlibrary.org/works/OL82563W or 'Dune'"
                aria-describedby="bookHelp"
              />
              <Typeahead query={input} fetcher={titleSuggest} onPick={(v) => setInput(v)} />
            </div>
            <div id="bookHelp" className="form-text">
              Accepts <code>OL…W</code>/<code>OL…M</code> IDs, full URLs, or titles. Shows 3 suggestions as you type.
            </div>

            <div className="mt-3 d-flex gap-2">
              <Button type="submit" disabled={busy}>
                {busy ? 'Searching…' : 'Search'}
              </Button>
              <Button variant="outline-secondary" onClick={() => setInput('')} disabled={busy}>
                Clear
              </Button>
            </div>

            {error && <div className="text-danger mt-3">{error}</div>}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
