import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Award, Users, TrendingUp, Building2, Star, CheckCircle, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect  } from 'react';
import { getProperties } from "../services/property.service.js";
import { getAgents } from "../services/agent.service.js";
import { services, stats, testimonials } from '../data/mockData';
import SearchBar from '../components/ui/SearchBar';
import SectionHeading from '../components/ui/SectionHeading';
import PropertyCard from '../components/ui/PropertyCard';
import AgentCard from '../components/ui/AgentCard';

const iconMap = { Building2, TrendingUp, Award, Users };

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const data = await getProperties();
      const properties = Array.isArray(data) ? data : [];
      const featured = properties
        .filter((p) => p.featured === true)
        .slice(0, 6);
      setFeaturedProperties(featured);
    };

    const fetchAgents = async () => {
      const data = await getAgents();
      setAgents(Array.isArray(data) ? data : []);
    };

    fetchProperties();
    fetchAgents();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/Hero_(2).png"
            alt="Luxury Property"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/70 to-navy-900/30" />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="gold-line" />
              <span className="text-gold-400 text-xs font-semibold tracking-[0.25em] uppercase">
                South Africa's Premier Luxury Real Estate
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-light text-white leading-[1.05] mb-6"
            >
              Find Your
              <span className="block text-gradient-gold">Perfect Luxury</span>
              Property
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-300 leading-relaxed mb-10 max-w-xl"
            >
              Discover South Africa's most exclusive properties. From clifftop villas to urban penthouses, we connect discerning buyers with exceptional homes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-14"
            >
              <Link to="/properties" className="btn-primary">
                Explore Properties
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link to="/valuation" className="btn-white">
                Get Valuation
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-8"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-serif font-light text-gradient-gold">{stat.value}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-0.5 h-12 bg-gradient-to-b from-white/0 via-gold-400 to-white/0" />
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="relative -mt-10 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-luxury p-6"
          >
            <div className="flex gap-6 mb-5 border-b border-gray-100 pb-4">
              {['For Sale', 'To Let', 'Commercial'].map((tab) => (
                <button key={tab} className="text-sm font-medium text-navy-900 hover:text-gold-600 transition-colors pb-2 border-b-2 border-transparent hover:border-gold-500 first:border-gold-500 first:text-gold-600">
                  {tab}
                </button>
              ))}
            </div>
            <SearchBar />
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Exceptional Listings"
            title="Featured Properties"
            subtitle="Hand-selected properties that represent the pinnacle of luxury South African real estate."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, i) => (
              <PropertyCard
                  key={property.property_id}
                  property={property}
                  index={i}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/properties" className="btn-navy">
              View All Properties
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-gray-50">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="What We Offer"
            title="Comprehensive Property Services"
            subtitle="From valuation to completion, we provide a full suite of premium real estate services."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <Link
                  to={`/${service.slug}`}
                  className="block bg-white rounded-2xl p-6 hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 group h-full"
                  style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.07)' }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center mb-4 group-hover:bg-gold-500 transition-colors">
                    <Building2 size={20} className="text-gold-400 group-hover:text-white" />
                  </div>
                  <h3 className="font-serif font-semibold text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-20 bg-navy-gradient">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-5xl font-serif font-light text-gradient-gold mb-2">{stat.value}</p>
                <p className="text-gray-400 text-sm tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Top Agents */}
      <section className="section-padding">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Our Experts"
            title="Meet Our Agents"
            subtitle="Our team of luxury property specialists brings unparalleled expertise and dedication to every transaction."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {agents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/agents" className="btn-outline">
              View All Agents
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-navy-gradient overflow-hidden">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Client Stories"
            title="What Our Clients Say"
            subtitle="The trust and satisfaction of our clients is our greatest achievement."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-gray-200 leading-relaxed mb-6 italic font-serif text-lg">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold-500"
                  />
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Brand Section */}
      <section className="section-padding">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="The Light Vision Difference"
            subtitle="We combine local expertise with international standards to deliver results that exceed expectations."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Unmatched Market Knowledge',
                desc: 'Deep expertise in South Africa\'s most prestigious property markets, backed by 15 years of proven results.',
                icon: TrendingUp,
              },
              {
                title: 'Premium Marketing',
                desc: 'World-class photography, staging, and multi-channel marketing that presents your property in its finest light.',
                icon: Award,
              },
              {
                title: 'Personalised Service',
                desc: 'A dedicated agent from first conversation to final signature, ensuring a seamless and stress-free experience.',
                icon: Users,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8"
              >
                <div className="w-16 h-16 rounded-full bg-gold-50 flex items-center justify-center mx-auto mb-6 border border-gold-200">
                  <item.icon size={24} className="text-gold-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-navy-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-navy-gradient rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
            </div>
            <div className="relative">
              <div className="flex justify-center mb-4">
                <div className="gold-line" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-white mb-4">
                Ready to Find Your<br />
                <span className="text-gradient-gold">Dream Property?</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                Speak with one of our luxury property specialists today and let us guide you to your perfect home.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn-primary">
                  Contact Us Today
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link to="/properties" className="btn-white">
                  Browse Properties
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
