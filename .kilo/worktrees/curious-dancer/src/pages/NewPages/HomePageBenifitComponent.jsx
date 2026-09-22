import { useState } from 'react';
import { motion } from 'framer-motion';
import Visual from '../../assets/new-images/Visual concepts Black.png';
import AskPrepo from '../../assets/new-images/Ask Prepo 2 Black.png';
import LastMinPrep from '../../assets/new-images/Last Minute Prep Black.png';
import Trusted from '../../assets/new-images/Notes Black.png';
import Cheat from '../../assets/new-images/Placement & Internships Black.png';
import Practice from '../../assets/new-images/PYQ Black.png';
import Skill from '../../assets/new-images/Skills Black.png';

export const HomePageBenifitComponent = () => {
  const tabData = [
    {
      name: 'Visual Concepts',
      title: 'Visual learning that makes everything click',
      desc: 'AI assistant helps you understand difficult concepts quickly.',
      media: Visual,
      type: 'image',
    },
    {
      name: 'Ask Prepo',
      title: 'Your 24/7 doubt-solving bestie',
      desc: 'Generate videos, images, and diagrams to break down any concept.',
      media: AskPrepo,
      type: 'image',
    },
    {
      name: 'Last Minute Prep',
      title: 'Revise everything in minutes, not hours',
      desc: 'Upload notes, PDFs, and lectures to study in one place.',
      media: LastMinPrep,
      type: 'image',
    },
    {
      name: 'Notes',
      title: 'Notes you can rely on, every time',
      desc: 'Get suggestions on what to study next based on progress.',
      media: Trusted,
      type: 'image',
    },
    {
      name: 'Solved PYQs',
      title: 'Practice what actually gets asked',
      desc: 'Get concise summaries, key formulas, and important points for fast revision.',
      media: Cheat,
      type: 'image',
    },
    {
      name: 'Skills',
      title: 'Build skills that actually matter. From theory to real-world skills',
      desc: 'Learn practical concepts, hands-on techniques, and real-world applications to build skills that go beyond theory.',
      media: Skill,
      type: 'image',
    },
    {
      name: 'Placements & Internships',
      title: 'Bridge the gap between college and career.',
      desc: 'Test yourself with quizzes and revision prompts.',
      media: Practice,
      type: 'image',
    },
  ];

  const [activeTab, setActiveTab] = useState(tabData[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="my-16 md:px-6 px-3"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-3 text-center max-w-3xl mx-auto">
        Stop searching for reliable sources, One stop solution for all your needs
      </h1>

      <p className="text-sm md:text-base text-gray-700 max-w-xl mx-auto text-center mb-10">
        Your AI-powered study partner that helps you solve doubts, learn faster, and master concepts
        instantl
      </p>
      <div className="flex flex-nowrap md:gap-2 bg-[#f3f4f6] max-w-[calc(100vw-32px)] overflow-auto rounded-3xl p-1 w-fit mx-auto">
        {tabData.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab)}
            className={`lg:!px-4 px-2 py-2 text-[13px] sm:text-base font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab.name === tab.name
                ? 'bg-white text-black rounded-3xl'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="mt-3 flex justify-center md:rounded-xl rounded-lg overflow-hidden">
        {/* <div className="md:p-10 text-black flex-1 max-w-[400px]">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 px-3 md:px-0 pt-5 md:pt-0">
            {activeTab.title}
          </h2>

          <p className="text-sm md:text-base text-black/80 max-w-sm px-3 md:px-0 pb-5 md:pb-0">
            {activeTab.desc}
          </p>
        </div> */}

        <div className="relative h-auto object-contain lg:!h-[650px] max-w-[1000px] aspect-[16/10] md:rounded-xl rounded-lg mx-auto overflow-hidden p-8 md:p-12 flex-1">
          {activeTab.type === 'video' ? (
            <video
              src={activeTab.media}
              autoPlay
              muted
              loop
              className="absolute inset-0 w-full h-full object-cover md:rounded-xl rounded-lg"
            />
          ) : (
            <img
              src={activeTab.media}
              alt={activeTab.title}
              className="absolute inset-0 w-full h-full object-cover md:rounded-xl rounded-lg"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};
