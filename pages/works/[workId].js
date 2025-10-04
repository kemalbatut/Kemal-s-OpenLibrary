// pages/works/[workId].js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from 'next/error';
import PageHeader from '../../components/PageHeader';
import BookDetails from '../../components/BookDetails';
import SeoHead from '../../components/SeoHead';
import { Button } from 'react-bootstrap';

export default function Work() {
  const router = useRouter();
  const { workId } = router.query;

  const { data, error, isLoading } = useSWR(
    workId ? `https://openlibrary.org/works/${workId}.json` : null
  );

  // recently viewed list
  useEffect(() => {
    if (!data?.title || !workId) return;
    try {
      const key = 'recentWorks';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      const next = [{ id: workId, title: data.title }, ...arr.filter((x) => x.id !== workId)];
      localStorage.setItem(key, JSON.stringify(next.slice(0, 10)));
    } catch {}
  }, [data, workId]);

  const title = data?.title ? `${data.title} — Book Details` : 'Book — OpenLibrary Explorer';
  const desc = data?.description
    ? (typeof data.description === 'string' ? data.description : data.description?.value || 'Book details and metadata.')
    : 'Book details and metadata.';

  if (isLoading) return null;
  if (error || !data) return <Error statusCode={404} />;


  return (
     <>
    <SeoHead title={title} description={desc.slice(0, 160)} />
    <PageHeader text={data.title || 'Book'} />
    <BookDetails book={data} />
    <div className="text-center mt-4">
      <Button variant="secondary" onClick={() => router.push('/book-search')}>
        ← Back to Book Search
      </Button>
    </div>
  </>
  );
  
}
