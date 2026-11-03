'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import SafeBookImage from '@/components/SafeBookImage';
import getTokenClient from '@/lib/getTokenClient';
import { toast } from 'react-toastify';

const MyBookPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  const [deletingBook, setDeletingBook] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    category: '',
    image: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      setLoading(false);
      return;
    }

    const fetchMyBooks = async () => {
      
      const token = await getTokenClient();
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );

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

  // Open Edit Modal
  const handleEdit = book => {
    setEditingBook(book);

    setEditForm({
      title: book.title || '',
      author: book.author || '',
      category: book.category || '',
      image: book.image || '',
      description: book.description || '',
    });
  };

  // Update Form
  const handleChange = e => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // Save Updated Book
  const handleUpdate = async e => {
    e.preventDefault();
    const token = await getTokenClient();
    try {
      setSaving(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${editingBook._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      setBooks(previousBooks =>
        previousBooks.map(book =>
          book._id === editingBook._id ? { ...book, ...editForm } : book,
        ),
      );

      setEditingBook(null);
      toast.success('Book updated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const token = await getTokenClient();
    try {
      setDeleting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${deletingBook._id}`,
        {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      setBooks(previousBooks =>
        previousBooks.filter(book => book._id !== deletingBook._id),
      );

      setDeletingBook(null);
      toast.success('Book deleted successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

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
                  <SafeBookImage
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

                  <button
                    onClick={() => handleEdit(book)}
                    className="mt-5 w-full rounded-lg bg-[#173D35] py-2 font-medium text-white hover:bg-[#24594d]"
                  >
                    Edit Book
                  </button>

                  <button
                    onClick={() => setDeletingBook(book)}
                    className="mt-2 w-full rounded-lg bg-red-600 py-2 font-medium text-white hover:bg-red-700"
                  >
                    Delete Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleUpdate}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6"
          >
            <h2 className="mb-5 text-2xl font-bold text-[#173D35]">
              Edit Book
            </h2>

            <div className="space-y-4">
              <input
                name="title"
                value={editForm.title}
                onChange={handleChange}
                placeholder="Book Title"
                required
                className="w-full rounded-lg border p-3"
              />

              <input
                name="author"
                value={editForm.author}
                onChange={handleChange}
                placeholder="Author Name"
                required
                className="w-full rounded-lg border p-3"
              />

              <select
                name="category"
                value={editForm.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Category</option>
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Kids">Kids</option>
                <option value="Others">Others</option>
              </select>

              <input
                name="image"
                value={editForm.image}
                onChange={handleChange}
                placeholder="Book Image URL"
                required
                className="w-full rounded-lg border p-3"
              />

              <textarea
                name="description"
                value={editForm.description}
                onChange={handleChange}
                placeholder="Book Description"
                required
                rows={4}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="w-1/2 rounded-lg border border-gray-300 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="w-1/2 rounded-lg bg-[#173D35] py-2 text-white disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 text-center">
            <h2 className="text-2xl font-bold text-[#173D35]">Delete Book?</h2>

            <p className="my-4 text-gray-600">
              Are you sure you want to delete "{deletingBook.title}"? This
              action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingBook(null)}
                disabled={deleting}
                className="w-1/2 rounded-lg border py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-1/2 rounded-lg bg-red-600 py-2 text-white disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyBookPage;
