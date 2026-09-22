import { useContext, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import HOC from "../../../components/layout/HOC";
import images from "../../../utils/images";
import { UserBannerTopComponent } from "../../../components/common/Banners";
import { UserMenuBar } from "../../../components/common/MenuBar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import { userApi } from "../../../services/apiFunctions";

const NewCapsuleCoursePage1 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = "" } = user || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate("/login");
    } else if (goal) {
      fetchCourses();
    }
  }, [isAuthenticated, goal]);

  const fetchCourses = () => {
    userApi.capsuleCourse.getAll({
      setIsLoading,
      params: {
        search: searchQuery,
        page: 1,
        limit: 999,
      },
      onSuccess: (res) => {
        setCourses(res?.data || []);
      },
      onError: (err) => {
        console.error("Failed to fetch courses:", err);
      },
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user_container px-4 md:px-10 py-6 space-y-6">
      
      <div className="user_container_width">
        <UserMenuBar />
      </div>
      <div className="w-full">
        <img
          src={images.newAboutPageBanner}
          alt="Community Banner"
          className="w-full rounded-xl object-cover"
        />
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Explore Course</h3>
        <div className="flex items-center justify-between my-3">
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
          <div className="text-gray-500 flex items-center space-x-2 gap-4">
            <span className="flex items-center space-x-2 gap-2">
              <Icon icon="uil:graph-bar" className="text-gray-500" /> Category
            </span>
            <span className="flex items-center space-x-2 gap-2">
              <Icon
                icon="material-symbols-light:dashboard-outline-rounded"
                className="text-gray-500"
              />{" "}
              Category
            </span>
            <span className="flex items-center space-x-2 gap-2">
              <Icon icon="akar-icons:sort" className="text-gray-500" /> Sort by
              Popular
            </span>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center mt-10">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCourses.map((course, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden p-1"
                onClick={() => navigate(`/user/courses/${course._id}`)}
              >
                <div className="relative">
                  <img
                    src={course.courseImage?.[0] || images.newCoursePage4Image1}
                    alt={course.title}
                    className="max-h-[450px] w-full object-cover"
                  />
                  {course.tag && (
                    <span className="absolute top-2 right-2 bg-white text-gray-800 text-xs px-2 py-0.5 rounded-md shadow-sm">
                      {course.tag}
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {course.title}
                  </p>
                  <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                    <span>👥 {course.students || "N/A"} Students</span>
                    <span>📘 {course.modules || "N/A"} Modules</span>
                    <span>⏱️ {course.duration || "N/A"} Min </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mt-2">
                      {/* <img
                        src={
                          course.instructorImage ||
                          images.newHandwrittenNotesImage1
                        }
                        alt={course.instructor || "Instructor"}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs text-gray-700 font-medium">
                        {course.instructor || "Unknown Instructor"}
                      </span> */}
                    </div>
                    <div>
                      <button className="bg-yellow-300 text-black px-2 py-1 rounded-lg w-full mt-2 text-sm">
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HOC(NewCapsuleCoursePage1);
