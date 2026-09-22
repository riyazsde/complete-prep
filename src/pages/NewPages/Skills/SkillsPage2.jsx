import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { triggerRazorpay } from '../../../components/ThirdParty/RazorpayCheckout';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';

const SkillsPage2 = () => {
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } =
    useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  // =========================================================
  // FETCH SKILLS
  // =========================================================

  const fetchCourses = () => {
    setIsLoading(true);

    userApi.skills.getAll({
      params: {
        page: 1,
        limit: 999,
      },

      onSuccess: response => {
        console.log('SKILLS API RESPONSE:', response);

        const skills = Array.isArray(response?.data)
          ? response.data
          : [];

        console.log('SKILLS DATA:', skills);

        setCourses(skills);
        setIsLoading(false);
      },

      onError: error => {
        console.error('Failed to fetch skills:', error);

        setCourses([]);
        setIsLoading(false);

        showNotification({
          type: 'error',
          message: 'Failed to load skills. Please try again.',
        });
      },
    });
  };

  // =========================================================
  // AUTH
  // =========================================================

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
      return;
    }

    fetchCourses();
  }, [isAuthenticated]);

  // =========================================================
  // CATEGORY LIST
  // =========================================================

  const categories = useMemo(() => {
    const values = courses
      .map(course => course?.goalCategory?.name)
      .filter(Boolean);

    return ['All', ...new Set(values)];
  }, [courses]);

  // =========================================================
  // MY COURSES
  // =========================================================

  const myCourses = useMemo(() => {
    return courses.filter(
      course => course?.isPurchased === true
    );
  }, [courses]);

  // =========================================================
  // EXPLORE COURSES
  // =========================================================

  const exploreCourses = useMemo(() => {
    let result = [...courses];

    // SEARCH
    if (searchTerm.trim()) {
      const search = searchTerm
        .trim()
        .toLowerCase();

      result = result.filter(course => {
        const name =
          course?.name?.toLowerCase() || '';

        const highlights =
          course?.courseHighlights?.toLowerCase() || '';

        const categoryName =
          course?.goalCategory?.name?.toLowerCase() || '';

        const goal =
          course?.goal?.name?.toLowerCase() || '';

        const subject =
          course?.subjects?.[0]?.subject?.name?.toLowerCase() ||
          '';

        return (
          name.includes(search) ||
          highlights.includes(search) ||
          categoryName.includes(search) ||
          goal.includes(search) ||
          subject.includes(search)
        );
      });
    }

    // CATEGORY
    if (category !== 'All') {
      result = result.filter(
        course =>
          course?.goalCategory?.name === category
      );
    }

    // SORT
    if (sortBy === 'Popular') {
      result.sort(
        (a, b) =>
          Number(b?.numberOfCourses || 0) -
          Number(a?.numberOfCourses || 0)
      );
    }

    if (sortBy === 'Price: Low to High') {
      result.sort(
        (a, b) =>
          Number(a?.price || 0) -
          Number(b?.price || 0)
      );
    }

    if (sortBy === 'Price: High to Low') {
      result.sort(
        (a, b) =>
          Number(b?.price || 0) -
          Number(a?.price || 0)
      );
    }

    return result;
  }, [
    courses,
    searchTerm,
    category,
    sortBy,
  ]);

  // =========================================================
  // START COURSE
  // =========================================================

  const handleStartSkill = course => {
    if (!course?._id) {
      showNotification({
        type: 'error',
        message: 'Invalid skill course.',
      });

      return;
    }

    const subjectId =
      course?.subjects?.[0]?.subject?._id;

    if (subjectId) {
      navigate(
        `/user/skill/${course._id}/${subjectId}`
      );
    } else {
      navigate(`/user/skill/${course._id}`);
    }
  };

  // =========================================================
  // PAYMENT
  // =========================================================

  const handleSkillPayment = course => {
    if (!course?._id) {
      showNotification({
        type: 'error',
        message: 'Invalid skill course.',
      });

      return;
    }

    if (
      !course?.price ||
      Number(course.price) <= 0
    ) {
      showNotification({
        type: 'error',
        message: 'Invalid course price.',
      });

      return;
    }

    setButtonLoading(true);

    triggerRazorpay({
      amount: Number(course.price),

      name: user?.fullName || 'User',

      email:
        user?.email || 'email@example.com',

      contact:
        user?.mobileNumber || '0000000000',

      onSuccess: paymentRes => {
        console.log(
          'RAZORPAY SUCCESS:',
          paymentRes
        );

        const transactionId =
          paymentRes?.razorpay_payment_id ||
          paymentRes?.payload?.payment?.id ||
          paymentRes?.payment?.id;

        if (!transactionId) {
          setButtonLoading(false);

          showNotification({
            type: 'error',
            message:
              'Payment ID was not received. Please contact support.',
          });

          return;
        }

        userApi.cart.addToCart({
          data: {
            skills: [course._id],
          },

          onSuccess: cartResponse => {
            console.log(
              'ADD TO CART RESPONSE:',
              cartResponse
            );

            userApi.cart.checkOut({
              onSuccess: checkoutResponse => {
                console.log(
                  'CHECKOUT RESPONSE:',
                  checkoutResponse
                );

                const orderId =
                  checkoutResponse?.data?.orderId ||
                  checkoutResponse?.data?._id;

                if (!orderId) {
                  setButtonLoading(false);

                  showNotification({
                    type: 'error',
                    message:
                      'Checkout completed but order ID was not received.',
                  });

                  return;
                }

                userApi.cart.placeOrder({
                  id: orderId,

                  data: {
                    paymentMode: 'RAZORPAY',
                    transactionId,
                    paymentStatus: 'completed',
                  },

                  onSuccess: orderResponse => {
                    console.log(
                      'ORDER PLACED:',
                      orderResponse
                    );

                    setButtonLoading(false);

                    showNotification({
                      type: 'success',
                      message:
                        'Skill purchased successfully.',
                    });

                    fetchCourses();

                    handleStartSkill(course);
                  },

                  onError: error => {
                    console.error(
                      'Order placement failed:',
                      error
                    );

                    setButtonLoading(false);

                    showNotification({
                      type: 'error',
                      message:
                        'Payment succeeded but order placement failed. Please contact support.',
                    });
                  },
                });
              },

              onError: error => {
                console.error(
                  'Checkout failed:',
                  error
                );

                setButtonLoading(false);

                showNotification({
                  type: 'error',
                  message:
                    'Checkout failed. Please try again.',
                });
              },
            });
          },

          onError: error => {
            console.error(
              'Add to cart failed:',
              error
            );

            setButtonLoading(false);

            showNotification({
              type: 'error',
              message:
                'Unable to add course to cart. Please try again.',
            });
          },
        });
      },

      onFailure: error => {
        console.error(
          'Payment failed:',
          error
        );

        setButtonLoading(false);

        showNotification({
          type: 'error',
          message:
            'Payment failed. Please try again.',
        });
      },

      onCancel: () => {
        setButtonLoading(false);
      },
    });
  };

  // =========================================================
  // CARD ACTION
  // =========================================================

  const handleCourseClick = course => {
    if (buttonLoading) return;

    if (course?.isPurchased) {
      handleStartSkill(course);
      return;
    }

    handleSkillPayment(course);
  };

  // =========================================================
  // COURSE CARD
  // =========================================================

  const CourseCard = ({
    course,
    isMyCourse = false,
  }) => {
    const image =
      course?.locale ||
      course?.goalCategory?.imageUrl ||
      'https://via.placeholder.com/600x350?text=Course';

    const title =
      course?.name ||
      'Beginner’s Guide To Becoming A Professional Frontend Developer';

    const categoryName =
      course?.goalCategory?.name ||
      'SKILLS';

    const moduleCount =
      course?.numberOfCourses || 5;

    const duration =
      course?.duration || 3;

    /*
      Replace with your backend progress field
      when available.
    */
    const progress = course?.progress ?? (
      isMyCourse ? 60 : 20
    );

    return (
      <div
        className="
          group
          bg-white
          rounded-[10px]
          border
          border-[#dedede]
          overflow-hidden
          shadow-[0_1px_3px_rgba(0,0,0,0.06)]
          hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]
          transition-all
          duration-200
          cursor-pointer
          h-full
        "
      >
        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          className="
            relative
            w-full
            h-[105px]
            sm:h-[115px]
            bg-[#eeeeee]
            overflow-hidden
          "
        >
          <img
            src={image}
            alt={title}
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-[1.02]
              transition-transform
              duration-300
            "
            onError={event => {
              event.currentTarget.src =
                'https://via.placeholder.com/600x350?text=Course';
            }}
          />

          {/* SKILLS BADGE */}

          <div className="absolute left-[8px] bottom-[7px]">
            <span
              className="
                inline-flex
                items-center
                bg-white
                px-[7px]
                py-[3px]
                rounded-[4px]
                text-[9px]
                font-semibold
                text-[#6556d9]
                shadow-sm
              "
            >
              {categoryName}
            </span>
          </div>

          {/* PURCHASED */}

          {course?.isPurchased && (
            <div className="absolute top-[7px] right-[7px]">
              <span
                className="
                  bg-[#3DD455]
                  text-white
                  px-[7px]
                  py-[3px]
                  rounded-[4px]
                  text-[8px]
                  font-semibold
                "
              >
                Purchased
              </span>
            </div>
          )}
        </div>

        {/* =================================================
            CARD BODY
        ================================================= */}

        <div className="px-[10px] pt-[8px] pb-[9px]">

          {/* TITLE */}

          <h3
            className="
              text-[11px]
              sm:text-[12px]
              leading-[15px]
              font-semibold
              text-[#242424]
              line-clamp-2
              min-h-[30px]
            "
          >
            {title}
          </h3>

          {/* =================================================
              PROGRESS
          ================================================= */}

          <div className="mt-[8px]">

            <div className="flex items-center justify-between mb-[4px]">

              <span className="text-[9px] text-[#555]">
                {isMyCourse
                  ? `${Math.max(
                    1,
                    Math.round(
                      (moduleCount * progress) /
                      100
                    )
                  )}/${moduleCount} Module`
                  : `1/${moduleCount} Module`}
              </span>

              <span className="text-[9px] font-semibold text-[#333]">
                {progress}%
              </span>
            </div>

            <div className="w-full h-[4px] bg-[#e9e9e9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5548ff] rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* =================================================
              META INFORMATION
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-[5px]
              mt-[8px]
              text-[8px]
              text-[#666]
              whitespace-nowrap
            "
          >
            <span className="flex items-center gap-[3px]">
              <span className="text-[10px]">
                ♙
              </span>

              <span>
                {course?.students || 500} Student
              </span>
            </span>

            <span className="flex items-center gap-[3px]">
              <span className="text-[10px]">
                ▣
              </span>

              <span>
                {moduleCount} Module
              </span>
            </span>

            <span className="flex items-center gap-[3px]">
              <span className="text-[10px]">
                ◷
              </span>

              <span>
                {duration}h
              </span>
            </span>
          </div>

          {/* =================================================
              EXPLORE CARD PRICE
          ================================================= */}

          {!isMyCourse && (
            <div
              className="
                flex
                items-center
                justify-between
                mt-[9px]
                pt-[8px]
                border-t
                border-[#eeeeee]
              "
            >
              <span className="text-[14px] font-bold text-[#202020]">
                ₹{course?.price || 0}
              </span>

              <button
                type="button"
                onClick={event => {
                  event.stopPropagation();

                  handleCourseClick(
                    course
                  );
                }}
                disabled={buttonLoading}
                className="
                  min-w-[58px]
                  h-[27px]
                  px-[10px]
                  rounded-[6px]
                  bg-[#3DD455]
                  hover:bg-[#2fc447]
                  text-white
                  text-[9px]
                  font-semibold
                  transition
                  disabled:bg-gray-400
                  disabled:cursor-not-allowed
                "
              >
                {buttonLoading
                  ? '...'
                  : 'Buy'}
              </button>
            </div>
          )}

          {/* MY COURSE START */}

          {isMyCourse && (
            <button
              type="button"
              onClick={event => {
                event.stopPropagation();

                handleStartSkill(
                  course
                );
              }}
              className="
                w-full
                h-[27px]
                mt-[9px]
                rounded-[6px]
                bg-[#3DD455]
                hover:bg-[#2fc447]
                text-white
                text-[9px]
                font-semibold
                transition
              "
            >
              Continue Learning
            </button>
          )}
        </div>
      </div>
    );
  };

  // =========================================================
  // SKELETON
  // =========================================================

  const SkeletonCard = () => (
    <div
      className="
        bg-white
        rounded-[10px]
        border
        border-[#e2e2e2]
        overflow-hidden
        animate-pulse
      "
    >
      <div className="h-[115px] bg-[#e5e5e5]" />

      <div className="p-[10px]">

        <div className="h-[9px] bg-[#e5e5e5] rounded w-[90%]" />

        <div className="h-[9px] bg-[#e5e5e5] rounded w-[65%] mt-[5px]" />

        <div className="h-[4px] bg-[#e5e5e5] rounded mt-[10px]" />

        <div className="flex justify-between mt-[9px]">
          <div className="h-[7px] bg-[#e5e5e5] rounded w-[25%]" />
          <div className="h-[7px] bg-[#e5e5e5] rounded w-[15%]" />
        </div>
      </div>
    </div>
  );

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="user_container min-h-screen bg-[#f4f4f0]">

      {/* =====================================================
          EXISTING SIDEBAR / HEADER
      ===================================================== */}

      <div className="user_container_width">
        <UserMenuBar />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="px-3 sm:px-4 md:px-6 py-4">

        <div
          className="
            max-w-[1400px]
            mx-auto
            bg-[#f5f3e9]
            border
            border-[#e7e4d8]
            rounded-[15px]
            px-4
            sm:px-5
            md:px-6
            py-5
          "
        >

          {/* =================================================
              PRACTICE ANALYSIS
          ================================================= */}

          <div className="mb-[7px]">
            <span
              className="
                inline-flex
                items-center
                gap-[6px]
                bg-[#cfff00]
                text-[#202020]
                px-[10px]
                py-[5px]
                rounded-full
                text-[9px]
                font-semibold
              "
            >
              <span className="text-[11px]">
                📈
              </span>

              Practice Analysis
            </span>
          </div>

          {/* =================================================
              MY COURSES
          ================================================= */}

          <section className="mb-[22px]">

            <h2
              className="
                text-[20px]
                sm:text-[21px]
                font-semibold
                text-[#181818]
                mb-[9px]
              "
            >
              My Courses
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[9px]">
                {[1, 2, 3, 4].map(item => (
                  <SkeletonCard
                    key={item}
                  />
                ))}
              </div>
            ) : myCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[9px]">
                {myCourses
                  .slice(0, 4)
                  .map(course => (
                    <CourseCard
                      key={course?._id}
                      course={course}
                      isMyCourse
                    />
                  ))}
              </div>
            ) : (
              <div
                className="
                  bg-white/70
                  border
                  border-[#deddd4]
                  rounded-[9px]
                  py-5
                  text-center
                "
              >
                <p className="text-[11px] text-[#777]">
                  You haven't purchased
                  any skills yet.
                </p>
              </div>
            )}
          </section>

          {/* =================================================
              EXPLORE COURSES
          ================================================= */}

          <section>

            <h2
              className="
                text-[20px]
                sm:text-[21px]
                font-semibold
                text-[#181818]
                mb-[9px]
              "
            >
              Explore Courses
            </h2>



            {/* =================================================
    FILTER BAR
================================================= */}

            <div
              className="
    flex
    items-center
    justify-between
    gap-3
    mb-4
    w-full
  "
            >
              {/* SEARCH - LEFT */}

              <div className="relative flex-1 min-w-0">
                <span
                  className="
        absolute
        left-3
        top-1/2
        -translate-y-1/2
        text-gray-400
        text-sm
      "
                >
                  🔍
                </span>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={event =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search Course Name, Mentor..."
                  className="
        w-full
        h-[38px]
        pl-9
        pr-9
        bg-white
        border
        border-[#cfcfcf]
        rounded-[7px]
        text-[11px]
        text-gray-700
        placeholder:text-gray-400
        outline-none
        focus:border-[#555]
      "
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-gray-400
          hover:text-gray-700
          text-sm
        "
                  >
                    ×
                  </button>
                )}
              </div>

              {/* RIGHT FILTERS */}

              <div className="flex items-center gap-2 flex-shrink-0">

                {/* CATEGORY */}

                <div className="relative">
                  <select
                    value={category}
                    onChange={event =>
                      setCategory(event.target.value)
                    }
                    className="
          h-[38px]
          min-w-[125px]
          appearance-none
          bg-white
          border
          border-[#dedede]
          rounded-[7px]
          pl-9
          pr-8
          text-[11px]
          text-gray-600
          outline-none
          cursor-pointer
        "
                  >
                    {categories.map(item => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item === 'All'
                          ? 'Category'
                          : item}
                      </option>
                    ))}
                  </select>

                  <span
                    className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-[11px]
          text-gray-500
          pointer-events-none
        "
                  >
                    ◈
                  </span>

                  <span
                    className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-[10px]
          text-gray-400
          pointer-events-none
        "
                  >
                    ▾
                  </span>
                </div>

                {/* SORT */}

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={event =>
                      setSortBy(event.target.value)
                    }
                    className="
          h-[38px]
          min-w-[155px]
          appearance-none
          bg-white
          border
          border-[#dedede]
          rounded-[7px]
          pl-9
          pr-8
          text-[11px]
          text-gray-600
          outline-none
          cursor-pointer
        "
                  >
                    <option value="Popular">
                      Sort by: Popular
                    </option>

                    <option value="Price: Low to High">
                      Price: Low to High
                    </option>

                    <option value="Price: High to Low">
                      Price: High to Low
                    </option>
                  </select>

                  <span
                    className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-[11px]
          text-gray-500
          pointer-events-none
        "
                  >
                    ⇅
                  </span>

                  <span
                    className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-[10px]
          text-gray-400
          pointer-events-none
        "
                  >
                    ▾
                  </span>
                </div>

              </div>
            </div>

            {/* =================================================
                COURSE GRID
            ================================================= */}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[9px]">
                {Array.from({
                  length: 8,
                }).map((_, index) => (
                  <SkeletonCard
                    key={index}
                  />
                ))}
              </div>
            ) : exploreCourses.length > 0 ? (
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-4
                  gap-[9px]
                "
              >
                {exploreCourses.map(
                  course => (
                    <CourseCard
                      key={course?._id}
                      course={course}
                    />
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  bg-white
                  rounded-[10px]
                  border
                  border-[#dedede]
                  py-12
                  text-center
                "
              >
                <div className="text-[30px] mb-2">
                  🔍
                </div>

                <h3 className="text-[14px] font-semibold text-[#333]">
                  No courses found
                </h3>

                <p className="text-[10px] text-[#888] mt-1">
                  Try changing your
                  search or category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCategory('All');
                    setSortBy('Popular');
                  }}
                  className="
                    mt-4
                    px-4
                    py-2
                    rounded-[6px]
                    bg-[#3DD455]
                    text-white
                    text-[10px]
                    font-semibold
                  "
                >
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HOC(SkillsPage2);
