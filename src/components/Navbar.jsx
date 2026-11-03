
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import {
  BookOpen,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
    { name: "Add Book", href: "/add-book", private: true },
    { name: "My Books", href: "/my-books", private: true },
    { name: "My Borrows", href: "/my-borrows", private: true },
  ];

  const handleLogout = async () => {
    await authClient.signOut();

    setProfileOpen(false);
    setMobileOpen(false);

    router.push("/sign-in");
    router.refresh();
  };

  const isLoggedIn = !!session?.user;

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
            .filter((link) => isLoggedIn || !link.private)
            .map((link) => (
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
          {!isPending && !isLoggedIn ? (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg px-4 py-2 font-semibold text-[#173d35] hover:bg-[#e9e2d5]"
              >
                Login
              </Link>

              <Link
                href="/sign-up"
                className="rounded-lg bg-[#173d35] px-5 py-2.5 font-semibold text-white transition hover:bg-[#24594d]"
              >
                SignUp
              </Link>
            </>
          ) : isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-[#ded6c8] bg-white p-1.5 pr-3"
              >
                <Image
                  src={session.user.image || "https://i.pravatar.cc/100"}
                  alt="User profile"
                  width={36}
                  height={36}
                  unoptimized
                  className="h-9 w-9 rounded-full object-cover"
                />

                <span className="text-sm font-semibold text-[#173d35]">
                  {session.user.name}
                </span>

                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-xl border border-[#e7e1d5] bg-white p-2 shadow-xl">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="font-semibold text-[#173d35]">
                      {session.user.name}
                    </p>

                    <p className="break-all text-xs text-gray-500">
                      {session.user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm hover:bg-[#f5f0e6]"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}
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
              .filter((link) => isLoggedIn || !link.private)
              .map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-medium text-[#173d35]"
                >
                  {link.name}
                </Link>
              ))}

            {!isPending && !isLoggedIn ? (
              <div className="flex gap-3">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-[#173d35] px-4 py-2"
                >
                  Login
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-[#173d35] px-4 py-2 text-white"
                >
                  SignUp
                </Link>
              </div>
            ) : isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 border-t border-[#ded6c8] pt-4">
                  <Image
                    src={session.user.image || "https://i.pravatar.cc/100"}
                    alt="User profile"
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold text-[#173d35]">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <User size={17} />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-left text-red-600"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
