import HeroSection from "@/components/home/Herosection";
import NewArrivals from "@/components/home/NewArrivals";
import TopCategories from "@/components/home/TopCategories";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <NewArrivals />
      <TopCategories/>
    </div>
  );
};

export default HomePage;