// components/BookDetails.js
import { Container, Row, Col } from 'react-bootstrap';

export default function BookDetails({ book }) {
  if (!book) return null;

  const title = book?.title ?? 'Untitled';

  // Normalize description (can be string or { value })
  const description = (() => {
    const d = book?.description;
    if (!d) return null;
    return typeof d === 'string' ? d : d?.value ?? null;
  })();

  const subjectPeople = Array.isArray(book?.subject_people) ? book.subject_people : [];
  const subjectPlaces = Array.isArray(book?.subject_places) ? book.subject_places : [];
  const links = Array.isArray(book?.links) ? book.links : [];

  const coverId = Array.isArray(book?.covers) && book.covers.length ? book.covers[0] : null;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : 'https://placehold.co/400x600?text=Cover+Not+Available';

  return (
    <Container fluid>
      <Row>
        <Col lg="4" className="mb-3">
          <img
            className="img-fluid w-100"
            src={coverUrl}
            alt={`${title} cover`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/400x600?text=Cover+Not+Available';
            }}
          />
          <br />
          <br />
        </Col>

        <Col lg="8">
          <h3>{title}</h3>

          {description && <p>{description}</p>}

          {subjectPeople.length > 0 && (
            <>
              <br />
              <h5>Characters</h5>
              <div>{subjectPeople.join(', ')}</div>
            </>
          )}

          {subjectPlaces.length > 0 && (
            <>
              <br />
              <h5>Settings</h5>
              <div>{subjectPlaces.join(', ')}</div>
            </>
          )}

          {links.length > 0 && (
            <>
              <br />
              <h5>More Information</h5>
              {links.map((l, i) => (
                <div key={i}>
                  <a href={l.url} target="_blank" rel="noreferrer">
                    {l.title || l.url}
                  </a>
                </div>
              ))}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
