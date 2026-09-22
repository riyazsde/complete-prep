import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';

const CookiesPolicyPage = () => {
  return (
    <>
      <div className="mainMaxWidth">
        <Header />

        <div className="px-3 md:px-6 py-16">
          <div className="max-w-4xl mx-auto">

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-center"
            >
              Cookie Policy 🔒
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 mb-6 text-center"
            >
              This Cookie Policy explains how we use cookies and similar technologies to enhance your experience on our platform.
            </motion.p>

            <div className="space-y-8 text-gray-700 text-sm md:text-base leading-relaxed mt-16">

              {[
                {
                  title: "1. What Are Cookies",
                  desc: "Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience."
                },
                {
                  title: "2. How We Use Cookies",
                  desc: "We use cookies to personalize content, remember user preferences, analyze traffic, and improve overall performance of our platform."
                },
                {
                  title: "3. Types of Cookies We Use",
                  desc: "We may use session cookies, persistent cookies, and third-party cookies for analytics and functionality improvements."
                },
                {
                  title: "4. Third-Party Cookies",
                  desc: "Some cookies may be placed by third-party services such as analytics tools. These help us understand user behavior and improve our services."
                },
                {
                  title: "5. Managing Cookies",
                  desc: "You can control or disable cookies through your browser settings. However, disabling cookies may affect certain features of the platform."
                },
                {
                  title: "6. Changes to This Policy",
                  desc: "We may update this Cookie Policy from time to time. Any changes will be posted on this page."
                },
                {
                  title: "7. Contact Us",
                  desc: "If you have any questions about our Cookie Policy, feel free to contact us at support@semprep.com"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                  <p>{item.desc}</p>
                </motion.div>
              ))}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CookiesPolicyPage;