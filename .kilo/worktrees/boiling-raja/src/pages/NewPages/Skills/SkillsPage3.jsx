import { Icon } from "@iconify/react/dist/iconify.js";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserMenuBar } from "../../../components/common/MenuBar";
import HOC from "../../../components/layout/HOC";
import { AuthContext } from "../../../Context/AuthContext";
import { userApi } from "../../../services/apiFunctions";
import { showNotification } from "../../../services/exportComponents";
import { addToCart } from "../../../utils/constants";
import images from "../../../utils/images";

const SkillsPage3 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const params = useParams();
  const { id, courseId } = params;
  const { goal = "" } = user || {};

  const [skill, setSkill] = useState(null);
  const [subjectsWrapper, setSubjectsWrapper] = useState([]);
  const [selectedSubjectWrapper, setSelectedSubjectWrapper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate("/login");
    } else if (goal) {
      fetchSkill();
    }
  }, [isAuthenticated, goal, id]);

  const fetchSkill = () => {
    setIsLoading(true);
    userApi.skills.getById({
      id,
      setIsLoading,
      onSuccess: (res) => {
        const data = res?.data || res || {};
        const fetchedSkill = data?.data || data || null;
        if (!fetchedSkill) {
          setIsLoading(false);
          return;
        }
        setSkill(fetchedSkill);
        setIsPurchased(Boolean(true || fetchedSkill.isPurchased));
        setPurchaseDate(fetchedSkill.purchaseDate || null);
        setIsInCart(Boolean(fetchedSkill.isCart));
        const wrappers = Array.isArray(fetchedSkill.subjects)
          ? fetchedSkill.subjects
          : [];
        setSubjectsWrapper(wrappers);
        if (wrappers.length > 0) {
          setSelectedSubjectWrapper(wrappers[0]);
        } else {
          setSelectedSubjectWrapper(null);
        }
        setIsLoading(false);
      },
      onError: (err) => {
        console.error("Failed to fetch skill:", err);
        setIsLoading(false);
      },
    });
  };

  const handleSubjectSelect = (subjectWrapper) => {
    // if (isPurchased) {
      const subjectId = subjectWrapper?.subject?._id;
      navigate(`/user/skill/${id}/${subjectId}`);
    // } else {
    //   showNotification({
    //     type: "error",
    //     message: isInCart
    //       ? "Please buy the bundle from cart first"
    //       : "Please add the bundle to cart first",
    //   });
    // }
  };

  return (
    <div className="user_container">
      <div className="user_container_width">
        <UserMenuBar />
      </div>
      <div className="p-6">
        <div className="">
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="flex smallScreenFlex gap-4">
              <div className="w-full lg:w-[60%] bg-[#efefef] rounded-xl border p-6 ">
                <p className="text-xl font-semibold mb-6 text-gray-800">
                  {skill?.name || ""}
                </p>

                <div className="space-y-4">
                  {subjectsWrapper?.map((wrapper, index) => (
                    <div
                      key={wrapper?.subject?._id || index}
                      onClick={() => handleSubjectSelect(wrapper)}
                      className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow transition cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            wrapper?.subject?.image || images.newSubjectImage1
                          }
                          alt={wrapper?.subject?.name || "Subject Thumbnail"}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {wrapper?.subject?.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Total{" "}
                            {wrapper?.subject?.duration || skill?.duration || 0}{" "}
                            Hours | {wrapper?.subject?.lessons || 0} lectures
                          </p>
                        </div>
                      </div>
                      <span className="text-lg text-gray-500">→</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white w-full lg:w-[40%] p-3 rounded-2xl">
                {selectedSubjectWrapper && (
                  <div className="flex-1 p-5 bg-[#efefef] rounded-2xl border">
                    <img
                      src={
                        skill?.courseImage?.[0] || images.newCoursePage1Image2
                      }
                      alt={skill?.name || "Course"}
                      className="w-full h-48 object-cover rounded-xl"
                    />

                    <p className="text-lg font-semibold mt-4 text-gray-900">
                      {skill?.goalCategory?.name ||
                        skill?.courseCategoryId?.name ||
                        skill?.name}
                    </p>

                    {skill?.courseHighlights && (
                      <>
                        <p className="text-sm font-medium mt-2 text-gray-800">
                          Course Highlights
                        </p>
                        <div className="text-sm space-y-2 mt-2">
                          {(skill?.courseHighlights || "")
                            .split("\n")
                            .map((line, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="w-2 h-2 mt-[6px] bg-blue-400 rounded-full"></span>
                                <span className="text-gray-700">{line}</span>
                              </div>
                            ))}
                        </div>
                      </>
                    )}

                    <hr className="my-4" />

                    {!isPurchased && (
                      <>
                        <input
                          type="text"
                          placeholder="Apply promo code"
                          className="border mt-4 px-3 py-2 rounded-lg w-full text-sm placeholder:text-gray-400"
                        />

                        <div className="mt-4 flex items-center gap-3">
                          <button className="w-12 h-12 flex items-center justify-center border rounded-lg bg-yellow-100 text-black hover:bg-yellow-200">
                            <Icon
                              icon="material-symbols-light:bookmark-outline"
                              className="text-2xl"
                            />
                          </button>

                          <button
                            onClick={() =>
                              addToCart({
                                id: skill?._id,
                                type: "skills",
                                onSuccess: () => {
                                  fetchSkill();
                                },
                              })
                            }
                            className="flex-1 bg-black text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                            disabled={isInCart}
                          >
                            {isInCart ? "Added To Cart" : "Add to cart"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!selectedSubjectWrapper && (
                  <div className="p-6 text-center text-gray-600">
                    No subject selected
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(SkillsPage3);
