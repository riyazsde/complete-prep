import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { userApi } from '../../../services/apiFunctions';

const SemesterExamPage1 = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      userApi.university.getAll({
        onSuccess: data => setUniversities(data?.data || []),
        onError: () => setUniversities([]),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleUniversitySelect = universityId => {
    setSelectedUniversity(universityId);
  };

  const handleSubmit = () => {
    if (!selectedUniversity) {
      alert('Please select a university/college before continuing.');
      return;
    }
    navigate(`/semester-exam/${selectedUniversity}`);
  };

  const filteredUniversities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return universities;
    return universities.filter(u => {
      const name = (u.name || '').toLowerCase();
      const city = (u.address?.city || u.location || '').toLowerCase();
      const state = (u.address?.state || '').toLowerCase();
      const country = (u.address?.country || '').toLowerCase();
      return name.includes(q) || city.includes(q) || state.includes(q) || country.includes(q);
    });
  }, [universities, searchQuery]);

  return (
    <div className="">
      <div className="user_container_width">
        <UserMenuBar />
      </div>
      <div className="mt-2 p-6">
        <div className="sm:p-2 lg:p-3 bg-white m-4 rounded-xl">
          <h1 className="text-4xl font-bold mb-6">Select University / College</h1>

          <div className="mb-4">
            <div className="relative max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search universities, city or country..."
                className="w-full pl-11 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search universities"
              />
            </div>
          </div>

          {loading ? (
            <p>Loading universities...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#efefef] p-3 border rounded">
              {filteredUniversities.map((university, index) => {
                const id = university._id || university.id || `${university.name}-${index}`;
                const isSelected = selectedUniversity === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleUniversitySelect(id)}
                    className={`flex items-center justify-between p-4 bg-white rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      isSelected ? 'ring-2 ring-yellow-300' : ''
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div>
                      <h2 className="text-lg font-semibold">{university.name}</h2>
                      <p className="text-gray-600">
                        {university.address?.city
                          ? `${university.address.city}, ${
                              university.address?.state ?? ''
                            } ${university.address?.country ?? ''}`
                          : (university.location ?? '')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        id={`uni-radio-${id}`}
                        name="selected-university"
                        type="radio"
                        checked={isSelected}
                        onChange={() => handleUniversitySelect(id)}
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

export default HOC(SemesterExamPage1);
