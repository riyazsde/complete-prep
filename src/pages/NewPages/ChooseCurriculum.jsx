import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { userApi } from '../../services/apiFunctions';

const ChooseCurriculum = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { nextPage } = location.state || '';
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const fetchCategory = async () => {
    setSubCategory([]);
    await userApi.goalCategory.getAll({
      onSuccess: data => {
        const fetched = data?.data || [];
        setCategory(fetched);
        if (fetched.length > 0) {
          setActiveTab(fetched[0]?._id);
          fetchSubCategory(fetched[0]?._id);
        }
      },
      setIsLoading,
      onError: err => {
        console.error('Error fetching category:', err);
      },
    });
  };

  const fetchSubCategory = async id => {
    setIsLoading(true);
    await userApi.goal.getByGoalCategory({
      id,
      params: { category: id },
      onSuccess: data => {
        setSubCategory(data?.data || []);
        setSelectedOption(null);
        setSemesters([]);
        setSelectedSemester(null);
        setIsLoading(false);
      },
      onError: err => {
        console.error('Error fetching subcategory:', err);
        setIsLoading(false);
      },
    });
  };

  const fetchSemesters = async (categoryId, goalId) => {
    setIsLoading(true);
    setSemesters([]);
    setSelectedSemester(null);
    await userApi.semesterExam.getAll({
      id: goalId,
      params: { goalCategory: categoryId, goal: goalId },
      onSuccess: data => {
        setSemesters(data?.data || []);
        setIsLoading(false);
      },
      onError: err => {
        console.error('Error fetching semesters:', err);
        setIsLoading(false);
      },
    });
  };

  const handleTabClick = id => {
    setActiveTab(id);
    fetchSubCategory(id);
  };

  const handleOptionToggle = id => {
    const newSelected = selectedOption === id ? null : id;
    setSelectedOption(newSelected);
    setSelectedSemester(null);
    setSemesters([]);
    if (newSelected && activeTab) {
      fetchSemesters(activeTab, newSelected);
    }
  };

  const handleSemesterToggle = id => {
    setSelectedSemester(prev => (prev === id ? null : id));
  };

  const handleNext = () => {
    if (!activeTab || !selectedOption) {
      alert('Please select a curriculum.');
      return;
    }
    if (semesters.length > 0 && !selectedSemester) {
      alert('Please select a semester.');
      return;
    }

    const payload = {
      goalCategory: activeTab,
      goal: selectedOption,
      semester: selectedSemester,
    };

    if (selectedSemester) {
      payload.semester = selectedSemester;
    }

    userApi.profile.update({
      data: payload,
      onSuccess: updatedUser => {
        setUser(updatedUser?.data);
        if (nextPage) {
          navigate('/user/home');
          // navigate(nextPage);
        } else {
          navigate('/user/home');
        }
      },
      onError: err => {
        console.error('Error updating profile:', err);
      },
    });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div>
      <div className="bg-white text-white px-6 py-1 relative">
        <div className="flex items-center space-x-2 z-10">
          <img
            src="/path/to/your/image.png"
            alt="Logo"
            className="h-[10px] w-auto object-contain"
          />
        </div>
      </div>

      <div className="bg-white px-4 py-8">
        <div className="w-full max-w-8xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black text-left">
            Which Curriculum do you take?
          </h1>

          <div className="flex flex-wrap gap-3 mb-6">
            {category?.map(tab => (
              <button
                key={tab?._id}
                onClick={() => handleTabClick(tab?._id)}
                className={`px-4 py-2 rounded-3xl border ${
                  activeTab === tab?._id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-slate-300'
                } transition`}
              >
                {tab?.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 rounded-xl">
            {subCategory?.map(option => (
              <label
                key={option?._id}
                className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer hover:shadow transition bg-white border ${
                  selectedOption === option._id ? 'border-black' : 'border-gray-200'
                }`}
              >
                <div>
                  <div className="font-medium text-black">{option.name}</div>
                  <div className="text-sm text-gray-500">{option.description?.slice(0, 100)}</div>
                </div>
                <input
                  type="radio"
                  name="goalOption"
                  className="w-5 h-5 text-lime-500 border-gray-300 focus:ring-2 focus:ring-lime-500"
                  checked={selectedOption === option._id}
                  onChange={() => handleOptionToggle(option._id)}
                />
              </label>
            ))}
          </div>

          {semesters.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3 text-black">Select Semester</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {semesters?.map(sem => (
                  <label
                    key={sem?._id}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer hover:shadow transition bg-white border ${
                      selectedSemester === sem._id ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-black">
                        Semester {sem.name || sem?.semesterNumber}
                      </div>
                      <div className="text-sm text-gray-500">{sem.description?.slice(0, 100)}</div>
                    </div>
                    <input
                      type="radio"
                      name="semesterOption"
                      className="w-5 h-5 text-lime-500 border-gray-300 focus:ring-2 focus:ring-lime-500"
                      checked={selectedSemester === sem._id}
                      onChange={() => handleSemesterToggle(sem._id)}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center mt-4 text-sm text-gray-600">
              Loading curriculum categories...
            </div>
          )}

          {activeTab && selectedOption && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNext}
                className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChooseCurriculum;
