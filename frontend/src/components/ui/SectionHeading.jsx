import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, subtitle, light = false, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-14 ${center ? 'text-center' : ''}`}
    >
      {eyebrow && (
        <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
          <div className="gold-line" />
          <span className={`text-xs font-semibold tracking-[0.2em] uppercase ${light ? 'text-gold-400' : 'text-gold-600'}`}>
            {eyebrow}
          </span>
          <div className="gold-line" />
        </div>
      )}
      <h2 className={`text-4xl md:text-5xl font-serif font-light leading-tight mb-4 ${light ? 'text-white' : 'text-navy-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl leading-relaxed ${center ? 'mx-auto' : ''} ${light ? 'text-gray-300' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
