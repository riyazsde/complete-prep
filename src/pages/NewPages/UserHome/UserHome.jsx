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
import { AlertTriangle } from 'lucide-react';
import {
  saveSubscriptionCache,
  getSubscriptionCache,
  clearSubscriptionCache,
} from '../../../utils/subscriptionCache';

const UserHome = (props) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  // =========================================================
  // GENERAL STATE
  // =========================================================
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursePercentage, setCoursePercentage] = useState([]);
  const [banners, setBanners] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  // =========================================================
  // SUBSCRIPTION STATE — hydrated from cache on first render
  // =========================================================
  const [subscriptionStatus, setSubscriptionStatus] = useState(() => {
    const cached = getSubscriptionCache();
    return Boolean(cached?.isActive);
  });
  const [currentSubscription, setCurrentSubscription] = useState(() => {
    const cached = getSubscriptionCache();
    return cached?.isActive ? cached : null;
  });
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const [subscriptions, setSubscriptions] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  const [isReferalButtonVisible, setIsReferalButtonVisible] = useState(false);

  // =========================================================
  // DERIVED VALUES
  // =========================================================
  const isSubscribed = subscriptionStatus || user?.isSubscribed;

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.email?.split('@')?.[0] ||
    'User';

  // Stable signature — re-runs effects when user shape changes
  const userSignature = user
    ? `${user._id || ''}|${user.semester || ''}|${user.semesterId || ''}`
    : '';

  // =========================================================
  // RESOLVE SEMESTER (handles object OR string shapes + fallbacks)
  // =========================================================
  const resolveSemester = (override) => {
    if (override) {
      return typeof override === 'object' ? override?._id : override;
    }

    if (user?.semester) {
      return typeof user.semester === 'object'
        ? user.semester?._id
        : user.semester;
    }

    if (user?.semesterId) return user.semesterId;

    const stored = sessionStorage.getItem('semesterId');
    if (stored) return stored;

    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (storedUser?.semester) {
        return typeof storedUser.semester === 'object'
          ? storedUser.semester?._id
          : storedUser.semester;
      }
      if (storedUser?.semesterId) return storedUser.semesterId;
    } catch {
      // ignore
    }

    return undefined;
  };

  // =========================================================
  // FETCH COURSES
  // =========================================================
  const fetchCourses = () => {
    const universityId =
      sessionStorage.getItem('universityId') || user?.goalCategory;
    const semesterId = resolveSemester();
    const courseId = sessionStorage.getItem('courseId') || user?.goal;

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
      onSuccess: (res) => {
        setCourses(res?.data || []);
      },
      onError: (err) => {
        setCourses([]);
        console.error('Failed to fetch courses:', err);
      },
    });
  };

  // =========================================================
  // FETCH COURSE PERCENTAGE
  // =========================================================
  const fetchCoursePercentage = () => {
    userApi.courses.getCoursePercentage({
      params: {
        limit: 999999,
        page: 1,
        search: searchQuery,
        semester: resolveSemester(),
      },
      setIsLoading,
      onSuccess: (res) => {
        setCoursePercentage(res?.data || []);
      },
      onError: (err) => {
        console.error('Failed to fetch course percentage:', err);
      },
    });
  };

  // =========================================================
  // FETCH COURSES WHEN USER / SEARCH CHANGES
  // =========================================================
  useEffect(() => {
    if (!userSignature) return;
    fetchCourses();
    fetchCoursePercentage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, userSignature]);

  // =========================================================
  // MODAL POPUP FROM PARENT
  // =========================================================
  useEffect(() => {
    const shouldShow = Boolean(props?.showModalPopUp);
    setModalVisible(shouldShow);
    if (shouldShow) {
      fetchSubscriptionPlans();
      fetchSubScription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.showModalPopUp]);

  // =========================================================
  // RE-VERIFY SUBSCRIPTION WHEN MODAL OPENS
  // =========================================================
  useEffect(() => {
    if (modalVisible) {
      fetchSubScription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  // =========================================================
  // FETCH BANNERS
  // =========================================================
  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSignature]);

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
      onSuccess: (data) => {
        setBanners(data?.data || data || []);
      },
      onError: () => {
        setBanners([]);
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
  // SEARCH
  // =========================================================
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // =========================================================
  // FETCH CURRENT SUBSCRIPTION (returns a Promise)
  // =========================================================
  const fetchSubScription = (semesterOverride) => {
    const semester = resolveSemester(semesterOverride);

    return new Promise((resolve) => {
      userApi.subscriptions.getSubscription({
        params: { semester },
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
  const fetchSubscriptionPlans = (semesterOverride) => {
    const semester = resolveSemester(semesterOverride);

    return new Promise((resolve) => {
      setLoadingSubscriptions(true);

      userApi.subscriptions.getAll({
        params: { semester },
        showMsg: false,
        onSuccess: (res) => {
          let plans = [];
          if (Array.isArray(res?.data)) plans = res.data;
          else if (Array.isArray(res?.data?.data)) plans = res.data.data;
          else if (Array.isArray(res)) plans = res;

          setSubscriptions(plans);
          setLoadingSubscriptions(false);
          resolve(plans);
        },
        onError: (error) => {
          console.error('Failed to fetch subscription plans:', error);
          setSubscriptions([]);
          setLoadingSubscriptions(false);
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
  // Fires on mount + re-fires whenever userSignature changes
  // =========================================================
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setSubscriptionLoading(true);
      try {
        await fetchSubScription();
        if (cancelled) return;
        await fetchSubscriptionPlans();
        if (cancelled) return;
        fetchCoupons();
      } finally {
        if (!cancelled) setSubscriptionLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSignature]);

  // =========================================================
  // REFRESH SUBSCRIPTION ON WINDOW FOCUS
  // =========================================================
  useEffect(() => {
    const onFocus = () => {
      if (userSignature) fetchSubScription();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSignature]);

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
  // FETCH COURSE SUBJECTS
  // =========================================================
  const fetchCourseSubjectsByCourseId = (courseId) => {
    userApi.courses.getById({
      params: {
        courseCategoryId: courseId,
        semesterId: resolveSemester(),
      },
      setIsLoading,
      onSuccess: (res) => {
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

              if (props?.handleClose) props.handleClose();

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
          name: user?.fullName || user?.name || 'User',
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

                  if (props?.handleClose) props.handleClose();

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
            console.log('Razorpay payment cancelled');
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
        'https://api.semprep.com/api/create-order',
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
              'https://api.semprep.com/api/verify-payment',
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
              message: error?.message || 'Payment verification failed',
            });
            onFailure?.(error);
          }
        },

        modal: {
          ondismiss: function () {
            console.log('Razorpay modal dismissed');
            onCancel?.();
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response);
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
        message:
          error?.message || 'Something went wrong while opening payment',
      });
      onFailure?.(error);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================
  const getInitials = (name = '') => {
    if (!name) return '?';
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

  const openSubscriptionModal = async () => {
    fetchSubscriptionPlans();
    fetchSubScription();
    setModalVisible(true);
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <>
      {/* SUBSCRIPTION MODAL */}
      <ReusableModal
        size="md"
        show={modalVisible}
        onHide={() => {
          setModalVisible(false);
          if (props?.handleClose) props.handleClose();
        }}
        footer={false}
        header={false}
        body={
          <div className="p-6">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-900">
                Choose Your Plan
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Select a subscription plan to continue.
              </p>
            </div>

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

            {loadingSubscriptions ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#3DD455]" />
                <p className="text-sm text-gray-500">
                  Loading subscription plans...
                </p>
              </div>
            ) : subscriptions?.length > 0 ? (
              <div className="space-y-4">
                {subscriptions.map((sub) => {
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
                      className={`rounded-xl border p-4 transition-all ${
                        currentPlan
                          ? 'border-[#3DD455] bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {sub?.name || 'Subscription Plan'}
                          </h3>
                          {sub?.desc && (
                            <p className="mt-1 text-sm text-gray-500">
                              {sub.desc}
                            </p>
                          )}
                        </div>

                        {currentPlan && (
                          <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Current Plan
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{finalPrice}
                        </span>

                        {sub?.discountActive && originalPrice !== finalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{originalPrice}
                          </span>
                        )}

                        {sub?.discountActive && Number(sub?.discount) > 0 && (
                          <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                            {sub.discount}% OFF
                          </span>
                        )}
                      </div>

                      {sub?.duration && (
                        <p className="mt-2 text-xs text-gray-500">
                          Duration: {sub.duration}{' '}
                          {Number(sub.duration) === 1 ? 'month' : 'days'}
                        </p>
                      )}

                      {allCoupons?.length > 0 && !currentPlan && (
                        <select
                          className="mt-3 w-full rounded border border-gray-300 p-2 text-sm"
                          value={selectedCoupons}
                          onChange={(e) =>
                            setSelectedCoupons(e.target.value)
                          }
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
                        type="button"
                        className={`mt-3 w-full rounded-lg px-4 py-2 font-semibold text-white transition ${
                          currentPlan
                            ? 'cursor-not-allowed bg-gray-400'
                            : 'bg-[#3DD455] hover:bg-black'
                        } disabled:opacity-50`}
                        onClick={() => handleSubscribe(sub)}
                        disabled={currentPlan || loadingPlanId !== null}
                      >
                        {loadingPlanId === sub._id ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Processing...
                          </span>
                        ) : currentPlan ? (
                          '✓ Current Plan'
                        ) : finalPrice <= 0 ? (
                          'Activate Free'
                        ) : (
                          `Subscribe ₹${finalPrice}`
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="mb-3 text-4xl">📋</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No Subscription Plans Found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  No active subscription plans are currently available.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-lg bg-[#3DD455] px-5 py-2 text-sm font-semibold text-white hover:bg-black"
                  onClick={() => fetchSubscriptionPlans()}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        }
      />

      {/* MAIN DASHBOARD */}
      <div className="w-full flex flex-col-reverse lg:flex-row bg-white">
        <div className="w-full">
          <div>
            <UserMenuBar />
          </div>

          <div className="flex lg:flex-row flex-col-reverse items-start">
            {/* MAIN CONTENT */}
            <div className="p-4 flex-1 lg:max-w-[70%] w-full">
              {/* HERO */}
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
                      <Icon
                        icon="lsicon:play-filled"
                        width="16"
                        height="16"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* WRONG CURRICULUM WARNING */}
              {!isSubscribed && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 mt-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-900">
                      Wrong University/Course Selected?
                    </p>
                    <p className="mt-1 text-amber-800">
                      If you have selected the wrong university or course.
                      Please{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/choose-curriculum')}
                        className="font-semibold underline hover:no-underline"
                      >
                        click here
                      </button>{' '}
                      to go back.
                    </p>
                  </div>
                </div>
              )}

              {/* COURSES */}
              <div className="mt-3">
                <h3 className="text-xl font-semibold mb-2">Courses</h3>

                {isLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses?.map((course, idx) => (
                      <div
                        key={course?._id || idx}
                        className="bg-[#efefef] md:rounded-xl rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden p-2"
                        onClick={() => {
                          if (isSubscribed) {
                            fetchCourseSubjectsByCourseId(course._id);
                          } else {
                            showNotification({
                              message: 'Please Subscribe to Continue',
                              type: 'error',
                            });
                          }
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
                                coursePercentage?.find(
                                  (item) => item._id === course._id
                                )?.progress || 0
                              }
                              readOnly
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
                            {course.modules && (
                              <span>📘 {course.modules} Module</span>
                            )}
                            {course.duration && (
                              <span>⏱️ {course.duration}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="hidden lg:block w-full flex-1 lg:max-w-[30%] bg-white lg:border-l border-[#d0d0d0] p-6 lg:min-h-svh">
              <div className="space-y-6">
                {/* PROFILE */}
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
                        {getInitials(displayName)}
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-900 capitalize">
                      {displayName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Continue Your Journey And Achieve Your Target
                    </p>
                  </div>

                  {/* SUBSCRIPTION */}
                  {subscriptionLoading && !isSubscribed ? (
                    <div className="mt-4 flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#3DD455]" />
                      <p className="text-xs text-gray-500">
                        Checking subscription...
                      </p>
                    </div>
                  ) : isSubscribed && currentSubscription ? (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-semibold text-gray-500 text-center uppercase">
                        Current Plan
                      </p>
                      <p className="mt-1 text-base font-bold text-gray-900 text-center">
                        {currentSubscription?.subscriptionPlanId?.name ||
                          currentSubscription?.subscriptionPlanId ||
                          'Active Subscription'}
                      </p>

                      {currentSubscription?.endDate && (
                        <p className="mt-2 text-sm text-gray-600 text-center">
                          Expire On:{' '}
                          <span className="font-medium text-gray-800">
                            {formatDate(currentSubscription.endDate)}
                          </span>
                        </p>
                      )}

                      <button
                        type="button"
                        className="mt-4 w-full bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg transition"
                        onClick={openSubscriptionModal}
                      >
                        Change / Upgrade Plan
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center gap-4 mt-4 mb-4">
                      <p className="text-sm text-black">
                        Please Subscribe to Continue
                      </p>
                      <button
                        type="button"
                        className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
                        onClick={openSubscriptionModal}
                      >
                        Subscribe
                      </button>
                    </div>
                  )}
                </div>

                {/* OFFER */}
                <div className="bg-yellow-100 rounded-lg p-2.5 flex flex-col items-center gap-2">
                  <p className="font-semibold text-[13px] text-center">
                    ■ Limited Time Offer: 50% Off All Courses! ■
                  </p>
                  <p className="text-xs text-center">
                    Boost your exam prep with half off on our top-rated
                    courses. Hurry, offer ends soon!
                  </p>
                </div>

                {/* TUTORIAL BANNER */}
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

                {/* REFERRAL / HELP / AMBASSADOR */}
                <div className="flex lg:flex-col flex-wrap gap-2">
                  {isReferalButtonVisible && (
                    <div className="flex items-center justify-between gap-2 bg-gray-100 px-3 py-2 rounded-2xl">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.refferalCode || ''}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          showNotification({
                            type: 'success',
                            message: 'Copied to clipboard',
                          });
                          navigator.clipboard.writeText(
                            user?.refferalCode || ''
                          );
                        }}
                        className="p-1 hover:bg-gray-200 rounded-md transition"
                      >
                        <Icon icon="solar:copy-outline" width={16} />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    className="bg-[#3DD455] hover:bg-black text-white font-medium text-sm px-3 py-2 rounded-lg transition"
                    onClick={() => {
                      setIsReferalButtonVisible(true);
                      showNotification({
                        type: 'success',
                        message: 'Copied to clipboard',
                      });
                      navigator.clipboard.writeText(
                        user?.refferalCode || ''
                      );
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
                    type="button"
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
          </div>
        </div>
      </div>

      <NotificationDrawer
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

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