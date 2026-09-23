import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';

const NewStudyPlannerAiPage1Main = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const bgColors = ['#FFFECF', '#FEE5E5', '#E3FCD0', '#DDE8FF', '#FFFFFF'];
  const borderColors = ['#C3B900', '#B82020', '#1F7A1F', '#003E9D', '#E0E0E0'];
  const titleColors = ['#D4B300', '#D62828', '#228B22', '#003B95', '#000000'];

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await userApi.goal.getByGoalCategory({
        id: user?.goalCategory?._id,
        setIsLoading: setIsLoading,
        params: { search: searchQuery },
        onSuccess: data => {
          const fetchedCourses = data?.data || [];
          setCourses(fetchedCourses);
          setIsLoading(false);
        },
        onError: () => {
          setCourses([]);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user exists and has required data
    if (user) {
      if (user?.goalCategory?._id) {
        fetchData();
      } else {
        // No goal category, stop loading and show empty state
        setCourses([]);
        setIsLoading(false);
      }
    }
    // If user is not yet loaded, keep loading state
  }, [isAuthenticated, user, searchQuery, user?.goalCategory]);

  const handleCourseClick = courseId => {
    navigate(`/study-planner/${courseId}`, { state: { id: courseId } });
  };

  return (
    <div className="">
      <div className="">
        <UserMenuBar />
      </div>
      <div className=" bg-white p-6">
        <div className="bg-[#EFEFEF] p-3 rounded-lg md:min-h-[calc(100vh-48px)]">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Create Your Personalized</h1>
            <h1 className="text-4xl font-bold text-gray-900">Study Schedule</h1>
          </div>
          <div className="flex items-center flex-wrap justify-between my-3">
            <div className="flex-grow">
              <div className="relative sm:w-full lg:w-[70%]">
                <input
                  type="text"
                  placeholder="Search Course Name, Mentor |"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Icon icon="akar-icons:search" className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div className="w-full">
                {isLoading ? (
                  <div className="flex justify-center items-center mt-8 w-full min-h-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-gray-500">Loading...</p>
                    </div>
                  </div>
                ) : courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                    {courses?.map((course, index) => (
                      <div
                        key={course?._id || index}
                        onClick={() => handleCourseClick(course?._id)}
                        className="relative w-full pt-[120%] rounded-lg overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={course.image}
                          alt={course.name || 'Course Thumbnail'}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center mt-8 w-full min-h-[200px]">
                    <Icon
                      icon="mdi:book-open-page-variant-outline"
                      className="text-6xl text-gray-300 mb-4"
                    />
                    <p className="text-gray-500 text-lg font-medium">No courses found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchQuery
                        ? 'Try adjusting your search query'
                        : 'No courses available for your goal category. Please check back later.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(NewStudyPlannerAiPage1Main);