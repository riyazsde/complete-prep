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
      await userApi.goal.getByGoalCategory({
        id: user?.goalCategory?._id,
        setIsLoading: setIsLoading,
        params: { search: searchQuery },
        onSuccess: data => {
          const fetchedCourses = data?.data || [];
          setCourses(fetchedCourses);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && user.goal) {
      fetchData();
    }
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
            {/* <div className="text-gray-500 flex items-center space-x-2 gap-4">
              <span className="flex items-center space-x-2 gap-2">
                <Icon icon="uil:graph-bar" className="text-gray-500" /> Category
              </span>
              <span className="flex items-center space-x-2 gap-2">
                <Icon
                  icon="material-symbols-light:dashboard-outline-rounded"
                  className="text-gray-500"
                />
                Category
              </span>
              <span className="flex items-center space-x-2 gap-2">
                <Icon icon="akar-icons:sort" className="text-gray-500" /> Sort
                by Popular
              </span>
            </div> */}
          </div>
          <div>
            <div>
              {/* <p className="inline-block px-4 py-2 text-lg bg-[#3DD455] hover:bg-black text-white font-bold rounded-3xl">
                Popular Courses
              </p> */}
              <div className="w-full">
                {isLoading ? (
                  <div className="flex justify-center mt-8 w-full">
                    <p>Loading...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                    {/* {courses?.map((course, index) => (
                      <div
                        key={course._id}
                        className="relative min-h-[220px] rounded-xl p-4 border-2 cursor-pointer"
                        style={{
                          backgroundColor: bgColors[index % bgColors.length],
                          borderColor: borderColors[index % borderColors.length],
                        }}
                        onClick={() => handleCourseClick(course._id)}
                      >
                        <div className="absolute top-3 left-3 w-[70px] h-[70px] flex items-center justify-center overflow-hidden">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-[50px] h-[50px] object-cover rounded-full"
                          />
                        </div>
                        <div
                          className="absolute bottom-3 left-3 text-base font-bold"
                          style={{
                            color: titleColors[index % titleColors.length],
                          }}
                        >
                          {course.name}
                          {console.log(course)}
                        </div>
                        <div
                          className="absolute text-[64px] font-extrabold opacity-5 whitespace-nowrap"
                          style={{
                            bottom: '8px',
                            right: '10px',
                            color: titleColors[index % titleColors.length],
                          }}
                        >
                          {course?.name?.toUpperCase()?.slice(0, 4)}
                        </div>
                        <div
                          className="absolute bottom-3 right-3 text-lg font-bold"
                          style={{
                            color: titleColors[index % titleColors.length],
                          }}
                        >
                          ›
                        </div>
                      </div>
                    ))} */}
                    {courses?.map((course, index) => (
                      <div
                        key={index}
                        onClick={() => handleCourseClick(course?._id)}
                        className="relative w-full pt-[120%] rounded-lg overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={course.image}
                          alt="Course Thumbnail"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}

                  </div>
                )}
                {!isLoading && courses.length === 0 && (
                  <div className="flex justify-center items-center mt-8 w-full">
                    <p>No courses found for your goal category. Please check back later.</p>
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
