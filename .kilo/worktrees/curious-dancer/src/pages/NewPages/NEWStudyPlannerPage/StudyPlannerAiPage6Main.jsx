import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const StudyPlannerAiPage6Main = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const params = useParams();
  const { week, studyPlanId } = params;
  const { goal = '' } = user || {};
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchCourses();
    }
  }, [isAuthenticated, goal]);

  const fetchCourses = () => {
    userApi.studyPlanner?.getPlanById({
      id: studyPlanId,
      setIsLoading,
      onSuccess: res => {
        const fetchedCourses = res?.data || [];
        setIsPurchased(fetchedCourses?.isPurchased);
        setCourses([fetchedCourses]);
        if (fetchedCourses.length > 0) {
          setSelectedCourse(fetchedCourses);
        }
        setIsLoading(false);
      },
      onError: err => {
        console.error('Failed to fetch courses:', err);
        setIsLoading(false);
      },
    });
  };

  const handleCourseSelect = course => {
    setSelectedCourse(course);
    navigate(`/study-planner/${week}/${studyPlanId}/${course?.subject?._id}/study-plan-subject`);
  };

  return (
    <div className="user_container">
      <div className="">
        <UserMenuBar />
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center mt-10">
            <p>Loading...</p>
          </div>
        )   : (
          <div className="flex flex-col gap-6">
            <p className="text-2xl font-bold text-gray-800">{courses[0]?.title || 'Course'}</p>

            <div className="bg-white p-6 rounded-xl border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses[0]?.subjects?.map((subjectItem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-zinc-100 hover:bg-zinc-200 transition p-4 rounded-lg shadow-sm cursor-pointer"
                    onClick={() => handleCourseSelect(subjectItem)}
                  >
                    {/* Image + Text */}
                    <div className="flex items-center gap-4 w-full">
                      <img
                        src={subjectItem.subject?.image || images.newSubjectImage1}
                        alt={subjectItem.subject?.name || 'Course Thumbnail'}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <p className="font-medium text-gray-800 text-lg">
                        {subjectItem.subject?.name}
                      </p>
                    </div>

                    {/* Arrow */}
                    <button className="text-2xl text-gray-500 hover:text-gray-700">→</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HOC(StudyPlannerAiPage6Main);
