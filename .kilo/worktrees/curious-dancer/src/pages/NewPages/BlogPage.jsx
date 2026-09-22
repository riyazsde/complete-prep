import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';

const blogs = [
  {
    title: 'How to Study Effectively for Exams',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
    description: 'Learn proven techniques to improve focus, retention, and exam performance.',
  },
  {
    title: 'Top 10 Productivity Tips for Students',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    description: 'Boost your productivity with simple habits and smart planning strategies.',
  },
  {
    title: 'How to Crack Competitive Exams',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    description: 'A complete guide to preparing for competitive exams like JEE, NEET, and more.',
  },
  {
    title: 'Time Management for Students',
    image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335',
    description: 'Master time management skills to balance studies, revision, and personal life.',
  },
  {
    title: 'Best Study Techniques That Work',
    image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d',
    description: 'Discover techniques like active recall and spaced repetition.',
  },
  {
    title: 'How to Stay Motivated While Studying',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0',
    description: 'Tips to stay consistent and motivated throughout your learning journey.',
  },
  {
    title: 'Importance of Mock Tests',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    description: 'Understand why mock tests are crucial for exam success.',
  },
  {
    title: 'Revision Strategy for Exams',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
    description: 'Plan your revision smartly to maximize retention and performance.',
  },
  {
    title: 'Avoid These Common Study Mistakes',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    description: 'Identify and avoid mistakes that can slow down your progress.',
  },
];

const BlogPage = () => {
  return (
    <>
      <div className='mainMaxWidth'>
        <Header />

      <div className="px-3 md:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Our Blog 📚
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore insights, tips, and guides to help you learn better and achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: index * 0.2 }}
            viewport={{ once: true }}
            
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-3">
                <h2 className="text-lg font-semibold mb-2">
                  {blog.title}
                </h2>

                <p className="text-gray-600 text-sm mb-4">
                  {blog.description}
                </p>

                <button className="text-blue-600 font-medium hover:underline">
                  Read More →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No blogs available
          </div>
        )}
      </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPage;