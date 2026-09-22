import { useState } from "react";
import { Icon } from "@iconify/react";
import HOC from "../../../components/layout/HOC";
import images from "../../../utils/images";
import { UserBannerTopComponent } from "../../../components/common/Banners";
import { UserMenuBar } from "../../../components/common/MenuBar";
import { useNavigate } from "react-router-dom";

const NewUserHomePage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const featuredCourses = [
    {
      title: "How To Create Your Online Course",
      instructor: "Prashant Singh",
      image: images.newHomePageCourseImage1,
      students: "100 Students",
      modules: "5 Modules",
    },
    {
      title: "Learn Software Development with US!",
      instructor: "Prashant Singh",
      image: images.newHomePageCourseImage2,
      students: "100 Students",
      modules: "5 Modules",
    },
    {
      title: "How To Create Your Online Course",
      instructor: "Prashant Singh",
      image: images.newHomePageCourseImage3,
      students: "100 Students",
      modules: "5 Modules",
    },
  ];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const relatedCourses = [
    {
      image: images.newCoursePage4Image1,
      title: "Beginner’s Guide To Becoming A Professional Frontend Developer",
      tag: "Beginner",
      students: "350",
      modules: "5",
      duration: "1h 30m",
      instructor: "Prashant Kumar Singh",
      instructorImage: images.newHandwrittenNotesImage1,
    },
    {
      image: images.newCoursePage4Image1,
      title: "Beginner’s Guide To Becoming A Professional Frontend Developer",
      tag: "Beginner",
      students: "350",
      modules: "5",
      duration: "1h 30m",
      instructor: "Prashant Kumar Singh",
      instructorImage: images.newHandwrittenNotesImage1,
    },
  ];

  const topContent = [
    {
      title: "Schedule & Details of CLAT 2025 Mock Test Series",
      image: images.newCoursePage4Image1,
    },
    {
      title: "Schedule & Details of CLAT 2025 Mock Test Series",
      image: images.newCoursePage4Image1,
    },
    {
      title: "Schedule & Details of CLAT 2025 Mock Test Series",
      image: images.newCoursePage4Image1,
    },
    {
      title: "Schedule & Details of CLAT 2025 Mock Test Series",
      image: images.newCoursePage4Image1,
    },
  ];
  const courseDetails = {
    title: "UX Design : How To Implement Usability Testing",
    instructor: "Alfredo Rhiel Madison",
    students: "500",
    modules: "6 Module",
    duration: "1h 30m",
    progress: 0,
    totalModules: 5,
    bannerImage: "your-image-url-here",
    modulesList: [
      { title: "Introduction", duration: "10:00" },
      { title: "What is UX Design", duration: "10:00" },
      { title: "Usability Testing", duration: "10:00" },
      { title: "Create Usability Test", duration: "30:00" },
      { title: "How to Implement", duration: "30:00" },
    ],
  };

  return (
    <div className="w-[100%] flex sm:flex-col lg:flex-row gap-3">
      <div className="w-[100%] sm:w-[100%] md:w-[70%]">
        
        <div className="user_container_width">
          <UserMenuBar />
        </div>
        <div className="mt-5">
          <div className="relative bg-cyan-600 text-white rounded-xl p-6 mt-6 overflow-hidden">
            {/* Background image */}
            {/* <img
              src={images.newDashboardImage1}
              alt="Promotional Banner"
              className="absolute inset-0 w-full h-full object-cover"
            /> */}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black opacity-40"></div>

            {/* Foreground content */}
            <div className="relative z-10 flex flex-col gap-2">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Sharpen Your Skills With
                </h2>
                <h2 className="text-xl font-bold mb-2">
                  Professional Online Courses
                </h2>
              </div>
              <div className="mt-4 flex flex-row gap-2">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-3xl inline-flex items-center gap-2">
                  <span>Join Now</span>
                  <Icon icon="lsicon:play-filled" width="16" height="16" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Continue Watching</h3>
            <div className="flex items-center justify-between my-3">
              {/* Search Input */}
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
                  <Icon icon="uil:graph-bar" className="text-gray-500" />{" "}
                  Category
                </span>
                <span className="flex items-center space-x-2 gap-2">
                  <Icon
                    icon="material-symbols-light:dashboard-outline-rounded"
                    className="text-gray-500"
                  />{" "}
                  Category
                </span>
                <span className="flex items-center space-x-2 gap-2">
                  <Icon icon="akar-icons:sort" className="text-gray-500" /> Sort
                  by Popular
                </span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden p-1"
                  onClick={() => navigate("/user/courses/4")}
                >

                  <div className="relative">
                    <img
                      src={course.image}
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
                      <span>👥 {course.students} Student</span>
                      <span>📘 {course.modules} Modul</span>
                      <span>⏱️ {course.duration}</span>
                    </div>
                    <div className="w-full mt-1">
                      <input
                        type="range"
                        disabled
                        min="0"
                        max="100"
                        value={40}
                        className="w-full appearance-none cursor-not-allowed h-1 rounded-lg bg-gray-300 relative overflow-hidden"
                        style={{
                          WebkitAppearance: "none",
                          background: `linear-gradient(to right, black 40%, #d1d5db 40%)`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={course.instructorImage}
                          alt={course.instructor}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-gray-700 font-medium">
                          {course.instructor}
                        </span>
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  <Icon icon="uil:graph-bar" className="text-gray-500" />{" "}
                  Category
                </span>
                <span className="flex items-center space-x-2 gap-2">
                  <Icon
                    icon="material-symbols-light:dashboard-outline-rounded"
                    className="text-gray-500"
                  />{" "}
                  Category
                </span>
                <span className="flex items-center space-x-2 gap-2">
                  <Icon icon="akar-icons:sort" className="text-gray-500" /> Sort
                  by Popular
                </span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {courses?.slice(3)?.map((course, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden p-1"
                  onClick={() => navigate("/user/courses/4")}
                >
                  <div className="relative">
                    <img
                      src={course.image}
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
                      {course.name}
                    </p>
                    <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                      <span>👥 {course.students} Student</span>
                      <span>📘 {course.modules} Modul</span>
                      <span>⏱️ {course.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={course.instructorImage}
                          alt={course.instructor}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-gray-700 font-medium">
                          {course.instructor}
                        </span>
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative bg-transparent text-white rounded-lg p-6 mt-6 overflow-hidden">
          <img
            src={images.newDashboardImage1}
            alt="Promotional Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black opacity-40"></div>

          <div className="relative z-10 flex flex-col gap-2">
            <div>
              <h2 className="text-xl font-bold mb-2">
                Join and get amazing discount
              </h2>
              <p className="text-sm">
                With our responsive themes and mobile and desktop apps
              </p>
            </div>
            <div className="mt-4 flex flex-row gap-2">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-3xl inline-flex items-center gap-2">
                <span>Claim Now</span>
                <Icon icon="lsicon:play-filled" width="16" height="16" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">
            Top Content of This Week
          </h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            {topContent.map((content, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 flex items-center"
              >
                <div className="flex gap-1">
                  <img
                    src={content.image}
                    alt={content.title}
                    className="w-16 h-16 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    {content.title}
                  </h3>
                </div>
                <div>
                  <Icon icon="material-symbols:arrow-forward-ios-rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[30%]">
        <div className="space-y-6 max-w-md mx-auto px-4">
          <div className="flex flex-col justify-center">
            <p className="flex justify-end mt-4 text-2xl">
              <Icon icon="qlementine-icons:menu-dots-16 cursor-pointer" />
            </p>
            <div className="flex flex-col items-center justify-center text-center gap-4 mt-2 mb-4">
              <img
                src={images.newHandwrittenNotesImage1}
                alt="Note Thumbnail"
                className="w-[100px] h-[100px] rounded-full object-cover"
              />
            </div>

            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-900">
                Good Morning Prashant
              </h2>
              <p className="text-sm text-gray-500">
                Continue Your Journey And Achieve Your Target
              </p>
            </div>
          </div>

          <div className="">
            <p className="flex justify-between gap-2">
              <h3 className="text-base font-semibold text-gray-500 mb-3">
                Today
              </h3>
              <span className="flex gap-2">
                <Icon icon="oui:arrow-left" className="text-gray-500" />
                <Icon icon="oui:arrow-right" className="text-black" />
              </span>
            </p>

            <div className="relative">
              <img
                src={images.newDashboardUserImage2}
                alt="Course"
                className="w-full h-40 object-cover rounded-lg mb-3"
              />

              {/* <button className="absolute top-2 left-2 bg-white text-black text-xs px-2 py-1 rounded-full font-semibold shadow">
                Beginner
              </button> */}
            </div>

            <h4 className="text-base font-bold text-gray-800 mb-1">
              <span> {courseDetails.title}</span>
            </h4>
            <p className="text-sm text-gray-600 mb-1  flex items-center justify-between gap-2">
              {courseDetails.instructor}
              <span>
                <img
                  src={images.newDashboardUserImage2}
                  alt="Verified"
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
              </span>
            </p>
            <p className="text-xs text-gray-500 mb-4 flex items-center justify-between gap-2">
              👥 {courseDetails.students} Student • 📘 {courseDetails.modules}{" "}
              Module • ⏱ {courseDetails.duration}
            </p>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span className="text-black font-semibold text-lg">
                    5 Module
                  {/* {courseDetails.progress}/{courseDetails.totalModules} Done */}
                </span>
                <span>
                  {Math.round(
                    (courseDetails.progress / courseDetails.totalModules) * 100
                  )}
                  % Complete
                </span>
              </div>
              <div className="w-full  h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all"
                  style={{
                    width: `${
                      (courseDetails.progress / courseDetails.totalModules) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {courseDetails?.modulesList?.map((mod, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-1 px-2  rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium text-gray-700">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{mod.title}</span>
                  </div>
                  <span className="text-gray-500 text-xs">{mod.duration}</span>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full bg-yellow-300 hover:bg-yellow-300 text-black font-bold py-2 rounded-lg text-sm">
              Go To Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(NewUserHomePage);
