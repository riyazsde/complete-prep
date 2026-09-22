import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { TrendingUp, Laptop, Target, Icon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>Careers at Semprep | Build the Future of Learning</title>

  <meta
    name="description"
    content="Join Semprep and help build smarter learning for every student."
  />
</Helmet>;

const stats = [
  {
    title: 'Growth',
    desc: 'Learn, grow, and build real-world skills while working on impactful projects with a fast-growing team.',
    icon: TrendingUp,
  },
  {
    title: 'Remote Work',
    desc: 'Enjoy flexibility and work from anywhere while collaborating with a dynamic and creative team.',
    icon: Laptop,
  },
  {
    title: 'Impact',
    desc: 'Contribute to a platform that is helping thousands of students learn better and achieve their goals.',
    icon: Target,
  },
];

const jobs = [
  {
    title: 'Campus Ambassador',
    tags: ['Part Time', 'Remote'],
    description:
      'Represent our brand on your campus, organize events, and help students discover better learning opportunities.',
    link: 'https://forms.gle/1JUQT5ZKRdhwSoqH7',
  },
  {
    title: 'Content Creators',
    tags: ['Full Time', 'Hybrid'],
    description:
      'Create engaging educational content, reels, and videos to help students learn smarter and faster.',
    link: 'https://forms.gle/3rLm62n9H8urPb89A',
  },
];

// const stats = [
//   {
//     title: 'Growth',
//     desc: 'Learn, grow, and build real-world skills while working on impactful projects with a fast-growing team.',
//     img: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
//   },
//   {
//     title: 'Remote Work',
//     desc: 'Enjoy flexibility and work from anywhere while collaborating with a dynamic and creative team.',
//     img: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
//   },
//   {
//     title: 'Impact',
//     desc: 'Contribute to a platform that is helping thousands of students learn better and achieve their goals.',
//     img: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
//   },
// ];

const CareerPage = () => {
  return (
    <>
      <div className="mainMaxWidth">
        <Header />

        <div className="px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team 🚀</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Be a part of a fast-growing platform that is transforming the way students learn. Work
              with us, grow with us, and make an impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
            {stats.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="rounded-lg p-3 lg:p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all bg-white"
                >
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#00A63E]/10 mx-auto mb-4">
                    <Icon className="w-7 h-7 text-[#00A63E]" strokeWidth={2} />
                  </div>

                  <h3 className="font-semibold text-lg mb-2 text-gray-900 text-center">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed text-center">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Open Positions</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Explore exciting opportunities and join us to build something impactful.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="border rounded-lg p-3 shadow-sm hover:shadow-lg transition cursor-pointer"
              >
                <div className="mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💼</span>
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-xl"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-base mb-6 leading-relaxed">{job.description}</p>

                <button
                  onClick={() => window.open(job.link, '_blank')}
                  className="w-full py-2 bg-black text-white rounded-lg text-base font-medium hover:opacity-90"
                >
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="text-center text-gray-500 mt-10">No openings available right now</div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CareerPage;
