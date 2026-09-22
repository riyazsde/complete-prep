import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { ReusableModal } from "../../components/common/ComPrepComponent/ComPrepComponent";
import { userApi } from "../../services/apiFunctions";
import images from "../../utils/images";
import "./NewPages.css";
import { useForm } from "react-hook-form";
import { AuthContext } from '../../Context/AuthContext';
import { ProfileEditFormMain } from '../../components/common/New-Components/NewComponent';
import Footer from "./Footer";
import Header from "./Header";
import { motion } from 'framer-motion';
const courseData = {
  CBSE: {
    "CBSE CLASS 12": [
      "Applied Mathematics Class 12",
      "Biology Class 12",
      "Physics Class 12",
      "History Class 12",
      "Sociology Class 12",
      "English Core Class 12",
      "Chemistry Class 12",
    ],
    "CBSE CLASS 11": [
      "Applied Mathematics Class 11",
      "Biology Class 11",
      "Physics Class 11",
      "History Class 11",
      "Sociology Class 11",
      "English Core Class 11",
      "Chemistry Class 11",
    ],
    "CBSE CLASS 10": [
      "Mathematics Class 10",
      "Biology Class 10",
      "Physics Class 10",
      "History Class 10",
      "Science Class 10",
      "English Class 10",
      "Hindi Class 10",
    ],
    "CBSE CLASS 9": [
      "Mathematics Class 9",
      "Biology Class 9",
      "Physics Class 9",
      "History Class 9",
      "Science Class 9",
      "English Class 9",
      "Hindi Class 9",
    ],
  },
  JEE: {
    "JEE MAINS": ["Physics", "Chemistry", "Maths"],
    "JEE ADVANCED": [
      "Physics Advanced",
      "Chemistry Advanced",
      "Maths Advanced",
    ],
  },
  NEET: {
    Biology: ["Zoology", "Botany"],
    "Physics & Chemistry": ["NEET Physics", "NEET Chemistry"],
  },
  "Govt. Exam": {
    SSC: ["Math", "Reasoning", "English"],
    UPSC: ["GS", "CSAT", "Essay"],
  },
  "UG & PG": {
    BSc: ["Maths", "Physics", "Comp Sci"],
    MSc: ["Physics", "Data Science"],
  },
};

const categories = Object.keys(courseData);

const Reviews = () => {
  const [currentState, setCurrentState] = useState(null);
  const [activeCategory, setActiveCategory] = useState("CBSE");
  const [modalVisible, setModalVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);

   const [goalCategory, setGoalCategory] = useState([]);
  const [goal, setGoal] = useState([]);
    const [selectedGoalCategory, setSelectedGoalCategory] = useState("");
    const [selectedGoal, setSelectedGoal] = useState("");

  const { setUser } = useContext(AuthContext);

  const [nextPage, setNextPage] = useState('');

  const fetchGoalCategory = async () => {
      userApi.goalCategory.getAll({
        onSuccess: (data) => setGoalCategory(data?.data || []),
      });
    };
    useEffect(()=>{fetchGoalCategory()},[])

    const fetchGoal = async () => {
      userApi.subjects.getByGoalCategory({
        params: { goalCategory: selectedGoalCategory },
        onSuccess: (data) => setGoal(data?.data || []),
      });
    };
    useEffect(() => {
      fetchGoal();
    }, [selectedGoalCategory]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    userApi.testMonial.getAll({
      onSuccess: (data) => setTestimonials(data?.data || []),
    });
  };

  const navigate = useNavigate();
  const toggleDropdown = (state) => {
    setCurrentState(currentState === state ? null : state);
  };

  return (
    <>
      {" "}
     <ReusableModal
        size="md"
        body={<ProfileEditFormMain nextPage={nextPage} closeModal={() => setModalVisible(false)} setUser={setUser} />}
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        footer={false}
        header={false}
      />
      <div className="h-full mainMaxWidth">
        <Header />
        <div className="my-16 md:px-6 px-3">
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-3xl text-lg font-medium text-gray-700 border border-gray-300">
              <Icon icon="proicons:emoji" className="text-xl" />
              <span>Our Testimonials</span>
            </div>
          </div>

          <h2 className="text-center text-4xl font-bold mt-4 text-black">
            User Reviews and Feedback
          </h2>
          <p className="text-center text-gray-500 mt-2 text-sm md:text-base max-w-xl mx-auto">
            See how Capcable has transformed users’ social experiences through
            their own words.
          </p>
          <div>
            <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, index) => (
                               <motion.div
                                 key={index}
                                 initial={{ opacity: 0, y: 40 }}
                                 whileInView={{ opacity: 1, y: 0 }}
                                 transition={{ duration: 1, delay: index * 0.2 }}
                                 viewport={{ once: true }}
                                 className="md:p-4 p-3 md:rounded-xl rounded-lg bg-[#efefef]"
                               >
                                 <div className="flex items-center gap-4 mb-1">
                                   <div>
                                     {t.avatar ? (
                                       <img
                                         src={t.avatar}
                                         alt={t.name}
                                         className="w-12 h-12 rounded-full object-cover"
                                       />
                                     ) : (
                                       <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-semibold text-lg uppercase">
                                         {t.name
                                           ?.split(' ')
                                           .slice(0, 2)
                                           .map(word => word.charAt(0))
                                           .join('')}
                                       </div>
                                     )}
                                   </div>
             
                                   <div>
                                     <h3 className="font-semibold text-lg text-gray-800">{t.name}</h3>
                                     <p className="text-sm text-gray-500">{t.designation}</p>
             
                                     {t.rating && <div className="text-yellow-500">{'★'.repeat(t.rating)}</div>}
                                   </div>
                                 </div>
             
                                 <p className="text-gray-600">{t.review}</p>
                               </motion.div>
                             ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Reviews;
