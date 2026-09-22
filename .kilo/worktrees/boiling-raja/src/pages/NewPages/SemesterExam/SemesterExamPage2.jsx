import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { userApi } from '../../../services/apiFunctions';

const SemesterExamPage2 = () => {
  const navigate = useNavigate();
  const { universityId } = useParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    if (!universityId) return;
    fetchCourses();
  }, [universityId]);

  const fetchCourses = async () => {
    setLoading(true);
    userApi.universityCourse.getAll({
      params: { universityId },
      onSuccess: data => {
        setCourses(data?.data || data || []);
        setLoading(false);
      },
      onError: () => {
        setCourses([]);
        setLoading(false);
      },
    });
  };

  const handleCourseSelect = id => {
    setSelectedCourseId(id);
  };

  const handleSubmit = () => {
    if (!selectedCourseId) {
      alert('Please select a course before continuing.');
      return;
    }
    navigate(`/semester-exam/${universityId}/${selectedCourseId}`);
  };

  return (
    <div className="bg-white">
      <div className="user_container_width">
        <UserMenuBar />
      </div>
      <div className="mt-2 p-6">
        <div className="p-3">
          <h1 className="text-4xl font-bold mb-6">Select Course</h1>

          {loading ? (
            <p>Loading courses...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#efefef] p-3 border rounded">
              {courses.map((course, idx) => {
                const id = course._id || course.id || `course-${idx}`;
                const isSelected = selectedCourseId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleCourseSelect(id)}
                    className={`flex items-center justify-between p-4 bg-white rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      isSelected ? 'ring-2 ring-yellow-300' : ''
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div>
                      <h2 className="text-lg font-semibold">{course.name || ''}</h2>
                      <p className="text-gray-600">{course.code || course.description || ''}</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        id={`course-radio-${id}`}
                        name="selected-course"
                        type="radio"
                        checked={isSelected}
                        onChange={() => handleCourseSelect(id)}
                        className="w-5 h-5"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              className="bg-yellow-500 hover:bg-[#f7f700] text-black font-bold py-2 px-4 rounded-3xl"
              onClick={handleSubmit}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(SemesterExamPage2);
