import { Icon } from "@iconify/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserMenuBar } from "../../../components/common/MenuBar";
import HOC from "../../../components/layout/HOC";
import { AuthContext } from "../../../Context/AuthContext";
import { userApi } from "../../../services/apiFunctions";
import images from "../../../utils/images";

const StudyPlannerAi6_1Main = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = "" } = user || {};
  const { week, studyPlanId, subjectId } = useParams();
  const [activeChapter, setActiveChapter] = useState(null);
  const [activeTab, setActiveTab] = useState("Videos");
  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate("/login");
    } else if (goal) {
      fetchSubjects();
    }
  }, [isAuthenticated, goal]);

  const fetchSubjects = () => {
    userApi.studyPlanner?.getPlanById({
      id: studyPlanId,
      setIsLoading,
      onSuccess: (res) => {
        const fetchedData = res?.data || {};
        const subjectsData = fetchedData.subjects || [];
        setSubjects(subjectsData);
        const currentSubjectData = subjectsData.find(
          (item) => item.subject?._id === subjectId
        );
        setCurrentSubject(currentSubjectData);
        setIsLoading(false);
      },
      onError: (err) => {
        console.error("Failed to fetch subjects:", err);
        setIsLoading(false);
      },
    });
  };

  const filterContent = (topic, tab) => {
    if (!topic) return [];

    switch (tab) {
      case "Videos":
        return topic.courseVideos || [];
      case "Docs":
        return topic.educatorNotes && topic.educatorNotes.length > 0
          ? [{ educatorNotes: topic.educatorNotes }]
          : [];
      case "Tests":
        return topic.testSeries || [];
      default:
        return [];
    }
  };

  return (
    <div className="user_container">
       
      <div className="">
        <UserMenuBar />
      </div>
      <div className="p-6 space-y-5">
        <div className="overflow-hidden rounded-xl"></div>
        <div className="w-full">
          <h1 className="text-2xl font-bold text-gray-800">
            {currentSubject?.subject?.name || ""}
          </h1>
          <p className="text-sm text-gray-500">
            {subjects?.[0]?.subject?.students || "42,825"} students learning
            this week
          </p>
        </div>
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="space-y-3 grid grid-cols-2 gap-4">
              {currentSubject?.subSubjects?.map((subSubject, subSubIndex) => (
                <div key={subSubIndex} className="bg-gray-100 rounded-lg">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() =>
                      setActiveChapter(
                        activeChapter === subSubIndex ? null : subSubIndex
                      )
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white bg-black rounded-full">
                        {subSubIndex + 1}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {subSubject.subSubject?.name || "Chapter"}
                        </p>
                      </div>
                    </div>
                    <Icon
                      icon={
                        activeChapter === subSubIndex
                          ? "mdi:chevron-up"
                          : "mdi:chevron-down"
                      }
                      className="text-xl text-gray-500"
                    />
                  </div>
                  {activeChapter === subSubIndex && (
                    <div className="px-4 pb-4 space-y-3">
                      <div className="flex justify-between gap-4 p-1 my-2 bg-white rounded-3xl">
                        {["Videos", "Docs", "Tests"].map((tab) => (
                          <button
                            key={tab}
                            className={`sm:px-4 px-2 py-1 rounded-3xl text-md font-medium ${
                              activeTab === tab
                                ? "bg-black text-white"
                                : "text-gray-700"
                            }`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {subSubject?.chapters?.map((chapterData, chapIndex) => (
                          <div key={chapIndex} className="space-y-2">
                            <h3 className="font-semibold text-lg">
                              {chapterData.chapter?.name}
                            </h3>
                            {chapterData?.topics?.map((topic, topicIndex) => (
                              <div key={topicIndex}>
                                {filterContent(topic, activeTab)?.map(
                                  (filteredContent, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer"
                                      onClick={() => {
                                        if (
                                          activeTab === "Videos" &&
                                          filteredContent.videoLink
                                        ) {
                                          return navigate(
                                            `/user/study-planner/${week}/${studyPlanId}/${subjectId}/${subSubject._id}/${chapterData._id}?topicId=${topic._id}&videoId=${filteredContent._id}`
                                          );
                                        }
                                        if (
                                          activeTab === "Docs" &&
                                          filteredContent.educatorNotes
                                        ) {

                                          return navigate(
                                            `/user/notes/${filteredContent._id}/view`,
                                            {
                                              state: {
                                                pdfUrl:
                                                  topic
                                                    ?.handwrittenNotes?.[0]
                                                    ?.subjects?.[0]
                                                    ?.subSubjects?.[0]
                                                    ?.chapters?.[0]?.topics?.[0]
                                                    ?.handwrittenNotes?.[0],
                                              },
                                            }
                                          );
                                        }
                                        if (
                                          activeTab === "Tests" &&
                                          filteredContent._id
                                        ) {
                                          return navigate(
                                            `/user/test-series/${filteredContent._id}?testVariant=studyPlannerTest&studyPlannerId=${studyPlanId}`
                                          );
                                        }
                                      }}
                                    >
                                      <div className="flex items-center gap-4">
                                        <img
                                          src={images.newHandwrittenNotesImage1}
                                          alt={
                                            filteredContent.videoName ||
                                            filteredContent
                                              .educatorNotes?.[0] ||
                                            "Content"
                                          }
                                          className="object-cover rounded-md w-14 h-14"
                                        />
                                        <div>
                                          <p className="font-medium">
                                            {activeTab === "Tests"
                                              ? filteredContent.bundleName
                                              : activeTab === "Videos"
                                              ? filteredContent.videoName
                                              : `Doc ${i + 1}`}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {activeTab} |{" "}
                                            {filteredContent.videoDuration ||
                                              "N/A"}{" "}
                                            Minutes
                                          </p>
                                        </div>
                                      </div>
                                      <Icon
                                        icon="mdi:chevron-right"
                                        className="text-lg text-gray-400"
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(StudyPlannerAi6_1Main);
