// components/Typeahead.js
import { useEffect, useRef, useState } from 'react';
import { ListGroup, Spinner } from 'react-bootstrap';

/**
 * Minimal typeahead dropdown.
 * Props:
 *  - query: string
 *  - fetcher: (q) => Promise<string[]>
 *  - onPick: (value) => void
 *  - visibleMin: number (default 2)
 *  - limit: number (default 3)
 */
export default function Typeahead({ query, fetcher, onPick, visibleMin = 2, limit = 3 }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!query || query.trim().length < visibleMin) {
      setOpen(false);
      setItems([]);
      return;
    }
    let alive = true;
    setLoading(true);
    fetcher(query.trim())
      .then((arr) => {
        if (!alive) return;
        const unique = Array.from(new Set(arr)).filter(Boolean);
        const sorted = unique.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        setItems(sorted.slice(0, limit));
        setOpen(sorted.length > 0);
      })
      .catch(() => {
        if (!alive) return;
        setItems([]);
        setOpen(false);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [query, fetcher, visibleMin, limit]);

  // Close on outside click
  useEffect(() => {
    function onDoc(e) { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  if (!open && !loading) return null;

  return (
    <div ref={boxRef} className="position-relative">
      <div className="position-absolute w-100 mt-1" style={{ zIndex: 1000 }}>
        <ListGroup className="shadow-sm">
          {loading && (
            <ListGroup.Item className="d-flex align-items-center small">
              <Spinner animation="border" size="sm" className="me-2" /> Searching…
            </ListGroup.Item>
          )}
          {!loading && items.map((it) => (
            <ListGroup.Item key={it} action onClick={() => { setOpen(false); onPick(it); }}>
              {it}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}
