import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';
import images from '../../../utils/images';

const CoursePage2_1 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const params = useParams();
  const { id, courseId } = params;
  const { goal = '' } = user || {};
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isPurchased, setIsPurchased] = useState(true);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchCourses();
    }
  }, [isAuthenticated, goal]);

  const fetchCourses = () => {
    userApi.courses.getById({
      params: { courseId, CourseType: id },
      setIsLoading,
      onSuccess: (res) => {
        const fetchedCourses = res?.data || [];
        console.log(fetchedCourses, 'fetchedCourses');
        setIsPurchased(true || fetchedCourses?.[0]?.isPurchased);
        setPurchaseDate(fetchedCourses?.[0]?.purchaseDate);
        setIsInCart(fetchedCourses?.[0]?.isCart);
        setCourses(fetchedCourses);
        if (fetchedCourses.length > 0) {
          setSelectedCourse(fetchedCourses[0]);
        }
      },
      onError: (err) => {
        console.error('Failed to fetch courses:', err);
        setIsLoading(false);
      },
    });
  };

  const handleCourseSelect = (course) => {
    // setSelectedCourse(course);
    console.log('Selected Course:', course);
    {
      isPurchased
        ? navigate(`/user/course/${id}/${courseId}/${course?.subject?._id}`)
        : showNotification({
            type: 'error',
            message: isInCart
              ? 'Please buy the bundle from cart first'
              : 'Please add the bundle to cart first',
          });
    }
  };
  return (
    <div className="user_container">

      <div className="user_container_width">
        <UserMenuBar />
      </div>

      <div className="p-6">
        <div className="">
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="flex smallScreenFlex gap-4">
              <div className="w-full lg:w-[100%] bg-[#efefef] rounded-xl border p-6 ">
                {/* <p className="text-xl font-semibold mb-6 text-gray-800">
                  {courses?.[0]?.title || 'Course'}
                </p> */}

                <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {courses?.[0]?.subjects?.map((course, index) => (
                    // <div
                    //   key={index}
                    //   onClick={() => handleCourseSelect(course)}
                    //   className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow transition cursor-pointer"
                    // >
                    //   <div className="flex items-center gap-4">
                    //     <img
                    //       src={course.image || images.newSubjectImage1}
                    //       alt="Course Thumbnail"
                    //       className="w-16 h-16 rounded-lg object-cover"
                    //     />
                    //     <div>
                    //       <p className="text-sm font-semibold text-gray-800">
                    //         {course?.subject?.name}
                    //       </p>
                    //       <p className="text-xs text-gray-500 mt-1">
                    //         Total {course?.subject?.duration || 12} Hours |{" "}
                    //         {course?.subject?.lessons || 111} lectures
                    //       </p>
                    //     </div>
                    //   </div>
                    //   <span className="text-lg text-gray-500">→</span>
                    // </div>
                    <div
                    key={index}
                      style={{
                        width: '100%',
                        position: 'relative',
                        paddingTop: '120%',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        maxHeight: '100%',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleCourseSelect(course)}
                      className="group"
                    >
                      {course?.imageUrl }
                      <img
                        src={course?.subject?.imageUrl || images.newSubjectImage1}
                        alt="Course Thumbnail"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.35s ease',
                        }}
                        className="group-hover:scale-110 aspect-[3/4] border rounded-lg "
                      />
                      {/* <p className="text-center text-sm font-semibold mt-2 z-10 py-2 relative bg-white">
                        {course?.subject?.name}
                      </p> */}
                    </div>
                  ))}
                </div>
                {courses?.[0]?.subjects?.length === 0 && (
                  <p className="text-center text-gray-500 mt-10">
                    No subjects available for this course.
                  </p>
                )}
              </div>

              {/* <div className="bg-white w-full lg:w-[40%] p-3 rounded-2xl">
                {selectedCourse && (
                  <div className="flex-1 p-5 bg-[#efefef] rounded-2xl border">
                    <img
                      src={
                        selectedCourse.courseImage?.[0] ||
                        images.newCoursePage1Image2
                      }
                      alt="Course"
                      className="w-full h-48 object-cover rounded-xl"
                    />

                    <p className="text-lg font-semibold mt-4 text-gray-900">
                      {selectedCourse?.courseCategoryId?.name}
                    </p>
                    {selectedCourse?.courseCategoryId?.desc && (
                      <>
                        <p className="text-sm font-medium mt-2 text-gray-800">
                          Course Highlights
                        </p>
                        <div className="text-sm space-y-2 mt-2">
                          {(selectedCourse?.courseCategoryId?.desc || "")
                            .split("\n")
                            .map((line, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="w-2 h-2 mt-[6px] bg-blue-400 rounded-full"></span>
                                <span className="text-gray-700">{line}</span>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                    <hr className="my-4" />

                    <p className="text-xl font-bold text-gray-900">
                      ₹{selectedCourse.price}
                    </p>

                    {isPurchased && (
                      <p className="text-sm text-gray-600 mt-1">
                        Purchased On:{" "}
                        <span className="font-semibold">
                          {formatPurchaseDate(purchaseDate)}
                        </span>
                      </p>
                    )}

                    {!isPurchased && (
                      <>
                        <input
                          type="text"
                          placeholder="Apply promo code"
                          className="border mt-4 px-3 py-2 rounded-lg w-full text-sm placeholder:text-gray-400"
                        />

                        <div className="mt-4 flex items-center gap-3">
                          <button className="w-12 h-12 flex items-center justify-center border rounded-lg bg-yellow-100 text-black hover:bg-yellow-200">
                            <Icon
                              icon="material-symbols-light:bookmark-outline"
                              className="text-2xl"
                            />
                          </button>

                          <button
                            onClick={() =>
                              addToCart({
                                id: selectedCourse?._id,
                                type: "courses",
                                onSuccess: () => {
                                  fetchCourses();
                                },
                              })
                            }
                            className="flex-1 bg-black text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                            disabled={isInCart}
                          >
                            {isInCart ? "Added To Cart" : "Add to cart"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(CoursePage2_1);
