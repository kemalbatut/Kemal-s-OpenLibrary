// components/PageHeader.js
import { Card } from 'react-bootstrap';

export default function PageHeader({ text, sub }) {
  return (
    <>
      <Card className="border-0 shadow-sm pageheader-glass">
        <Card.Body className="py-3 py-md-4">
          <h3 className="m-0">{text}</h3>
          {sub && <p className="m-0 text-muted mt-1">{sub}</p>}
        </Card.Body>
      </Card>
      <div className="spacer-16" />
    </>
  );
}
