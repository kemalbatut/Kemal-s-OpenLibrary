// pages/author-search.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import PageHeader from '../components/PageHeader';
import SeoHead from '../components/SeoHead';

function parseMaybeAuthorId(input) {
  const text = input.trim();
  try {
    const u = new URL(text);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts[0]?.toLowerCase() === 'authors' && parts[1]) return parts[1];
  } catch {}
  if (/^OL\d+A$/i.test(text)) return text;
  return null;
}

export default function AuthorSearch() {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleGo = useCallback(async () => {
    setError('');
    const raw = value.trim();
    if (!raw) return setError('Please paste an author URL / ID or enter a name.');

    const maybeId = parseMaybeAuthorId(raw);

    try {
      setBusy(true);

      if (maybeId) {
        if (!/^OL\d+A$/i.test(maybeId)) throw new Error('Invalid author ID format.');
        await router.push(`/authors/${maybeId}`);
        return;
      }

      // name search
      const res = await fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(raw)}`);
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const json = await res.json();
      const docs = Array.isArray(json?.docs) ? json.docs : [];
      if (docs.length === 0) throw new Error('No authors found with that name.');
      const key = docs[0]?.key; // "/authors/OL23919A"
      const id = typeof key === 'string' ? key.split('/').pop() : null;
      if (!id || !/^OL\d+A$/i.test(id)) throw new Error('Search returned an unexpected author key.');
      await router.push(`/authors/${id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong while resolving that author.');
    } finally {
      setBusy(false);
    }
  }, [router, value]);

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGo();
    }
  };

  return (
    <>
      <SeoHead title="Author Search — OpenLibrary Explorer" description="Paste an author URL/ID or type a name to see profile and works." />
      <PageHeader text="Author Search" />
      <p className="mb-3">
        Paste <code>/authors/OL…A</code>, a local link like <code>/authors/OL…A</code>, a raw ID (e.g., <code>OL23919A</code>), or type the author’s name.
      </p>

      <InputGroup className="mb-3">
        <Form.Control
          ref={inputRef}
          placeholder="Paste author URL / ID, or type a name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onEnter}
          aria-label="Author search input"
        />
        <Button variant="primary" onClick={handleGo} disabled={busy}>
          {busy ? 'Searching…' : 'Open'}
        </Button>
      </InputGroup>

      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
}
