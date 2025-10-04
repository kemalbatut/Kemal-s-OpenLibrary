// components/PageHeader.js
import { Card } from 'react-bootstrap';

export default function PageHeader({ text }) {
  return (
    <>
      <Card className="bg-light border-0 shadow-sm">
        <Card.Body className="py-4">
          <h3 className="m-0">{text}</h3>
        </Card.Body>
      </Card>
      <br />
    </>
  );
}
