
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#173D35] px-5 py-10 text-[#F5F0E6]">
      <div className="mx-auto max-w-7xl">

        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen size={30} className="text-[#D5A85C]" />

            <h2 className="text-2xl font-bold tracking-wide">
              Book<span className="text-[#D5A85C]">Nook</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-gray-300">
            A little corner for every book lover.
            Discover stories, explore knowledge, and let
            your imagination travel beyond limits.
          </p>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/15" />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row">
          <p className="text-xs text-gray-400 sm:text-sm">
            ©  BookNook. All rights reserved.
          </p>

          <p className="text-xs text-gray-400 sm:text-sm">
            Made with <span className="text-[#D5A85C]">♥</span> for book lovers.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

