import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const SelectUniversity = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { nextPage } = location.state || {};
  const { setUser } = useContext(AuthContext);

  const fetchUniversities = async () => {
    setIsLoading(true);
    await userApi.goalCategory.getAll({
      onSuccess: res => {
        setUniversities(res?.data || []);
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

const handleNext = () => {
  const universityId =
    selectedUniversity || sessionStorage.getItem('universityId');

  if (!universityId) {
    alert('Please select a university.');
    return;
  }

  if (selectedUniversity) {
    sessionStorage.setItem('universityId', selectedUniversity);
  }

  navigate('/choose/university-course', {
    state: {
      universityId,
      nextPage,
    },
  });
};

  useEffect(() => {
    fetchUniversities();
  }, []);

  return (
    <div className='min-h-svh flex flex-col'>
            <div className="bg-white text-white py-3 px-4">
        <img src={images.navBarLogo2} alt="Logo" className=" max-w-60 py-2 max-h-[60px]" onClick={()=> navigate("/user/home")} />
      </div>

      <div className="bg-white px-4 py-3 flex-1 flex flex-col justify-between gap-5">
        <div className="w-full max-w-8xl mb-16">
          <h1 className="text-2xl md:text-3xl font-bold text-black text-left">
            Which University do you take?
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
            {universities?.map(u => (
              <label
                key={u?._id}
                className={`group flex items-center gap-4 rounded-xl border bg-white p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedUniversity === u?._id ? 'border-black shadow-sm' : 'border-gray-200'
                }`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={u?.imageUrl}
                    alt={u?.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{u?.name}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {u?.description?.slice(0, 100)}
                  </div>
                </div>

                <input
                  type="radio"
                  name="universityOption"
                  className="w-5 h-5 min-w-5 accent-black"
                  checked={selectedUniversity === u?._id}
                  onChange={() => setSelectedUniversity(u?._id)}
                />
              </label>
            ))}
          </div>

          {isLoading && (
            <div className="text-center mt-4 text-sm text-gray-600">Loading universities...</div>
          )}

        </div>
          {selectedUniversity && (
            <div className="flex justify-end fixed left-0 right-0 bottom-0 bg-white py-2 px-6">
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
  );
};

export default SelectUniversity;
