import AboutExam from '../pages/NewPages/AboutExam/AboutExam.jsx';
import AboutMainPage from '../pages/NewPages/AboutMainPage.jsx';
import AssessmentAssistancePage from '../pages/NewPages/AssessmentAssistancePage/AssessmentAssistancePage.jsx';
import ChatBotAi from '../pages/NewPages/AssessmentAssistancePage/ChatBotAi.jsx';
import ChatBotAiAssignement from '../pages/NewPages/AssessmentAssistancePage/ChatBotAiAssignement.jsx';
import ChatBotAiCarrierGuidence from '../pages/NewPages/AssessmentAssistancePage/ChatBotAiCarrierGuidence.jsx';
import ChatBotAiInterview from '../pages/NewPages/AssessmentAssistancePage/ChatBotAiInterview.jsx';
import CareerPage from '../pages/NewPages/CareerPage.jsx';
import BlogPage from '../pages/NewPages/BlogPage.jsx';
import PrivacyPolicyPage from '../pages/NewPages/PrivacyPolicyPage.jsx';
import TermsPage from '../pages/NewPages/TermsPage.jsx';
import ContactPage from '../pages/NewPages/ContactPage.jsx';
import CommunityPage from '../pages/NewPages/CommunityPage.jsx';
import FaqPage from '../pages/NewPages/FaqPage.jsx';
import CookiesPolicyPage from '../pages/NewPages/CookiesPolicyPage.jsx';
import AddToCart from '../pages/NewPages/Cart/AddToCart.jsx';
import SelectHearAboutUs from '../pages/NewPages/ChooseCurriculamPages/SelectHearAboutUs.jsx';
import SelectUniversity from '../pages/NewPages/ChooseCurriculamPages/SelectUniversity.jsx';
import SelectUniversityCourse from '../pages/NewPages/ChooseCurriculamPages/SelectUniversityCourse.jsx';
import SelectUniversitySemester from '../pages/NewPages/ChooseCurriculamPages/SelectUniversitySemester.jsx';
import CoursePage1 from '../pages/NewPages/CoursePage/CoursePage1.jsx';
import CoursePage2 from '../pages/NewPages/CoursePage/CoursePage2.jsx';
import CoursePage2_1 from '../pages/NewPages/CoursePage/CoursePage2_1.jsx';
import CoursePage3 from '../pages/NewPages/CoursePage/CoursePage3.jsx';
import CoursePage4 from '../pages/NewPages/CoursePage/CoursePage4.jsx';
import HandwrittenNotesPage1_1 from '../pages/NewPages/HandWrittenNotes/HandwrittenNotesPage1_1.jsx';
import HandwrittenNotesPage1_2 from '../pages/NewPages/HandWrittenNotes/HandwrittenNotesPage1_2.jsx';
import HandwrittenNotesPage1_3 from '../pages/NewPages/HandWrittenNotes/HandwrittenNotesPage1_3.jsx';
import HandWrittenNotesPage2 from '../pages/NewPages/HandWrittenNotes/HandWrittenNotesPage2.jsx';
import HomePage from '../pages/NewPages/HomePage.jsx';
import NewCapsuleCoursePage1 from '../pages/NewPages/NewCapsuleCoursePage/NewCapsuleCoursePage1.jsx';
import CommunityPage1 from '../pages/NewPages/NewCommunityPage/CommunityPage1.jsx';
import NewCurrentAffairsPage1 from '../pages/NewPages/NewCurrentAffairsPage/NewCurrentAffairsPage1.jsx';
import PYQSubjects from '../pages/NewPages/NEWPYQWithVideo/PYQSubjects.jsx';
import PyqWithVideoPage1 from '../pages/NewPages/NEWPYQWithVideo/PyqWithVideoPage1.jsx';
import PYQWithVidePage2 from '../pages/NewPages/NEWPYQWithVideo/PYQWithVidePage2.jsx';
import SettingPage1 from '../pages/NewPages/NewSettings/SettingPage1.jsx';
import SkillsPage1 from '../pages/NewPages/NewSkillsPage/SkillsPage1.jsx';
import NewStudyPlannerAiPage1Main from '../pages/NewPages/NEWStudyPlannerPage/NewStudyPlannerAiPage1Main.jsx';
import StudyPlannerAi6_1Main from '../pages/NewPages/NEWStudyPlannerPage/StudyPlannerAi6_1Main.jsx';
import StudyPlannerAiPage2Main from '../pages/NewPages/NEWStudyPlannerPage/StudyPlannerAiPage2Main.jsx';
import StudyPlannerAiPage3Main from '../pages/NewPages/NEWStudyPlannerPage/StudyPlannerAiPage3Main.jsx';
import StudyPlannerAiPage4Main from '../pages/NewPages/NEWStudyPlannerPage/StudyPlannerAiPage4Main.jsx';
import StudyPlannerAiPage5Main from '../pages/NewPages/NEWStudyPlannerPage/StudyPlannerAiPage5Main.jsx';
import StudyPlannerAiPage6Main from '../pages/NewPages/NEWStudyPlannerPage/StudyPlannerAiPage6Main.jsx';
import StudyPlannerAiPage7Main from '../pages/NewPages/NEWStudyPlannerPage/StudyPlannerAiPage7Main.jsx';
import PlacementPage1 from '../pages/NewPages/PlacementPage/PlacementPage1.jsx';
import PlacementPage2 from '../pages/NewPages/PlacementPage/PlacementPage2.jsx';
import PricingPage from '../pages/NewPages/PricingPage.jsx';
import Reviews from '../pages/NewPages/Reviews.jsx';
import SemesterExamPage1 from '../pages/NewPages/SemesterExam/SemesterExamPage1.jsx';
import SemesterExamPage2 from '../pages/NewPages/SemesterExam/SemesterExamPage2.jsx';
import SemesterExamPage3 from '../pages/NewPages/SemesterExam/SemesterExamPage3.jsx';
import SemesterExamPage4 from '../pages/NewPages/SemesterExam/SemesterExamPage4.jsx';
import SkillsPage2 from '../pages/NewPages/Skills/SkillsPage2.jsx';
import SkillsPage3 from '../pages/NewPages/Skills/SkillsPage3.jsx';
import SkillsPage4 from '../pages/NewPages/Skills/SkillsPage4.jsx';
import SkillsPage5 from '../pages/NewPages/Skills/SkillsPage5.jsx';
import TestSectionPage1 from '../pages/NewPages/TestSection/TestSectionPage1.jsx';
import TestSectionPage2 from '../pages/NewPages/TestSection/TestSectionPage2.jsx';
import TestSectionPage3 from '../pages/NewPages/TestSection/TestSectionPage3.jsx';
import TestSectionPage4 from '../pages/NewPages/TestSection/TestSectionPage4.jsx';
import TestSectionPage5 from '../pages/NewPages/TestSection/TestSectionPage5.jsx';
import TestSeriesPage1 from '../pages/NewPages/TestSeriesPage/TestSeriesPage1.jsx';
import TestSeriesPage2 from '../pages/NewPages/TestSeriesPage/TestSeriesPage2.jsx';
import BannerVideos from '../pages/NewPages/UserHome/BannerVideos.jsx';
import UserHome from '../pages/NewPages/UserHome/UserHome.jsx';

export const routes = [
  {
    path: '/',
    name: 'Home',
    element: <HomePage />,
  },
  {
    path: '/about',
    name: 'About',
    element: <AboutMainPage />,
  },
  {
    path: '/cart',
    name: 'Cart',
    element: <AddToCart />,
  },
  {
    path: '/pricing',
    name: 'About',
    element: <PricingPage />,
  },
  {
    path: '/careers',
    name: 'Careers',
    element: <CareerPage />,
    },
    {
      path: '/blogs',
      name: 'Blogs',
      element: <BlogPage />,
    },
    {
      path: '/privacy-policy',
      name: 'Privacy Policy',
      element: <PrivacyPolicyPage />,
    },
    {
      path: '/terms',
      name: 'Terms',
      element: <TermsPage />,
    },
    {
      path: '/cookies-policy',
      name: 'Cookies Policy',
      element: <CookiesPolicyPage />,
    },
    {
      path: '/community',
      name: 'Community',
      element: <CommunityPage />,
    },
    
    {
      path: '/contact',
      name: 'Contact',
      element: <ContactPage />,
    },
    {
      path: '/faqs',
      name: 'Faq',
      element: <FaqPage />,
    },
  {
    path: '/testimonials',
    name: 'Testimonials',
    element: <Reviews />,
  },

  {
    path: '/choose-curriculum',
    name: 'Home',
    element: <SelectUniversity />,
  },
  {
    path: '/choose/university-course',
    name: 'Home',
    element: <SelectUniversityCourse />,
  },
  {
    path: '/choose/university-semester',
    name: 'Home',
    element: <SelectUniversitySemester />,
  },
  {
    path: '/choose/hear-about-us',
    name: 'Home',
    element: <SelectHearAboutUs />,
  },
  {
    path: '/user/about-exam',
    name: 'Home',
    element: <AboutExam />,
  },
  {
    path: '/user/home',
    name: 'User Dashboard',
    element: <UserHome />,
  },
  {
    path: '/user/assignment-assistance-ai',
    name: 'Assignment Assistance AI',
    element: <AssessmentAssistancePage />,
  },
  {
    path: '/user/assignment-assistance-ai/chatbot',
    name: 'Assignment Assistance AI',
    element: <ChatBotAi />,
  },
  {
    path: '/user/assignment-assistance-ai/chatbot/assignment',
    name: 'Assignment Assistance AI',
    element: <ChatBotAiAssignement />,
  },
  {
    path: '/user/assignment-assistance-ai/chatbot/interview',
    name: 'Assignment Assistance AI',
    element: <ChatBotAiInterview />,
  },
  {
    path: '/user/assignment-assistance-ai/chatbot/carrier-guidence',
    name: 'Assignment Assistance AI',
    element: <ChatBotAiCarrierGuidence />,
  },
  {
    path: '/user/courses',
    name: 'Courses',
    element: <CoursePage1 />,
  },
  {
    path: '/user/courses/:id',
    name: 'Courses',
    element: <CoursePage2 />,
  },
  {
    path: '/user/course/:id/:courseId',
    name: 'Courses',
    element: <CoursePage2_1 />,
  },
  {
    path: '/user/course/:id/:courseId/:subjectId',
    name: 'Courses',
    element: <CoursePage3 />,
  },
  {
    path: '/user/course/:id/:courseId/:subjectId/:subSubjectId/:chapterId',
    name: 'Courses',
    element: <CoursePage4 />,
  },
  {
    path: '/user/test-series',
    name: 'Test-Series',
    element: <TestSeriesPage1 />,
  },
  {
    path: '/user/test-series/:bundleId',
    name: 'Test-Series',
    element: <TestSeriesPage2 />,
  },
  {
    path: '/user/notes',
    name: 'Test-Series',
    element: <HandwrittenNotesPage1_1 />,
  },
  {
    path: '/user/notes/:id/subjects',
    name: 'Test-Series',
    element: <HandwrittenNotesPage1_2 />,
  },
  {
    path: '/user/notes/:id/:subjectId',
    name: 'Test-Series',
    element: <HandwrittenNotesPage1_3 />,
  },
  {
    path: '/user/notes/:id/view',
    name: 'Test-Series',
    element: <HandWrittenNotesPage2 />,
  },
  {
    path: '/user/community/1',
    name: 'Test-Series',
    element: <CommunityPage1 />,
  },
  {
    path: '/user/first-banner',
    name: 'First Banner',
    element: <BannerVideos />,
  },
  {
    path: '/user/capsule-course/1',
    name: 'Test-Series',
    element: <NewCapsuleCoursePage1 />,
  },
  {
    path: '/user/current-affairs/1',
    name: 'Test-Series',
    element: <NewCurrentAffairsPage1 />,
  },
  {
    path: '/user/test/:id',
    name: 'Test-Series',
    element: <TestSectionPage1 />,
  },
  {
    path: '/user/test-instructions/:id',
    name: 'Test-Series',
    element: <TestSectionPage2 />,
  },
  {
    path: '/user/test-questions/:id',
    name: 'Test-Series',
    element: <TestSectionPage3 />,
  },
  {
    path: '/user/test-result/:id',
    name: 'Test-Series',
    element: <TestSectionPage4 />,
  },
  {
    path: '/user/test-summary/:id',
    name: 'Test-Series',
    element: <TestSectionPage5 />,
  },
  {
    path: '/semester-exams',
    name: 'Courses',
    element: <SemesterExamPage1 />,
  },
  {
    path: '/semester-exam/:universityId',
    name: 'Courses',
    element: <SemesterExamPage2 />,
  },
  {
    path: '/semester-exam/:universityId/:courseId',
    name: 'Courses',
    element: <SemesterExamPage3 />,
  },
  {
    path: '/semester-exam/:universityId/:courseId/:semesterId',
    name: 'Courses',
    element: <SemesterExamPage4 />,
  },
  {
    path: '/user/skills/1',
    name: 'Courses',
    element: <SkillsPage1 />,
  },
  {
    path: '/user/placement-jobs',
    name: 'Courses',
    element: <PlacementPage1 />,
  },
  {
    path: '/user/placement-jobs/:id',
    name: 'Courses',
    element: <PlacementPage2 />,
  },
  {
    path: '/user/pyq/subjects',
    name: 'Courses',
    element: <PYQSubjects />,
  },
  {
    path: '/user/pyq-with-videos/:id',
    name: 'Courses',
    element: <PyqWithVideoPage1 />,
  },
  {
    path: '/user/pyq-with-video/:id',
    name: 'Courses',
    element: <PYQWithVidePage2 />,
  },
  {
    path: '/settings/1',
    name: 'Courses',
    element: <SettingPage1 />,
  },
  {
    path: '/study-planner',
    name: 'Study Planner AI',
    element: <NewStudyPlannerAiPage1Main />,
  },
  {
    path: '/study-planner/:id',
    name: 'Study Planner AI',
    element: <StudyPlannerAiPage2Main />,
  },
  {
    path: '/study-planner/:id/:profileId',
    name: 'Study Planner AI',
    element: <StudyPlannerAiPage3Main />,
  },
  {
    path: '/study-planner/:id/:profileId/choose-availability',
    name: 'Courses',
    element: <StudyPlannerAiPage4Main />,
  },
  {
    path: '/study-planner/:id/:profileId/study-plan',
    name: 'Courses',
    element: <StudyPlannerAiPage5Main />,
  },
  {
    path: '/study-planner/:week/:studyPlanId/study-plan-subjects',
    name: 'Courses',
    element: <StudyPlannerAiPage6Main />,
  },
  {
    path: '/study-planner/:week/:studyPlanId/:subjectId/study-plan-subject',
    name: 'Courses',
    element: <StudyPlannerAi6_1Main />,
  },
  {
    path: '/user/study-planner/:week/:studyPlanId/:subjectId/:subSubjectId/:chapterId',
    name: 'Courses',
    element: <StudyPlannerAiPage7Main />,
  },
  {
    path: '/user/skill',
    name: 'Skills',
    element: <SkillsPage2 />,
  },
  {
    path: '/user/skill/:id',
    name: 'Skills',
    element: <SkillsPage3 />,
  },
  {
    path: '/user/skill/:id/:subjectId',
    name: 'Skills',
    element: <SkillsPage4 />,
  },
  {
    path: '/user/skill/:id/:subjectId/:subSubjectId/:chapterId',
    name: 'Skills',
    element: <SkillsPage5 />,
  },

  {
    path: '*',
    name: '404',
    element: <HomePage />,
  },
];
