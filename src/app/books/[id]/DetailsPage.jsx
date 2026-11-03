
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import getTokenClient from '@/lib/getTokenClient';

const DetailsPage = ({ id }) => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [message, setMessage] = useState('');

  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [checkingBorrow, setCheckingBorrow] = useState(true);

  // Fetch book details
  useEffect(() => {
    if (isPending) return;

    let cancelled = false;

    const fetchBook = async () => {
      try {
        setLoading(true);

        const token = await getTokenClient();

        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Book not found');
        }

        const data = await response.json();

        if (!cancelled) {
          setBook(data);
          setError('');
        }
      } catch (error) {
        console.error('Fetch Book Error:', error);

        if (!cancelled) {
          setError('Failed to load book details.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBook();

    return () => {
      cancelled = true;
    };
  }, [id, isPending, session?.user?.email]);

  // Check if current user already borrowed this book
  useEffect(() => {
    if (isPending) return;

    if (!session?.user?.email) {
      setCheckingBorrow(false);
      setAlreadyBorrowed(false);
      return;
    }

    let cancelled = false;

    const checkBorrowStatus = async () => {
      try {
        setCheckingBorrow(true);

        const token = await getTokenClient();

        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to check borrow status');
        }

        const borrows = await response.json();

        const isBorrowed = borrows.some(
          (borrow) =>
            String(borrow.bookId) === String(id) &&
            borrow.userEmail === session.user.email
        );

        if (!cancelled) {
          setAlreadyBorrowed(isBorrowed);
        }
      } catch (error) {
        console.error('Borrow Status Error:', error);

        if (!cancelled) {
          setMessage('Could not check book availability.');
        }
      } finally {
        if (!cancelled) {
          setCheckingBorrow(false);
        }
      }
    };

    checkBorrowStatus();

    return () => {
      cancelled = true;
    };
  }, [id, session?.user?.email, isPending]);

  // Open Borrow Modal
  const handleBorrowClick = () => {
    if (isPending || checkingBorrow) return;

    if (!session?.user) {
      router.push(
        `/sign-in?callbackURL=${encodeURIComponent(`/books/${id}`)}`
      );
      return;
    }

    if (alreadyBorrowed) return;

    setMessage('');
    setShowModal(true);
  };

  // Confirm Borrow
  const handleConfirmBorrow = async () => {
    if (!session?.user || !book || alreadyBorrowed) return;

    try {
      setBorrowing(true);
      setMessage('');

      const token = await getTokenClient();

      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookId: book._id,
            bookTitle: book.title,
            bookImage: book.image,
            userEmail: session.user.email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setAlreadyBorrowed(true);
          setShowModal(false);
        }

        throw new Error(data.message || 'Failed to borrow book');
      }

      setAlreadyBorrowed(true);
      setShowModal(false);

      alert('Book borrowed successfully!');
    } catch (error) {
      console.error('Confirm Borrow Error:', error);
      setMessage(error.message || 'Something went wrong!');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading || isPending) {
    return <p className="py-20 text-center">Loading...</p>;
  }

  if (error || !book) {
    return (
      <p className="py-20 text-center text-red-500">
        {error || 'Book not found'}
      </p>
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F0E6] px-4 py-12">
      <div className="mx-auto grid max-w-5xl gap-10 rounded-3xl bg-white p-6 shadow-lg md:grid-cols-2">

        {/* Book Image */}
        <div className="relative min-h-[350px]">
          <Image
            src={book.image}
            alt={book.title}
            fill
            unoptimized
            className="rounded-2xl object-cover"
          />
        </div>

        {/* Book Information */}
        <div>
          <span className="rounded-full bg-[#F5F0E6] px-4 py-2 text-sm text-[#173D35]">
            {book.category}
          </span>

          <h1 className="mt-5 font-serif text-3xl font-bold text-[#173D35]">
            {book.title}
          </h1>

          <p className="mt-3 text-gray-600">
            Author: {book.author}
          </p>

          <h2 className="mt-7 text-lg font-bold text-[#173D35]">
            Description
          </h2>

          <p className="mt-2 leading-7 text-gray-600">
            {book.description}
          </p>

          {/* Added By */}
          <div className="mt-7 border-t pt-5">
            <h2 className="font-bold text-[#173D35]">
              Added By
            </h2>

            <p className="mt-2 text-gray-600">
              {book.addedBy?.name}
            </p>

            <p className="text-sm text-gray-500">
              {book.addedBy?.email}
            </p>
          </div>

          {/* Borrow Button */}
          <button
            onClick={handleBorrowClick}
            disabled={
              isPending ||
              checkingBorrow ||
              alreadyBorrowed
            }
            className="mt-8 block w-full rounded-xl bg-[#173D35] px-6 py-4 text-center font-semibold text-white hover:bg-[#D5A85C] hover:text-[#173D35] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white"
          >
            {checkingBorrow
              ? 'Checking Availability...'
              : alreadyBorrowed
                ? 'Already Borrowed'
                : isPending
                  ? 'Checking Login...'
                  : 'Borrow This Book'}
          </button>

          {message && !showModal && (
            <p className="mt-3 text-center text-sm text-red-500">
              {message}
            </p>
          )}

          <Link
            href="/books"
            className="mt-4 block text-center text-[#173D35] underline"
          >
            Back to Books
          </Link>
        </div>
      </div>

      {/* Borrow Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-2xl font-bold text-[#173D35]">
              Borrow This Book
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Confirm your borrowing information.
            </p>

            <div className="mt-6 space-y-4">

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Your Name
                </label>

                <input
                  type="text"
                  value={session?.user?.name || ''}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Your Email
                </label>

                <input
                  type="email"
                  value={session?.user?.email || ''}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Book Title
                </label>

                <input
                  type="text"
                  value={book.title}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 px-4 py-3 outline-none"
                />
              </div>

              <p className="text-sm text-[#173D35]">
                Maximum borrowing period: 7 days. You can return the book
                earlier.
              </p>

              {message && (
                <p className="text-sm text-red-500">
                  {message}
                </p>
              )}

              <div className="flex gap-3 pt-3">

                <button
                  onClick={() => setShowModal(false)}
                  disabled={borrowing}
                  className="w-1/2 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmBorrow}
                  disabled={borrowing}
                  className="w-1/2 rounded-lg bg-[#173D35] px-4 py-3 font-semibold text-white hover:bg-[#D5A85C] hover:text-[#173D35] disabled:opacity-50"
                >
                  {borrowing ? 'Borrowing...' : 'Confirm Borrow'}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DetailsPage;
