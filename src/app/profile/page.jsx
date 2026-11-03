'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace('/sign-in?callbackURL=/profile');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const token = await getTokenClient();

        const [booksResponse, borrowsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!booksResponse.ok || !borrowsResponse.ok) {
          throw new Error('Failed to load profile data');
        }

        const booksData = await booksResponse.json();
        const borrowsData = await borrowsResponse.json();

        const myBooks = booksData.filter(
          book => book.addedBy?.email === session.user.email,
        );

        const myBorrows = borrowsData.filter(
          borrow => borrow.userEmail === session.user.email,
        );

        setBooks(myBooks);
        setBorrows(myBorrows);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load profile data.');
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

  const user = session.user;

  return (
    <section className="min-h-screen bg-[#F5F0E6] px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Profile Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <Image
              src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1000&q=85"
              alt="Book"
              width={100}
              height={100}
              loading="eager"
            />

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[#173D35]">{user.name}</h1>

              <p className="mt-2 text-gray-500">{user.email}</p>

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
              <p className="font-semibold text-[#252B29]">{user.name}</p>
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
