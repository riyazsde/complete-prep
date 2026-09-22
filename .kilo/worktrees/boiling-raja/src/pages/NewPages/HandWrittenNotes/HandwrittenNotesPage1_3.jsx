import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserBannerTopComponent } from "../../../components/common/Banners";
import { UserMenuBar } from "../../../components/common/MenuBar";
import HOC from "../../../components/layout/HOC";
import { AuthContext } from "../../../Context/AuthContext";
import { userApi } from "../../../services/apiFunctions";
import { addToCart, formatPurchaseDate } from "../../../utils/constants";
import images from "../../../utils/images";
import { Icon } from "@iconify/react/dist/iconify.js";

const HandwrittenNotesPage1_3 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const params = useParams();
  const { id, subjectId } = params;
  const { goal = "" } = user || {};
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate("/login");
    } else if (goal) {
      fetchCourses();
    }
  }, [isAuthenticated, goal]);

  const fetchCourses = () => {
    userApi.handWrittenNotes.getById({
      id: id,
      setIsLoading,
      onSuccess: (res) => {
        const fetchedCourses = res?.data ? [res.data] : [];
        setIsPurchased(fetchedCourses[0]?.isPurchased);
        setPurchaseDate(fetchedCourses[0]?.purchaseDate);
        setIsInCart(fetchedCourses[0]?.isCart);
        setCourses(fetchedCourses);
        if (fetchedCourses.length > 0) {
          setSelectedCourse(fetchedCourses[0]);
          const subject = fetchedCourses[0].subjects.find(
            (sub) => sub.subject._id === subjectId
          );
          setSelectedSubject(subject);
        }
        setIsLoading(false);
      },
      onError: (err) => {
        console.error("Failed to fetch courses:", err);
        setIsLoading(false);
      },
    });
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
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
              {/* <p className="text-xl font-semibold mb-4">
                {selectedSubject?.subject?.name || "Subject"}
              </p> */}
              <div className="space-y-3">
                {selectedSubject?.subSubjects?.map((subSubjectItem, index) => (
                  <div key={index} className="bg-zinc-100 rounded-lg shadow-sm">
                    <p className="font-semibold p-3">
                      {subSubjectItem?.subSubject?.name}
                    </p>
                    {subSubjectItem.chapters.map(
                      (chapterItem, chapterIndex) => (
                        <div
                          key={chapterIndex}
                          className="border-t border-gray-200"
                        >
                          <div
                            className="flex justify-between items-center p-4 cursor-pointer bg-white hover:bg-gray-50 transition"
                            onClick={() => toggleChapter(chapterItem._id)}
                          >
                            <p className="font-medium text-gray-800">
                              {chapterItem?.chapter?.name}
                            </p>
                            <svg
                              className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                                expandedChapter === chapterItem._id
                                  ? "rotate-90"
                                  : "rotate-0"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>

                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              expandedChapter === chapterItem._id
                                ? "max-h-[1000px] opacity-100"
                                : "max-h-0 opacity-0"
                            } bg-gray-50 px-6`}
                          >
                            {chapterItem.topics.length === 0 ? (
                              <p className="text-sm text-gray-500 italic py-4">
                                No topics available
                              </p>
                            ) : (
                              chapterItem.topics.map((topic, topicIndex) => (
                                <div
                                  key={topicIndex}
                                  className="py-2 border-gray-300 text-gray-700"
                                >
                                  <div
                                    className="text-sm font-medium cursor-pointer text-red-600 hover:text-blue-600 transition flex items-center justify-between gap-2 mt-2"
                                    onClick={() =>
                                      navigate(
                                        `/user/notes/${topic.topic._id}/view`,
                                        {
                                          state: {
                                            pdfUrl: topic.handwrittenNotes?.[0],
                                          },
                                        }
                                      )
                                    }
                                  >
                                    <span>{topic?.topic?.name}</span>
                                    <Icon
                                      icon="icon-park-outline:notes"
                                      className="w-5 h-5"
                                    />
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
            {selectedCourse && (
              <div className="flex-1 bg-white rounded-xl">
                <img
                  src={selectedCourse.image || images.newCoursePage1Image2}
                  alt="Course"
                  className="w-full rounded-xl"
                />
                <p className="text-lg font-semibold mt-2">
                  {selectedCourse.bundleName}
                </p>
                <div className="text-sm space-y-1">
                  <p>{selectedCourse.desc}</p>
                </div>
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

export default HOC(HandwrittenNotesPage1_3);
