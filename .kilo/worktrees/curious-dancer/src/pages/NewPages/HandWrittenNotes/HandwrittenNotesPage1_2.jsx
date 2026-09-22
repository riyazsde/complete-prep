import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';
import { showNotification } from '../../../services/exportComponents';

const HandwrittenNotesPage1_2 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const params = useParams();
  const { id } = params;
  const { goal = '' } = user || {};
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
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
    userApi.handWrittenNotes.getById({
      id: id,
      setIsLoading,
      onSuccess: res => {
        const fetchedCourses = res?.data ? [res.data] : [];
        setIsPurchased(fetchedCourses[0]?.isPurchased);
        setPurchaseDate(fetchedCourses[0]?.purchaseDate);
        setIsInCart(fetchedCourses[0]?.isCart);
        setCourses(fetchedCourses);
        if (fetchedCourses.length > 0) {
          setSelectedCourse(fetchedCourses[0]);
        }
        setIsLoading(false);
      },
      onError: err => {
        console.error('Failed to fetch courses:', err);
        setIsLoading(false);
      },
    });
  };

  const handleCourseSelect = subject => {
    // if (isPurchased) {
    navigate(`/user/notes/${id}/${subject?.subject?._id}`);
    // } else {
    //   showNotification({
    //     type: "error",
    //     message: isInCart
    //       ? "Please buy the bundle from cart first"
    //       : "Please add the bundle to cart first",
    //   });
    // }
  };

  return (
    <div className="user_container">

      <div className="user_container_width">
        <UserMenuBar />
      </div>
      <div className="user_container_width p-6">
        {isLoading ? (
          <div className="flex justify-center mt-10">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="smallScreenFlex gap-4">
            <div className="sm:w-full lg:w-[60%] bg-white">
              {/* <p className="text-xl font-semibold mb-4">{courses[0]?.bundleName || 'Subjects'}</p> */}
              <div className="space-y-3">
                {courses[0]?.subjects?.map((subjectItem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#efefef] p-3 rounded-lg shadow-sm hover:shadow transition cursor-pointer"
                    onClick={() => {
                      user?.isSubscribed
                        ? handleCourseSelect(subjectItem)
                        : showNotification({
                            type: 'error',
                            message: 'Please subscribe to access this course',
                          });
                    }}
                  >
                    <div className="flex items-center gap-4 w-full h-full">
                      <img
                        src={subjectItem.subject?.image || images.newSubjectImage1}
                        alt="Subject Thumbnail"
                        className="w-20 h-20 rounded object-cover"
                      />
                      <div>
                        <p className="font-semibold">{subjectItem.subject?.name}</p>
                      </div>
                    </div>
                    <button className="text-xl text-gray-600">→</button>
                  </div>
                ))}
              </div>
            </div>
            {selectedCourse && (
              <div className="flex-1 bg-white rounded-xl">
                <img
                  src={selectedCourse.image || images.newCoursePage1Image2}
                  alt="Course"
                  className="w-full rounded-xl max-h-[370px]"
                />
                {/* <p className="text-lg font-semibold mt-2">{selectedCourse.bundleName}</p> */}
                {/* <div className="text-sm space-y-1">
                  <p>{selectedCourse.desc}</p>
                </div> */}
                {/* <p className="text-xl font-bold">₹{selectedCourse.price}</p> */}
                <p>
                  {/* {isPurchased ? (
                    <span className="text-gray-600">
                      Purchased On:{" "}
                      <span className="font-semibold">
                        {formatPurchaseDate(purchaseDate)}
                      </span>
                    </span>
                  ) : null} */}
                </p>
                <div className="mt-4 flex flex-row items-center gap-4 w-full">
                  {/* {!isPurchased && (
                    <button
                      onClick={() =>
                        addToCart({
                          id: selectedCourse?._id,
                          type: "handwrittenNotes",
                          onSuccess: () => {
                            fetchCourses();
                          },
                        })
                      }
                      className="w-full bg-black text-white py-2 rounded-lg font-semibold h-12"
                      disabled={isInCart}
                    >
                      {isInCart ? "Added To Cart" : "Add To Cart"}
                    </button>
                  )} */}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HOC(HandwrittenNotesPage1_2);
