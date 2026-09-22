import React, { useRef, useEffect, useState, useContext } from 'react';
import { Icon } from '@iconify/react';
import { userApi } from '../../services/apiFunctions';
import { AuthContext } from '../../Context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ReusableModal } from '../../components/common/ComPrepComponent/ComPrepComponent';
import { ProfileEditFormMain } from '../../components/common/New-Components/NewComponent';
import images from '../../utils/images';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef();
  const mounted = useRef(true);
  const [currentState, setCurrentState] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalJoinVisible, setModalJoinVisible] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [nextPage, setNextPage] = useState('');
  const [goalCategory, setGoalCategory] = useState([]);
  const [goal, setGoal] = useState([]);
  const [form, setForm] = useState({
    name: '',
    university: '',
    courses: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [topBanner, setTopBanner] = useState('');
  const [selectedGoalCategory, setSelectedGoalCategory] = useState('');
  const [mainUniversities, setMainUniversities] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [goalSemesters, setGoalSemesters] = useState({});
  const [semesterLoading, setSemesterLoading] = useState(false);
  const [semesterError, setSemesterError] = useState('');
  const [goalLoading, setGoalLoading] = useState(false);
  const [goalError, setGoalError] = useState('');
  const [mainUniversitiesLoading, setMainUniversitiesLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('');
  const isActive = path => location.pathname === path;

  const resetForm = () => {
    setForm({
      name: '',
      university: '',
      courses: '',
      email: '',
      phone: '',
    });
    setErrors({});
  };

  const handleModalClose = () => {
    setModalJoinVisible(false);
    resetForm();
  };
  const toggleDropdown = state => {
    setCurrentState(currentState === state ? null : state);
  };
  useEffect(() => {
    const handleClickOutside = e => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchTopBanner = async () => {
    userApi.landingPage.getTopBanner({
      params: { position: 'TOP' },
      onSuccess: data => {
        setTopBanner(data?.data?.[data?.data?.length - 1]?.image || '');
      },
    });
  };

  const fetchPopularCourses = async () => {
    userApi.landingPage.getAll({
      onSuccess: data => setPopularCourses(data?.data || []),
    });
  };

  const fetchUniversities = async () => {
    setMainUniversitiesLoading(true);
    userApi.university.getAll({
      onSuccess: data => {
        setMainUniversities(data?.data || []);
        setMainUniversitiesLoading(false);
      },
      onError: () => {
        setMainUniversities([]);
        setMainUniversitiesLoading(false);
      },
    });
  };

  const fetchGoalCategory = async () => {
    userApi.goalCategory.getAll({
      onSuccess: data => setGoalCategory(data?.data || []),
    });
  };

  const fetchGoal = async () => {
    if (!selectedGoalCategory) return;
    setGoalLoading(true);
    setGoalError('');
    userApi.universityCourse.getByUniversity({
      id: selectedGoalCategory,
      onSuccess: data => {
        setGoal(data?.data || []);
        setGoalLoading(false);
      },
      onError: error => {
        console.error('Error fetching goals:', error);
        setGoal([]);
        setGoalError('Failed to load courses.');
        setGoalLoading(false);
      },
    });
  };

  const fetchSemestersForGoal = async goalId => {
    if (!selectedGoalCategory || !goalId) return;
    setSemesterLoading(true);
    setSemesterError('');
    await userApi.semesterExam.getAll({
      params: { goalCategory: selectedGoalCategory, goal: goalId },
      onSuccess: data => {
        setGoalSemesters(prev => ({
          ...prev,
          [goalId]: data?.data || [],
        }));
      },
      onError: error => {
        console.error('Error fetching semesters for goal:', error);
        setGoalSemesters(prev => ({ ...prev, [goalId]: [] }));
        setSemesterError('Failed to load semesters.');
      },
      setIsLoading: setSemesterLoading,
    });
  };

  const handleGoalClick = item => {
    const id = item?._id;
    setSelectedGoal(id);
     sessionStorage.setItem('courseId', id);

    setNextPage(`/semester-exam/${selectedGoalCategory}/${id}`);
    if (!goalSemesters[id]) {
      fetchSemestersForGoal(id);
    }
    // setModalVisible(true);
  };

  useEffect(() => {
    setSelectedGoal('');
    setSelectedSemester('');
    setGoalSemesters({});
    setSemesterError('');
    setGoalError('');
    setGoalLoading(false);
    if (!selectedGoalCategory) {
      setGoal([]);
      return;
    }
    fetchGoal();
  }, [selectedGoalCategory]);

  useEffect(() => {
    fetchUniversities();
    fetchGoalCategory();
    fetchPopularCourses();
    fetchTopBanner();
  }, []);

  const validateField = (name, value) => {
    const err = { ...errors };
    const trimmedValue = value.trim();

    switch (name) {
      case 'name':
        if (!trimmedValue) {
          err.name = 'Name is required';
        } else if (trimmedValue.length < 2) {
          err.name = 'Name must be at least 2 characters';
        } else {
          delete err.name;
        }
        break;
      case 'university':
        if (!trimmedValue) {
          err.university = 'University is required';
        } else {
          delete err.university;
        }
        break;
      case 'courses':
        if (!trimmedValue) {
          err.courses = 'Courses is required';
        } else {
          delete err.courses;
        }
        break;
      case 'email':
        if (!trimmedValue) {
          err.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
          err.email = 'Please enter a valid email address';
        } else {
          delete err.email;
        }
        break;
      case 'phone':
        if (!trimmedValue) {
          err.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(trimmedValue)) {
          err.phone = 'Phone number must be 10 digits';
        } else {
          delete err.phone;
        }
        break;
      default:
        break;
    }

    return err;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Validate field on change
    const newErrors = validateField(name, value);
    setErrors(newErrors);
  };

  // Validate all fields
  const validate = () => {
    const err = {};

    // Validate each field
    err.name = validateField('name', form.name).name;
    err.university = validateField('university', form.university).university;
    err.courses = validateField('courses', form.courses).courses;
    err.email = validateField('email', form.email).email;
    err.phone = validateField('phone', form.phone).phone;

    // Remove undefined errors
    Object.keys(err).forEach(key => !err[key] && delete err[key]);

    return err;
  };

  const SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbyGMR_aGVtbSJboL8bvPBbqgsWntjceQ2v4OnsA5M9-KvcKyxw3kRfGR3b0iQ0sE2MW6Q/exec';

  const handleSubmit = async () => {
    const err = validate();

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    const payload = {
      name: form.name,
      university: form.university,
      courses: form.courses,
      email: form.email,
      phone: form.phone,
    };

    try {
      setLoading(true);
      setErrors({});

      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === 'success') {
        setSuccess(true);
        resetForm();
        setModalJoinVisible(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setErrors({ submit: 'Submission failed. Try again.' });
      }
    } catch (e) {
      console.error('Error submitting form:', e);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
const handleDirect = (semesterId) => {
  console.log({selectedGoal,selectedGoalCategory,selectedSemester})
    // if (!subscriptionStatus) {
    //   setModalVisible(true);
    //   return;
    // }
    userApi.profile.update({
      data: {
        goalCategory: selectedGoal,
        goal: selectedGoalCategory,
        semester: semesterId??selectedSemester,
        firstHearAboutUs: true,
      },
      onSuccess: () => {
        if (user?.firstHearAboutUs) {
          navigate('/user/home');
        } else {
          navigate('/choose/hear-about-us');
        }
      },
      onError: () => {
        navigate(-1);
      },
      setIsLoading: v => {
        if (!mounted.current) return;
        setLoading(v);
      },
    });
  };
const [step,setStep]=useState("login")
  return (
    <>
      <ReusableModal
        size="md"
        body={
          <ProfileEditFormMain
            nextPage={nextPage}
            closeModal={() => setModalVisible(false)}
            setUser={setUser}
            seletedStep={step}

          />
        }
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        footer={false}
        header={false}
      />
      <div className="w-full max-h-[600px] object-cover rounded-lg sticky top-0 bg-white z-[99]">
        <div className="flex flex-wrap gap-3 items-center justify-between md:px-6 px-3 py-3 pb-3">
          <img
            src={images.newMainLogo}
            alt="Logo"
            onClick={() => navigate('/')}
            className="md:max-w-[150px] w-[120px] object-contain cursor-pointer"
          />

          <span className="lg:hidden block cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </span>

          <div className="items-center gap-3 hidden lg:flex justify-between w-full max-w-[65%] xl:max-w-[65%]">
            <div className="relative flex flex-wrap items-center gap-2 p-1 bg-[#efefef] text-gray-500 hover:text-gray-700 rounded-3xl">
              <span
                onClick={() => toggleDropdown(0)}
                className="flex items-center gap-1 cursor-pointer hover:bg-white rounded-3xl xl:px-4 px-3 py-2"
              >
                Universities
                {currentState === 0 ? (
                  <Icon icon="akar-icons:chevron-up" />
                ) : (
                  <Icon icon="akar-icons:chevron-down" />
                )}
              </span>

              <span
                onClick={() => navigate('/about')}
                className={`cursor-pointer ${
                  isActive('/about')
                    ? 'font-semibold text-black bg-white rounded-3xl xl:px-4 px-3 py-2'
                    : 'xl:px-4 px-3 py-2'
                }`}
              >
                About
              </span>

              <span
                onClick={() => navigate('/pricing')}
                className={`cursor-pointer ${
                  isActive('/pricing')
                    ? 'font-semibold text-black bg-white rounded-3xl xl:px-4 px-3 py-2'
                    : 'xl:px-4 px-3 py-2'
                }`}
              >
                Pricing
              </span>

              <span
                onClick={() => navigate('/careers')}
                className={`cursor-pointer ${
                  isActive('/careers')
                    ? 'font-semibold text-black bg-white rounded-3xl xl:px-4 px-3 py-2'
                    : 'xl:px-4 px-3 py-2'
                }`}
              >
                Careers
              </span>

              {currentState === 0 && (
                <div className="absolute top-[110%] left-0 bg-white text-black rounded-xl border w-full md:w-[491px] p-2 z-50">
                  <div className="flex flex-wrap gap-2 pb-2 border-b md:gap-3">
                    {mainUniversitiesLoading ? (
                      <div className="px-3 py-2 text-sm bg-gray-100 rounded-3xl">
                        Loading universities...
                      </div>
                    ) : (
                      mainUniversities?.map(cat => (
                        <button
                          key={cat?._id}
                          onClick={() => {
                            sessionStorage.setItem('universityId', cat?._id);
                            setSelectedGoalCategory(cat?._id);
                          }}
                          className={`whitespace-nowrap px-2 py-1 text-sm rounded-3xl ${
                            selectedGoalCategory === cat?._id
                              ? 'bg-gray-900 text-white'
                              : 'bg-white text-black border border-gray-300'
                          }`}
                        >
                          {cat?.name}
                        </button>
                      ))
                    )}
                  </div>
                  {selectedGoalCategory && (
                    <>
                      {goalLoading ? (
                        <div className="flex justify-center items-center mt-4">
                          <span className="px-3 py-1 text-sm bg-gray-100 rounded-3xl">
                            Loading courses...
                          </span>
                        </div>
                      ) : goalError ? (
                        <div className="flex justify-center items-center mt-4">
                          <span className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-3xl">
                            {goalError}
                          </span>
                        </div>
                      ) : goal && goal.length > 0 ? (
                        <div className="flex flex-col gap-2 mt-4 max-h-[300px] overflow-y-auto">
                          {goal?.map((item, index) => (
                            <div key={index}>
                              <h5
                                className={`px-3 py-1 text-sm cursor-pointer rounded-3xl w-fit ${
                                  selectedGoal === item?._id
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                onClick={() => handleGoalClick(item)}
                              >
                                {item?.name}
                              </h5>
                              {selectedGoal === item?._id && (
                                <div className="flex flex-wrap gap-2 mt-3 border-b pb-3">
                                  {semesterLoading && selectedGoal === item?._id ? (
                                    <span className="px-3 py-1 text-sm bg-gray-100 rounded-3xl flex justify-center items-center gap-2">
                                      Loading semesters...
                                    </span>
                                  ) : semesterError ? (
                                    <span className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-3xl">
                                      {semesterError}
                                    </span>
                                  ) : (goalSemesters[item?._id] || []).length > 0 ? (
                                    (goalSemesters[item?._id] || []).map((semester, idx) => (
                                      <span
                                        key={idx}
                                        onClick={() => {
                                          setSelectedSemester(semester?._id);

                                          sessionStorage.setItem('semesterId', semester?._id);

                                          setModalVisible(true);
                                          
                                        }}
                                        className={`px-3 py-1 text-sm cursor-pointer rounded-3xl ${
                                          selectedSemester === semester?._id
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                      >
                                        {`Semester - ${semester?.semesterNumber}`}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="px-3 py-1 text-sm bg-gray-100 rounded-3xl">
                                      No semesters found
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center items-center mt-4">
                          <span className="px-3 py-1 text-sm bg-gray-100 rounded-3xl">
                            No courses found
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {setStep((prev)=>"register");setModalVisible(true)}}
                className="px-3 py-2 font-bold text-black bg-transparent border border-black hover:!border-[#3DD455] rounded-lg hover:!bg-[#3DD455] hover:!text-white"
              >
                Register
              </button>

              <button
                onClick={() => {setStep((prev)=>"login");setModalVisible(true)}}
                className="px-3 py-2 font-bold bg-[#3DD455] hover:bg-black text-white rounded-lg"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        <div className={`fixed inset-0 z-50 transition ${isSidebarOpen ? 'visible' : 'invisible'}`}>
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          />

          <div
            ref={sidebarRef}
            className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-lg p-3 transition-transform duration-300 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              {' '}
              <img
                onClick={() => navigate('/')}
                src={images.newMainLogo}
                alt="Logo"
                className="max-w-[120px]"
              />{' '}
              <button onClick={() => setIsSidebarOpen(false)}>✕</button>{' '}
            </div>{' '}
            <div className="flex flex-col gap-3 relative">
              <span
                onClick={() => toggleDropdown(0)}
                className="cursor-pointer flex items-center gap-1"
              >
                Universities
                {currentState === 0 ? (
                  <Icon icon="akar-icons:chevron-up" />
                ) : (
                  <Icon icon="akar-icons:chevron-down" />
                )}
              </span>

              <span onClick={() => navigate('/about')} className="cursor-pointer">
                About
              </span>

              <span onClick={() => navigate('/pricing')} className="cursor-pointer">
                Pricing
              </span>

              <span onClick={() => navigate('/careers')} className="cursor-pointer">
                Careers
              </span>

              {currentState === 0 && (
                <div className="bg-white text-black rounded-lg shadow-lg w-full p-2 mt-2 absolute top-6 left-0">
                  <div className="flex flex-wrap gap-2 pb-2 mb-3 border-b">
                    {mainUniversitiesLoading ? (
                      <div className="px-3 py-2 text-sm bg-gray-100 rounded-3xl">
                        Loading universities...
                      </div>
                    ) : (
                      mainUniversities?.map(cat => (
                        <button
                          key={cat?._id}
                          onClick={() => {
                            setSelectedGoalCategory(cat?._id);
                          }}
                          className={`text-start text-sm px-3 py-1 rounded-3xl ${
                            selectedGoalCategory === cat?._id
                              ? 'bg-gray-900 text-white'
                              : 'bg-white text-black border border-gray-300'
                          }`}
                        >
                          {cat?.name}
                        </button>
                      ))
                    )}
                  </div>
                  {selectedGoalCategory && (
                    <>
                      {goalLoading ? (
                        <div className="flex justify-center items-center mt-3">
                          <span className="px-3 py-1 text-sm bg-gray-100 rounded-3xl">
                            Loading courses...
                          </span>
                        </div>
                      ) : goalError ? (
                        <div className="flex justify-center items-center mt-3">
                          <span className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-3xl">
                            {goalError}
                          </span>
                        </div>
                      ) : goal && goal.length > 0 ? (
                        <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto">
                          {goal?.map((item, index) => (
                            <div key={index}>
                              <h5
                                className={`px-3 py-1 text-sm cursor-pointer rounded-3xl w-fit ${
                                  selectedGoal === item?._id
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                onClick={() => handleGoalClick(item)}
                              >
                                {item?.name}
                              </h5>
                              {selectedGoal === item?._id && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {semesterLoading && selectedGoal === item?._id ? (
                                    <span className="px-3 py-1 text-sm bg-gray-100 rounded-3xl">
                                      Loading semesters...
                                    </span>
                                  ) : semesterError ? (
                                    <span className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-3xl">
                                      {semesterError}
                                    </span>
                                  ) : (goalSemesters[item?._id] || []).length > 0 ? (
                                    (goalSemesters[item?._id] || []).map((semester, idx) => (
                                      <span
                                        key={idx}
                                        onClick={() => {
                                          setSelectedSemester(semester?._id);
                                          setModalVisible(true);
                                        }}
                                        className={`px-3 py-1 text-sm cursor-pointer rounded-3xl ${
                                          selectedSemester === semester?._id
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                      >
                                        {`Semester - ${semester?.semesterNumber}`}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="px-3 py-1 text-sm bg-gray-100 rounded-3xl">
                                      No semesters found
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center items-center mt-3">
                          <span className="px-3 py-1 text-sm bg-gray-100 rounded-3xl">
                            No courses found
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => {
                    setModalVisible(true);
                    setIsSidebarOpen(false);
                    setStep((prev)=>"register");
                  }}
                  className="px-4 py-2 border border-black rounded-lg"
                >
                  Register
                </button>

                <button
                  onClick={() => {
                    setModalVisible(true);
                    setIsSidebarOpen(false);
                    setStep((prev)=>"login");
                  }}
                  className="px-4 py-2 bg-[#3DD455] rounded-lg"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>

        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-8 text-center max-w-sm w-full mx-4 animate-in">
              <div className="text-5xl mb-4 flex items-center justify-center">
                <Icon icon="emojione:check-mark-button" className="text-[#3DD455]" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-600">Success!</h2>
              <p className="text-gray-700 mb-6 font-medium">
                You have successfully joined the waitlist. We will contact you soon!
              </p>

              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2 bg-[#3DD455] text-white rounded-lg font-medium hover:bg-green-600 transition-colors w-full"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
