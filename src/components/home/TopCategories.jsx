import Link from 'next/link';
import {
  BookOpen,
  FlaskConical,
  Landmark,
  Baby,
  Library,
  ArrowRight,
} from 'lucide-react';

const categories = [
  {
    name: 'Fiction',
    description: 'Explore stories and imaginary worlds.',
    icon: BookOpen,
  },
  {
    name: 'Science',
    description: 'Discover science and new ideas.',
    icon: FlaskConical,
  },
  {
    name: 'History',
    description: 'Learn about the past and its stories.',
    icon: Landmark,
  },
  {
    name: 'Kids',
    description: 'Fun and educational books for children.',
    icon: Baby,
  },
  {
    name: 'Others',
    description: 'Explore books from other categories.',
    icon: Library,
  },
];

const TopCategories = () => {
  return (
    <section className="bg-[#F5F0E6] px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <span className="font-semibold uppercase tracking-[3px] text-[#D5A85C]">
            Explore Library
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#173D35] md:text-4xl">
            Explore Top Categories
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
            Find your next favorite book from our carefully organized collection
            of different categories.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(category => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/books?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-[#e7e1d5] bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-[#D5A85C] hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#173D35] text-white transition group-hover:bg-[#D5A85C]">
                  <Icon size={27} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#173D35]">
                  {category.name}
                </h3>

                <p className="mt-2 min-h-14 text-sm leading-6 text-gray-600">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#D5A85C]">
                  Explore Books
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
