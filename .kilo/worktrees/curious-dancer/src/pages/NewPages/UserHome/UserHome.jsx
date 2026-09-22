import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TutorialVideoImage from '../../../assets/images/tutorialBanner.jpg';
import { ReusableModal } from '../../../components/common/ComPrepComponent/ComPrepComponent';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import NotificationDrawer from '../../../components/ThirdParty/NotificationDrawer';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';
import images from '../../../utils/images';
import ModalBannerVideos from './ModalBannerVideos';
     import { AlertTriangle } from "lucide-react";

const UserHome = (props) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [topContent, setTopContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursePercentage, setCoursePercentage] = useState([]);
  const [banners, setBanners] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  // const [buttonLoading, setButtonLoading] = useState(false);
    const [loadingPlanId, setLoadingPlanId] = useState(null);

  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isReferalButtonVisible, setIsReferalButtonVisible] = useState(false);

  const fetchCourses = () => {
    const universityId = sessionStorage.getItem('universityId');
        const semesterId = sessionStorage.getItem('semesterId');
        const courseId = sessionStorage.getItem('courseId');
    userApi.courses.getAll({
      params: {
        limit: 999999,
        page: 1,
        search: searchQuery,
        goalId: courseId,
        goalCategoryId: universityId,
        semesterId: semesterId,
      },
      setIsLoading,
      onSuccess: res => {
        setCourses(res?.data || []);
      },
      onError: err => {
        setCourses([]);
        console.error('Failed to fetch courses:', err);
      },
    });
  };
  const fetchCoursePercentage = () => {
    userApi.courses.getCoursePercentage({
      params: {
        limit: 999999,
        page: 1,
        search: searchQuery,
        semester: user?.semester,
      },
      setIsLoading,
      onSuccess: res => {
        setCoursePercentage(res?.data || []);
      },
      onError: err => {
        console.error('Failed to fetch courses:', err);
      },
    });
  };
useEffect(() => {
  setModalVisible(props.showModalPopUp);
}, [props.showModalPopUp]);
  useEffect(() => {
    fetchCourses();
    fetchCoursePercentage();
  }, [searchQuery,user]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    let params = {};
    if (user?.firstVideoBanner) {
      params = { position: 'MID' };
    } else if (user?.secondVideoBanner) {
      params = { position: 'BOTTOM' };
    } else {
      params = { position: 'TOP' };
    }
    userApi.landingPage.getTopBanner({
      params,
      onSuccess: data => setBanners(data?.data || data || []),
      onError: () => setBanners([]),
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

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
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

  const fetchCourseSubjectsByCourseId = courseId => {
    userApi.courses.getById({
      params: {
        courseCategoryId: courseId,
        semesterId: user?.semester,
      },
      setIsLoading,
      onSuccess: res => {
        if (!res?.data?.length) {
          showNotification({
            type: 'error',
            message: 'No subjects found for this course',
          });
          return;
        }
        navigate(`/user/course/${courseId}/${res?.data?.[0]?._id}`);
      },
      onError: () => {
        showNotification({
          type: 'error',
          message: 'No subjects found for this course',
        });
      },
    });
  };

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
                      props?.handleClose&&props?.handleClose();
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

if(loading){}

  return (
    <>
      <ReusableModal
              size="md"
              show={modalVisible}
              onHide={() => {
                props?.handleClose&&props?.handleClose();
                setModalVisible(false)}}
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
      <div className="w-full flex flex-col-reverse lg:flex-row bg-white">
        <div className="w-full">
          <div>
            <UserMenuBar />
          </div>
          <div className='flex lg:flex-row flex-col-reverse items-start'>

          <div className="p-4 flex-1 lg:max-w-[70%] w-full">
            <div
              className="relative text-white md:rounded-xl rounded-lg md:p-3 p-2 bg-center bg-no-repeat bg-cover"
              style={{
                backgroundImage: `url(${images.userDashboardImageHome})`,
              }}
            >
              <div className="relative z-10 flex flex-col justify-center h-full gap-2 p-3">
                <div>
                  <h4 className="text-lg sm:text-xl md:text-xl font-bold mb-1 sm:mb-2">
                    Sharpen Your Skills With
                  </h4>
                  <h4 className="text-lg sm:text-xl md:text-xl font-bold">
                    Professional Online Courses
                  </h4>
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => navigate('/user/skill')}
                    className="bg-[#3DD455] hover:bg-black text-white font-bold text-sm sm:text-base py-1.5 px-4 rounded-lg inline-flex items-center gap-2 transition-all duration-200"
                  >
                    <span>Join Now</span>
                    <Icon icon="lsicon:play-filled" width="16" height="16" />
                  </button>
                </div>
              </div>
            </div>

       

{!subscriptionStatus && (
  <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 mt-3">
    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />

    <div className="text-sm">
      <p className="font-medium text-amber-900">
        Wrong University/Course Selected
      </p>

      <p className="mt-1 text-amber-800">
        It looks like you have selected the wrong university or course.
        Please{" "}
        <button
          type="button"
          onClick={() => navigate("/choose-curriculum")}
          className="font-semibold underline hover:no-underline"
        >
          click here
        </button>{" "}
        to go back and select the correct university and course.
      </p>
    </div>
  </div>
)}

            <div className="mt-3">
              <h3 className="text-xl font-semibold mb-2">Courses</h3>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses?.map((course, idx) => (
                    <div
                      key={idx}
                      className="bg-[#efefef] md:rounded-xl rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden p-2"
                      onClick={() => {
                        user?.isSubscribed
                          ? fetchCourseSubjectsByCourseId(course._id)
                          : showNotification({
                              message: 'Please Subscribe to Continue',
                              type: 'error',
                            });
                      }}
                    >
                      <div className="relative">
                        <img
                          src={course?.image}
                          alt={course?.name}
                          loading={idx < 6 ? 'eager' : 'lazy'}
                          fetchpriority={idx < 3 ? 'high' : 'auto'}
                          decoding="async"
                          width={800}
                          height={450}
                          className="h-[135px] md:rounded-xl rounded-lg w-full object-cover"
                        />
                        <div className="w-full flex items-center mt-4">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={
                              coursePercentage?.find(item => item._id === course._id)?.progress || 0
                            }
                            style={{
                              width: '100%',
                              accentColor: '#2563eb',
                              cursor: 'pointer',
                              appearance: 'none',
                              height: '4px',
                              borderRadius: '8px',
                              background: '#e5e7eb',
                            }}
                            className="range-slider"
                          />
                        </div>

                        {course.tag && (
                          <span className="absolute top-2 right-2 bg-white text-gray-800 text-xs px-2 py-0.5 rounded-md shadow-sm">
                            {course.tag}
                          </span>
                        )}
                      </div>
                      <div className="pt-3 space-y-2">
                        <p className="text-sm font-semibold text-black leading-tight">
                          {course?.name || ''}
                        </p>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                          {course.modules && <span>📘 {course.modules} Module</span>}
                          {course.duration && <span>⏱️ {course.duration}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="hidden lg:block w-full flex-1 lg:max-w-[30%] bg-white lg:border-l border-[#d0d0d0] p-6 lg:min-h-svh">
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
          </div>
        </div>
      </div>

      <NotificationDrawer open={showNotifications} onClose={() => setShowNotifications(false)} />

      <ModalBannerVideos
        open={showBannerModal}
        onClose={() => setShowBannerModal(false)}
        onWatched={() => {
          setShowBannerModal(false);
          navigate('/user/first-banner');
        }}
      />
    </>
  );
};

export default HOC(UserHome);
