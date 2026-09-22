import { Icon } from '@iconify/react/dist/iconify.js';
import { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../Context/Context';
import images from '../../utils/images';
import { useNavigate } from '../../utils/imports';
import './css/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const userData = useContext(UserContext);
  const { pathname } = useLocation();

  const sideBarItems = [
    { name: 'Home', path: '/user/home', iconName: 'ic:baseline-home' },
    {
      name: 'Study Planner AI',
      // path: "/user/studPlannerAi",
      // path: "/user/studPlannerBanner",
      path: '/new-study-planner/1',
      iconName: 'mynaui:book-check',
    },
    {
      name: 'About Exam',
      path: '/user/about-exam',
      iconName: 'ic:outline-event-note',
    },
    { name: 'Courses', path: '/user/courses', iconName: 'mdi:school-outline' },
    { name: 'Semester Exams', path: '/semester-exam/1', iconName: 'mdi:school-outline' },
    {
      name: 'Test Series',
      path: '/user/testSeriesp/1',
      iconName: 'ic:baseline-ondemand-video',
    },
    // {
    //   name: "Notes",
    //   path: "/user/notes/1",
    //   iconName: "ic:outline-event-note",
    // },
    {
      name: 'Notes',
      path: '/user/notes/1',
      iconName: 'ic:outline-event-note',
    },
    {
      name: 'PYQs With Video',
      path: '/user/pyq-with-video/1',
      iconName: 'mynaui:book-check',
    },
    {
      name: 'Community',
      path: '/user/community/1',
      iconName: 'ic:baseline-group',
    },
    {
      name: 'Capsule Course',
      path: '/user/capsule-course/1',
      iconName: 'mdi:format-list-numbered',
    },
    {
      name: 'Skills',
      path: '/user/skills/1',
      iconName: 'mdi:lightning-bolt-outline',
    },
    // {
    //   name: 'Current Affairs',
    //   path: '/user/current-affairs/1',
    //   iconName: 'mdi:newspaper-variant-outline',
    //   isShow: true,
    // },
    {
      name: 'Placement Jobs',
      path: '/user/placement-jobs/1',
      iconName: 'mdi:newspaper-variant-outline',
      isShow: true,
    },
    {
      name: 'Setting',
      path: '/settings/1',
      iconName: 'ic:outline-settings',
    },
    // {
    //   name: "Change Goal",
    //   path: "/select-goals",
    //   iconName: "lucide:goal",
    // },
    {
      name: 'Logout',
      path: '/user/logout',
      iconName: 'ic:outline-logout',
    },
  ];
  const [modalShow, setModalShow] = useState(false);

  function MyVerticallyCenteredModal(props) {
    const handleLogout = () => {
      localStorage.removeItem('StudyPlannerDaysAvailable');
      localStorage.removeItem('StudyPlannerHoursAvailable');
      localStorage.removeItem('StudyPlannerTotalDays');
      localStorage.removeItem('StudyPlannerendDate');
      localStorage.removeItem('StudyPlannerstartDate');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userIdLogin');

      navigate('/');
    };
    return (
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body>
          <div class="modal-body-lock">
            <h3>Are You sure you want to logout?</h3>
            <div>
              <button onClick={() => setModalShow(false)}>Cancel</button>
              <button onClick={() => handleLogout()}>Logout</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
      <div className="sidebar__container">
        <div className="sidebar__container1">
          <div className="sidebar__container1__1">
            <span className="flex flex-col items-center">
              <img
                onClick={() => navigate(-1)}
                src={images.navBarLogo}
                alt="logo"
                className="sidebar__logo"
              />
            </span>
          </div>

          <div className="sidebar__container1__2">
            {sideBarItems
              ?.filter((item) => item.isShow !== false)
              ?.map((item, index) => (
                <div
                  key={index}
                  onClick={() =>
                    item.path === '/user/capsule-course'
                      ? null
                      : item.path === '/user/logout'
                      ? setModalShow(true)
                      : navigate(item.path)
                  }
                  className={`sidebar__container1__2__1 ${item.path === pathname ? 'active' : ''}`}
                >
                  <span className="sidebar__container1__2__1__1">
                    <Icon icon={item.iconName} className="sidebar__icon" />
                  </span>

                  <span className="sidebar__container1__2__1__2 d-flex g-1">
                    <span> {item.name}</span> <span></span>
                  </span>
                  {/* <p>

                  </p> */}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
