import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Building2, TrendingUp, Shield, Scale, FileText, Calculator, Key, Briefcase } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import SectionHeading from '../components/ui/SectionHeading';
import { services } from '../data/mockData';

const iconComponents = { Building2, TrendingUp, Shield, Scale, FileText, Calculator, Key, Briefcase };

const serviceLinks = {
  valuation: '/valuation',
  compliance: '/compliance',
  legal: '/legal',
  'offer-to-purchase': '/offer-to-purchase',
  'bond-calculator': '/bond-calculator',
  services: '/services',
};

export default function ServicesPage() {
  return (
    <div>
      <PageBanner
        title="Our Services"
        subtitle="Comprehensive luxury real estate services tailored to your every need."
        breadcrumbs={[{ label: 'Services' }]}
      />

      <section className="section-padding">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Offer"
            title="Full-Spectrum Property Services"
            subtitle="From your first enquiry to final transfer, we guide you through every step with expertise and care."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => {
              const Icon = iconComponents[service.icon] || Building2;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-3xl p-8 hover:shadow-luxury transition-all duration-300 border border-gray-100 group"
                  style={{ boxShadow: '0 2px 16px rgba(15,27,61,0.07)' }}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-navy-900 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors">
                      <Icon size={24} className="text-gold-400 group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-semibold text-navy-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>
                      <ul className="space-y-2 mb-5">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={serviceLinks[service.slug] || '/contact'}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
                      >
                        Learn More <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-gradient">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-serif font-light text-white mb-4">Need Expert Guidance?</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Our team is ready to assist you with any property service. Contact us today for a personalised consultation.
            </p>
            <Link to="/contact" className="btn-primary">
              Contact Us <ArrowRight size={16} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
