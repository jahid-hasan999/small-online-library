import { Suspense } from 'react';
import DetailsPage from './DetailsPage';

async function BookDetails({ params }) {
  const { id } = await params;

  return <DetailsPage id={id} />;
}

export default function Page({ params }) {
  return (
    <Suspense
      fallback={<p className="py-20 text-center">Loading book details...</p>}
    >
      <BookDetails params={params} />
    </Suspense>
  );
}
