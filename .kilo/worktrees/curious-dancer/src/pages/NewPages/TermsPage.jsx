import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';

const TermsPage = () => {
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
              Terms of Usage 📄
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 mb-6 text-center"
            >
              These Terms of Usage govern your access to and use of our platform. By using our services, you agree to comply with these terms.
            </motion.p>

            <div className="space-y-8 text-gray-700 text-sm md:text-base leading-relaxed mt-16">

              {[
                {
                  title: "1. Acceptance of Terms",
                  desc: "By accessing or using our platform, you agree to be bound by these Terms of Usage. If you do not agree, please do not use our services."
                },
                {
                  title: "2. Use of the Platform",
                  desc: "You agree to use the platform only for lawful purposes. You must not misuse the platform, attempt unauthorized access, or disrupt services."
                },
                {
                  title: "3. User Accounts",
                  desc: "You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility."
                },
                {
                  title: "4. Content Usage",
                  desc: "All content provided on the platform is for educational purposes only. You may not copy, distribute, or reuse content without permission."
                },
                {
                  title: "5. Intellectual Property",
                  desc: "All materials, including logos, content, and designs, are owned by us and protected by applicable intellectual property laws."
                },
                {
                  title: "6. Limitation of Liability",
                  desc: "We are not liable for any direct or indirect damages resulting from the use of our platform. Use the platform at your own risk."
                },
                {
                  title: "7. Termination",
                  desc: "We reserve the right to suspend or terminate access to the platform if users violate these terms or misuse the service."
                },
                {
                  title: "8. Changes to Terms",
                  desc: "We may update these Terms of Usage from time to time. Continued use of the platform means you accept the updated terms."
                },
                {
                  title: "9. Contact Us",
                  desc: "If you have any questions regarding these Terms, feel free to contact us at support@semprep.com"
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

export default TermsPage;