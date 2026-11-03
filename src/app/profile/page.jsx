'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { authClient } from '@/lib/auth-client';
import getTokenClient from '@/lib/getTokenClient';

import {
  BookOpen,
  BookPlus,
  Bookmark,
  Library,
  ArrowRight,
} from 'lucide-react';

const ProfilePage = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const user = session?.user;

  // Reset image error when profile image changes
  useEffect(() => {
    setImageError(false);
  }, [user?.image]);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace('/sign-in?callbackURL=/profile');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const token = await getTokenClient();

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [booksResponse, borrowsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, { headers }),
        ]);

        // Books (public endpoint)
        if (booksResponse.ok) {
          const booksData = await booksResponse.json();

          setBooks(
            booksData.filter(
              book => book.addedBy?.email === session.user.email,
            ),
          );
        } else {
          console.error(
            `Profile Error: GET /books returned HTTP ${booksResponse.status}`,
          );
        }

        // Borrows (protected endpoint - requires a valid JWT)
        if (borrowsResponse.ok) {
          const borrowsData = await borrowsResponse.json();

          setBorrows(
            borrowsData.filter(
              borrow => borrow.userEmail === session.user.email,
            ),
          );
        } else if (borrowsResponse.status === 401) {
          console.error(
            'Profile Error: GET /borrows returned 401 - session token was missing or rejected',
          );
        } else {
          console.error(
            `Profile Error: GET /borrows returned HTTP ${borrowsResponse.status}`,
          );
        }
      } catch (error) {
        console.error('Profile Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F0E6]">
        <p className="text-lg font-medium text-[#173D35]">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (!session) return null;

  const profileImage =
    typeof user.image === 'string' &&
    user.image.trim() !== '' &&
    !user.image.toLowerCase().includes('pinterest.com');

  return (
    <section className="min-h-screen bg-[#F5F0E6] px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Profile Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <div className="flex min-w-0 items-center gap-4">
            {/* Profile Image or First Letter */}
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-[84px] sm:w-[84px]">
              {profileImage && !imageError ? (
                <img
                  src={user.image}
                  alt={user.name || 'Profile picture'}
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#173D35] text-4xl font-bold text-white">
                  {user.name?.trim()?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="min-w-0 text-left">
              <h1 className="text-3xl font-bold text-[#173D35]">
                {user.name || 'User'}
              </h1>

              <p className="mt-2 break-all text-gray-500">{user.email}</p>

              <span className="mt-3 inline-block rounded-full bg-[#e8f0e9] px-4 py-1 text-sm font-semibold text-[#173D35]">
                BookNook Reader
              </span>
            </div>
          </div>
        </div>

        {/* Reading Statistics */}
        <div className="mt-8">
          <h2 className="mb-5 text-2xl font-bold text-[#173D35]">
            My Reading Activity
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <BookPlus size={28} className="text-[#D5A85C]" />

              <h3 className="mt-4 text-3xl font-bold text-[#173D35]">
                {books.length}
              </h3>

              <p className="mt-1 text-gray-500">Added Books</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <Bookmark size={28} className="text-[#D5A85C]" />

              <h3 className="mt-4 text-3xl font-bold text-[#173D35]">
                {borrows.length}
              </h3>

              <p className="mt-1 text-gray-500">Total Borrowed</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <Library size={28} className="text-[#D5A85C]" />

              <h3 className="mt-4 text-3xl font-bold text-[#173D35]">
                {borrows.length}
              </h3>

              <p className="mt-1 text-gray-500">Currently Borrowed</p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-[#173D35]">
            Account Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-semibold text-[#252B29]">
                {user.name || 'User'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-semibold text-[#252B29]">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-semibold text-[#252B29]">Reader</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <h2 className="mb-5 text-2xl font-bold text-[#173D35]">
            Quick Links
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/my-books"
              className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1"
            >
              <span className="font-semibold text-[#173D35]">My Books</span>
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/my-borrows"
              className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1"
            >
              <span className="font-semibold text-[#173D35]">My Borrows</span>
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/books"
              className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1"
            >
              <span className="font-semibold text-[#173D35]">Browse Books</span>
              <BookOpen size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
