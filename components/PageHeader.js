// components/PageHeader.js
import { Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function PageHeader({
  text,
  sub,
  as = 'h2',           // h1|h2|h3...
  id,
  showBack = false,    
  backHref,            
}) {
  const Tag = as;
  const router = useRouter();
  const headingId =
    id ||
    `hdr-${(text || '')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')}`;

  const goBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <>
      <Card
        className="border-0 shadow-sm pageheader-glass pageheader-animated"
        as="section"
        aria-labelledby={headingId}
      >
        <Card.Body className="py-3 py-md-4 position-relative">
          {showBack && (
            <Button
              onClick={goBack}
              className="back-button-theme"
              size="sm"
              aria-label="Go back"
              title="Go back"
            >
              ← Back
            </Button>
          )}
          <Tag id={headingId} className="m-0">{text}</Tag>
          {sub && <p className="m-0 text-muted mt-1">{sub}</p>}
        </Card.Body>
      </Card>
      <div className="spacer-16" />
    </>
  );
}
