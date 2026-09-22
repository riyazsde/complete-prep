import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { triggerRazorpay } from '../../../components/ThirdParty/RazorpayCheckout';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';

const SkillsPage2 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '' } = user || {};
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchCourses();
    }
  }, [isAuthenticated, goal]);

  const fetchCourses = () => {
    userApi.skills.getAll({
      params: {
        page: 1,
        limit: 999,
      },
      setIsLoading,
      onSuccess: res => {
        setCourses(res?.data || []);
      },
      onError: err => {
        console.error('Failed to fetch courses:', err);
      },
    });
  };
  const fetchCourseSubjectsByCourseId = courseId => {
    userApi.courses.getById({
      params: { courseCategoryId: courseId },
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
      onError: err => {
        showNotification({
          type: 'error',
          message: 'No subjects found for this course',
        });
      },
    });
  };

  const handleSkillPayment = async course => {
    setButtonLoading(true);

    triggerRazorpay({
      amount: course?.price || 0,
      name: user?.fullName || 'User',
      email: user?.email || 'email@example.com',
      contact: user?.mobileNumber || '0000000000',
      onSuccess: paymentRes => {
        userApi.cart.addToCart({
          data: {
            skills: [course?._id],
          },
          onSuccess: () => {
            userApi.cart.checkOut({
              onSuccess: checkoutRes => {
                userApi.cart.placeOrder({
                  id: checkoutRes?.data?.orderId,
                  data: {
                    paymentMode: 'RAZORPAY',
                    transactionId:
                      paymentRes?.razorpay_payment_id || paymentRes?.payload?.payment?.id,
                    paymentStatus: 'completed',
                  },
                  onSuccess: () => {
                    setButtonLoading(false);
                    navigate(`/user/skill/${course?._id}`);
                  },
                  onError: err => {
                    console.error('Order placement failed:', err);
                    setButtonLoading(false);
                    showNotification({
                      type: 'error',
                      message: 'Payment succeeded but order placement failed. Please contact support.',
                    });
                  },
                });
              },
              onError: err => {
                console.error('Checkout failed:', err);
                setButtonLoading(false);
                showNotification({
                  type: 'error',
                  message: 'Checkout failed. Please try again.',
                });
              },
            });
          },
          onError: err => {
            console.error('Add to cart failed:', err);
            setButtonLoading(false);
            showNotification({
              type: 'error',
              message: 'Unable to add course to cart. Please try again.',
            });
          },
        });
      },
      onFailure: err => {
        console.error('Payment failed:', err);
        setButtonLoading(false);
        showNotification({
          type: 'error',
          message: 'Payment failed. Please try again.',
        });
      },
      onCancel: () => {
        setButtonLoading(false);
      },
    });
  };

  return (
    <div className="user_container">
      <div>
        <div className="user_container_width">
          <UserMenuBar />
        </div>
        <div className="p-6 bg-white rounded-sm">
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg">
              {courses?.map(course => (
                <div
                  key={course._id}
                  className="bg-[#efefef] md:rounded-xl rounded-lg overflow-hidden hover:shadow-lg transition duration-300 flex flex-col border border-[#efefef]"
                >
                  <div className="w-full aspect-[1/1.2]">
                    <img
                      src={course?.locale}
                      alt={course?.name}
                      className="w-full h-full object-cover md:rounded-t-xl rounded-t-lg"
                    />
                  </div>

                  <div className="flex flex-col gap-1 p-3 flex-1 bg-[#efefef]">
                    <p className="font-semibold text-lg text-gray-800 line-clamp-2">
                      {course?.name}
                    </p>

                    <p className="text-sm text-gray-600 line-clamp-2">{course?.desc}</p>

                    <div className="mt-auto flex flex-col gap-3">
                      <p className="text-xl font-bold text-green-600">₹{course?.price || 0}</p>

                      <button
                        onClick={() => {
                          if (course?.isPurchased) {
                            navigate(
                              `/user/skill/${course?._id}/${course?.subjects?.[0]?.subject?._id}`
                            );
                            return;
                          }
                          handleSkillPayment(course);
                        }}
                        disabled={buttonLoading}
                        className={`w-full py-2 mt-1 font-bold ${
                          course?.isPurchased ? 'bg-[#3DD455]' : 'bg-[#3DD455]'
                        } hover:bg-black text-white rounded-lg ${buttonLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {buttonLoading ? 'Processing...' : course?.isPurchased ? 'Start' : 'Unlock Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {courses.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center mt-10">
              No skill courses available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(SkillsPage2);
