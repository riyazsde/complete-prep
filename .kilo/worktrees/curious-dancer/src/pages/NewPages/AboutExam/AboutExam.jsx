import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserBannerTopComponent } from "../../../components/common/Banners";
import { UserMenuBar } from "../../../components/common/MenuBar";
import HOC from "../../../components/layout/HOC";
import { AuthContext } from "../../../Context/AuthContext";
import { userApi } from "../../../services/apiFunctions";
import images from "../../../utils/images";

const defaultSections = [
  { key: "description", title: "About the Exam", content: "" },
  { key: "eligibilityCriteria", title: "Eligibility Criteria", content: "" },
  { key: "importantDates", title: "Important Dates", content: "" },
  { key: "syllabus", title: "Syllabus", content: "" },
  { key: "examPattern", title: "Exam Pattern", content: "" },
  {
    key: "additionalInfo",
    title: "Any Important thing to show (Data)",
    content: "",
  },
  {
    key: "importantLinks",
    title: "Important Links (Main website to apply)",
    content: "No links available",
  },
];

const AboutExam = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState(defaultSections);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { goal = "" } = user || {};
  const [examName, setExamName] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate("/login");
    } else if (user && user.goal) {
      fetchData();
    }
  }, [isAuthenticated, user]);


  const fetchData = async () => {
    userApi.aboutExam.getByGoalId({
      id: goal,
      setIsLoading: setIsLoading,
      onSuccess: (res) => { 
        const examData = res?.data?.[0];
        if (examData) {
          setExamName(examData.name || "");
          setBannerImage(examData.image || "");
          const updated = defaultSections?.map((section) => ({
            ...section,
            content: examData[section.key] || section.content,
          }));
          setSections(updated);
        }
      },
    });
  };

  return (
    <div className="">
      <div>


        <div className="user_container_width">
          <UserMenuBar />
        </div>

        <div className="user_container_width p-4">
          {isLoading ? (
            <div className="flex justify-center mt-8">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 mt-4">
              <UserBannerTopComponent
                divCSS="userAboutPageTopBannerDiv"
                imagecss="min-h-[310px] rounded-2xl"
                image={ images.newAboutPageBannerImage}
              />
              <h1 className="text-2xl font-semibold mt-6 mb-4 text-center">
                {examName || "Exam Name"}
              </h1>

              <div className="divide-y divide-gray-200">
                {sections?.map((section, index) => (
                  <div key={index} className="py-4">
                    <p className="font-bold text-lg text-black">
                      {section.title}
                    </p>
                    {section.content &&
                      (section.key === "importantLinks" ? (
                        <a
                          href={section.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 underline mt-1 inline-block"
                        >
                          {section.content}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1 whitespace-pre-line text-justify">
                          {section.content}
                        </p>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(AboutExam);
