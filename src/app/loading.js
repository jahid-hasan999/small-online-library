import { BookOpen } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F5F0E6]">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#173D35]">
        <BookOpen size={30} className="animate-pulse text-[#D5A85C]" />
      </div>

      <h2 className="mt-5 font-serif text-2xl font-bold text-[#173D35]">
        BookNook
      </h2>

      <p className="mt-2 text-sm text-[#252B29]/60">
        Preparing your reading experience...
      </p>

      <div className="mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-[#D5A85C]/30">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-[#173D35]" />
      </div>
    </div>
  );
}
