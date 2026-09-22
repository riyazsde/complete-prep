import { useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const SelectUniversitySemester = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const groupName = useId();
  const mounted = useRef(false);
  const params = useParams();
  const state = location.state || null;
  const { universityId, courseId, universityName } = state || {};
  const { user } = useContext(AuthContext);

  const selectedSemesterObj = useMemo(
    () => semesters.find(s => s?._id === selectedSemester) || null,
    [semesters, selectedSemester]
  );

  useEffect(() => {
    if (!universityId) return;
    mounted.current = true;
    setIsLoading(true);
    setLoadError('');
    userApi.semesterExam.getAll({
      params: {
        goalCategory: universityId,
        goal: courseId,
      },
      onSuccess: res => {
        if (!mounted.current) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setSemesters(list);
      },
      onError: () => {
        if (!mounted.current) return;
        setLoadError('Failed to load courses. Please try again.');
      },
      setIsLoading: v => {
        if (!mounted.current) return;
        setIsLoading(v);
      },
    });
    return () => {
      mounted.current = false;
    };
  }, [universityId]);

const handleNext = () => {
  const semesterId =
    selectedSemester || sessionStorage.getItem('semesterId');

  if (!semesterId) return;

  userApi.profile.update({
    data: {
      goalCategory: universityId,
      goal: courseId,
      semester: semesterId,
      firstHearAboutUs: true,
    },
    onSuccess: () => {
      if (selectedSemester) {
        sessionStorage.setItem('semesterId', selectedSemester);
      }

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
      setIsLoading(v);
    },
  });
};

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
    <div className='min-h-svh flex flex-col'>
            <div className="bg-white text-white py-3 px-4">
        <img src={images.navBarLogo2} alt="Logo" className=" max-w-60 py-2 max-h-[60px]" onClick={()=> navigate("/user/home")} />
      </div>

      <div className="bg-white px-4 py-3 flex-1 flex flex-col justify-between gap-5">
          <div className="w-full max-w-8xl mb-16">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">Select a Semester</h1>
            {universityName ? (
              <p className="text-sm text-gray-600 mb-6">University: {universityName}</p>
            ) : null}

            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[86px] rounded-lg border border-gray-200 animate-pulse bg-gray-100"
                  />
                ))}
              </div>
            )}

            {!isLoading && loadError && (
              <div className="p-4 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
                {loadError}
              </div>
            )}

            {!isLoading && !loadError && (
              <>
                {semesters?.length === 0 ? (
                  <div className="p-4 rounded-md border border-gray-200 bg-gray-50 text-gray-700 text-sm">
                    No courses found for the selected university.
                  </div>
                ) : (
                  <div
                    role="radiogroup"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-xl"
                  >
                    {semesters?.map(c => (
                      <label
                        key={c?._id}
                        className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer hover:shadow transition bg-white border ${selectedSemester === c?._id ? 'border-black' : 'border-gray-200'}`}
                      >
                        <div className="min-w-0 pr-3">
                          <div className="font-medium text-black truncate">
                            Semester {c?.semesterNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(c?.description || '').slice(0, 100)}
                            {(c?.description || '').length > 100 ? '…' : ''}
                          </div>
                        </div>
                        <input
                          type="radio"
                          name={groupName}
                          className="w-5 h-5 min-w-5 accent-black"
                          checked={selectedSemester === c?._id}
                          onChange={() => setSelectedSemester(c?._id)}
                          aria-label={c?.name}
                        />
                      </label>
                    ))}
                  </div>
                )}

              </>
            )}
          </div>
          {!isLoading && !loadError && (
                <div className="flex justify-between fixed left-0 right-0 bottom-0 bg-white py-2 px-6">
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 rounded-lg transition bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!selectedSemester}
                    className={`bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg ${
                      !selectedSemester
                        ? 'hidden'
                        : 'text-[#f7f700] bg-[#3DD455] hover:bg-[#f7f700] hover:text-[#3DD455]'
                    }`}
                  >
                    Next
                  </button>
                </div>)}
        </div>
      </div>
    </>
  );
};

export default SelectUniversitySemester;
