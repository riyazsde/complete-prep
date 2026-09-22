import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserMenuBar } from "../../../components/common/MenuBar";
import HOC from "../../../components/layout/HOC";
import { userApi } from "../../../services/apiFunctions";
import images from "../../../utils/images";

const HandwrittenNotesPage1 = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bundles, setBundles] = useState([]);
  const navigate = useNavigate();
 const handleBundleClick = (bundleId) => {
    navigate(`/user/notes/${bundleId}/subjects`);
  };
  useEffect(() => {
    const fetchNotesData = async () => {
      try {
        const response = await userApi.handWrittenNotes.getAll();
        if (response?.data) {
handleBundleClick(response?.data[0]?._id);
    // navigate(`/user/notes/${response?.data[0]?.id}}/subjects`);
          const bundlesData = response.data.map((bundle) => {
            const chaptersData = bundle?.subjects.flatMap((subject) =>
              subject.subSubjects.flatMap((subSubject) =>
                subSubject.chapters.flatMap((chapter) => ({
                  chapterName: chapter.chapter.name,
                  topics: chapter.topics.map((topic) => ({
                    topicName: topic.topic.name,
                    duration: `${topic.durationOfNotes || "0"} Minutes`,
                    notesLink: topic.handwrittenNotes[0] || "",
                  })),
                }))
              )
            );

            return {
              id: bundle._id,
              bundleName: bundle.bundleName,
              author: bundle.topperName,
              pages: `${bundle.pagesCount} Pages`,
              topics: `${bundle.subjects.length} Subjects`,
              price: `₹ ${bundle.price}`,
              goalCategory: bundle.goalCategory.name,
              goalDescription: bundle.goal.description,
              goalImage: bundle.goal.image,
              chapters: chaptersData,
              image: bundle.image || images.newHandwrittenNotesImage1,
            };
          });
          setBundles(bundlesData);
        }
      } catch (error) {
        console.error("Error fetching notes data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotesData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading notes...
        </p>
      </div>
    );
  }
  
  return (
    <div className="">
      <div className="user_container_width">
        <UserMenuBar />
      </div>
      <div className="bg-white p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {bundles?.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-[#fff] border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => handleBundleClick(bundle.id)}
            >
              <img
                src={bundle.image}
                alt={bundle.bundleName}
                className="w-full h-44 object-cover rounded-t-lg"
              />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {bundle.bundleName}
                  </h2>
                  <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-3xl">
                    {bundle.goalCategory}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{bundle?.author}</p>
                <div className="text-sm text-gray-600 space-y-1 flex justify-between">
                  <p>{bundle.pages}</p>
                  <p>{bundle.topics}</p>
                </div>
                {/* <p className="text-base font-semibold text-indigo-600 pt-1">
                  {bundle.price}
                </p> */}
              </div>
            </div>
          ))}
        </div>
        {
          bundles.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10">
              No handwritten notes bundles available at the moment.
            </div>
          )
        }
      </div>
    </div>
  );
};

export default HOC(HandwrittenNotesPage1);
