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

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [isInCart, setIsInCart] = useState(false);

  // =========================
  // FETCH COURSES
  // =========================
  const fetchCourses = () => {
    setIsLoading(true);

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
        setCourses([]);
        setSelectedCourse(null);
        setIsLoading(false);
      },
    });
  };

  // =========================
  // EFFECT — runs when auth or id changes
  // =========================
  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
      return;
    }

    if (!id) {
      // No id in URL — nothing to fetch
      setIsLoading(false);
      return;
    }

    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, id]);

  // =========================
  // HANDLE SUBJECT CLICK
  // =========================
  const handleCourseSelect = subject => {
    navigate(`/user/notes/${id}/${subject?.subject?._id}`);
  };

  const handleSubjectClick = subjectItem => {
    if (user?.isSubscribed) {
      handleCourseSelect(subjectItem);
    } else {
      showNotification({
        type: 'error',
        message: 'Please subscribe to access this course',
      });
    }
  };

  // =========================
  // LOADING
  // =========================
  if (isLoading) {
    return (
      <div className="user_container">
        <div className="user_container_width">
          <UserMenuBar />
        </div>
        <div className="min-h-[400px] flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="mt-3 text-sm font-medium text-gray-500">
              Loading subjects...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  const subjects = courses[0]?.subjects || [];

  return (
    <div className="user_container">
      <div className="user_container_width">
        <UserMenuBar />
      </div>

      <div className="user_container_width p-6">
        {courses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-16 px-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-bold text-gray-800">
              No subjects found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Subjects for this bundle will appear here once available.
            </p>
          </div>
        ) : (
          <div className="smallScreenFlex gap-4">
            {/* =========================
                SUBJECTS LIST
            ========================= */}
            <div className="sm:w-full lg:w-[60%] bg-white">
              <div className="space-y-3">
                {subjects.length > 0 ? (
                  subjects.map((subjectItem, index) => (
                    <div
                      key={subjectItem?.subject?._id || index}
                      className="flex items-center justify-between bg-[#efefef] p-3 rounded-lg shadow-sm hover:shadow transition cursor-pointer"
                      onClick={() => handleSubjectClick(subjectItem)}
                    >
                      <div className="flex items-center gap-4 w-full h-full">
                        <img
                          src={
                            subjectItem.subject?.image ||
                            images.newSubjectImage1
                          }
                          alt="Subject Thumbnail"
                          className="w-20 h-20 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold">
                            {subjectItem.subject?.name}
                          </p>
                        </div>
                      </div>
                      <button className="text-xl text-gray-600">→</button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-6">
                    No subjects available for this bundle.
                  </p>
                )}
              </div>
            </div>

            {/* =========================
                SELECTED COURSE PANEL
            ========================= */}
            {selectedCourse && (
              <div className="flex-1 bg-white rounded-xl">
                <img
                  src={selectedCourse.image || images.newCoursePage1Image2}
                  alt="Course"
                  className="w-full rounded-xl max-h-[370px] object-cover"
                />
                <div className="mt-4 flex flex-row items-center gap-4 w-full">
                  {/* Purchase / cart logic kept commented out as in original */}
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