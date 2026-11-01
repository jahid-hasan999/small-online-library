'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch Category from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');

    setSelectedCategory(category || '');
  }, []);

  // Fetch All Books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/books');

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error(error);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter Books by Category
  const filteredBooks = selectedCategory
    ? books.filter(
        book => book.category?.toLowerCase() === selectedCategory.toLowerCase(),
      )
    : books;

  // Clear Category Filter
  const handleClearFilter = () => {
    setSelectedCategory('');
    window.history.pushState({}, '', '/books');
  };

  return (
    <section className="min-h-screen bg-[#F5F0E6] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl font-bold text-[#173D35] md:text-5xl">
            Explore Our Library
          </h1>

          <p className="mt-3 text-[#252B29]/65">
            Discover your next favorite book from our collection.
          </p>
        </div>

        {/* Selected Category */}
        {selectedCategory && (
          <div className="mb-8 flex items-center justify-center gap-3">
            <p className="text-[#173D35]">
              Category: <span className="font-bold">{selectedCategory}</span>
            </p>

            <button
              onClick={handleClearFilter}
              className="rounded-lg bg-[#173D35] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#D5A85C] hover:text-[#173D35]"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="py-10 text-center text-[#173D35]">Loading books...</p>
        )}

        {/* Error */}
        {error && <p className="py-10 text-center text-red-600">{error}</p>}

        {/* Empty Books */}
        {!loading && !error && filteredBooks.length === 0 && (
          <div className="py-16 text-center">
            <BookOpen size={45} className="mx-auto text-[#173D35]" />

            <h2 className="mt-4 text-xl font-semibold text-[#173D35]">
              {selectedCategory
                ? `No Books Found in ${selectedCategory}`
                : 'No Books Available'}
            </h2>

            <p className="mt-2 text-gray-600">
              {selectedCategory
                ? 'Try another category or clear the filter.'
                : 'Add your first book to the library.'}
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && filteredBooks.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map(book => (
              <div
                key={book._id}
                className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-64 w-full bg-gray-100">
                  {book.image && (
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>

                {/* Book Information */}
                <div className="p-5">
                  <span className="rounded-full bg-[#F5F0E6] px-3 py-1 text-xs font-semibold text-[#173D35]">
                    {book.category}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-[#173D35]">
                    {book.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">By {book.author}</p>

                  <Link
                    href={`/books/${book._id}`}
                    className="mt-5 inline-block rounded-lg bg-[#173D35] px-5 py-2.5 font-semibold text-white transition hover:bg-[#D5A85C] hover:text-[#173D35]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BooksPage;
