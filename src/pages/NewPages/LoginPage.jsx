import { Icon } from '@iconify/react/dist/iconify.js';
import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import { ReusableModal } from '../../components/common/ComPrepComponent/ComPrepComponent';
import { ProfileEditFormMain } from '../../components/common/New-Components/NewComponent';
import { AuthContext } from '../../Context/AuthContext';
import { userApi } from '../../services/apiFunctions';
import images from '../../utils/images';
import './NewPages.css';
import { HomePageBenifitComponent } from './HomePageBenifitComponent';
import StackCards from './StackCards';
import Footer from './Footer';
import Header from './Header';
import { HomePagePrepoComponent } from './HomePagePrepoComponent';
import { FeaturesGrid } from './FeaturesGrid';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import img1 from '../../assets/images/updated-img-logo/1.png';
import img2 from '../../assets/images/updated-img-logo/2.png';
import img3 from '../../assets/images/updated-img-logo/3.png';
import img4 from '../../assets/images/updated-img-logo/4.png';
import img5 from '../../assets/images/updated-img-logo/5.png';
import img6 from '../../assets/images/updated-img-logo/6.png';
import img7 from '../../assets/images/updated-img-logo/7.png';
import img8 from '../../assets/images/updated-img-logo/8.png';
import img9 from '../../assets/images/updated-img-logo/9.png';
import img10 from '../../assets/images/updated-img-logo/10.png';
import img11 from '../../assets/images/updated-img-logo/11.png';
import img12 from '../../assets/images/updated-img-logo/12.png';
import img13 from '../../assets/images/updated-img-logo/13.png';
import img14 from '../../assets/images/updated-img-logo/14.png';
import img15 from '../../assets/images/updated-img-logo/15.png';
import img16 from '../../assets/images/updated-img-logo/16.png';
import img17 from '../../assets/images/updated-img-logo/17.png';
import img18 from '../../assets/images/updated-img-logo/18.png';
import img19 from '../../assets/images/updated-img-logo/19.png';
import img20 from '../../assets/images/updated-img-logo/20.png';
import img21 from '../../assets/images/updated-img-logo/21.png';
import img22 from '../../assets/images/updated-img-logo/22.png';
import heroimg from '../../assets/new-images/Transparent.png';

<Helmet>
  <title>Semprep | Smarter Study Resources for Semester Exams</title>

  <meta
    name="description"
    content="Semprep is a one stop solution for all the higher education students to prepare for their semester exams."
  />
</Helmet>;

const courses = [
  {
    title: 'NEET',
    image: images.newHomePageCourseImage1,
    cardBg: '#A8D5A2',
    imageBg: '#ffffff',
  },
  {
    title: '12th Board',
    image: images.newHomePageCourseImage2,
    cardBg: '#FFE88D',
    imageBg: '#fff1b8',
  },
  {
    title: '10th Board',
    image: images.newHomePageCourseImage3,
    cardBg: '#FFCB89',
    imageBg: '#fff0d1',
  },
  {
    title: 'BA (Online)',
    image: images.newHomePageCourseImage4,
    cardBg: '#E7D1FB',
    imageBg: '#d3bff7',
  },
  {
    title: 'UPSC 2026',
    image: images.newHomePageCourseImage5,
    cardBg: '#B6D7A8',
    imageBg: '#c6e1b6',
  },
  {
    title: 'SSC CGL',
    image: images.newHomePageCourseImage6,
    cardBg: '#D6E0FF',
    imageBg: '#dce7ff',
  },
];

const brands = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
  img19,
  img20,
  img21,
  img22,
];

const howWeWork = [
  {
    icon: 'heroicons-solid:eye',
    title: 'Tell Us About Your Vision',
    description:
      "Share your pitch deck or business plan, and we'll review your vision, market potential, and growth strategy to explore collaboration.",
  },
  {
    icon: 'streamline:magnifying-glass-circle',
    title: 'Assessing Potential',
    description: '',
  },
  {
    icon: 'game-icons:tree-growth',
    title: 'Fueling Your Growth',
    description: '',
  },
  {
    icon: 'fluent:arrow-growth-20-regular',
    title: 'Long-Term Growth Support',
    description: '',
  },
];

const communityCards = [
  {
    title: 'Discussion Forums',
    description:
      'Engage in topic-based discussions, post questions, and participate in debates on key subjects.',
    image: images.newHomePageCommunityImage1,
  },
  {
    title: 'Study Groups',
    description:
      'Join study groups based on your exam or subject area. Work together, share strategies, and track each other’s progress.',
    image: images.newHomePageCommunityImage2,
  },
  {
    title: 'Challenges & Leaderboards',
    description:
      'Participate in weekly or monthly challenges. Earn points by solving quizzes, contributing to discussions, and climb the leaderboard.',
    image: images.newHomePageCommunityImage3,
  },
  {
    title: 'Doubts & Solutions',
    description:
      'Post your doubts, and receive solutions from other learners and mentors. Respond to queries and help others along the way.',
    image: images.newHomePageCommunityImage4,
  },
];

const exploreCourses = [
  {
    title: 'JEE',
    description:
      'Unlock Your Online JEE Main/Advanced, a digital self-paced course is designed for any JEE aspirant in any corner of the country.',
    bgImage: images?.newHomePageExploreCourseImage1,
  },
  {
    title: 'NEET',
    description:
      'Embark on your NEET UG journey with our Comprehensive Medical Course, designed to give you an edge in the world of medical entrance exams.',
    bgImage: images?.newHomePageExploreCourseImage2,
  },
  {
    title: 'SSC COL',
    description:
      'Download Your SSC Answer Key 2023. Check your answers and calculate your expected score.',
    bgImage: images?.newHomePageExploreCourseImage3,
  },
  {
    title: 'className 12th',
    description:
      'Order Your Sample Papers for className 12th CBSE Board Exams. Prepare from the best resources, score high, and shine bright.',
    bgImage: images?.newHomePageExploreCourseImage4,
  },
];

// const testimonials = [
//   {
//     id: 1,
//     name: 'Anubhav Tyagi',
//     university: 'Delhi University',
//     course: 'B.Com (Prog)',
//     rating: 5,
//     avatar: '',
//     review:
//       'If you’re a college student looking for a single platform for video lectures, notes, revision, AI support, and placements, Semprep is exactly what you need.',
//   },
//   {
//     id: 2,
//     name: 'Aditi Yadav',
//     university: 'Delhi University',
//     course: 'BA Political Science (Hons)',
//     rating: 4,
//     avatar: '',
//     review:
//       'I used to spend hours searching for reliable study material. With Semprep, everything I need is available in one place — notes, revision material, and practice tests. The community feature is also very useful.',
//   },
//   {
//     id: 3,
//     name: 'Raman',
//     university: 'Delhi University',
//     course: 'BA Pol Sci (Hons)',
//     rating: 5,
//     avatar: '',
//     review:
//       'Semprep gives me everything in one place — study resources, doubt-solving, and even placement support. It’s much more than just a prep platform.',
//   },
//   {
//     id: 4,
//     name: 'Kunal Singh',
//     university: 'Delhi University',
//     course: 'BA History (Hons)',
//     rating: 4,
//     avatar: '',
//     review:
//       'The video solutions for PYQs are excellent. Instead of just memorizing answers, I actually understand how to approach exam questions.',
//   },
//   {
//     id: 5,
//     name: 'Ananya Gupta',
//     university: 'Delhi University',
//     course: 'BA Economics (Hons)',
//     rating: 5,
//     avatar: '',
//     review:
//       'Prepo AI is my favourite feature. It explains difficult concepts in simple language and even helps me structure my assignments. It’s much more useful than generic AI tools because it is built specifically for students.',
//   },
//   {
//     id: 6,
//     name: 'Abhishek Sharma',
//     university: 'Delhi University',
//     course: 'B.Com (Hons)',
//     rating: 5,
//     avatar: '',
//     review:
//       'Honestly, Semprep has made my semester preparation so much easier. The notes are concise, the PYQs are extremely helpful, and Prepo AI clears my doubts instantly. It feels like having a personal tutor available 24/7.',
//   },
// ];

const LoginPage = () => {
  const [currentState, setCurrentState] = useState(null);
  const [activeCategory, setActiveCategory] = useState('CBSE');
  const [openIndex, setOpenIndex] = useState(0);
  const bgColors = ['#FFFECF', '#FEE5E5', '#E3FCD0', '#DDE8FF', '#FFFFFF'];
  const borderColors = ['#C3B900', '#B82020', '#1F7A1F', '#003E9D', '#E0E0E0'];
  const titleColors = ['#D4B300', '#D62828', '#228B22', '#003B95', '#000000'];
  const [testimonials, setTestimonials] = useState([]);
  const [mainUniversities, setMainUniversities] = useState([]);

  const universities = [
    {
      title: 'IIT',

      image: images.newHomePageCourseImage1,
      cardBg: '#A8D5A2',
      imageBg: '#ffffff',
    },
    {
      title: 'NIT',
      image: images.newHomePageCourseImage2,
      cardBg: '#FFE88D',
      imageBg: '#fff1b8',
    },
    {
      title: 'IIIT',
      image: images.newHomePageCourseImage3,
      cardBg: '#FFCB89',
      imageBg: '#fff0d1',
    },
    {
      title: 'IIM',
      image: images.newHomePageCourseImage4,
      cardBg: '#E7D1FB',
      imageBg: '#d3bff7',
    },
    {
      title: 'NIFT',
      image: images.newHomePageCourseImage5,
      cardBg: '#B6D7A8',
      imageBg: '#c6e1b6',
    },
    {
      title: 'NIRF',
      image: images.newHomePageCourseImage6,
      cardBg: '#D6E0FF',
      imageBg: '#dce7ff',
    },
  ];

  const [nextPage, setNextPage] = useState('');
  const [faqs, setFaqs] = useState([]);
  const navigate = useNavigate();
  const toggleDropdown = state => {
    setCurrentState(currentState === state ? null : state);
  };
  const [modalVisible, setModalVisible] = useState(true);

  const [goalCategory, setGoalCategory] = useState([]);
  const [goal, setGoal] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedGoalCategory, setSelectedGoalCategory] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [topBanner, setTopBanner] = useState('');
  const { setUser } = useContext(AuthContext);

  const [popularCourses, setPopularCourses] = useState([]);

  const fetchTopBanner = async () => {
    userApi.landingPage.getTopBanner({
      params: { position: 'TOP' },
      onSuccess: data => {
        setTopBanner(data?.data?.[data?.data?.length - 1]?.image || '');
      },
    });
  };

  const fetchPopularCourses = async () => {
    userApi.landingPage.getAll({
      onSuccess: data => setPopularCourses(data?.data || []),
    });
  };

  const fetchGoalCategory = async () => {
    userApi.goalCategory.getAll({
      onSuccess: data => setGoalCategory(data?.data || []),
    });
  };

  const fetchGoal = async () => {
    userApi.universityCourse.getAll({
      params: { universityId: selectedGoalCategory },
      onSuccess: data => setGoal(data || []),
    });
  };
  useEffect(() => {
    if (selectedGoalCategory) fetchGoal();
  }, [selectedGoalCategory]);

  const fetchUniversities = async () => {
    userApi.university.getAll({
      onSuccess: data => setMainUniversities(data?.data || []),
    });
  };

  useEffect(() => {
    fetchUniversities();
    fetchGoalCategory();
    fetchPopularCourses();
    fetchTopBanner();
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    userApi.testMonial.getAll({
      onSuccess: data => setTestimonials(data?.data || []),
    });
  };

  const fetchFaqs = async () => {
    userApi.faq.getAll({
      onSuccess: data => setFaqs((data?.data || []).filter(item => item?.showOnHomepage)),
    });
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const getRandomStaticStyle = () => {
    const all = [...courses, ...universities];
    return all[Math.floor(Math.random() * all.length)];
  };

  const mergeCourseData = apiItem => {
    const random = getRandomStaticStyle();
    return {
      title: apiItem?.title ?? apiItem?.name ?? random?.title ?? 'Untitled',
      name: apiItem?.name ?? apiItem?.title ?? random?.title ?? 'Untitled',
      cardBg: random?.cardBg ?? '#FFFFFF',
      imageBg: random?.imageBg ?? '#FFFFFF',
      courseImage: apiItem?.image
        ? [apiItem.image]
        : apiItem?.courseImage
          ? apiItem.courseImage
          : random?.image
            ? [random.image]
            : [],
      logo: apiItem?.image ?? apiItem?.logo ?? random?.image ?? '',
      id: apiItem?._id,
      courseCategoryId: apiItem?.courseCategoryId || null,
      ...apiItem,
    };
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = e => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <>
      <ReusableModal
        size="md"
        body={
          <ProfileEditFormMain
            nextPage={nextPage}
            closeModal={() => setModalVisible(true)}
            setUser={setUser}
          />
        }
        show={modalVisible}
        onHide={() => setModalVisible(true)}
        footer={false}
        header={false}
      />

      <div className="h-svh mainMaxWidth bg-black/50">
      </div>
    </>
  );
};

export default LoginPage;
