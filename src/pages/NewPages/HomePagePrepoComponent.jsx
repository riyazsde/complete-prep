import { useState } from 'react';
import { motion } from 'framer-motion';

import Ask from "../../assets/new-images/Ask Prepo Black.png";
import Summarise from "../../assets/new-images/Summarise Topic Black.png";
import Cheat from "../../assets/new-images/Assignment Assistance Black.png";
import Practice from "../../assets/new-images/Interview Prep Black.png";

export const HomePagePrepoComponent = () => {
  const tabData = [
    {
      name: 'Ask Prepo',
      title: 'Ask anything. Get instant clarity',
      desc: 'Get instant answers to your doubts with our smart AI assistant. Whether it’s a tricky concept or a quick revision, Prepo is always ready to help you learn faster and better.',
      media: Ask,
    },
    {
      name: 'Summarise topics',
      title: 'Understand more, read less',
      desc: 'Convert long chapters into short, easy summaries. Save time and focus on what really matters with clear and concise explanations.',
      media: Summarise,
    },
    {
      name: 'Assignment Assistance',
      title: 'Write better assignments, effortlessly',
      desc: 'Get step-by-step help for your assignments. From understanding questions to structuring answers, we’ve got you covered.',
      media: Cheat,
    },
    {
      name: 'Interview Prep',
      title: ' Practice, refine, and stand out',
      desc: 'Prepare for interviews with curated questions, answers, and mock practice. Boost your confidence and be job-ready.',
      media: Practice,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabData[0]);

  return (
    <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
             className="my-16 md:my-24 md:px-6 px-3">
      <h2 className="text-center text-2xl md:text-4xl font-bold mb-8 max-w-2xl mx-auto">
        Meet Prepo — Your AI Study Assistant
      </h2>

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
          <img
            src={activeTab.media}
            alt={activeTab.title}
            className="absolute inset-0 w-full h-full object-cover md:rounded-xl rounded-lg"
          />
        </div>
      </div>
    </motion.div>
  );
};