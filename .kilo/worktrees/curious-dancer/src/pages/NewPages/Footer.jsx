import React from 'react';
import { Icon } from '@iconify/react';
import images from '../../utils/images';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-[#efefef] text-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="md:grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:px-6 px-3 py-16 mainMaxWidth w-full"
      >
        <div className="flex flex-col gap-6 lg:max-w-sm">
          <img src={images.navBarLogo} alt="Company Logo" className="md:w-40 w-[120px]" />

          <p>
            Video explanations, AI-powered preparation tools, notes, mind maps, one-shot revisions,
            previous year questions, and sample papers — everything you need, all in one place for a
            complete and efficient learning experience.
          </p>

          <div className="md:px-2 flex justify-start gap-6 md:py-6 pb-5 text-xl text-black">
            <Icon
              icon="mdi:instagram"
              className="cursor-pointer hover:scale-110 hover:text-gray-300 transition"
              aria-label="Instagram"
              onClick={() => window.open('https://www.instagram.com/easysemprep/', '_blank')}
            />
            <Icon
              icon="mdi:youtube"
              className="cursor-pointer hover:scale-110 hover:text-gray-300 transition"
              aria-label="YouTube"
              onClick={() => window.open('https://www.youtube.com/@easysemprep', '_blank')}
            />
            {/* <Icon
              icon="mdi:discord"
              className="cursor-pointer hover:scale-110 hover:text-gray-300 transition"
              aria-label="Discord"
            />
            <Icon
              icon="mdi:twitter"
              className="cursor-pointer hover:scale-110 hover:text-gray-300 transition"
              aria-label="Twitter"
            /> */}
            <Icon
              icon="mdi:linkedin"
              className="cursor-pointer hover:scale-110 hover:text-gray-300 transition"
              aria-label="LinkedIn"
              onClick={() => window.open('https://www.linkedin.com/company/semprep/', '_blank')}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h2 className="text-xl font-bold md:mb-5 mb-2 mt-4">Quick Links</h2>
            <ul className="md:space-y-4 space-y-1 mt-3 text-[15px]">
              <Link to="/about" className="hover:text-gray-300 block transition">
                About Us
              </Link>
              <Link to="/pricing" className="hover:text-gray-300 block transition">
                Pricing
              </Link>
              <Link to="/community" className="hover:text-gray-300 block transition">
                Community
              </Link>
              <Link to="/careers" className="hover:text-gray-300 block transition">
                Careers
              </Link>
              <Link to="/testimonials" className="hover:text-gray-300 block transition">
                Testimonials
              </Link>
              <Link to="/faqs" className="hover:text-gray-300 block transition">
                FAQs
              </Link>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold md:mb-5 mb-2 mt-4">Legal</h2>
            <ul className="md:space-y-4 space-y-1 mt-3 text-[15px]">
              <Link to="/blogs" className="hover:text-gray-300 block transition">
                Blog
              </Link>
              <Link to="/privacy-policy" className="hover:text-gray-300 block transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gray-300 block transition">
                Terms of Usage
              </Link>
              <Link to="/cookies-policy" className="hover:text-gray-300 block transition">
                Cookie Policy
              </Link>
              <Link to="/contact" className="hover:text-gray-300 block transition">
                Contact Us
              </Link>
            </ul>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
