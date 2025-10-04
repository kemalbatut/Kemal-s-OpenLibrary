// components/QuickCard.js
import Link from 'next/link';
import { Card } from 'react-bootstrap';

export default function QuickCard({ title, description, href, footer }) {
  return (
    <Card className="shadow-sm h-100 quick-card">
      <Card.Body>
        <Card.Title className="mb-2">{title}</Card.Title>
        {description && <Card.Text className="text-muted">{description}</Card.Text>}
      </Card.Body>
      <Card.Footer className="bg-transparent border-0 pt-0">
        <Link className="stretched-link" href={href}>
          {footer || 'Open'}
        </Link>
      </Card.Footer>
    </Card>
  );
}
