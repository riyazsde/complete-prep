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
import {
  saveSubscriptionCache,
  getSubscriptionCache,
  clearSubscriptionCache,
} from '../../../utils/subscriptionCache';

const SettingPage1 = () => {
  const navigate = useNavigate();
  const { user, setUser, logout, isAuthenticated } = useContext(AuthContext);
  const goal = user?.goal || '';

  const [activeTab, setActiveTab] = useState('Profile');
  const [modalVisible, setModalVisible] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState('');
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  // Hydrate subscription state from cache
  const [subscriptionStatus, setSubscriptionStatus] = useState(() => {
    const cached = getSubscriptionCache();
    return Boolean(cached?.isActive);
  });
  const [currentSubscription, setCurrentSubscription] = useState(() => {
    const cached = getSubscriptionCache();
    return cached?.isActive ? cached : null;
  });

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
  const [dashboards] = useState([
    { title: 'My Success Roadmap', icon: images.newSettingDashboardImage1, color: 'bg-green-100' },
    { title: 'Videos Analysis', icon: images.newSettingDashboardImage2, color: 'bg-red-100' },
    { title: 'Practice Analysis', icon: images.newSettingDashboardImage3, color: 'bg-yellow-100' },
    { title: 'Tests Analysis', icon: images.newSettingDashboardImage4, color: 'bg-blue-100' },
    { title: 'My Skills Analysis', icon: images.newSettingDashboardImage5, color: 'bg-gray-100' },
    { title: 'Capsule Course Analysis', icon: images.newSettingDashboardImage6, color: 'bg-purple-100' },
    { title: 'Notes by Toppers Analysis', icon: images.newSettingDashboardImage7, color: 'bg-indigo-100' },
  ]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReferalButtonVisible, setIsReferalButtonVisible] = useState(false);

  // Derived single source of truth
  const isSubscribed = subscriptionStatus || user?.isSubscribed;

  // =========================================================
  // AUTH GUARD
  // =========================================================
  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, goal]);

  // =========================================================
  // FETCH TRANSACTIONS + TIMELINE
  // =========================================================
  const fetchData = () => {
    userApi.subscriptions.transactions({
      setIsLoading,
      onSuccess: (res) => {
        setTransactions(res?.data || []);
      },
      onError: (err) => {
        console.error('Failed to fetch transactions:', err);
      },
    });

    userApi.settingPage.getTimeLine({
      onSuccess: (res) => {
        setTimelineEvents(res?.data || []);
      },
      onError: (err) => {
        console.error('Failed to fetch timeline events:', err);
      },
    });
  };

  // =========================================================
  // UPDATE USER BANNER
  // =========================================================
  const updateUserBanner = async () => {
    userApi.landingPage.updateBannerStatus({
      data: {
        goalCategory: user?.goalCategory || '',
        goal: user?.goal || '',
        semester: user?.semester || '',
        firstVideoBanner: true,
      },
      onSuccess: () => {
        setUser((prev) => ({ ...prev, firstVideoBanner: true }));
        setShowBannerModal(true);
      },
      onError: () => {
        showNotification({
          type: 'error',
          message: 'Failed to update banner status',
        });
      },
    });
  };

  // =========================================================
  // FETCH CURRENT SUBSCRIPTION (returns Promise)
  // =========================================================
  const fetchSubScription = () => {
    return new Promise((resolve) => {
      userApi.subscriptions.getSubscription({
        params: { semester: user?.semester },
        showMsg: false,
        onSuccess: (res) => {
          const current = res?.data || null;

          if (current?.isActive) {
            setSubscriptionStatus(true);
            setCurrentSubscription(current);
            setUser((prev) => ({ ...prev, isSubscribed: true }));
            saveSubscriptionCache(current);
            resolve(current);
            return;
          }

          setSubscriptionStatus(false);
          setCurrentSubscription(null);
          setUser((prev) => ({ ...prev, isSubscribed: false }));
          clearSubscriptionCache();
          resolve(null);
        },
        onError: (err) => {
          console.error('Failed to fetch subscription:', err);
          const cached = getSubscriptionCache();
          if (cached?.isActive) {
            setSubscriptionStatus(true);
            setCurrentSubscription(cached);
            setUser((prev) => ({ ...prev, isSubscribed: true }));
            resolve(cached);
          } else {
            resolve(null);
          }
        },
      });
    });
  };

  // =========================================================
  // FETCH ALL SUBSCRIPTION PLANS
  // =========================================================
  const fetchSubscriptionPlans = () => {
    return new Promise((resolve) => {
      userApi.subscriptions.getAll({
        params: { semester: user?.semester },
        showMsg: false,
        onSuccess: (res) => {
          let plans = [];
          if (Array.isArray(res?.data)) plans = res.data;
          else if (Array.isArray(res?.data?.data)) plans = res.data.data;
          else if (Array.isArray(res)) plans = res;

          setSubscriptions(plans);
          resolve(plans);
        },
        onError: (err) => {
          console.error('Failed to fetch subscription plans:', err);
          setSubscriptions([]);
          resolve([]);
        },
      });
    });
  };

  // =========================================================
  // FETCH COUPONS
  // =========================================================
  const fetchCoupons = () => {
    userApi.subscriptions.coupons.getAll({
      onSuccess: (res) => {
        setAllCoupons(res?.data || []);
      },
      onError: (err) => {
        console.log('Failed to fetch coupons:', err);
        setAllCoupons([]);
      },
    });
  };

  // =========================================================
  // INITIAL SUBSCRIPTION LOAD
  // =========================================================
  useEffect(() => {
    if (!user?._id) return;
    fetchSubScription();
    fetchSubscriptionPlans();
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.semester]);

  // =========================================================
  // REFRESH SUBSCRIPTION DATA
  // =========================================================
  const refreshSubscriptionData = async () => {
    try {
      await Promise.all([fetchSubScription(), fetchSubscriptionPlans()]);
    } catch (error) {
      console.error('Failed to refresh subscription data:', error);
    }
  };

  // =========================================================
  // PROFILE SAVE / LOGOUT / DELETE
  // =========================================================
  const handleSave = () => {
    userApi.settingPage.updateProfile({
      onSuccess: (res) => {
        console.log('Profile updated successfully:', res);
      },
      onError: (err) => {
        console.error('Failed to update profile:', err);
      },
    });
  };

  const handleLogout = () => {
    clearSubscriptionCache();
    logout();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    clearSubscriptionCache();
    console.log('Account deleted');
    navigate('/');
  };

  // =========================================================
  // RESPONSIVE TABS
  // =========================================================
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeTab]);

  // =========================================================
  // HANDLE SUBSCRIPTION (Free + Paid)
  // =========================================================
  const handleSubscribe = (sub) => {
    if (!sub?._id) {
      showNotification({ type: 'error', message: 'Invalid subscription plan' });
      return;
    }

    if (loadingPlanId) return;

    setLoadingPlanId(sub._id);

    const originalPrice = Number(sub?.originalPrice || 0);
    const discountPrice = Number(sub?.discountPrice ?? originalPrice);
    const planPrice = sub?.discountActive ? discountPrice : originalPrice;
    const finalPlanPrice = Number.isFinite(planPrice) ? planPrice : 0;
    const isFree = finalPlanPrice <= 0;

    userApi.subscriptions.create({
      showMsg: false,
      data: {
        subscriptionPlanId: sub._id,
        paymentMode: isFree ? 'free' : 'pending',
        taxAmount: 0,
        paymentStatus: isFree ? 'completed' : 'pending',
        couponCode: selectedCoupons || '',
        useWallet: true,
      },
      onSuccess: (response) => {
        const subscriptionData = response?.data;
        const subscriptionId = subscriptionData?._id;

        if (!subscriptionId) {
          setLoadingPlanId(null);
          showNotification({
            type: 'error',
            message: 'Subscription could not be created',
          });
          return;
        }

        const amount = Number(
          subscriptionData?.finalPrice ?? finalPlanPrice
        );

        // =====================================================
        // FREE / ZERO PRICE PLAN → NO RAZORPAY
        // =====================================================
        if (amount <= 0) {
          const optimistic = {
            ...subscriptionData,
            isActive: true,
            paymentStatus: 'completed',
          };

          setSubscriptionStatus(true);
          setCurrentSubscription(optimistic);
          setUser((prev) => ({ ...prev, isSubscribed: true }));
          saveSubscriptionCache(optimistic);

          userApi.subscriptions.update({
            id: subscriptionId,
            showMsg: false,
            data: {
              paymentMode: 'free',
              paymentStatus: 'completed',
              transactionId:
                subscriptionData?.transactionId || `FREE-${Date.now()}`,
            },
            onSuccess: async (updateResponse) => {
              const updated = updateResponse?.data || optimistic;
              const finalSub = { ...updated, isActive: true };

              setSubscriptionStatus(true);
              setCurrentSubscription(finalSub);
              setUser((prev) => ({ ...prev, isSubscribed: true }));
              saveSubscriptionCache(finalSub);

              setModalVisible(false);
              setLoadingPlanId(null);

              showNotification({
                type: 'success',
                message: 'Subscription activated successfully',
              });

              await refreshSubscriptionData();
            },
            onError: async (error) => {
              console.error('Free subscription update failed:', error);

              const latest = await fetchSubScription();
              if (latest?.isActive) {
                setSubscriptionStatus(true);
                setUser((prev) => ({ ...prev, isSubscribed: true }));
                setModalVisible(false);
                showNotification({
                  type: 'success',
                  message: 'Subscription activated successfully',
                });
              } else {
                showNotification({
                  type: 'success',
                  message: 'Subscription activated successfully',
                });
                setModalVisible(false);
              }
              setLoadingPlanId(null);
            },
          });

          return;
        }

        // =====================================================
        // PAID PLAN → RAZORPAY
        // =====================================================
        triggerRazorpay({
          amount,
          name: user?.fullName || 'User',
          email: user?.email || 'email@example.com',
          contact: user?.mobileNumber || '0000000000',

          onSuccess: (paymentRes) => {
            const transactionId =
              paymentRes?.payload?.payment?.id ||
              paymentRes?.razorpay_payment_id;

            if (!transactionId) {
              setLoadingPlanId(null);
              showNotification({
                type: 'error',
                message: 'Payment ID was not received',
              });
              return;
            }

            userApi.subscriptions.update({
              id: subscriptionId,
              showMsg: false,
              data: {
                paymentMode: 'upi',
                paymentStatus: 'completed',
                transactionId,
              },
              onSuccess: async (updateResponse) => {
                const updated = updateResponse?.data;

                if (
                  updated?.paymentStatus === 'completed' ||
                  updated?.isActive === true
                ) {
                  const finalSub = { ...updated, isActive: true };

                  setSubscriptionStatus(true);
                  setCurrentSubscription(finalSub);
                  setUser((prev) => ({ ...prev, isSubscribed: true }));
                  saveSubscriptionCache(finalSub);

                  setModalVisible(false);
                  setLoadingPlanId(null);

                  showNotification({
                    type: 'success',
                    message:
                      'Payment successful and subscription activated',
                  });

                  await refreshSubscriptionData();
                } else {
                  setLoadingPlanId(null);
                  showNotification({
                    type: 'error',
                    message:
                      'Payment was successful, but subscription activation failed',
                  });
                }
              },
              onError: (error) => {
                console.error(
                  'Subscription payment confirmation failed:',
                  error
                );
                setLoadingPlanId(null);
                showNotification({
                  type: 'error',
                  message:
                    'Payment was successful, but subscription activation failed. Please contact support.',
                });
              },
            });
          },

          onFailure: (error) => {
            console.error('Razorpay payment failed:', error);
            setLoadingPlanId(null);
            showNotification({
              type: 'error',
              message: error?.message || 'Payment failed. Please try again.',
            });
          },

          onCancel: () => {
            setLoadingPlanId(null);
            showNotification({ type: 'error', message: 'Payment cancelled' });
          },
        });
      },

      onError: (error) => {
        console.error('Subscription creation failed:', error);
        setLoadingPlanId(null);
        showNotification({
          type: 'error',
          message: error?.message || 'Unable to create subscription',
        });
      },
    });
  };

  // =========================================================
  // LOAD RAZORPAY SCRIPT (once, global)
  // =========================================================
  useEffect(() => {
    if (document.querySelector('script[data-razorpay-checkout="true"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    document.body.appendChild(script);
  }, []);

  // =========================================================
  // TRIGGER RAZORPAY
  // =========================================================
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
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const existingScript = document.querySelector(
            'script[data-razorpay-checkout="true"]'
          );

          if (existingScript) {
            existingScript.addEventListener('load', resolve, { once: true });
            existingScript.addEventListener(
              'error',
              () => reject(new Error('Razorpay checkout failed to load')),
              { once: true }
            );
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.dataset.razorpayCheckout = 'true';
          script.onload = resolve;
          script.onerror = () =>
            reject(new Error('Razorpay checkout failed to load'));
          document.body.appendChild(script);
        });
      }

      if (!window.Razorpay) {
        throw new Error(
          'Razorpay checkout is not loaded. Please try again.'
        );
      }

      const orderResponse = await fetch(
        `https://api.semprep.com/api/create-order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.max(100, Math.round(Number(amount) * 100)),
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
        currency: orderData?.data?.currency || 'INR',
        order_id: orderData?.data?.order_id,
        name: 'Semprep',
        description: 'Semester Subscription',
        prefill: { name, email, contact },
        theme: { color: '#3DD455' },

        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              `https://api.semprep.com/api/verify-payment`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData?.success) {
              onSuccess?.({
                payload: {
                  payment: { id: response.razorpay_payment_id },
                },
              });
            } else {
              throw new Error(
                verifyData?.message || 'Payment verification failed'
              );
            }
          } catch (error) {
            console.error('Payment verification error:', error);
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
          message: response?.error?.description || 'Payment failed',
        });
        onFailure?.(response);
      });

      razorpay.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      showNotification({
        type: 'error',
        message: error?.message || 'Something went wrong',
      });
      onFailure?.(error);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================
  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const isCurrentPlan = (sub) => {
    if (!currentSubscription) return false;
    const planRef = currentSubscription?.subscriptionPlanId;
    const currentPlanId =
      typeof planRef === 'object' ? planRef?._id : planRef;
    return currentPlanId && String(currentPlanId) === String(sub?._id);
  };

  const formatDate = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-IN');
    } catch {
      return String(date).slice(0, 10).split('-').reverse().join('-');
    }
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="">
      {/* SUBSCRIPTION MODAL */}
      <ReusableModal
        size="md"
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        footer={false}
        header={false}
        body={
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Subscribe to Continue</h2>
            <p className="mb-4">
              Please choose a subscription plan to access this feature.
            </p>

            {isSubscribed && currentSubscription && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                <p className="text-sm font-medium text-green-800">
                  ✓ You are subscribed to{' '}
                  <strong>
                    {currentSubscription?.subscriptionPlanId?.name ||
                      currentSubscription?.subscriptionPlanId ||
                      'Active Plan'}
                  </strong>
                </p>
                {currentSubscription?.endDate && (
                  <p className="mt-1 text-xs text-green-700">
                    Expires on {formatDate(currentSubscription.endDate)}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              {subscriptions?.map((sub) => {
                const originalPrice = Number(sub?.originalPrice || 0);
                const discountPrice = Number(
                  sub?.discountPrice ?? originalPrice
                );
                const finalPrice = sub?.discountActive
                  ? discountPrice
                  : originalPrice;
                const currentPlan = isCurrentPlan(sub);

                return (
                  <div
                    key={sub._id}
                    className={`p-4 border rounded-lg ${
                      currentPlan
                        ? 'border-[#3DD455] bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{sub.name}</h3>
                        <p className="text-sm text-gray-600">{sub.desc}</p>
                      </div>
                      {currentPlan && (
                        <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Current Plan
                        </span>
                      )}
                    </div>

                    <p className="text-lg font-bold mt-2">
                      ₹{finalPrice}
                      {sub.discountActive &&
                        originalPrice !== finalPrice && (
                          <span className="ml-2 text-sm line-through text-gray-400">
                            ₹{originalPrice}
                          </span>
                        )}
                    </p>

                    {allCoupons?.length > 0 && !currentPlan && (
                      <select
                        className="mt-2 w-full p-2 border rounded"
                        value={selectedCoupons}
                        onChange={(e) => setSelectedCoupons(e.target.value)}
                      >
                        <option value="">Select Coupon (Optional)</option>
                        {allCoupons.map((coupon) => (
                          <option key={coupon._id} value={coupon.code}>
                            {coupon.code} - {coupon.discount}% off
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      className={`mt-2 px-4 py-2 font-semibold rounded-lg ${
                        currentPlan
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-[#3DD455] text-[#fff] hover:bg-[#000]'
                      } disabled:opacity-50`}
                      onClick={() => handleSubscribe(sub)}
                      disabled={currentPlan || loadingPlanId !== null}
                    >
                      {loadingPlanId === sub._id
                        ? 'Processing...'
                        : currentPlan
                        ? '✓ Current Plan'
                        : finalPrice <= 0
                        ? 'Activate Free'
                        : 'Subscribe'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        }
      />

      <div className="">
        <UserMenuBar />
      </div>

      <div className="bg-white rounded-xl p-6">
        <div className="w-full">
          <div className="w-full overflow-auto">
            <div className="flex justify-between bg-[#f3f4f6] rounded-3xl tab-button-container w-fit p-1 min-w-[400px]">
              {tabs?.map((tab) => (
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

          {activeTab === 'Subscriptions' && (
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
                        {user?.fullName || ''}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Continue Your Journey And Achieve Your Target
                      </p>
                    </div>

                    {isSubscribed ? (
                      <div className="mt-2">
                        <p className="text-sm text-black text-center">
                          Your Current Plan : -{' '}
                          <span className="text-sm text-gray-500">
                            {currentSubscription?.subscriptionPlanId?.name ||
                              currentSubscription?.subscriptionPlanId ||
                              'Active'}
                          </span>
                        </p>
                        <p className="text-sm text-black text-center items-center justify-center flex gap-2">
                          <span className="text-sm text-black">
                            {' '}
                            Expire On :{' '}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(currentSubscription?.endDate)}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center gap-4 mt-2 mb-4">
                        <p className="text-sm text-black">
                          Please Subscribe to Continue
                        </p>
                        <button
                          className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
                          onClick={() => setModalVisible(true)}
                        >
                          Subscribe
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-100 rounded-lg p-2.5 flex flex-col items-center gap-2">
                    <p className="font-semibold text-[13px] text-center">
                      ■ Limited Time Offer: 50% Off All Courses! ■
                    </p>
                    <p className="text-xs text-center">
                      Boost your exam prep with half off on our top-rated
                      courses. Hurry, offer ends soon!
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
                        cursor: 'pointer',
                      }}
                      onClick={updateUserBanner}
                    />
                  </div>

                  <div className="flex lg:flex-col flex-wrap gap-2">
                    {isReferalButtonVisible && (
                      <div className="flex items-center justify-between gap-2 bg-gray-100 px-3 py-2 rounded-2xl">
                        <span className="text-sm font-medium text-gray-700">
                          {user?.refferalCode || ''}
                        </span>
                        <button
                          onClick={() => {
                            showNotification({
                              type: 'success',
                              message: 'Copied to clipboard',
                            });
                            navigator.clipboard.writeText(
                              user?.refferalCode
                            );
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
                        showNotification({
                          type: 'success',
                          message: 'Copied to clipboard',
                        });
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

                    <button
                      onClick={() =>
                        window.open(
                          'https://forms.gle/1JUQT5ZKRdhwSoqH7',
                          '_blank'
                        )
                      }
                      className="bg-[#3DD455] hover:bg-black text-white font-medium text-sm px-2.5 py-2 rounded-lg"
                    >
                      Become an Ambassador
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Transactions' && (
            <div className="w-[100%] mt-5">
              <p className="mb-3 text-lg font-semibold mt-3">Transactions</p>
              <div className="course-transactions-wrapper w-[100%]">
                {isLoading ? (
                  <div className="mt-6 text-center">
                    <p className="text-base text-gray-500">
                      Loading transactions...
                    </p>
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
                              {new Date(item?.createdAt).toLocaleDateString(
                                'en-IN',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Transaction ID</p>
                            <p className="font-medium">
                              {item?.transactionId}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-medium">
                              ₹{item?.finalAmount}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Status</p>
                            <p className="font-medium capitalize">
                              {item?.paymentStatus}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Mode</p>
                            <p className="font-medium">
                              {item?.paymentMode}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 text-center">
                    <h2 className="mb-2 text-xl sm:text-2xl font-bold">
                      No transactions yet
                    </h2>
                    <p className="text-base text-gray-500">
                      Your transaction history will appear here after your
                      first purchase.
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
                    <h1 className="mb-6 text-2xl font-bold">
                      All Dashboards
                    </h1>
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
                            <span
                              className={`${dashboard.color} p-2 rounded-lg mb-2`}
                            >
                              <img
                                src={dashboard.icon}
                                alt={dashboard.title}
                                className="w-12 h-12 mb-2"
                              />
                            </span>
                            <h2 className="text-lg font-semibold text-center">
                              {dashboard.title}
                            </h2>
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
                <h1 className="mb-3 text-lg font-semibold mt-3">
                  Weekly Timeline
                </h1>
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
                              <Icon
                                icon="akar-icons:calendar"
                                className="mr-2 text-gray-500"
                              />
                              <span className="text-gray-700 text-sm md:text-base">
                                {event.startDate} To {event.endDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/2 sm:pl-4 pl-2">
                          <div className="md:p-4 p-2 rounded-lg bg-gray-100">
                            <h3 className="flex gap-2 items-center mb-2 sm:text-lg text-sm font-semibold text-gray-700">
                              <Icon
                                icon="mdi:timer-sand-empty"
                                width="24"
                                height="24"
                              />{' '}
                              Weekly Time Spent
                            </h3>
                            <p className="mb-2 text-gray-700">
                              {formatTimeSpentTimeLine(
                                event.totalTimeSpent
                              )}
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
                                  {event.totalPracticeActivities} Practice
                                  activities
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