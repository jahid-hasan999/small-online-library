'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';

const MyBookPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      setLoading(false);
      return;
    }

    const fetchMyBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/books');

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();

        const myBooks = data.filter(
          book => book.addedBy?.email === session.user.email,
        );

        setBooks(myBooks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [session, isPending]);

  if (isPending || loading) {
    return <p className="py-20 text-center">Loading your books...</p>;
  }

  if (!session) {
    return <p className="py-20 text-center">Please login to see your books.</p>;
  }

  if (error) {
    return <p className="py-20 text-center text-red-500">{error}</p>;
  }

  return (
    <section className="min-h-screen bg-[#F5F0E6] px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-[#173D35]">My Books</h1>

        <p className="mb-8 text-gray-600">
          Manage the books you have added to BookNook.
        </p>

        {books.length === 0 ? (
          <p className="py-16 text-center text-gray-600">
            You haven't added any books yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map(book => (
              <div
                key={book._id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-[#173D35]">
                    {book.title}
                  </h2>

                  <p className="mt-2 text-gray-600">Author: {book.author}</p>

                  <p className="mt-1 text-sm text-[#D5A85C]">{book.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookPage;
