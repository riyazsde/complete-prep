import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>Semprep Community | Learn, Discuss & Grow Together</title>

  <meta
    name="description"
    content="Join the Semprep community to connect with students & get important updates."
  />
</Helmet>

const CommunityPage = () => {
  return (
    <>
      <div className="mainMaxWidth">
        <Header />

        <div className="px-3 md:px-6 py-16">
          <div className="">
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
             className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Our Community 🌍
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join a vibrant and growing community of learners, creators, and achievers. Connect, collaborate, and grow together.
              </p>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
             className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
              <div className="p-6 border border-gray-200 rounded-lg">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/921/921347.png"
                  className="w-14 h-14 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-gray-600 text-sm">
                  Meet like-minded students and professionals who share the same learning goals.
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                  className="w-14 h-14 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
                <p className="text-gray-600 text-sm">
                  Work together on projects, share ideas, and build meaningful connections.
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  className="w-14 h-14 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Grow</h3>
                <p className="text-gray-600 text-sm">
                  Learn from peers, mentors, and real experiences to accelerate your growth.
                </p>
              </div>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
             className="grid md:grid-cols-2 gap-10 mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Why Join Our Community?
                </h2>
                <p className="text-gray-600 mb-4">
                  Our community is built to support students at every stage of their journey. Whether you're preparing for exams, building skills, or exploring new opportunities, you'll find the right environment here.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Access to exclusive learning resources</li>
                  <li>• Participate in events, webinars, and discussions</li>
                  <li>• Network with peers and industry experts</li>
                  <li>• Stay updated with latest trends and opportunities</li>
                </ul>
                <h3 className="text-lg font-semibold mb-2 mt-10">
                  Be Part of Something Bigger
                </h3>
                <p className="text-gray-600 text-sm">
                  Join thousands of students who are already part of our ecosystem. Learn together, grow together, and achieve more.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                  className="w-full h-full max-h-[300px] object-cover rounded-lg"
                />
              </div>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
             className="text-center border rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-3">
                Join the Community 🚀
              </h2>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Become a part of our growing network and start your journey today. Engage, learn, and unlock new opportunities.
              </p>

              <button
                onClick={() => window.open('https://forms.gle/your-google-form-link', '_blank')}
                className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-90"
              >
                Join Now
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CommunityPage;