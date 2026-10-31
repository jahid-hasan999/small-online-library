'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const AddBookPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    image: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Input value handle
  const handleChange = e => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Form submit
  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add book');
      }

      alert('Book added successfully!');

      setFormData({
        title: '',
        author: '',
        category: '',
        image: '',
        description: '',
      });

      router.push('/');
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F5F0E6] px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-[#173D35] hover:text-[#D5A85C]"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* Form Container */}
        <div className="rounded-3xl bg-white p-6 shadow-lg md:p-10">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F0E6] text-[#173D35]">
              <BookPlus size={28} />
            </div>

            <h1 className="font-serif text-3xl font-bold text-[#173D35] md:text-4xl">
              Add a New Book
            </h1>

            <p className="mt-3 text-[#252B29]/65">
              Share a new story with our library community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Book Title */}
            <div>
              <label className="mb-2 block font-semibold text-[#173D35]">
                Book Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#173D35]"
              />
            </div>

            {/* Author */}
            <div>
              <label className="mb-2 block font-semibold text-[#173D35]">
                Author Name
              </label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#173D35]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block font-semibold text-[#173D35]">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#173D35]"
              >
                <option value="">Select a category</option>
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Kids">Kids</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="mb-2 block font-semibold text-[#173D35]">
                Book Image URL
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Paste your book image URL"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173D35]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-semibold text-[#173D35]">
                Book Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write something about this book..."
                rows={5}
                required
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#173D35]"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173D35] px-6 py-4 font-semibold text-white transition hover:bg-[#D5A85C] hover:text-[#173D35] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <BookPlus size={20} />
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddBookPage;
