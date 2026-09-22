import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
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
              Privacy Policy 🔐
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 mb-6 text-center"
            >
              Your privacy matters to us. This Privacy Policy explains how we collect, use, and protect your information while you use our platform.
            </motion.p>

            <div className="space-y-8 text-gray-700 text-sm md:text-base leading-relaxed mt-16">

              {[
                {
                  title: "1. Information We Collect",
                  desc: "We may collect personal information such as your name, email address, and usage data when you sign up or interact with our platform. This helps us improve your learning experience."
                },
                {
                  title: "2. How We Use Your Information",
                  desc: "Your information is used to provide personalized content, improve our services, communicate updates, and enhance overall user experience."
                },
                {
                  title: "3. Data Security",
                  desc: "We take appropriate security measures to protect your data from unauthorized access, misuse, or disclosure. Your data is stored securely and handled with care."
                },
                {
                  title: "4. Third-Party Services",
                  desc: "We may use third-party tools or services to improve functionality. These services may collect limited data as per their own privacy policies."
                },
                {
                  title: "5. Cookies",
                  desc: "We use cookies to enhance user experience, remember preferences, and analyze website traffic. You can disable cookies in your browser settings if you prefer."
                },
                {
                  title: "6. Your Rights",
                  desc: "You have the right to access, update, or delete your personal data. You can contact us anytime for any privacy-related concerns."
                },
                {
                  title: "7. Updates to This Policy",
                  desc: "We may update this Privacy Policy from time to time. Any changes will be reflected on this page."
                },
                {
                  title: "8. Contact Us",
                  desc: "If you have any questions about this Privacy Policy, feel free to contact us at support@semprep.com"
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

export default PrivacyPolicyPage;