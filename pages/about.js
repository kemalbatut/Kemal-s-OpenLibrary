// pages/about.js
import PageHeader from '../components/PageHeader';
import BookDetails from '../components/BookDetails';
import SeoHead from '../components/SeoHead';

export default function About({ book }) {
  return (
    <>
      <SeoHead
        title="About the Developer — OpenLibrary Explorer"
        description="Built with Next.js, React-Bootstrap, and SWR — a polished OpenLibrary explorer."
      />
      <PageHeader text="About the Developer — Kemal Batu Turgut" />
      <p>
        I’m a Seneca student building with React, Next.js, and SWR. Below is a favourite book pulled
        from the OpenLibrary API.
      </p>
      <BookDetails book={book} />
    </>
  );
}

export async function getStaticProps() {
  const workId = 'OL453657W'; // change to any favourite work
  const res = await fetch(`https://openlibrary.org/works/${workId}.json`);
  const book = await res.json();
  return { props: { book } };
}
