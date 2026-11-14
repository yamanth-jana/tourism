import Hero from '../components/home/Hero';
import CategoryCard from '../components/common/CategoryCard';
import DestinationCard from '../components/common/DestinationCard';
import HiddenGemCard from '../components/common/HiddenGemCard';
import SectionHeader from '../components/common/SectionHeader';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Statistics from '../components/home/Statistics';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import categories from '../data/categories';
import destinations from '../data/destinations';
import hiddenGems from '../data/hiddenGems';

export default function Home() {
  const trendingPlaces = destinations.filter((d) => d.trending).slice(0, 4);
  const topRatedPlaces = destinations.filter((d) => d.topRated).slice(0, 4);
  const featuredPlaces = destinations.slice(0, 4);
  const featuredGems = hiddenGems.slice(0, 3);

  return (
    <div>
      <Hero />

      {/* Popular Categories */}
      <section className="section-padding">
        <div className="container-max">
          <SectionHeader
            subtitle="Browse by Interest"
            title="Popular Categories"
            linkTo="/categories"
            linkText="All Categories"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="section-padding bg-gradient-to-b from-transparent to-stone-100/50 dark:to-stone-900/30">
        <div className="container-max">
          <SectionHeader
            subtitle="Handpicked for You"
            title="Featured Destinations"
            linkTo="/explore"
            linkText="Explore All"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlaces.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Places */}
      <section className="section-padding">
        <div className="container-max">
          <SectionHeader
            subtitle="Hot Right Now"
            title="Trending Places"
            linkTo="/search?q=trending"
            linkText="View All"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPlaces.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Places */}
      <section className="section-padding bg-gradient-to-b from-transparent to-stone-100/50 dark:to-stone-900/30">
        <div className="container-max">
          <SectionHeader
            subtitle="Highest Rated"
            title="Top Rated Places"
            linkTo="/search?q=top-rated"
            linkText="View All"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRatedPlaces.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* Hidden Gems */}
      <section className="section-padding">
        <div className="container-max">
          <SectionHeader
            subtitle="Off the Beaten Path"
            title="Hidden Gems"
            linkTo="/hidden-gems"
            linkText="Discover More"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGems.map((gem) => (
              <HiddenGemCard key={gem.id} gem={gem} />
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <Statistics />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
