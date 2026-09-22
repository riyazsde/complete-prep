import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserMenuBar } from "../../../components/common/MenuBar";
import HOC from "../../../components/layout/HOC";
import images from "../../../utils/images";

const CATEGORY_ITEMS = [
  {
    id: "video-ai",
    name: "Assignment Assistance",
    subtitle: "Generate explainer",
    description:
      "",
    thumbnail: "https://picsum.photos/seed/video-ai/600/360",
    path: "/user/assignment-assistance-ai/chatbot/assignment",
  },
  {
    id: "study-planner-ai",
    name: "Study Planner AI",
    subtitle: "Personalized study plans & schedules",
    description:
      "Auto-generate study plans, weekly schedules and learning milestones tailored to your course and exam dates.",
    thumbnail: "https://picsum.photos/seed/study-planner-ai/600/360",
    path: "/study-planner",
  },
  {
    id: "chatbot-ai",
    name: "Chatbot AI",
    subtitle: "Interactive Q&A & doubt resolution",
    description:
      "Ask subject questions, clarify concepts or simulate exam questions with an AI-powered tutor chatbot.",
    path: "/user/assignment-assistance-ai/chatbot",
    thumbnail: "https://picsum.photos/seed/chatbot-ai/600/360",
  },
  {
    id: "chatbot-ai",
    name: "InterView AI",
    subtitle: "Interactive Q&A & doubt resolution",
    description:
      "Ask subject questions, clarify concepts or simulate exam questions with an AI-powered tutor chatbot.",
    path: "/user/assignment-assistance-ai/chatbot/interview",
    thumbnail: "https://picsum.photos/seed/chatbot-ai/600/360",
  },
  {
    id: "chatbot-ai",
    name: "Carreer Guidance",
    subtitle: "Career Guidance",
    description:
      "Ask Carreer Guidance questions, clarify concepts or simulate exam questions with an AI-powered tutor chatbot.",
    path: "/user/assignment-assistance-ai/chatbot/carrier-guidence",
    thumbnail: "https://picsum.photos/seed/chatbot-ai/600/360",
  },
];

const AssessmentAssistancePage = () => {
  const navigate = useNavigate();
  const [items] = useState(CATEGORY_ITEMS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (id) => {
    setSelectedItem(id);
  };

  const handleNext = () => {
    if (!selectedItem) {
      alert("Please select an assistance category before continuing.");
      return;
    }
    if (selectedItem.path) navigate(selectedItem.path);
  };

  const filtered = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      return (
        (it.name || "").toLowerCase().includes(q) ||
        (it.subtitle || "").toLowerCase().includes(q) ||
        (it.description || "").toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery]);

  return (
    <div className="">
      <div className="user_container_width">
        <UserMenuBar /> 
      </div>

      <div className="mt-2 p-6">
        <div className="sm:p-2 lg:p-3 bg-white m-4 rounded-xl">
          <div>
          <img
            src={images.newAboutPageBannerCoursePageImage}
            alt="banner"
            style={{ maxHeight: "300px", width: "100%" }}
          />
        </div>
          {/* <h1 className="text-4xl font-bold mb-6">Assessment Assistance</h1> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#efefef] p-3 border rounded mt-4">
            {filtered.map((item, idx) => {
              const id = item.id || `${item.name}-${idx}`;
              const isSelected = selectedItem === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => item?.path && navigate(item?.path)}
                  className={`flex flex-col justify-between p-4 bg-white rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    isSelected ? "ring-2 ring-yellow-300" : ""
                  }`}
                  aria-pressed={isSelected}
                >
                  <div>
                    <div className="mb-3">
                      <img
                        src={item.thumbnail}
                        alt={`${item.name} thumbnail`}
                        className="w-full h-36 object-cover rounded-md"
                      />
                    </div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.subtitle}
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(AssessmentAssistancePage);
