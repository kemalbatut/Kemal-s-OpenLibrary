// pages/book-search.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import PageHeader from '../components/PageHeader';
import SeoHead from '../components/SeoHead';

function parseIdOrNull(input) {
  const text = input.trim();
  try {
    const u = new URL(text);
    const parts = u.pathname.split('/').filter(Boolean);
    if ((parts[0] === 'works' || parts[0] === 'books') && parts[1]) return parts[1];
  } catch {}
  if (/^OL\d+[WM]$/i.test(text)) return text;
  return null;
}
const isWorkId = (id) => /^OL\d+W$/i.test(id);
const isEditionId = (id) => /^OL\d+M$/i.test(id);

export default function BookSearch() {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleGo = useCallback(async () => {
    setError('');
    const raw = value.trim();
    if (!raw) return setError('Please paste a book URL/ID or enter a title.');

    const maybeId = parseIdOrNull(raw);

    try {
      setBusy(true);

      if (maybeId) {
        if (isWorkId(maybeId)) {
          await router.push(`/works/${maybeId}`);
          return;
        }
        if (isEditionId(maybeId)) {
          const res = await fetch(`https://openlibrary.org/books/${maybeId}.json`);
          if (!res.ok) throw new Error(`Edition not found (${res.status})`);
          const ed = await res.json();
          const workKey = Array.isArray(ed.works) && ed.works[0]?.key;
          const workId = workKey?.split('/').pop();
          if (!workId) throw new Error('Could not resolve work for this edition.');
          await router.push(`/works/${workId}`);
          return;
        }
      }

      // title search fallback
      const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(raw)}&limit=1`);
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const json = await res.json();
      const doc = json?.docs?.[0];
      if (!doc) throw new Error('No books found with that title.');
      const workId = doc.key?.split('/').pop();
      if (!workId) throw new Error('Search returned unexpected data.');
      await router.push(`/works/${workId}`);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
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
      <SeoHead title="Book Search — OpenLibrary Explorer" description="Paste a Work/Edition URL or ID, or type a title to find a book." />
      <PageHeader text="Book Search" />
      <p className="mb-3">
        Paste a <code>/works/OL…W</code> or <code>/books/OL…M</code> URL/ID, or type a title to jump to the best match.
      </p>

      <InputGroup className="mb-3">
        <Form.Control
          ref={inputRef}
          placeholder="Paste book URL / ID, or type a title"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onEnter}
          aria-label="Book search input"
        />
        <Button variant="primary" onClick={handleGo} disabled={busy}>
          {busy ? 'Searching…' : 'Open'}
        </Button>
      </InputGroup>

      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
}
