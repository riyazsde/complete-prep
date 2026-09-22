import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';

const CoursePage1 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '' } = user || {};
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchCourses();
    }
  }, [isAuthenticated, goal]);

  const fetchCourses = () => {
    userApi.courses.getAll({
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

  return (
    <div className="user_container">
      <div>
        <div></div>
        <div className="user_container_width">
          <UserMenuBar />
        </div>
        <div className="p-4 bg-[#efefef]">
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg">
              {courses?.map((course, index) => (
                <div key={index} className="bg-green-100 p-4 rounded-lg shadow text-center">
                  <p className="text-center bg-green-300 p-1 rounded inline-block">
                    <img
                      src={course?.image || course.icon}
                      alt={course.title}
                      className="w-[70px] h-[70px]"
                    />
                  </p>
                  <p className="font-bold">{course.name}</p>
                  <p className="text-sm">{course.desc?.substring(0, 100)}</p>
                  <button
                    // onClick={() =>   navigate(`/user/courses/${course._id}`)}
                    onClick={() => fetchCourseSubjectsByCourseId(course._id)}
                    className="border-2 border-blue-700 bg-blue-100 rounded w-60 py-2 mt-2 text-black"
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(CoursePage1);
