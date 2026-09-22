import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReusableModal } from '../../components/common/ComPrepComponent/ComPrepComponent';
import { userApi } from '../../services/apiFunctions';
import images from '../../utils/images';
import { useForm } from 'react-hook-form';
import { ProfileEditFormMain } from '../../components/common/New-Components/NewComponent';
import { AuthContext } from '../../Context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { showNotification } from '../../services/exportComponents';

<Helmet>
  <title>Semprep Pricing | Affordable Study Plans for Students</title>

  <meta name="description" content="Choose a Semprep plan that fits your preparation needs." />
</Helmet>;

const subScriptionsStatic = [
  {
    _id: 'free',
    name: 'Free',
    price: 0,
    discount: null,
    features: [
      { name: 'Community Access' },
      { name: 'Upskilling Courses' },
      { name: 'Placement Support' },
    ],
  },
  {
    _id: '698ec78d940c8e91c25dda33',
    name: 'Pro',
    price: 299,
    discount: null,
    features: [
      { name: 'Everything in free and:' },
      { name: 'Visual Concepts' },
      { name: 'Prepo AI' },
      { name: 'Notes (Coming Soon)' },
      { name: 'PYQs Solution Videos (Coming Soon)' },
    ],
  },
];

const courseData = {
  CBSE: {
    'CBSE CLASS 12': [
      'Applied Mathematics Class 12',
      'Biology Class 12',
      'Physics Class 12',
      'History Class 12',
      'Sociology Class 12',
      'English Core Class 12',
      'Chemistry Class 12',
    ],
    'CBSE CLASS 11': [
      'Applied Mathematics Class 11',
      'Biology Class 11',
      'Physics Class 11',
      'History Class 11',
      'Sociology Class 11',
      'English Core Class 11',
      'Chemistry Class 11',
    ],
    'CBSE CLASS 10': [
      'Mathematics Class 10',
      'Biology Class 10',
      'Physics Class 10',
      'History Class 10',
      'Science Class 10',
      'English Class 10',
      'Hindi Class 10',
    ],
    'CBSE CLASS 9': [
      'Mathematics Class 9',
      'Biology Class 9',
      'Physics Class 9',
      'History Class 9',
      'Science Class 9',
      'English Class 9',
      'Hindi Class 9',
    ],
  },
  JEE: {
    'JEE MAINS': ['Physics', 'Chemistry', 'Maths'],
    'JEE ADVANCED': ['Physics Advanced', 'Chemistry Advanced', 'Maths Advanced'],
  },
  NEET: {
    Biology: ['Zoology', 'Botany'],
    'Physics & Chemistry': ['NEET Physics', 'NEET Chemistry'],
  },
  'Govt. Exam': {
    SSC: ['Math', 'Reasoning', 'English'],
    UPSC: ['GS', 'CSAT', 'Essay'],
  },
  'UG & PG': {
    BSc: ['Maths', 'Physics', 'Comp Sci'],
    MSc: ['Physics', 'Data Science'],
  },
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    billingFrequency: 'per user/month, billed annually',
    features: {
      workspace: {
        seats: 'Up to 3',
        objects: 'Up to 3',
      },
      automations: {
        credits: '200',
      },
      emailAndCalendar: {
        sync: '1 account per user',
        sharing: 'Individual metadata',
        sendsAmount: '500 sends per month',
        bulkEmailSending: '10 sends at a time',
        removeEmailWatermark: false,
      },
      reporting: {
        reports: '3 reports',
        insightReports: false,
        salesReports: false,
        activityReports: false,
        emailReports: false,
      },
      dataModel: {
        accessPermissions: 'Fully visible',
      },
      admin: {
        paymentInvoice: false,
        sso: false,
      },
      support: {
        helpCenter: true,
        chatAndEmail: true,
        prioritySupport: false,
        migrationAssistance: false,
      },
    },
  },
  {
    name: 'Basic',
    price: '$39',
    discount: '15%',
    billingFrequency: 'per user/month, billed annually',
    features: {
      workspace: {
        seats: 'Unlimited',
        objects: 'Up to 8',
      },
      automations: {
        credits: '2000',
      },
      emailAndCalendar: {
        sync: '2 account per user',
        sharing: 'Individual attachments',
        sendsAmount: '1000 sends per month',
        bulkEmailSending: '20 sends at a time',
        removeEmailWatermark: true,
      },
      reporting: {
        reports: '20 reports',
        insightReports: true,
        salesReports: true,
        activityReports: false,
        emailReports: false,
      },
      dataModel: {
        accessPermissions: 'Private',
      },
      admin: {
        paymentInvoice: true,
        sso: false,
      },
      support: {
        helpCenter: true,
        chatAndEmail: true,
        prioritySupport: true,
        migrationAssistance: false,
      },
    },
  },
  {
    name: 'Pro',
    price: '$59',
    discount: '19%',
    billingFrequency: 'per user/month, billed annually',
    features: {
      workspace: {
        seats: 'Unlimited',
        objects: 'Up to 12',
      },
      automations: {
        credits: '4000',
      },
      emailAndCalendar: {
        sync: '4 account per user',
        sharing: 'Specific contacts',
        sendsAmount: 'Unlimited',
        bulkEmailSending: '50 sends at a time',
        removeEmailWatermark: true,
      },
      reporting: {
        reports: '100 reports',
        insightReports: true,
        salesReports: true,
        activityReports: true,
        emailReports: true,
      },
      dataModel: {
        accessPermissions: 'Advanced',
      },
      admin: {
        paymentInvoice: true,
        sso: true,
      },
      support: {
        helpCenter: true,
        chatAndEmail: true,
        prioritySupport: true,
        migrationAssistance: true,
      },
    },
  },
];

const ProfileEditForm = ({ closeModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('login');
  const navigate = useNavigate();

  const onSubmitLogin = async data => {
    localStorage.clear();

    userApi.auth.login({
      data: {
        email: data.email,
        password: data.password,
      },
      onSuccess: ({ data }) => {
        localStorage.setItem('authToken', data.token);

        if (!data.token) return;

        if (data.isSubscribed) {
          navigate('/user/home');
        } else {
          navigate('/choose-curriculum');
        }
      },
    });
  };

  const onSubmitForgot = data => {
    console.log(data);
    setStep('confirmation');
  };
  const onSubmitRegister = data => {
    localStorage.clear();
    userApi.auth.registerUser({
      data: data,
      showMsg: true,
      onSuccess: res => {
        console.log(res);
        userApi.auth.login({
          data: { email: data.email, password: data.password },
          onSuccess: res => {
            localStorage.setItem('authToken', res?.data?.token);
            const savedToken = localStorage.getItem('authToken');
            {
              savedToken && navigate('/choose-curriculum');
            }
          },
        });
      },
    });
  };

  return (
    <div
      className="bg-cover"
      // style={{
      //   backgroundImage: `url(${images.newHomePageLoginModalImage2})`,
      //   backgroundSize: "cover",
      // }}
    >
      <div className="p-5">
        <p className="flex justify-end">
          <Icon icon="material-symbols:close" className="cursor-pointer" onClick={closeModal} />
        </p>
        <div className="mx-auto sm:w-full md:w-80">
          <p className="text-center">
            <img
              src={images.newHomePageLoginModalImage}
              className="w-[70px] h-[70px] mx-auto"
              alt="logo"
            />
          </p>

          {step === 'login' && (
            <>
              <h2 className="text-2xl font-semibold text-center text-green-600">Log in</h2>
              <p className="text-sm text-center">
                No account yet?{' '}
                <button onClick={() => setStep('register')} className="text-blue-500 underline">
                  Register
                </button>
              </p>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmitLogin)}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs italic text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    className="w-full px-3 py-2 pr-10 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-xs italic text-red-500">{errors.password.message}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-[36px] text-gray-500"
                  >
                    <Icon
                      icon={showPassword ? 'basil:eye-closed-solid' : 'basil:eye-solid'}
                      size={18}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 font-semibold text-black transition bg-yellow-300 rounded-md hover:bg-yellow-400"
                >
                  Log in
                </button>
              </form>

              {/* <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm text-gray-500">
                    <span className="px-2 bg-white">or</span>
                  </div>
                </div>

                <button className="w-full bg-[#3b5998] text-white font-semibold py-2 rounded-md mb-2">
                  Log in with Facebook
                </button>
                <button className="w-full bg-[#4285F4] text-white font-semibold py-2 rounded-md">
                  Log in with Google
                </button> */}
            </>
          )}
          {step === 'register' && (
            <>
              <h2 className="text-2xl font-semibold text-center text-green-600">Register</h2>
              <p className="text-sm text-center">
                Already have an account?{' '}
                <button onClick={() => setStep('login')} className="text-blue-500 underline">
                  Log in
                </button>
              </p>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmitRegister)}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    {...register('fullName', {
                      required: 'Full name is required',
                    })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-xs italic text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input
                    type="tel"
                    {...register('mobileNumber', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Enter a valid 10-digit number',
                      },
                    })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="9876543210"
                  />
                  {errors.mobileNumber && (
                    <p className="text-xs italic text-red-500">{errors.mobileNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs italic text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    How did you hear about us?
                  </label>
                  <select
                    {...register('hearAboutUs', {
                      required: 'This field is required',
                    })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="">Select an option</option>
                    <option value="FaceBook">Facebook</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Websites">Websites</option>
                  </select>
                  {errors.hearAboutUs && (
                    <p className="text-xs italic text-red-500">{errors.hearAboutUs.message}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="w-full px-3 py-2 pr-10 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-xs italic text-red-500">{errors.password.message}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-[36px] text-gray-500"
                  >
                    <Icon
                      icon={showPassword ? 'basil:eye-closed-solid' : 'basil:eye-solid'}
                      size={18}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 font-semibold text-black transition bg-yellow-300 rounded-md hover:bg-yellow-400"
                >
                  Register
                </button>
              </form>
            </>
          )}

          {step === 'forgot' && (
            <>
              <h2 className="text-xl font-semibold text-center text-green-600">
                Forgot your password?
              </h2>
              <form onSubmit={handleSubmit(onSubmitForgot)} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs italic text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-2 font-semibold text-black transition bg-yellow-300 rounded-md hover:bg-yellow-400"
                >
                  Reset
                </button>
              </form>
              <p className="mt-4 text-center">
                <span
                  className="text-sm text-blue-600 underline cursor-pointer"
                  onClick={() => setStep('login')}
                >
                  Return to the login page
                </span>
              </p>
            </>
          )}

          {step === 'confirmation' && (
            <div className="text-center">
              <h2 className="mt-4 text-xl font-semibold text-green-600">
                We have sent you a message.
              </h2>
              <p className="text-green-700">Go to the mail</p>
              <p className="mt-4">
                <span
                  className="text-sm text-blue-600 underline cursor-pointer"
                  onClick={() => setStep('login')}
                >
                  Return to the login page
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const categories = Object.keys(courseData);

const PricingPage = () => {
  const [billingType, setBillingType] = useState('annually');
  if (!['monthly', 'annually'].includes(billingType)) {
    setBillingType('annually');
  }
  const [currentState, setCurrentState] = useState(null);
  const [activeCategory, setActiveCategory] = useState('CBSE');
  const [modalVisible, setModalVisible] = useState(false);
  const [subScriptions, setSubScriptions] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [goalCategory, setGoalCategory] = useState([]);
  const [goal, setGoal] = useState([]);
  const [selectedGoalCategory, setSelectedGoalCategory] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [selectedCoupons, setSelectedCoupons] = useState('');

  const { user, setUser, logout, isAuthenticated } = useContext(AuthContext);
  const [nextPage, setNextPage] = useState('');
  const fetchFaqs = async () => {
    userApi.faq.getAll({
      onSuccess: data => setFaqs(data?.data || []),
    });
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    fetchSubScriptions();
  }, []);
  const fetchGoalCategory = async () => {
    userApi.goalCategory.getAll({
      onSuccess: data => setGoalCategory(data?.data || []),
    });
  };
  useEffect(() => {
    fetchGoalCategory();
  }, []);

  const fetchGoal = async () => {
    userApi.subjects.getByGoalCategory({
      params: { goalCategory: selectedGoalCategory },
      onSuccess: data => setGoal(data?.data || []),
    });
  };
  useEffect(() => {
    fetchGoal();
  }, [selectedGoalCategory]);

  const fetchSubScriptions = async () => {
    userApi.subscription.getAll({
      onSuccess: res => setSubScriptions(res?.data),
    });
  };

  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);
  const toggleDropdown = state => {
    setCurrentState(currentState === state ? null : state);
  };

  const PricingCard = ({
    title,
    price,
    savings,
    features,
    isPro = false,
    discount,
    onBtnClick,
  }) => {
    return (
      <div
        className={`flex flex-col p-6 rounded-lg border w-full h-full ${
          isPro ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <h2 className="text-2xl font-bold text-left">{title}</h2>
        <div className="my-4 text-left">
          {/* <div className="text-3xl font-bold">
            ₹ {price}{' '}
            {discount > 0 && (
              <span className="text-sm text-white bg-gray-500 rounded px-2 py-1 ml-2">
                -{discount}%
              </span>
            )}
          </div> */}
          {/* <div className="text-sm text-gray-500">{savings}</div> */}
        </div>
        <ul className="mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <button
          onClick={onBtnClick}
          className={`mt-auto w-full py-2 rounded cursor-pointer ${
            isPro ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Get Started
        </button>
      </div>
    );
  };

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
      const orderResponse = await fetch(`https://api.semprep.com/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.max(100, Math.round(amount * 100)),
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

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
            const verifyResponse = await fetch(`https://api.semprep.com/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

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
              navigate('/choose-curriculum', { state: { nextPage } });
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
          message: response?.error?.description || 'Payment failed',
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

  const handleSubscribe = () => {
    const sub = selectedPlan;
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
  return (
    <>
      {' '}
      <ReusableModal
        size="md"
        body={
          <ProfileEditFormMain
            nextPage={nextPage}
            closeModal={() => setModalVisible(false)}
            setUser={setUser}
            seletedStep={'register'}
            onRegister={handleSubscribe}
          />
        }
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        footer={false}
        header={false}
      />
      <div className="h-full mainMaxWidth">
        <Header />
        <div className="md:my-16 my-24 md:px-6 px-3">
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-center text-4xl font-bold text-black">
                Semprep pricing plan for your startup
              </h2>
              <p className="text-center text-gray-500 mt-2 text-sm md:text-base max-w-xl mx-auto">
                Perfectly tailored for every stage of your growth. Get started today, no credit card
                needed.
              </p>
            </motion.div>
            <div className="">
              {/* <div className="flex justify-center mt-5 mb-5">
                <div className="flex justify-center mt-5">
                  <div className="inline-flex border border-gray-300 rounded-lg p-1 bg-gray-100">
                    <button
                      onClick={() => setBillingType('monthly')}
                      className={`px-4 py-2 rounded-lg font-bold transition ${
                        billingType === 'monthly' ? 'bg-white text-black shadow' : 'text-gray-600'
                      }`}
                    >
                      Billed Monthly
                    </button>

                    <button
                      onClick={() => setBillingType('annually')}
                      className={`px-4 py-2 rounded-lg font-bold transition ${
                        billingType === 'annually' ? 'bg-white text-black shadow' : 'text-gray-600'
                      }`}
                    >
                      Billed Annually
                    </button>
                  </div>
                </div>
              </div> */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto max-w-[767px] mt-5">
                  {subScriptionsStatic.map((plan, index) => {
                    const yearlyPrice = Number(plan.price) || 0;
                    const monthlyPrice = Math.round(yearlyPrice / 12);

                    return (
                      <motion.div
                        key={plan._id ?? index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <PricingCard
                          {...plan}
                          title={plan.name}
                          price={billingType === 'monthly' ? monthlyPrice : yearlyPrice}
                          features={plan.features.map(f => f.name)}
                          isPro={plan.name === 'Pro'}
                          discount={plan.discount}
                          onBtnClick={() => {
                            if (plan._id === 'free') {
                              setModalVisible(true);
                              return;
                            }
                            setSelectedPlan(prev => plan);
                            setModalVisible(true);

                            // handleSubscribe(plan)
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="md:my-16 my-24">
                {/* <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="overflow-auto"
                >
                  <table className="w-full table-fixed border border-gray-200 rounded-lg overflow-hidden min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="w-[250px] text-left p-3">Feature</th>
                        {plans.map(plan => (
                          <th key={plan.name} className="text-center p-3">
                            {plan.name}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="bg-gray-100 font-semibold">
                        <td colSpan={plans.length + 1} className="p-3">
                          Workspace
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Number of seats</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.workspace.seats}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Number of objects</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.workspace.objects}
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-gray-100 font-semibold">
                        <td colSpan={plans.length + 1} className="p-3">
                          Automations
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Number of credits</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.automations.credits}
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-gray-100 font-semibold">
                        <td colSpan={plans.length + 1} className="p-3">
                          Email and Calendar
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Email and calendar sync</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.emailAndCalendar.sync}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Email sharing</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.emailAndCalendar.sharing}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Email sends amount</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.emailAndCalendar.sendsAmount}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Bulk email sending</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.emailAndCalendar.bulkEmailSending}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Remove email watermark</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.emailAndCalendar.removeEmailWatermark ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-gray-100 font-semibold">
                        <td colSpan={plans.length + 1} className="p-3">
                          Reporting
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Number of reports</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.reporting.reports}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Insight Reports</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.reporting.insightReports ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Sales Reports</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.reporting.salesReports ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Activity Reports</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.reporting.activityReports ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Email Reports</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.reporting.emailReports ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-gray-100 font-semibold">
                        <td colSpan={plans.length + 1} className="p-3">
                          Data Model
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Access permissions</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.dataModel.accessPermissions}
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-gray-100 font-semibold">
                        <td colSpan={plans.length + 1} className="p-3">
                          Admin
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Payment invoice</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.admin.paymentInvoice ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">SAML (SSO)</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.admin.sso ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-gray-100 font-semibold">
                        <td colSpan={plans.length + 1} className="p-3">
                          Support
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Help Center</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.support.helpCenter ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Chat and Email Support</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.support.chatAndEmail ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Priority Support</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.support.prioritySupport ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-t">
                        <td className="p-3">Migration Assistance</td>
                        {plans.map(plan => (
                          <td key={plan.name} className="text-center p-3">
                            {plan.features.support.migrationAssistance ? '✔' : '✖'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </motion.div> */}

                {/* <div className="flex flex-col md:flex-row gap-8 md:mt-24 mt-16">
                  <div>
                    <div className="flex flex-col md:flex-row gap-8">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="space-y-4 flex items-center flex-wrap justify-between gap-3 mb-8"
                      >
                        <div>
                          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                          <p className="text-gray-600">
                            Still have any questions? Contact our Team via <br />
                                 <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=support@semprep.com"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline"
>
  support@semprep.com
</a>
                          </p>
                        </div>
                        <button
                          onClick={() => navigate('/faqs')}
                          className="border border-gray-300 rounded-lg px-4 py-2"
                        >
                          See All FAQ’s
                        </button>
                      </motion.div>

                      <div className="space-y-4">
                        {faqs?.map((faq, index) => {
                          const isOpen = openIndex === index;
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.05 }}
                              viewport={{ once: true }}
                              className="rounded-lg p-3 border bg-white"
                            >
                              <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                              >
                                <h3 className="font-medium text-gray-900 text-base md:text-lg">
                                  {faq.question}
                                </h3>
                                <div className="p-1 rounded text-gray-600">
                                  {isOpen ? (
                                    <Icon icon="line-md:minus" size={18} />
                                  ) : (
                                    <Icon icon="akar-icons:plus" size={18} />
                                  )}
                                </div>
                              </div>

                              {isOpen && faq.answer && (
                                <div className="mt-4 text-gray-700 space-y-3 text-sm md:text-base leading-relaxed">
                                  <p>{faq.answer}</p>

                                  {faq?.link && (
                                    <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 cursor-pointer text-blue-600 text-sm font-medium">
                                      <span className="truncate">{faq.link}</span>
                                      <Icon icon="si:arrow-right-duotone" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PricingPage;
