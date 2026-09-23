import { Icon } from '@iconify/react';
import { useContext, useEffect, useRef, useState } from 'react';
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

// ============================================================
// 🔤 NAME HELPERS
// ============================================================
const pickFirstNonEmptyString = (...values) => {
  for (const v of values) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
};

const resolveDisplayName = (user) => {
  if (!user) return 'User';
  const fromNames = pickFirstNonEmptyString(
    user.fullName,
    user.name,
    user.userName,
    user.username,
    user.displayName
  );
  if (fromNames) return fromNames;

  if (typeof user.email === 'string' && user.email.includes('@')) {
    const prefix = user.email.split('@')[0].trim();
    if (prefix) return prefix;
  }
  if (user.mobileNumber) return `User ${user.mobileNumber}`;
  return 'User';
};

const resolveInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (
    parts
      .slice(0, 2)
      .map((w) => (w[0] ? w[0].toUpperCase() : ''))
      .join('') || '?'
  );
};

// ============================================================
// RAZORPAY SCRIPT LOADER
// ============================================================
let razorpayScriptPromise = null;

const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[data-razorpay-checkout="true"]'
    );

    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('Razorpay checkout failed to load')),
        { once: true }
      );
      if (window.Razorpay) resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error('Razorpay checkout failed to load'));
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

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
  // SUBSCRIPTION STATE
  // =========================================================
  const initialCacheRef = useRef(getSubscriptionCache());
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    () => Boolean(initialCacheRef.current?.isActive)
  );
  const [currentSubscription, setCurrentSubscription] = useState(() =>
    initialCacheRef.current?.isActive ? initialCacheRef.current : null
  );
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const [subscriptions, setSubscriptions] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [isReferalButtonVisible, setIsReferalButtonVisible] = useState(false);

  const subscribeLockRef = useRef(false);

  // =========================================================
  // DERIVED
  // =========================================================
  const isSubscribed = subscriptionStatus || user?.isSubscribed;
  const displayName = resolveDisplayName(user);
  const initials = resolveInitials(displayName);

  const userSignature = user
    ? `${user._id || user.id || ''}|${user.semester || ''}|${
        user.semesterId || ''
      }`
    : '';

  // =========================================================
  // RESOLVE SEMESTER
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
      /* ignore */
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
        semesterId,
      },
      setIsLoading,
      onSuccess: (res) => setCourses(res?.data || []),
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
        semesterId: resolveSemester(),
      },
      setIsLoading,
      onSuccess: (res) => setCoursePercentage(res?.data || []),
      onError: (err) => {
        console.error('Failed to fetch course percentage:', err);
      },
    });
  };

  // =========================================================
  // FETCH BANNERS
  // =========================================================
  const fetchBanners = () => {
    let params;
    if (user?.firstVideoBanner) params = { position: 'MID' };
    else if (user?.secondVideoBanner) params = { position: 'BOTTOM' };
    else params = { position: 'TOP' };

    userApi.landingPage.getTopBanner({
      params,
      onSuccess: (data) => setBanners(data?.data || data || []),
      onError: () => setBanners([]),
    });
  };

  // =========================================================
  // FETCH COUPONS
  // =========================================================
  const fetchCoupons = () => {
    userApi.subscriptions.coupons.getAll({
      onSuccess: (res) => setAllCoupons(res?.data || []),
      onError: (err) => {
        console.error('Failed to fetch coupons:', err);
        setAllCoupons([]);
      },
    });
  };

  // =========================================================
  // FETCH CURRENT SUBSCRIPTION
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
          console.warn('Failed to fetch subscription:', err?.message);
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
  // FETCH ALL PLANS
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
  // EFFECTS
  // =========================================================
  useEffect(() => {
    if (!userSignature) return;
    fetchCourses();
    fetchCoursePercentage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, userSignature]);

  useEffect(() => {
    if (!userSignature) return;
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSignature]);

  useEffect(() => {
    const shouldShow = Boolean(props?.showModalPopUp);
    setModalVisible(shouldShow);
    if (shouldShow) {
      fetchSubscriptionPlans();
      fetchSubScription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.showModalPopUp]);

  useEffect(() => {
    if (modalVisible) fetchSubScription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

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

  useEffect(() => {
    const onFocus = () => {
      if (userSignature) fetchSubScription();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSignature]);

  // Preload Razorpay SDK
  useEffect(() => {
    loadRazorpayScript().catch(() => {});
  }, []);

  // =========================================================
  // HELPERS
  // =========================================================
  const refreshSubscriptionData = async () => {
    try {
      await Promise.all([fetchSubScription(), fetchSubscriptionPlans()]);
    } catch (error) {
      console.error('Failed to refresh subscription data:', error);
    }
  };

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

  const updateUserBanner = async () => {
    userApi.landingPage.updateBannerStatus({
      data: {
        goalCategory: user?.goalCategory || '',
        goal: user?.goal || '',
        semester: resolveSemester() || '',
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

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

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
  // OPEN RAZORPAY CHECKOUT (uses order data from backend)
  // =========================================================
  const openRazorpayCheckout = ({
    razorpayOrderId,
    amount,
    onSuccess,
    onFailure,
    onCancel,
  }) => {
    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      showNotification({
        type: 'error',
        message:
          'Payment is not configured. Please contact support@semprep.com.',
      });
      onFailure?.(new Error('Razorpay key missing'));
      return;
    }

    const options = {
      key: razorpayKey,
      amount: Math.round(Number(amount) * 100), // paise
      currency: 'INR',
      order_id: razorpayOrderId,
      name: 'Semprep',
      description: 'Semester Subscription',
      prefill: {
        name: user?.fullName || user?.name || '',
        email: user?.email || '',
        contact: user?.mobileNumber || '',
      },
      theme: { color: '#3DD455' },

      handler: function (response) {
        // Payment success → notify caller
        onSuccess?.({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      },

      modal: {
        ondismiss: function () {
          onCancel?.();
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      showNotification({
        type: 'error',
        message:
          response?.error?.description ||
          response?.error?.reason ||
          'Payment failed.',
      });
      onFailure?.(response);
    });

    rzp.open();
  };

  // =========================================================
  // HANDLE SUBSCRIBE
  // =========================================================
  const handleSubscribe = (sub) => {
    if (!sub?._id) {
      showNotification({ type: 'error', message: 'Invalid subscription plan' });
      return;
    }

    if (subscribeLockRef.current || loadingPlanId) return;
    subscribeLockRef.current = true;
    setLoadingPlanId(sub._id);

    const originalPrice = Number(sub?.originalPrice || 0);
    const discountPrice = Number(sub?.discountPrice ?? originalPrice);
    const planPrice = sub?.discountActive ? discountPrice : originalPrice;
    const finalPlanPrice = Number.isFinite(planPrice) ? planPrice : 0;
    const isFree = finalPlanPrice <= 0;

    const releaseLock = () => {
      subscribeLockRef.current = false;
      setLoadingPlanId(null);
    };

    // ---------- STEP 1: Create subscription on backend ----------
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
          releaseLock();
          showNotification({
            type: 'error',
            message: 'Subscription could not be created',
          });
          return;
        }

        // Extract order info if backend returned any
        const razorpayOrderId =
          subscriptionData?.razorpayOrderId ||
          subscriptionData?.order_id ||
          subscriptionData?.orderId ||
          subscriptionData?.razorpay_order_id;

        const amountToPay = Number(
          subscriptionData?.finalPrice ?? finalPlanPrice
        );

        // =====================================================
        // FREE PATH — no payment needed
        // =====================================================
        if (amountToPay <= 0) {
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
              releaseLock();
              if (props?.handleClose) props.handleClose();

              showNotification({
                type: 'success',
                message: 'Subscription activated successfully',
              });

              refreshSubscriptionData();
            },
            onError: async (error) => {
              console.error('Free subscription update failed:', error);
              const latest = await fetchSubScription();
              if (latest?.isActive) {
                setSubscriptionStatus(true);
                setUser((prev) => ({ ...prev, isSubscribed: true }));
              }
              setModalVisible(false);
              releaseLock();
              showNotification({
                type: 'success',
                message: 'Subscription activated successfully',
              });
            },
          });

          return;
        }

        // =====================================================
        // PAID PATH
        // =====================================================

        // If backend returned an order ID → open Razorpay directly
        if (razorpayOrderId) {
          console.log('[PAYMENT] Using order from create response:', razorpayOrderId);

          openRazorpayCheckout({
            razorpayOrderId,
            amount: amountToPay,

            onSuccess: (paymentResponse) => {
              userApi.subscriptions.update({
                id: subscriptionId,
                showMsg: false,
                data: {
                  paymentMode: 'upi',
                  paymentStatus: 'completed',
                  transactionId: paymentResponse.razorpay_payment_id,
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
                    releaseLock();
                    if (props?.handleClose) props.handleClose();

                    showNotification({
                      type: 'success',
                      message:
                        'Payment successful and subscription activated',
                    });

                    refreshSubscriptionData();
                  } else {
                    releaseLock();
                    showNotification({
                      type: 'error',
                      message:
                        'Payment succeeded but activation failed. Please contact support.',
                    });
                  }
                },
                onError: () => {
                  releaseLock();
                  showNotification({
                    type: 'error',
                    message:
                      'Payment succeeded but activation failed. Please contact support.',
                  });
                },
              });
            },

            onFailure: () => releaseLock(),

            onCancel: () => {
              releaseLock();
              showNotification({ type: 'error', message: 'Payment cancelled' });
            },
          });

          return;
        }

        // No order ID → backend doesn't support self-serve paid plans yet
        releaseLock();
        showNotification({
          type: 'error',
          message:
            'Online payment is temporarily unavailable. Please contact support@semprep.com to activate your subscription.',
        });
      },

      onError: (error) => {
        console.error('Subscription creation failed:', error);
        releaseLock();
        showNotification({
          type: 'error',
          message: error?.message || 'Unable to create subscription',
        });
      },
    });
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

                        {sub?.discountActive &&
                          originalPrice !== finalPrice && (
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
                            fetchPriority={idx < 3 ? 'high' : 'auto'}
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
                        {initials}
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