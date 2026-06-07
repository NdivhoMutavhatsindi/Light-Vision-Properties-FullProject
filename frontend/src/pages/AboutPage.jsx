import { motion } from 'framer-motion';
import { ArrowRight, Award, Users, TrendingUp, Building2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import PageBanner from '../components/ui/PageBanner';
import SectionHeading from '../components/ui/SectionHeading';
import AgentCard from '../components/ui/AgentCard';
import { agents, stats } from '../data/mockData';

const timeline = [
  { year: '2009', title: 'Foundation', desc: 'Light Vision Property was founded in Cape Town with a vision to transform luxury real estate in South Africa.' },
  { year: '2012', title: 'Expansion', desc: 'Expanded operations to Johannesburg and Durban, establishing our national presence in key luxury markets.' },
  { year: '2016', title: 'Award Recognition', desc: 'Received our first national luxury property award, cementing our reputation as industry leaders.' },
  { year: '2019', title: 'Digital Innovation', desc: 'Launched our premium digital platform, revolutionising how South Africans discover and purchase luxury properties.' },
  { year: '2022', title: 'Milestone Achievement', desc: 'Surpassed R1 billion in annual property sales, reflecting our clients\' trust and our team\'s dedication.' },
  { year: '2024', title: 'Today', desc: 'Continuing to set the standard for luxury real estate with 24 agents across South Africa\'s premier markets.' },
];

const values = [
  { title: 'Excellence', desc: 'We hold ourselves to the highest standards in every interaction, transaction, and outcome.' },
  { title: 'Integrity', desc: 'Transparency and honesty are the foundations upon which every client relationship is built.' },
  { title: 'Expertise', desc: 'Deep market knowledge and continuous learning ensure we deliver informed, expert guidance.' },
  { title: 'Discretion', desc: 'We understand the sensitivity of luxury transactions and uphold the utmost confidentiality.' },
];

export default function AboutPage() {
  return (
    <div>
      <PageBanner
        title="Our Story"
        subtitle="Fifteen years of redefining luxury real estate in South Africa."
        breadcrumbs={[{ label: 'About' }]}
        image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="gold-line" />
                <span className="text-gold-600 text-xs font-semibold tracking-widest uppercase">Who We Are</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-navy-900 mb-6 leading-tight">
                Redefining Luxury<br />Real Estate
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5 text-lg">
                Light Vision Property was born from a belief that luxury real estate deserves an exceptional level of service. Since 2009, we have been connecting discerning buyers, sellers, and investors with South Africa's most prestigious properties.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our team of specialist agents combines intimate local knowledge with a global perspective, ensuring every client receives guidance that is both expertly informed and deeply personal.
              </p>
              <Link to="/contact" className="btn-navy">
                Speak With Us
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Light Vision Property Office"
                  className="w-full rounded-3xl shadow-luxury"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-navy-gradient">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Principles"
            title="Values We Live By"
            light
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8 text-center"
              >
                <div className="w-14 h-14 rounded-full border-2 border-gold-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-gradient-gold font-serif text-2xl font-light">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-white mb-3">{v.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Journey" title="15 Years of Excellence" center />
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-300 to-transparent hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <span className="text-5xl font-serif font-light text-gradient-gold block mb-2">{item.year}</span>
                    <h3 className="text-xl font-serif font-semibold text-navy-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-navy-900 border-4 border-gold-500 items-center justify-center flex-shrink-0 z-10">
                    <div className="w-3 h-3 bg-gold-400 rounded-full" />
                  </div>
                  <div className="md:w-[calc(50%-2rem)]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
