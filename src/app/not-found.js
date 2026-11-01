import Link from 'next/link';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="flex min-h-[85vh] flex-col items-center justify-center bg-[#F5F0E6] px-4 text-center">
      <div className="relative">
        <h1 className="font-serif text-[120px] font-bold leading-none text-[#173D35] md:text-[180px]">
          404
        </h1>

        <BookOpen
          size={45}
          className="absolute -right-5 top-3 rotate-12 text-[#D5A85C] md:-right-8 md:top-5 md:size-16"
        />
      </div>

      <h2 className="mt-6 font-serif text-3xl font-bold text-[#173D35] md:text-4xl">
        Oops! Page Not Found
      </h2>

      <p className="mt-3 max-w-md text-[#252B29]/65">
        The page you are looking for doesn't exist or may have been moved. Let's
        get you back to your reading journey.
      </p>

      <Link
        href="/"
        className="mt-8 flex items-center gap-2 rounded-lg bg-[#173D35] px-7 py-3 font-semibold text-white transition hover:bg-[#D5A85C] hover:text-[#173D35]"
      >
        <Home size={18} />
        Back to Home
      </Link>

      <p className="mt-8 text-sm text-[#252B29]/50">
        BookNook — Your little corner of books.
      </p>
    </section>
  );
}
