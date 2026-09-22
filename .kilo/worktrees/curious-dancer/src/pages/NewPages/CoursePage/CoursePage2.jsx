import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserMenuBar } from "../../../components/common/MenuBar";
import HOC from "../../../components/layout/HOC";
import { AuthContext } from "../../../Context/AuthContext";
import { userApi } from "../../../services/apiFunctions";
import images from "../../../utils/images";

const CoursePage2 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const params = useParams();
  const { id } = params;
  const { goal = "" } = user || {};
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
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
    userApi.courses.getById({
      params: { courseCategoryId: id },
      setIsLoading,
      onSuccess: (res) => {
        const fetchedCourses = res?.data || [];
        setCourses(fetchedCourses);
        if (fetchedCourses.length > 0) {
          setSelectedCourse(fetchedCourses[0]);
        }
      },
      onError: (err) => {
        console.error("Failed to fetch courses:", err);
        setIsLoading(false);
      },
    });
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    console.log("Selected Course:", course);
    navigate(`/user/course/${id}/${course?._id}`);
  };

  return (
    <div className="user_container">

      <div className="">
        <UserMenuBar />
      </div>

      <div className="p-6">
        <div className="bg-[#efefef] rounded-xl border">
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="flex sm:flex-col lg:flex-row gap-4">
              <div className="w-full p-4">
                <p className="text-xl font-semibold mb-4">
                  {courses?.[0]?.courseCategoryId?.name || "All Courses"}
                </p>
                <div className="space-y-3">
                  {courses?.map((course, index) => (
                    // <div
                    //   key={index}
                    //   className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow transition cursor-pointer w-[60%]"
                    //   onClick={() => handleCourseSelect(course)}
                    // >
                    //   <div className="flex items-center gap-4  h-full">
                    //     <img
                    //       src={
                    //         course.courseImage?.[0] ||
                    //         images.newCoursePage1Image2
                    //       }
                    //       alt="Course Thumbnail"
                    //       className="w-18 h-20 rounded object-cover"
                    //     />
                    //     <div>
                    //       <p className="font-semibold">{course.title}</p>
                    //       {/* <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    //         {Array.from({ length: 5 }).map((_, i) => (
                    //           <Icon
                    //             key={i}
                    //             icon={
                    //               i < course.totalRating
                    //                 ? "ri:star-fill"
                    //                 : "material-symbols:star-outline"
                    //             }
                    //             width={16}
                    //             height={16}
                    //             className="text-yellow-500"
                    //           />
                    //         ))}
                    //       </div> */}
                    //       <p className="text-md text-gray-400 mt-2">
                    //         Total {course.duration} Hours | {course.lessons}{" "}
                    //         Lessons
                    //       </p>
                    //     </div>
                    //   </div>
                    //   <button className="text-xl text-gray-600">→</button>
                    // </div>
                    <div
                      key={index}
                      onClick={() => handleCourseSelect(course)}
                      className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow transition cursor-pointer sm:w-full lg:w-[60%]"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            course.courseImage?.[0] || images.newSubjectImage1
                          }
                          alt="Course Thumbnail"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {course.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Total {course?.subject?.duration || 0} Hours |{" "}
                            {course?.subject?.lessons || 0} lectures
                          </p>
                        </div>
                      </div>
                      <span className="text-lg text-gray-500">→</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(CoursePage2);
