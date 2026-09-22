import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { userApi } from '../../../services/apiFunctions';

const SemesterExamPage3 = () => {
  const navigate = useNavigate();
  const { universityId, courseId } = useParams();

  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSemesterId, setSelectedSemesterId] = useState(null);

  useEffect(() => {
    if (!universityId || !courseId) return;
    fetchSemesters();
  }, [universityId, courseId]);

  const fetchSemesters = async () => {
    setLoading(true);
    userApi.semesterExam?.getAll
      ? userApi.semesterExam.getAll({
          params: { goalCategory: universityId, goal: courseId },
          onSuccess: data => {
            setSemesters(data?.data || data || []);
            setLoading(false);
          },
          onError: () => {
            setSemesters([]);
            setLoading(false);
          },
        })
      : setLoading(false);
  };

  const handleSemesterSelect = id => {
    setSelectedSemesterId(id);
  };

  const handleSubmit = () => {
    if (!selectedSemesterId) {
      alert('Please select a semester before continuing.');
      return;
    }
    navigate(`/semester-exam/${universityId}/${courseId}/${selectedSemesterId}`);
  };

  return (
    <div className="bg-white">
      <div className="user_container_width">
        <UserMenuBar />
      </div>
      <div className="mt-2 p-6">
        <div className="p-3">
          <h1 className="text-4xl font-bold mb-6">Select Semester</h1>

          {loading ? (
            <p>Loading semesters...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#efefef] p-3 border rounded">
              {semesters.map((semester, idx) => {
                const id = semester._id || semester.id || `semester-${idx}`;
                const isSelected = selectedSemesterId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSemesterSelect(id)}
                    className={`flex items-center justify-between p-4 bg-white rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      isSelected ? 'ring-2 ring-yellow-300' : ''
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div>
                      <h2 className="text-lg font-semibold">{semester.stream || ''}</h2>
                      <p className="text-gray-600">
                        {semester.description || `Duration: ${semester.durationYears} years` || ''}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        id={`semester-radio-${id}`}
                        name="selected-semester"
                        type="radio"
                        checked={isSelected}
                        onChange={() => handleSemesterSelect(id)}
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
              className={`bg-yellow-500 hover:bg-[#f7f700] text-black font-bold py-2 px-4 rounded-3xl ${
                !selectedSemesterId ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              onClick={handleSubmit}
              disabled={!selectedSemesterId}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(SemesterExamPage3);
