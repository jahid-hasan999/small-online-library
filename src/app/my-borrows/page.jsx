'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const MyBorrowsPage = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [returning, setReturning] = useState(false);

  // Login check
  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/sign-in?callbackURL=/my-borrows');
    }
  }, [session, isPending, router]);

  // Fetch user's borrowed books
  useEffect(() => {
    if (isPending || !session?.user?.email) return;

    const fetchBorrows = async () => {
      try {
        setLoading(true);

        const response = await fetch('http://localhost:5000/borrows');

        if (!response.ok) {
          throw new Error('Failed to fetch borrowed books');
        }

        const data = await response.json();

        const myBorrows = data.filter(
          borrow => borrow.userEmail === session.user.email,
        );

        setBorrows(myBorrows);
      } catch (error) {
        console.error(error);
        setError('Failed to load your borrowed books.');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [session, isPending]);

  // Return book
  const handleReturnBook = async () => {
    if (!selectedBorrow) return;

    try {
      setReturning(true);

      const response = await fetch(
        `http://localhost:5000/borrows/${selectedBorrow._id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to return book');
      }

      setBorrows(previous =>
        previous.filter(borrow => borrow._id !== selectedBorrow._id),
      );

      setSelectedBorrow(null);
    } catch (error) {
      console.error(error);
      setError('Failed to return book. Please try again.');
    } finally {
      setReturning(false);
    }
  };

  if (isPending || loading) {
    return (
      <p className="py-20 text-center text-[#173D35]">
        Loading your borrowed books...
      </p>
    );
  }

  if (!session) return null;

  return (
    <section className="min-h-screen bg-[#F5F0E6] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl font-bold text-[#173D35]">
            My Borrowed Books
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your borrowed books and return them on time.
          </p>
        </div>

        {error && <p className="mb-5 text-center text-red-500">{error}</p>}

        {borrows.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-bold text-[#173D35]">
              No Borrowed Books
            </h2>

            <p className="mt-3 text-gray-500">
              You have not borrowed any books yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white p-5 shadow-lg">
            <table className="w-full min-w-[750px] text-left">
              <thead>
                <tr className="border-b text-[#173D35]">
                  <th className="px-4 py-4">Book</th>
                  <th className="px-4 py-4">Borrow Date</th>
                  <th className="px-4 py-4">Return Date</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {borrows.map(borrow => (
                  <tr key={borrow._id} className="border-b last:border-0">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-12 shrink-0">
                          <Image
                            src={borrow.bookImage}
                            alt={borrow.bookTitle}
                            fill
                            unoptimized
                            className="rounded-md object-cover"
                          />
                        </div>

                        <span className="font-semibold text-[#173D35]">
                          {borrow.bookTitle}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {new Date(borrow.borrowDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {new Date(borrow.returnDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedBorrow(borrow)}
                        className="rounded-lg bg-[#173D35] px-4 py-2 font-semibold text-white hover:bg-[#D5A85C] hover:text-[#173D35]"
                      >
                        Return Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Return Confirmation Modal */}
      {selectedBorrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-[#173D35]">Return Book?</h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to return{' '}
              <span className="font-semibold text-[#173D35]">
                {selectedBorrow.bookTitle}
              </span>
              ?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedBorrow(null)}
                disabled={returning}
                className="w-1/2 rounded-lg border px-4 py-3 font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleReturnBook}
                disabled={returning}
                className="w-1/2 rounded-lg bg-[#173D35] px-4 py-3 font-semibold text-white hover:bg-[#D5A85C] hover:text-[#173D35] disabled:opacity-50"
              >
                {returning ? 'Returning...' : 'Confirm Return'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyBorrowsPage;
