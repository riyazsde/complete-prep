import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import { Modal, Offcanvas } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import NewSidebarItem from '../NewSidebarItem';
import './css/HOC.css';
import images from '../../utils/images';

const HOC = WrappedComponent => {
  const WrappedWithHOC = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const { pathname } = useLocation();
    const [modalShow, setModalShow] = useState(false);
    const navigate = useNavigate();
    const pathName = useLocation().pathname;

    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [showModalPopUp, setShowModalPopUp] = useState(false);

    const localUser = JSON.parse(localStorage.getItem('user') || '{}');

    const isSubscribed = localUser?.isSubscribed;

    const toggleSidebar = () => setShowSidebar(prev => !prev);
    const handleCloseCanvas = () => setShowOffcanvas(false);
    const handleShowCanvas = () => setShowOffcanvas(true);

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
        badge: '✨',
      },
      {
        name: 'Prepo Ai',
        path: '/user/assignment-assistance-ai/chatbot',
        // path: '/user/assignment-assistance-ai',
        iconName: 'material-symbols:auto-awesome-rounded',
      },
      {
        name: 'Tests with Video Solution',
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
    const handleLogout = () => {
      localStorage.clear();
      navigate('/');
    };

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
    const renderSidebarItems = () =>
      sideBarItems
        .filter(item => item.isShow === undefined || item.isShow)
        .map((item, index) => {
          const isActive = pathname.includes(item.path);

          return (
            <div
              key={index}
              onClick={() => (item.name === 'Logout' ? setModalShow(true) : navigate(item.path))}
              className={`group flex items-center justify-between gap-3 px-2 py-2 rounded-lg text-sm transition cursor-pointer ${
                isActive
                  ? 'border-2 border-[#d0d0d0] bg-gray-50 text-[#585858] font-semibold'
                  : 'text-[#585858] hover:bg-gray-100 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon={item.iconName}
                  className={`text-xl transition ${
                    isActive ? 'text-[#00c054]' : 'text-[#00c054] group-hover:scale-105'
                  }`}
                />

                <span className="flex items-center gap-1">
                  {item.name}
                  {item?.name === 'Assignment Assistance' && (
                    <span className="animate-blink bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent font-bold">
                      AI
                    </span>
                  )}
                </span>
              </div>

              {item.badge && <span className="text-xs font-bold text-[#3dd455]">{item.badge}</span>}
            </div>
          );
        });

    return (
      <div className="max-w-8xl mx-auto bg-white min-h-screen">
        <div className="flex justify-between gap-3 items-center md:hidden p-3 bg-white">
          <img
            src={images.newMainLogo}
            alt="Logo"
            onClick={() => navigate('/user/home')}
            className="w-[120px] object-contain"
          />
          <Icon icon="mdi:menu" className="text-3xl cursor-pointer" onClick={handleShowCanvas} />
        </div>

        <Offcanvas
          show={showOffcanvas}
          onHide={handleCloseCanvas}
          placement="start"
          className="custom-offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <img
                src={images.newMainLogo}
                alt="Logo"
                onClick={() => navigate('/user/home')}
                className="w-[120px] object-contain"
              />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>{renderSidebarItems()}</Offcanvas.Body>
        </Offcanvas>

        <LogoutModal show={modalShow} onHide={() => setModalShow(false)} />

        <div className="flex">
          <div className={`hidden md:block ${showSidebar ? 'w-64' : 'w-20'} transition-all`}>
            <NewSidebarItem
              toggleSidebar={toggleSidebar}
              show={showSidebar}
              setShowSubscriptionModal={setShowSubscriptionModal}
              isSubscribed={isSubscribed}
            />
          </div>

          {showSubscriptionModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
              <div className="w-full max-w-md bg-white rounded-2xl p-6">
                <h2 className="text-xl font-bold text-center">Subscription Required</h2>

                <p className="text-center text-[#585858] text-sm mt-3">
                  Please subscribe to access Prepo AI features.
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowSubscriptionModal(false)}
                    className="flex-1 h-11 border border-gray-300 rounded-lg font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setShowSubscriptionModal(false);
                      setShowModalPopUp(true);
                    }}
                    className="flex-1 h-11 bg-[#3dd455] text-white rounded-lg font-medium"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 md:h-svh overflow-auto">
            <div className="bg-white">
              <WrappedComponent
                showModalPopUp={showModalPopUp}
                handleClose={() => setShowModalPopUp(false)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return WrappedWithHOC;
};

export default HOC;
