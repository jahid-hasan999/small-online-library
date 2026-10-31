'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ArrowRight, BookOpen } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';

const slides = [
  {
    subtitle: 'WELCOME TO BOOKNOOK',
    title: 'Discover Your Next Favorite Book',
    description:
      'Every book opens a new world. Explore our collection, find your favorite stories, and let your imagination grow.',
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1000&q=85',
    button: 'Explore Books',
  },
  {
    subtitle: 'A WORLD OF STORIES',
    title: 'Every Page Holds an Adventure',
    description:
      'From timeless classics to exciting new stories, discover books that inspire, entertain, and stay with you.',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1000&q=85',
    button: 'Browse Collection',
  },
  {
    subtitle: 'READ. BORROW. RETURN.',
    title: 'Good Books Are Meant to Be Shared',
    description:
      'Find a book you love, borrow it for seven days, and share the joy of reading with our library community.',
    image:
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1000&q=85',
    button: 'Start Reading',
  },
];

const HeroSection = () => {

 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <section className="min-h-[550px] bg-[#F5F0E6]" />
    );
  }
  return (
    <section className="bg-[#F5F0E6] px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          speed={800}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="hero-swiper overflow-hidden rounded-3xl"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="grid min-h-[480px] items-center gap-10 bg-[#F5F0E6] p-6 md:grid-cols-2 md:p-12 lg:p-16">
                {/* Left Content */}
                <div className="order-2 md:order-1">
                  <div className="mb-5 flex items-center gap-2 text-sm font-semibold tracking-[3px] text-[#D5A85C]">
                    <BookOpen size={18} />
                    {slide.subtitle}
                  </div>

                  <h1 className="max-w-xl font-serif text-4xl leading-tight font-bold text-[#173D35] md:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mt-6 max-w-lg text-base leading-8 text-[#252B29]/75 md:text-lg">
                    {slide.description}
                  </p>

                  <Link
                    href="/books"
                    className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#173D35] px-7 py-4 font-semibold text-white transition duration-300 hover:bg-[#D5A85C] hover:text-[#173D35]"
                  >
                    {slide.button}
                    <ArrowRight size={20} />
                  </Link>
                </div>

                {/* Right Image */}
                <div className="order-1 flex justify-center md:order-2">
                  <div className="relative h-[280px] w-full max-w-md overflow-hidden rounded-2xl shadow-xl md:h-[400px]">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      unoptimized
                      className="object-cover transition duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    <div className="absolute bottom-5 right-5 rounded-xl bg-[#F5F0E6]/90 px-5 py-3 text-sm font-semibold text-[#173D35] shadow-lg">
                      Your next chapter starts here.
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .hero-swiper {
          padding-bottom: 45px;
        }

        .hero-swiper .swiper-pagination {
          bottom: 5px;
        }

        .hero-swiper .swiper-pagination-bullet {
          background: #173d35;
          opacity: 0.35;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          background: #d5a85c;
          opacity: 1;
          width: 25px;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
