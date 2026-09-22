import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { UserContext } from '../Context/Context';
import { userApi } from '../services/apiFunctions';
import images from '../utils/images';

const NewSidebarItem = ({ toggleSidebar, show, setShowSubscriptionModal, isSubscribed }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const userData = useContext(UserContext);
  const { user, isAuthenticated, setUser } = useContext(AuthContext);
  const [modalShow, setModalShow] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      await userApi.goal.getByGoalCategory({
        id: user?.goalCategory,
        setIsLoading,
        params: { search: searchQuery },
        onSuccess: data => setCourses(data?.data || []),
      });
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && user.goal) {
      // fetchData();
    }
  }, [isAuthenticated, user, searchQuery]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const handleCourseClick = courseId => {
    userApi.profile.update({
      data: {
        goalCategory: user?.goalCategory,
        goal: courseId,
      },
      onSuccess: () => {
        setUser(prevUser => ({
          ...prevUser,
          goal: courseId,
        }));
        window.location.reload();
      },
    });
  };

  {
    /* const sideBarItems = [
    { name: "Home", path: "/user/home", iconName: "ic:baseline-home" },
    {
      name: "Study Planner AI",
      path: "/study-planner",
      iconName: "mdi:calendar-check-outline",
      badge: "✨",
    },
    // {
    //   name: "About Exam",
    //   path: "/user/about-exam",
    //   iconName: "ic:outline-event-note",
    // },

    // { name: "Course", path: "/user/courses", iconName: "mdi:school-outline" },
    {
      name: "Prepo Ai",
      path: "/user/assignment-assistance-ai",
      iconName: "mdi:book-open-page-variant",
    },
    // {
    //   name: "Semester Exam",
    //   path: "/semester-exams",
    //   iconName: "mdi:book-open-page-variant",
    // },
    {
      name: "Tests with Video Solution",
      path: "/user/test-series",
      iconName: "mdi:play-circle-outline",
    },
    {
      name: "Notes",
      path: "/user/notes",
      iconName: "mdi:note-text-outline",
    },
    {
      name: "PYQs with Videos",
      path: "/user/pyq/subjects",
      iconName: "mdi:video-box",
    },
    {
      name: "Community",
      path: "/user/community/1",
      iconName: "mdi:account-group-outline",
    },
    {
      name: "Current Affairs",
      path: "/user/current-affairs/1",
      iconName: "mdi:newspaper-variant-outline",
    },
    {
      name: "Skills",
      path: "/user/skill",
      iconName: "mdi:briefcase-outline",
    },
    {
      name: "Placement Jobs",
      path: "/user/placement-jobs",
      iconName: "mdi:briefcase-outline",
    },
    {
      name: "Setting",
      path: "/settings/1",
      iconName: "mdi:cog-outline",
    },
    {
      name: "Logout",
      path: "/user/logout",
      iconName: "mdi:logout",
    },
  ];
 */
  }
  const sideBarItems = [
    {
      name: 'Home',
      path: '/user/home',
      iconName: 'material-symbols:home-rounded',
    },
    {
      name: 'Study Planner AI',
      path: '/study-planner',
      iconName: 'material-symbols:calendar-month-rounded',
      badge: (
        <span className="inline-block animate-blink text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 font-bold">
          Beta
        </span>
      ),
    },
    {
      name: 'Prepo Ai',
      path: '/user/assignment-assistance-ai/chatbot',
      // path: "/user/assignment-assistance-ai",
      iconName: 'material-symbols:auto-awesome-rounded',
      badge: (
        <span className="inline-block animate-blink text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 font-bold">
          Beta
        </span>
      ),
    },
    {
      name: 'Practice Test',
      path: '/user/test-series',
      iconName: 'material-symbols:play-lesson-rounded',
    },
    {
      name: 'Notes',
      path: '/user/notes',
      iconName: 'material-symbols:edit-note-rounded',
    },
    {
      name: 'PYQs with Videos',
      path: '/user/pyq/subjects',
      iconName: 'material-symbols:video-library-rounded',
    },
    {
      name: 'Community',
      path: '/user/community/1',
      iconName: 'material-symbols:groups-rounded',
    },
    // {
    //   name: 'Current Affairs',
    //   path: '/user/current-affairs/1',
    //   iconName: 'material-symbols:breaking-news-rounded',
    // },
    {
      name: 'Skills',
      path: '/user/skill',
      iconName: 'material-symbols:psychology-alt-rounded',
    },
    {
      name: 'Placement Jobs',
      path: '/user/placement-jobs',
      iconName: 'streamline-freehand-color:office-work-wireless',
    },
    {
      name: 'Setting',
      path: '/settings/1',
      iconName: 'material-symbols:settings-rounded',
    },
    {
      name: 'Logout',
      path: '/user/logout',
      iconName: 'material-symbols:logout-rounded',
    },
  ];

  const LogoutModal = props => (
    <Modal {...props} size="lg" centered>
      <Modal.Body>
        <div className="text-center">
          <h3>Are you sure you want to logout?</h3>
          <div className="gap-3 mt-4 d-flex justify-content-center">
            <button className="btn btn-secondary" onClick={() => setModalShow(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );

  return (
    <>
      <LogoutModal show={modalShow} onHide={() => setModalShow(false)} />
      <div
        className={`fixed md:static top-0 left-0 z-50 md:z-auto bg-white border-r h-full w-64 p-4 transition-transform duration-300 ease-in-out pt-0 min-h-[100vh] ${
          show ? 'translate-x-0' : '-translate-x-full'
        } hideSidebar`}
      >
        <div className="bg-white p-4">
          <img
            onClick={() => navigate('/user/home')}
            src={images.navBarLogo}
            alt="Logo"
            className="w-fit h-[50px] mb-3 cursor-pointer object-cover"
          />
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto">
          {sideBarItems?.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={index}
                onClick={() => {
                  if (item.name === 'Logout') {
                    setModalShow(true);
                    return;
                  }

                  if (item.name === 'Prepo Ai' && !isSubscribed) {
                    setShowSubscriptionModal(true);
                    return;
                  }

                  navigate(item.path);
                }}
                className={`flex items-center justify-between gap-3 px-2 py-2 rounded-lg cursor-pointer transition text-sm ${
                  isActive
                    ? 'border-2 border-[#d0d0d0] text-[#585858] font-semibold hover:text-black hover:cursor-default'
                    : 'text-[#585858] hover:text-black hover:cursor-pointer'
                }`}
                style={{ border: isActive ? '2px solid #d0d0d0' : 'none' }}
              >
                <div className="flex items-center gap-2 iconColor">
                  <Icon icon={item.iconName} inline className={'text-xl'} />
                  <span>
                    {item.name}{' '}
                    {/* {item?.name === 'Assignment Assistance' && (
                      <span className="inline-block animate-blink text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 font-bold">
                        AI
                      </span>
                    )}
                    {item?.name === 'Prepo Ai' ||
                      (item?.name === 'Assignment Assistance' && (
                        <span className="inline-block animate-blink text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 font-bold">
                          Beta
                        </span>
                      ))} */}
                  </span>
                </div>
                {item.badge && (
                  <span
                    className={
                      'text-[#3dd455] text-xs font-bold' +
                      (isActive ? 'text-[#3dd455]' : 'text-black')
                    }
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default NewSidebarItem;
