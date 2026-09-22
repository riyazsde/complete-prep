import { Icon } from '@iconify/react/dist/iconify.js';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReusableModal } from '../../components/common/ComPrepComponent/ComPrepComponent';
import { ProfileEditFormMain } from '../../components/common/New-Components/NewComponent';
import { AuthContext } from '../../Context/AuthContext';
import { userApi } from '../../services/apiFunctions';
import images from '../../utils/images';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';
import aboutimages from '../../assets/new-images/aboutimage.png';
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>About Semprep | Built for Smarter College Learning</title>

  <meta
    name="description"
    content="Learn how Semprep makes semester exam prep simpler and smarter."
  />
</Helmet>

const missionPoints = [
  { icon: 'solar:book-bold', text: 'Understand concepts deeply' },
  { icon: 'solar:chart-bold', text: 'Prepare efficiently' },
  { icon: 'solar:star-bold', text: 'Perform confidently' },
];

const whatWeDoCards = [
  {
    icon: 'solar:atom-bold',
    title: 'Concept-Based Learning',
    desc: 'Break down complex topics into simple, easy-to-understand explanations — just like your best teacher would.',
    iconColor: 'text-[#3DD455]',
    bgColor: 'bg-[#3DD45510]',
  },
  {
    icon: 'solar:chat-round-bold',
    title: 'Ask Prepo (AI-Powered)',
    desc: 'Stuck on a concept? Ask anything and get instant, clear explanations — anytime, anywhere.',
    iconColor: 'text-[#3DD455]',
    bgColor: 'bg-[#3DD45510]',
  },
  {
    icon: 'solar:layers-bold',
    title: 'Smart Preparation Tools',
    desc: 'Topic summaries, last-minute revision, previous year questions & practice papers — all in one place.',
    iconColor: 'text-[#3DD455]',
    bgColor: 'bg-[#3DD45510]',
    tools: ['Topic summaries', 'Last-minute revision', 'Previous year questions', 'Practice papers'],
  },
  {
    icon: 'solar:diploma-bold',
    title: 'Academic Support',
    desc: 'From assignments to interview prep — we help you perform beyond exams.',
    iconColor: 'text-[#3DD455]',
    bgColor: 'bg-[#3DD45510]',
  },
];

const whyBuiltProblems = [
  'Information overload',
  'Unstructured study material',
  'Lack of clarity',
  'Last-minute stress',
];

const whyBuiltSolutions = [
  'Learning is structured',
  'Doubts are solved instantly',
  'Preparation becomes strategic',
];

const approachSteps = [
  { label: 'Understand', icon: 'solar:lightbulb-bold' },
  { label: 'Practice', icon: 'solar:pen-bold' },
  { label: 'Revise', icon: 'solar:refresh-bold' },
  { label: 'Perform', icon: 'solar:medal-ribbons-star-bold' },
];

const builtForCards = [
  { icon: 'solar:calendar-bold', text: 'Preparing for semester exams' },
  { icon: 'solar:alarm-bold', text: 'Managing tight deadlines' },
  { icon: 'solar:graph-up-bold', text: 'Trying to improve scores' },
];

const builtForFeatures = [
  { icon: 'solar:eye-bold', label: 'Clarity-first content' },
  { icon: 'solar:cpu-bold', label: 'AI-powered assistance' },
  { icon: 'solar:target-bold', label: 'Exam-focused strategy' },
];

const finalNotePoints = [
  { icon: 'solar:clock-circle-bold', text: 'Save time' },
  { icon: 'solar:heart-pulse-bold', text: 'Reduce stress' },
  { icon: 'solar:lightbulb-bold', text: 'Learn smarter' },
  { icon: 'solar:star-shine-bold', text: 'Achieve more' },
];

const AboutMainPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [goalCategory, setGoalCategory] = useState([]);
  const [aboutUs, setAboutUs] = useState({});
  const { setUser } = useContext(AuthContext);
  const [nextPage, setNextPage] = useState('');

  useEffect(() => {
    userApi.goalCategory.getAll({ onSuccess: data => setGoalCategory(data?.data || []) });
  }, []);

  useEffect(() => {
    userApi.aboutUs.getAll({ onSuccess: data => setAboutUs(data?.data?.[0] || {}) });
  }, []);

  return (
    <>
      <ReusableModal
        size="md"
        body={
          <ProfileEditFormMain
            nextPage={nextPage}
            closeModal={() => setModalVisible(false)}
            setUser={setUser}
          />
        }
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        footer={false}
        header={false}
      />

      <div className="h-full mainMaxWidth">
        <Header />

        <div className="bg-white text-gray-800 pb-10 lg:pb-16">

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12 about-bg relative overflow-hidden"
          >
            <img
              src={aboutimages}
              alt="About Us"
              className="w-full h-auto lg:rounded-xl object-cover min-h-[300px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent flex flex-col justify-end px-6 py-8 lg:px-10 lg:py-10 lg:rounded-xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-start text-4xl font-bold text-white max-w-lg"
              >
                Making Semesters Easy
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="text-white/80 text-sm lg:text-base mt-2 max-w-md"
              >
                At Semprep, we believe education shouldn't feel overwhelming — it should feel clear, structured, and empowering.
              </motion.p>
            </div>
          </motion.section>

          {/* ── API-driven description ── */}
          {/* {aboutUs?.desc && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 md:px-6 px-3"
            >
              <div
                className="text-sm lg:text-base leading-relaxed text-gray-600 text-center"
                dangerouslySetInnerHTML={{ __html: aboutUs?.desc || '' }}
              />
            </motion.section>
          )} */}

          <div className="space-y-16 md:px-6 px-3">

            {/* ── Empowering Education ── */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* heading + paragraphs side by side */}
              <div className="md:flex gap-10 items-start mb-10">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <span className="inline-block bg-[#3DD45510] border border-[#3DD45550] text-[#3DD455] text-xs font-bold tracking-widest uppercase rounded-3xl px-4 py-1 mb-3">
                    About Us
                  </span>
                  <h2 className="text-start text-4xl font-bold text-black">
                    Empowering Education Through Technology
                  </h2>
                </div>
                <div className="md:w-1/2 flex flex-col gap-3">
                  <p className="text-gray-500 font-normal text-[16px] leading-relaxed">
                    We are a passionate team of educators and technologists dedicated to making learning accessible, engaging, and effective for everyone.
                  </p>
                  <p className="text-gray-500 font-normal text-[16px] leading-relaxed">
                    Our mission is to bridge the gap between traditional education and modern technology. We believe that every learner deserves access to high-quality, interactive, and personalized educational experiences.
                  </p>
                  <p className="text-gray-500 font-normal text-[16px] leading-relaxed">
                    From interactive courses to adaptive learning platforms, we design tools that empower students, teachers, and institutions to achieve their full potential.
                  </p>
                </div>
              </div>

              {/* 4 value cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: 'solar:accessibility-bold',
                    title: 'Accessibility',
                    desc: 'Learning for all, regardless of background or ability.',
                    iconColor: 'text-[#3DD455]',
                    bgColor: 'bg-[#3DD45510]',
                    borderColor: 'border-[#3DD45530]',
                  },
                  {
                    icon: 'solar:cpu-bold',
                    title: 'Innovation',
                    desc: 'Leveraging technology to create impactful educational solutions.',
                    iconColor: 'text-[#3DD455]',
                    bgColor: 'bg-[#3DD45510]',
                    borderColor: 'border-[#3DD45530]',
                  },
                  {
                    icon: 'solar:users-group-rounded-bold',
                    title: 'Collaboration',
                    desc: 'Partnering with educators and learners to co-create the future of education.',
                    iconColor: 'text-[#3DD455]',
                    bgColor: 'bg-[#3DD45510]',
                    borderColor: 'border-[#3DD45530]',
                  },
                  {
                    icon: 'solar:heart-bold',
                    title: 'Empathy',
                    desc: 'Understanding the unique needs of every learner.',
                    iconColor: 'text-[#3DD455]',
                    bgColor: 'bg-[#3DD45510]',
                    borderColor: 'border-[#3DD45530]',
                  },
                ].map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className={`bg-white rounded-xl lg:p-5 p-3 border ${val.borderColor} shadow-sm hover:shadow-md transition-shadow duration-300`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${val.bgColor} flex items-center justify-center mb-3`}>
                      <Icon icon={val.icon} className={`${val.iconColor} text-xl`} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-xl mb-1">{val.title}</h4>
                    <p className="text-gray-500 text-base leading-relaxed">{val.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── Our Mission ── */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#3DD45510] border border-[#3DD45530] rounded-2xl p-6 lg:p-10"
            >
              <div className="text-center mb-8">
                <span className="inline-block bg-white border border-[#3DD45550] text-[#3DD455] text-xs font-bold tracking-widest uppercase rounded-3xl px-4 py-1 mb-3">
                  Our Mission
                </span>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">Why We Exist</h2>
                <p className="text-gray-500 text-sm lg:text-base max-w-xl mx-auto">
                  To transform the way students learn by combining clarity, technology, and real exam-focused preparation.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {missionPoints.map((pt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white rounded-xl lg:p-5 p-3 flex items-center gap-3 border border-[#3DD45530] shadow-sm"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3DD455] to-[#22c55e] flex items-center justify-center shrink-0">
                      <Icon icon={pt.icon} className="text-white text-xl" />
                    </div>
                    <span className=" text-gray-800 text-[16px]">{pt.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── What We Do ── */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <span className="inline-block bg-[#3DD45510] border border-[#3DD45550] text-[#3DD455] text-xs font-bold tracking-widest uppercase rounded-3xl px-4 py-1 mb-3">
                  What We Do
                </span>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">
                  Your Complete Academic Companion
                </h2>
                <p className="text-gray-500 text-sm lg:text-base max-w-xl mx-auto">
                  Semprep brings together everything a student needs in one place.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {whatWeDoCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="bg-white rounded-xl lg:p-5 p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center mb-4`}>
                      <Icon icon={card.icon} className={`${card.iconColor} text-2xl`} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-[16px] lg:text-xl mb-2">{card.title}</h4>
                    <p className="text-gray-500 text-[16px] leading-relaxed">{card.desc}</p>
                    {card.tools && (
                      <ul className="mt-3 space-y-1.5">
                        {card.tools.map((t, j) => (
                          <li key={j} className="flex items-center gap-2 text-gray-500 text-[16px]">
                            <Icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── Why We Built Semprep ── */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Problems */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-red-100 shadow-sm">
                <span className="inline-block bg-red-50 border border-red-200 text-red-600 text-xs font-bold tracking-widest uppercase rounded-3xl px-4 py-1 mb-3">
                  The Problem
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Why We Built Semprep</h3>
                <p className="text-gray-500 text-sm mb-4">We've seen students struggle with:</p>
                <div className="space-y-2">
                  {whyBuiltProblems.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-red-700 text-[16px]"
                    >
                      <Icon icon="solar:close-circle-bold" className="text-base shrink-0" />
                      {p}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Solutions */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 lg:p-8 text-white">
                <span className="inline-block bg-white/15 text-white text-xs font-bold tracking-widest uppercase rounded-3xl px-4 py-1 mb-3">
                  The Solution
                </span>
                <h3 className="text-xl font-extrabold mb-2 mt-1">So We Built Semprep</h3>
                <p className="text-white/70 text-sm mb-4">A platform where:</p>
                <div className="space-y-2">
                  {whyBuiltSolutions.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5 text-[16px]"
                    >
                      <Icon icon="solar:check-circle-bold" className="text-emerald-400 text-base shrink-0" />
                      {s}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ── Our Approach ── */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 lg:p-10"
            >
              <div className="text-center mb-8">
                <span className="inline-block bg-white border border-emerald-200 text-emerald-700 text-xs font-bold tracking-widest uppercase rounded-3xl px-4 py-1 mb-3">
                  Our Approach
                </span>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">
                  Understand → Practice → Revise → Perform
                </h2>
                <p className="text-gray-500 text-sm lg:text-base max-w-md mx-auto">
                  Every feature, every tool, and every piece of content is designed to move you through this journey seamlessly.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {approachSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white rounded-xl lg:p-5 p-3 flex items-center gap-4 border border-emerald-100 shadow-sm"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${i % 2 === 0 ? 'bg-gradient-to-br from-[#3DD455] to-[#22c55e]' : 'bg-[#3DD455]/80'}`}>
                      <Icon icon={step.icon} className="text-white text-xl" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step {String(i + 1).padStart(2, '0')}</p>
                      <p className="font-bold text-gray-900 text-sm">{step.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── Built for Students ── */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-10"
            >
              <div className="text-center mb-8">
                <span className="inline-block bg-[#3DD45510] border border-[#3DD45550] text-[#3DD455] text-xs font-bold tracking-widest uppercase rounded-3xl px-4 py-1 mb-3">
                  Built for Students
                </span>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">
                  Designed for Results
                </h2>
                <p className="text-gray-500 text-sm lg:text-base max-w-lg mx-auto">
                  Whether you're dealing with exams, deadlines, or aiming to improve — Semprep has you covered.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {builtForCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-3 bg-[#3DD45510] border border-[#3DD45530] rounded-xl px-4 py-3"
                  >
                    <Icon icon={card.icon} className="text-[#3DD455] text-xl shrink-0" />
                    <span className="text-gray-800 text-[16px]">{card.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-gray-100">
                {builtForFeatures.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#3DD455] to-[#22c55e] text-white font-semibold text-sm rounded-3xl lg:px-5 px-3 py-2.5"
                  >
                    <Icon icon={f.icon} className="text-base" />
                    {f.label}
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ── Vision ── */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#000] rounded-2xl p-8 lg:p-14 text-center text-white relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -bottom-14 -left-14 w-64 h-64 bg-white/5 rounded-full" />
              <Icon icon="solar:eye-bold" className="text-5xl text-white/90 mb-4 mx-auto" />
              <h2 className="text-2xl lg:text-4xl font-extrabold mb-4 leading-tight">Our Vision</h2>
              <p className="text-white/85 text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
                To become the most trusted learning platform for students, where education is not just accessible — but{' '}
                <strong className="text-white">intelligent, personalised, and outcome-driven</strong>.
              </p>
            </motion.section>

            {/* {aboutUs?.team?.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-10">
                  <span className="inline-block bg-[#3DD45510] border border-[#3DD45550] text-[#3DD455] text-xs font-bold tracking-widest uppercase rounded-3xl px-4 py-1 mb-3">
                    Meet the Team
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                    The People Behind Semprep
                  </h2>
                </div>
                <div className="space-y-12">
                  {aboutUs.team.map((founder, index) => {
                    const isReversed = index % 2 !== 0;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: isReversed ? 100 : -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`md:flex gap-10 ${isReversed ? 'md:flex-row-reverse' : ''} items-center`}
                      >
                        <div className="w-full lg:w-1/2">
                          {founder.image && (
                            <img
                              src={founder.image}
                              alt={founder.name}
                              className="w-full h-auto rounded-xl object-cover shadow-sm"
                            />
                          )}
                        </div>
                        <div className="w-full lg:w-1/2 mt-10 md:mt-0">
                          {founder.name && (
                            <h3 className="text-lg lg:text-xl font-semibold mb-3">{founder.name}</h3>
                          )}
                          <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                            {founder.desc || ''}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            )} */}

            {/* ── Final Note ── */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900 rounded-2xl p-8 lg:p-14 text-center text-white"
            >
              <span className="inline-block bg-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-3xl px-4 py-1 mb-4">
                Final Note
              </span>
              <h2 className="text-xl lg:text-3xl font-extrabold mb-2">
                At Semprep, we're not just helping you study.
              </h2>
              <p className="text-slate-400 text-sm mb-8">We're helping you:</p>

              <div className="grid grid-cols-2 sm:!grid-cols-4 gap-4 mx-auto mb-10">
                {finalNotePoints.map((pt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="bg-white/5 border border-white/10 rounded-xl py-5 px-3 flex flex-col items-center gap-2"
                  >
                    <Icon icon={pt.icon} className="text-[#3DD455] text-3xl" />
                    <span className="font-semibold text-slate-200 text-sm">{pt.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="inline-block bg-gradient-to-r from-[#3DD455] to-[#22c55e] rounded-lg lg:px-5 px-3 lg:py-3 py-2 text-base lg:text-lg font-extrabold tracking-wide">
                Now, Semesters Made Easy.
              </div>
            </motion.section>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AboutMainPage;