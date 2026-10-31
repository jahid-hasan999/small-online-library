'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BookOpen,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  // Temporary demo login state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Books', href: '/books' },
    { name: 'Add Book', href: '/add-book', private: true },
    { name: 'My Books', href: '/my-books', private: true },
    { name: 'My Borrows', href: '/my-borrows', private: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7e1d5] bg-[#f5f0e6]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173d35] text-white">
            <BookOpen size={23} />
          </div>

          <span className="text-2xl font-bold text-[#173d35]">
            BookNook<span className="text-[#d5a85c]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks
            .filter(link => isLoggedIn || !link.private)
            .map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#394a43] transition hover:text-[#d5a85c]"
              >
                {link.name}
              </Link>
            ))}
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-3 lg:flex">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 font-semibold text-[#173d35] hover:bg-[#e9e2d5]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-[#173d35] px-5 py-2.5 font-semibold text-white transition hover:bg-[#24594d]"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-[#ded6c8] bg-white p-1.5 pr-3"
              >
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt="User profile"
                  className="h-9 w-9 rounded-full object-cover"
                />

                <span className="text-sm font-semibold text-[#173d35]">
                  Jahid Hasan
                </span>

                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-xl border border-[#e7e1d5] bg-white p-2 shadow-xl">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="font-semibold text-[#173d35]">Jahid Hasan</p>
                    <p className="text-xs text-gray-500">jahid@example.com</p>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm hover:bg-[#f5f0e6]"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-[#173d35] hover:bg-[#e9e2d5] lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-[#e7e1d5] bg-[#f5f0e6] px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks
              .filter(link => isLoggedIn || !link.private)
              .map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-medium text-[#173d35]"
                >
                  {link.name}
                </Link>
              ))}

            {!isLoggedIn ? (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="rounded-lg border border-[#173d35] px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-[#173d35] px-4 py-2 text-white"
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-t border-[#ded6c8] pt-4">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt="User profile"
                    className="h-10 w-10 rounded-full"
                  />
                  <span className="font-semibold text-[#173d35]">
                    Jahid Hasan
                  </span>
                </div>

                <Link href="/profile" onClick={() => setMobileOpen(false)}>
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 text-left text-red-600"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
