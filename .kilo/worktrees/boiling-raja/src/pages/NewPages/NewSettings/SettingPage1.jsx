import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { formatTimeSpentTimeLine } from '../../../utils/constants';
import images from '../../../utils/images';
import TutorialVideoImage from '../../../assets/images/tutorialBanner.jpg';
import { showNotification } from '../../../services/exportComponents';
import ProfileTab from './ProfileTab';
import { ReusableModal } from '../../../components/common/ComPrepComponent/ComPrepComponent';

const SettingPage1 = () => {
  const navigate = useNavigate();
  const { user, setUser, logout, isAuthenticated } = useContext(AuthContext);
  // const { goal = "" } = user || {};
  const goal = user?.goal || '';
  const [activeTab, setActiveTab] = useState('Profile');
  const [modalVisible, setModalVisible] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState('');
    const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [profileData, setProfileData] = useState({
    avatar: user?.image || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    language: user?.language || 'English',
    timezone: '',
    mobileNumber: user?.mobileNumber || '',
    linkedInUrl: user?.linkedInUrl || '',
  });
  const [transactions, setTransactions] = useState([]);
  const [dashboards, setDashboards] = useState([
    {
      title: 'My Success Roadmap',
      icon: images.newSettingDashboardImage1,
      color: 'bg-green-100',
    },
    {
      title: 'Videos Analysis',
      icon: images.newSettingDashboardImage2,
      color: 'bg-red-100',
    },
    {
      title: 'Practice Analysis',
      icon: images.newSettingDashboardImage3,
      color: 'bg-yellow-100',
    },
    {
      title: 'Tests Analysis',
      icon: images.newSettingDashboardImage4,
      color: 'bg-blue-100',
    },
    {
      title: 'My Skills Analysis',
      icon: images.newSettingDashboardImage5,
      color: 'bg-gray-100',
    },
    {
      title: 'Capsule Course Analysis',
      icon: images.newSettingDashboardImage6,
      color: 'bg-purple-100',
    },
    {
      title: 'Notes by Toppers Analysis',
      icon: images.newSettingDashboardImage7,
      color: 'bg-indigo-100',
    },
  ]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReferalButtonVisible, setIsReferalButtonVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchData();
    }
  }, [isAuthenticated, goal]);

  const fetchData = () => {
    userApi.subscriptions.transactions({
      setIsLoading,
      onSuccess: res => {
        setTransactions(res?.data || []);
      },
      onError: err => {
        console.error('Failed to fetch courses:', err);
      },
    });

    userApi.settingPage.getTimeLine({
      onSuccess: res => {
        setTimelineEvents(res?.data || []);
      },
      onError: err => {
        console.error('Failed to fetch timeline events:', err);
      },
    });
  };

      const updateUserBanner = async () => {
      userApi.landingPage.updateBannerStatus({
        data: {
          goalCategory: user?.goalCategory || '',
          goal: user?.goal || '',
          semester: user?.semester || '',
          firstVideoBanner: true,
        },
        onSuccess: res => {
          setUser({ ...user, firstVideoBanner: true });
          setShowBannerModal(true);
        },
        onError: () => {
          showNotification({ type: 'error', message: 'Failed to update banner status' });
        },
      });
    };

      const fetchSubScription = async () => {
        try {
          const res = await userApi.subscriptions.getSubscription({
            params: { semester: user?.semester },
          });
          if (res?.data?.isActive) {
            setSubscriptionStatus(true);
            setCurrentSubscription(res.data);
            setUser(prev => ({ ...prev, isSubscribed: true }));
          } else {
            setSubscriptionStatus(false);
            setUser(prev => ({ ...prev, isSubscribed: false }));
            const subs = await userApi.subscriptions.getAll({ params: { semester: user?.semester } });
            setSubscriptions(subs?.data || []);
          }
        } catch (err) {
          setSubscriptionStatus(false);
          setUser(prev => ({ ...prev, isSubscribed: false }));
          showNotification({ type: 'error', message: 'Failed to fetch subscription status' });
        }
      };
    
      const fetchCoupons = () => {
        userApi.subscriptions.coupons.getAll({
          onSuccess: res => {
            setAllCoupons(res?.data || []);
          },
          onError: err => {
            console.log(err, 'err');
          },
        });
      };
    
      useEffect(() => {
        fetchSubScription();
        fetchCoupons();
      }, [user?._id]);

  const handleSave = () => {
    userApi.settingPage.updateProfile({
      onSuccess: res => {
        console.log('Profile updated successfully:', res);
      },
      onError: err => {
        console.error('Failed to update profile:', err);
      },
    });
  };

  const handleLogout = () => {
    console.log('Logged out');
    navigate('/');
  };

  const handleDeleteAccount = () => {
    console.log('Account deleted');
    navigate('/');
  };

  const [isLg, setIsLg] = useState(false);
  const allTabs = ['Profile', 'Subscriptions', 'Transactions', 'My Weekly Timeline'];

  useEffect(() => {
    const checkScreen = () => setIsLg(window.innerWidth >= 1024);

    checkScreen();
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const tabs = isLg
    ? allTabs.filter((tab) => tab !== 'Subscriptions')
    : allTabs;

      useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab('Profile');
    }
  }, [tabs, activeTab]);

    const handleSubscribe = sub => {
      setLoadingPlanId(sub._id);
      userApi.subscriptions.create({
        showMsg: true,
        data: {
          subscriptionPlanId: sub._id,
          paymentMode: 'pending',
          taxAmount: 0,
          paymentStatus: 'pending',
          couponCode: selectedCoupons,
          useWallet: true,
        },
        onSuccess: response => {
          triggerRazorpay({
            amount: response?.data?.finalPrice,
            name: user?.fullName || 'User',
            email: user?.email || 'email@example.com',
            contact: user?.mobileNumber || '0000000000',
            onSuccess: paymentRes => {
              if (paymentRes?.payload?.payment?.id)
                userApi.subscriptions.update({
                  id: response?.data?._id,
                  data: {
                    paymentMode: 'upi',
                    paymentStatus: 'completed',
                    transactionId: paymentRes?.payload?.payment?.id,
                  },
                  onSuccess: res => {
                    if (res?.data?.paymentStatus === 'completed') {
                      fetchSubScription();
                      setModalVisible(false);
                    }
                  },
                  onError: () => {
                    setLoadingPlanId(null);
                  },
                });
            },
            onFailure: err => {
              setLoadingPlanId(null);
            },
            onCancel: () => {
              setLoadingPlanId(null);
            },
          });
        },
        onError: () => {
          setLoadingPlanId(null);
        },
      });
    };

useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);

const triggerRazorpay = async ({
  amount,
  name,
  email,
  contact,
  onSuccess,
  onFailure,
  onCancel,
}) => {
  try {
    const orderResponse = await fetch(
      `https://api.semprep.com/api/create-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.max(100, Math.round(amount * 100)),
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      }
    );

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(orderData?.message || 'Failed to create order');
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: orderData?.data?.amount,
      currency: orderData?.data?.currency,
      order_id: orderData?.data?.order_id,

      name: 'Semprep',
      description: 'Semester Subscription',

      prefill: {
        name,
        email,
        contact,
      },

      theme: {
        color: '#3DD455',
      },

      handler: async function (response) {
        try {
          const verifyResponse = await fetch(
            `https://api.semprep.com/api/verify-payment`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const verifyData = await verifyResponse.json();

          if (verifyData?.success) {
            onSuccess?.({
              payload: {
                payment: {
                  id: response.razorpay_payment_id,
                },
              },
            });

            showNotification({
              type: 'success',
              message: 'Payment successful',
            });
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          showNotification({
            type: 'error',
            message: error?.message || 'Verification failed',
          });

          onFailure?.(error);
        }
      },

      modal: {
        ondismiss: function () {
          showNotification({
            type: 'error',
            message: 'Payment cancelled',
          });

          onCancel?.();
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on('payment.failed', function (response) {
      showNotification({
        type: 'error',
        message:
          response?.error?.description || 'Payment failed',
      });

      onFailure?.(response);
    });

    razorpay.open();
  } catch (error) {
    showNotification({
      type: 'error',
      message: error?.message || 'Something went wrong',
    });

    onFailure?.(error);
  }
};

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

  return (
    <div className="">
       <ReusableModal
              size="md"
              show={modalVisible}
              onHide={() => setModalVisible(false)}
              footer={false}
              header={false}
              body={
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Subscribe to Continue</h2>
                  <p className="mb-4">Please choose a subscription plan to access this feature.</p>
                  <div className="space-y-4">
                    {subscriptions?.map(sub => (
                      <div key={sub._id} className="p-4 border rounded-lg">
                        <h3 className="font-medium">{sub.name}</h3>
                        <p className="text-sm text-gray-600">{sub.desc}</p>
                        <p className="text-lg font-bold">
                          ₹{sub.discountActive ? sub.discountPrice : sub.originalPrice}
                          {sub.discountActive && (
                            <span className="ml-2 text-sm line-through text-gray-400">
                              ₹{sub.originalPrice}
                            </span>
                          )}
                        </p>
                        {allCoupons?.length > 0 && (
                          <select
                            className="mt-2 w-full p-2 border rounded"
                            value={selectedCoupons}
                            onChange={e => setSelectedCoupons(e.target.value)}
                          >
                            <option value="">Select Coupon (Optional)</option>
                            {allCoupons.map(coupon => (
                              <option key={coupon._id} value={coupon.code}>
                                {coupon.code} - {coupon.discount}% off
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          className="mt-2 px-4 py-2 bg-[#3DD455] text-[#fff] font-semibold rounded-lg hover:bg-[#000] disabled:opacity-50"
                          onClick={() => handleSubscribe(sub)}
                          disabled={loadingPlanId === sub._id}
                        >
                          {loadingPlanId === sub._id ? 'Processing...' : 'Subscribe'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              }
            ></ReusableModal>
      <div className="">
        <UserMenuBar />
      </div>
      <div className=" bg-white rounded-xl p-6">
        <div className="w-full">
          <div className="w-full overflow-auto">
            <div className="flex justify-between bg-[#f3f4f6] rounded-3xl tab-button-container w-fit p-1 min-w-[400px]">
              {tabs?.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm sm:text-base font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-white text-black font-semibold rounded-3xl'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'Profile' && <ProfileTab />}
          {activeTab === 'Subscriptions' && 
          <>
          <div className="block lg:hidden w-full flex-1 bg-white border-[#d0d0d0]">
                    <div className="space-y-6">
                      <div className="flex flex-col justify-center relative">
                        <p className="flex justify-end absolute right-2 top-2 text-2xl">
                          <Icon
                            icon="mdi:bell-outline"
                            className="cursor-pointer"
                            onClick={() => setShowNotifications(true)}
                          />
                        </p>
                        <div className="flex flex-col items-center justify-center text-center gap-4 mt-4 mb-4">
  {user?.image ? (
    <img
      src={user.image}
      alt="User Profile"
      className="w-[100px] h-[100px] rounded-full object-cover"
    />
  ) : (
    <div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-700">
      {getInitials(user?.fullName)}
    </div>
  )}
</div>

<div className="text-center">
  <h2 className="text-lg font-bold text-gray-900 capitalize">
    {user?.fullName || ""}
  </h2>
  <p className="text-sm text-gray-500">
    Continue Your Journey And Achieve Your Target
  </p>
</div>
          
                        {subscriptionStatus ? (
                          <div className="mt-2">
                            <p className="text-sm text-black text-center">
                              Your Current Plan : -{' '}
                              <span className="text-sm text-gray-500">
                                {currentSubscription?.subscriptionPlanId?.name}
                              </span>
                            </p>
                            <p className="text-sm text-black text-center items-center justify-center flex gap-2">
                              <span className="text-sm text-black"> Expire On : </span>
                              <span className="text-sm text-gray-500">
                                {currentSubscription?.endDate?.slice(0, 10)?.split('-').reverse().join('-')}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center gap-4 mt-2 mb-4">
                            <p className="text-sm text-black">Please Subscribe to Continue</p>
                            <button
                              className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
                              onClick={() => setModalVisible(true)}
                            >
                              Subscribe
                            </button>
                          </div>
                        )}
                      </div>
                      {/* <div>
                        <img
                          src={images.userDashboardTopBanner}
                          alt="Dashboard Banner"
                          className="object-cover"
                          style={{ width: '100%', height: '100%', minHeight: 30 }}
                        />
                      </div> */}
                      <div className="bg-yellow-100 rounded-lg p-2.5 flex flex-col items-center gap-2">
                        <p className="font-semibold text-[13px] text-center">
                          ■ Limited Time Offer: 50% Off All Courses! ■
                        </p>
                        <p className="text-xs text-center">
                          Boost your exam prep with half off on our top-rated courses. Hurry, offer ends soon!
                        </p>
                      </div>
                      <div>
                        <img
                          src={TutorialVideoImage || images.userDashboardTopBanner}
                          alt="Dashboard Banner"
                          className="rounded-lg"
                          style={{
                            width: '100%',
                            height: '100%',
                            minHeight: '170px',
                            // border: ' 1px solid red',
                            cursor: 'pointer',
                          }}
                          onClick={updateUserBanner}
                        />
                        {
                          user?.firstVideoBanner
                            ? // <img
                              //   src={TutorialVideoImage || images.userDashboardTopBanner}
                              //   alt="Dashboard Banner"
                              //   className=""
                              //   style={{
                              //     width: '100%',
                              //     height: '100%',
                              //     minHeight: '170px',
                              //     // border: ' 1px solid red',
                              //     cursor: 'pointer',
                              //   }}
                              //   onClick={updateUserBanner}
                              // />
                              null
                            : null
                          // (
                          // <img
                          //   src={images.userDashboardTopBanner}
                          //   alt="Dashboard Banner"
                          //   onClick={updateUserBanner}
                          //   className=""
                          //   style={{ width: '100%', height: '100%', minHeight: '170px', cursor: 'pointer' }}
                          // />
                          // )
                        }
                      </div>
                      <div className="flex lg:flex-col flex-wrap gap-2">
                        {isReferalButtonVisible && (
                          <div className="flex items-center justify-between gap-2 bg-gray-100 px-3 py-2 rounded-2xl">
                            <span className="text-sm font-medium text-gray-700">
                              {user?.refferalCode || ''}
                            </span>
          
                            <button
                              onClick={() => {
                                showNotification({ type: 'success', message: 'Copied to clipboard' });
                                navigator.clipboard.writeText(user?.refferalCode);
                              }}
                              className="p-1 hover:bg-gray-200 rounded-md transition"
                            >
                              <Icon icon="solar:copy-outline" width={16} />
                            </button>
                          </div>
                        )}
          
                        <button
                          className="bg-[#3DD455] hover:bg-black text-white font-medium text-sm px-3 py-2 rounded-lg transition"
                          onClick={() => {
                            setIsReferalButtonVisible(true);
                            showNotification({ type: 'success', message: 'Copied to clipboard' });
                            navigator.clipboard.writeText(user?.refferalCode);
                          }}
                        >
                          Referral & Earn
                        </button>
                      <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=support@semprep.com"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center bg-[#3DD455] hover:bg-black text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors duration-200 hover:no-underline"
>
  Help us improve
</a>
                        <button onClick={() => window.open("https://forms.gle/1JUQT5ZKRdhwSoqH7", '_blank')} className="bg-[#3DD455] hover:bg-black text-white font-medium text-sm px-2.5 py-2 rounded-lg">
                          Become an Ambassador
                        </button>
                      </div>
                    </div>
          </div>
          </>
          }
          {/* {activeTab === 'My Exams' && (
            <div className="p-6 bg-white">
              <h2 className="mb-4 text-2xl font-bold">Your Subscription</h2>
              {isLoading ? (
                <div className="flex justify-center mt-10">
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="grid gap-4 mb-3 sm:grid-cols-2 md:grid-cols-3">
                  {transactions?.map((course, idx) => (
                    <div
                      key={idx}
                      className="p-1 overflow-hidden transition bg-white shadow-sm cursor-pointer rounded-xl hover:shadow-md"
                      onClick={() =>
                        navigate(
                          `/user/course/${course?.course?.courseCategoryId}/${course.course?._id}`
                        )
                      }
                    >
                      <div className="relative">
                        <img
                          src={course.courseImage?.[0] || images.newCoursePage4Image1}
                          alt={course.course?.title}
                          className="max-h-[450px] w-full object-cover"
                        />
                        {course.course?.title && (
                          <span className="absolute top-2 right-2 bg-white text-gray-800 text-xs px-2 py-0.5 rounded-md shadow-sm">
                            {course.course?.title}
                          </span>
                        )}
                      </div>
                      <div className="p-3 space-y-2">
                        <p className="text-sm font-semibold leading-tight text-gray-800">
                          {course.course?.title}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>👥 {course.students || 'N/A'} Students</span>
                          <span>📘 {course.modules || 'N/A'} Modules</span>
                          <span>⏱️ {course.duration || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 mt-2"></div>
                          <div>
                            <button className="w-full px-2 py-1 mt-2 text-sm text-black bg-yellow-300 rounded-lg">
                              Explore
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )} */}
          {activeTab === 'Transactions' && (
            <div className="w-[100%] mt-5">
              <p className="mb-3 text-lg font-semibold mt-3">Transactions</p>
              <div className="course-transactions-wrapper w-[100%]">
                {isLoading ? (
                  <div className="mt-6 text-center">
                    <p className="text-base text-gray-500">Loading transactions...</p>
                  </div>
                ) : transactions?.transactions?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {transactions?.transactions?.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-2 hover:shadow-md cursor-pointer transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-gray-100 rounded-md w-10 h-10 min-w-10 flex items-center justify-center">
                            <Icon
                              icon="mdi:receipt"
                              width="32"
                              height="32"
                              className="text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 line-clamp-2">
                              Transaction #{item?.transactionId}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(item?.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Transaction ID</p>
                            <p className="font-medium">{item?.transactionId}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-medium">₹{item?.finalAmount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Status</p>
                            <p className="font-medium capitalize">{item?.paymentStatus}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Mode</p>
                            <p className="font-medium">{item?.paymentMode}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 text-center">
                    <h2 className="mb-2 text-xl sm:text-2xl font-bold">No transactions yet</h2>
                    <p className="text-base text-gray-500">
                      Your transaction history will appear here after your first purchase.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'My Dashboards' && (
            <div>
              <div>
                <div className="mt-5 sm:w-full lg:w-1/2">
                  <div className="p-3">
                    <h1 className="mb-6 text-2xl font-bold">All Dashboards</h1>
                    {isLoading ? (
                      <div className="flex justify-center mt-10">
                        <p>Loading...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {dashboards?.map((dashboard, index) => (
                          <div
                            key={index}
                            className={`rounded-lg p-4 flex flex-col items-center justify-center`}
                          >
                            <span className={`${dashboard.color} p-2 rounded-lg mb-2`}>
                              <img
                                src={dashboard.icon}
                                alt={dashboard.title}
                                className="w-12 h-12 mb-2"
                              />
                            </span>
                            <h2 className="text-lg font-semibold text-center">{dashboard.title}</h2>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'My Weekly Timeline' && (
            <div>
              <div className="mt-5">
                <h1 className="mb-3 text-lg font-semibold mt-3">Weekly Timeline</h1>
                {isLoading ? (
                  <div className="flex justify-center mt-10">
                    <p>Loading...</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute w-1 h-full transform -translate-x-1/2 bg-gray-500 left-1/2"></div>
                    {timelineEvents?.map((event, index) => (
                      <div key={index} className="flex mb-8">
                        <div className="w-full lg:w-1/2 sm:pr-4 pr-2 text-right">
                          <div className="inline-block p-2 bg-gray-300 rounded-lg">
                            <div className="flex items-center">
                              <Icon icon="akar-icons:calendar" className="mr-2 text-gray-500" />
                              <span className="text-gray-700 text-sm md:text-base">
                                {event.startDate} To {event.endDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/2 sm:pl-4 pl-2">
                          <div className="md:p-4 p-2 rounded-lg bg-gray-100">
                            <h3 className="flex gap-2 items-center mb-2 sm:text-lg text-sm font-semibold text-gray-700">
                              <Icon icon="mdi:timer-sand-empty" width="24" height="24" /> Weekly
                              Time Spent
                            </h3>
                            <p className="mb-2 text-gray-700">
                              {formatTimeSpentTimeLine(event.totalTimeSpent)}
                            </p>
                            <p className="grid grid-cols-2 gap-2">
                              <div className="flex items-center p-2 bg-white rounded">
                                <Icon
                                  icon="mingcute:video-fill"
                                  width="24"
                                  height="24"
                                  className="mr-2 text-gray-700"
                                />
                                <span className="text-black-700 text-sm md:text-base">
                                  {event.totalVideosWatched} videos watched
                                </span>
                              </div>
                              <div className="flex items-center p-2 bg-white rounded">
                                <Icon
                                  icon="twemoji:red-question-mark"
                                  width="24"
                                  height="24"
                                  className="mr-2 text-gray-700"
                                />
                                <span className="text-black-700 text-sm md:text-base">
                                  {event.totalPracticeActivities} Practice activities
                                </span>
                              </div>
                              <div className="flex items-center p-2 bg-white rounded">
                                <Icon
                                  icon="solar:test-tube-broken"
                                  width="24"
                                  height="24"
                                  className="mr-2 text-gray-700"
                                />
                                <span className="text-black-700 text-sm md:text-base">
                                  {event.totalTestsTaken} Test Taken
                                </span>
                              </div>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(SettingPage1);
