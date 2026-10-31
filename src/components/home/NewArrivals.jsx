'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';

const NewArrivals = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Books from Express Server
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/books?limit=6');

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();

        setBooks(data);
      } catch (error) {
        console.error('Books fetching error:', error);
        setError('Books could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="bg-white px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-bold tracking-[3px] text-[#D5A85C]">
              FRESH FROM OUR SHELVES
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#173D35] md:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-[#252B29]/70">
              Discover the newest additions to our library. Find your next
              favorite story and start reading today.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 font-semibold text-[#173D35] transition hover:text-[#D5A85C]"
          >
            See All Books
            <ArrowRight size={19} />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-[#173D35]">
            Loading books...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="py-10 text-center text-red-500">{error}</p>
        )}

        {/* Empty Books */}
        {!loading && !error && books.length === 0 && (
          <p className="py-16 text-center text-gray-500">
            No books available yet.
          </p>
        )}

        {/* Dynamic Books */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {books.map(book => (
              <div
                key={book._id}
                className="group overflow-hidden rounded-2xl border border-[#173D35]/10 bg-[#F5F0E6] transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Book Image */}
                <div className="relative h-[280px] overflow-hidden bg-[#e8e0d2]">
                  {book.image ? (
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen size={50} className="text-[#173D35]" />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-[#173D35] px-4 py-2 text-xs font-semibold text-white">
                    {book.category}
                  </span>
                </div>

                {/* Book Information */}
                <div className="p-5">
                  <h3 className="line-clamp-1 font-serif text-xl font-bold text-[#173D35]">
                    {book.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#252B29]/65">
                    By {book.author}
                  </p>

                  <div className="mt-5 border-t border-[#173D35]/10 pt-4">
                    <Link
                      href={`/books/${book._id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#173D35] transition hover:text-[#D5A85C]"
                    >
                      <BookOpen size={17} />
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Button */}
        <div className="mt-12 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-3 rounded-full bg-[#173D35] px-8 py-4 font-semibold text-white transition hover:bg-[#D5A85C] hover:text-[#173D35]"
          >
            Explore All Books
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
