// pages/author-search.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Form } from 'react-bootstrap';
import PageHeader from '../components/PageHeader';
import SeoHead from '../components/SeoHead';
import Typeahead from '../components/Typeahead';

const parseAuthorId = (value) => {
  if (!value) return null;
  const v = value.trim();
  const m = v.match(/OL\d+A/);
  return m ? m[0] : null;
};

const authorSuggest = async (q) => {
  const url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(q)}&limit=10`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return (json?.docs || []).map(d => d?.name).filter(Boolean);
};

export default function AuthorSearch() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const id = parseAuthorId(input);
    try {
      setBusy(true);
      if (id) return router.push(`/authors/${id}`);

      const url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(input)}&limit=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      const key = data?.docs?.[0]?.key;
      const authorId = key?.split('/').pop();
      if (!authorId) throw new Error('No results');
      router.push(`/authors/${authorId}`);
    } catch {
      setError('Sorry, no matching author found.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SeoHead title="Author Search" description="Find authors by ID, URL, or name." />
      <PageHeader as="h1" text="Author Search" sub="Paste an author URL/ID or type a name." />

      <Card className="card-glass">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Label className="small text-muted">Author</Form.Label>
            <div className="position-relative">
              <Form.Control
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. https://openlibrary.org/authors/OL26320A or 'Veronica Roth'"
                aria-describedby="authorHelp"
              />
              <Typeahead query={input} fetcher={authorSuggest} onPick={(v) => setInput(v)} />
            </div>
            <div id="authorHelp" className="form-text">
              Accepts <code>OL…A</code> IDs, full URLs, or names. Shows 3 suggestions as you type.
            </div>

            <div className="mt-3 d-flex gap-2">
              <Button type="submit" disabled={busy}>{busy ? 'Searching…' : 'Search'}</Button>
              <Button variant="outline-secondary" onClick={() => setInput('')} disabled={busy}>Clear</Button>
            </div>

            {error && <div className="text-danger mt-3">{error}</div>}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
