// components/AuthorDetails.js
import { Container, Row, Col } from 'react-bootstrap';

export default function AuthorDetails({ author }) {
  if (!author) return null;

  const name = author?.name ?? 'Unknown Author';
  const bio = typeof author?.bio === 'string' ? author.bio : author?.bio?.value;
  const birth = author?.birth_date;
  const death = author?.death_date;

  const olid = author?.key?.split('/').pop(); // "/authors/OL123A" -> "OL123A"
  const img = olid ? `https://covers.openlibrary.org/a/olid/${olid}-L.jpg` : null;

  const links = Array.isArray(author?.links) ? author.links : [];

  return (
    <Container fluid>
      <Row>
        <Col lg="4" className="mb-3">
          <img
            className="img-fluid w-100"
            src={img || 'https://placehold.co/400x400?text=No+Author+Image'}
            alt="Author portrait"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/400x400?text=No+Author+Image';
            }}
          />
          <br /><br />
        </Col>
        <Col lg="8">
          <h3>{name}</h3>
          <div className="text-muted mb-2">
            {(birth || death) && (
              <small>
                {birth || 'Unknown'} — {death || 'Present'}
              </small>
            )}
          </div>

          {bio && <p>{bio}</p>}

          {links.length > 0 && (
            <>
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
