import { motion } from 'framer-motion';
import {
  Video,
  Bot,
  LineChart,
  FileText,
  BookOpen,
  Rocket,
} from "lucide-react";

export const FeaturesGrid = () => {

const features = [
  {
    title: "Video Lectures",
    desc: "Learn concepts with structured video lectures designed for quick understanding.",
    points: [
      "Visual Concepts",
      "Ask Prepo",
      "Last Minute Prep",
      "Trusted Notes",
      "Cheat Sheet",
      "Practice Papers",
    ],
    icon: Video,
  },
  {
    title: "AI Tools",
    desc: "Smart AI-powered tools to simplify learning and boost productivity.",
    points: [
      "Ask Prepo",
      "Summarise Topics",
      "Assignment Assistance",
      "Interview Prep",
    ],
    icon: Bot,
  },
  {
    title: "Smart Learning",
    desc: "Personalized learning experience tailored to your progress and goals.",
    points: [
      "Personalized Study Plans",
      "Progress Tracking",
      "Daily Goals",
      "Smart Recommendations",
    ],
    icon: LineChart,
  },
  {
    title: "Exam Preparation",
    desc: "Everything you need to prepare effectively and score better.",
    points: [
      "Mock Tests",
      "Previous Year Questions",
      "Important Questions",
      "Revision Strategies",
    ],
    icon: FileText,
  },
  {
    title: "Resources",
    desc: "Access all your study materials in one place for easy learning.",
    points: [
      "PDF Notes",
      "Recorded Lectures",
      "Topic-wise Content",
      "Quick Revision Material",
    ],
    icon: BookOpen,
  },
  {
    title: "Career Growth",
    desc: "Prepare beyond exams with tools that help you build your career.",
    points: [
      "Interview Preparation",
      "Resume Guidance",
      "Skill Development",
      "Career Roadmaps",
    ],
    icon: Rocket,
  },
];

  return (
    <div className="my-16 md:px-6 px-3">
      {/* <h2 className="text-center text-2xl md:text-4xl font-bold mb-10">
        Everything You Need to Ace Your Exams
      </h2> */}
        <h2 className="text-center text-2xl md:text-4xl font-bold mb-8 max-w-2xl mx-auto">
       Everything You Need to Ace Your Exams
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
  {features.map((item, index) => {
  const Icon = item.icon;

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="rounded-lg lg:rounded-xl p-3 lg:p-6 border border-gray-200 bg-white shadow-sm hover:shadow-lg transition cursor-pointer group"
    >
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#3DD45550] group-hover:bg-[#3DD455] transition">
        <Icon className="w-6 h-6 text-[#3DD455] group-hover:text-white transition" />
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {item.title}
      </h3>

      <p className="text-gray-600 text-sm">
        {item.desc}
      </p>

      {/* <ul className="space-y-1 text-sm text-gray-600">
        {item.points.slice(0, 3).map((point, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
            {point}
          </li>
        ))}
      </ul> */}
    </motion.div>
  );
})}
      </div>
    </div>
  );
};