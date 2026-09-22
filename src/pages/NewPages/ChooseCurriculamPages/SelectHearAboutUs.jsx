// src/pages/curriculum/SelectHearAboutUs.jsx
import { useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const OPTIONS = [
  { id: 'search', label: 'Search' },
  { id: 'friend_and_family', label: 'Friend and Family' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'your_campus', label: 'Your Campus' },
];

const SelectHearAboutUs = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const groupName = useId();
  const mounted = useRef(false);
  const state = location.state || {};
  const {
    universityId,
    universityName,
    courseId,
    courseName,
    semester: semesterId,
    nextPage,
  } = state;
  const { user } = useContext(AuthContext);

  const selectedLabel = useMemo(
    () => OPTIONS.find(o => o.id === selectedSource)?.label || '',
    [selectedSource]
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (!selectedSource) return;
    setSaveError('');
    setIsSaving(true);
    console.log(selectedSource, user);
    userApi.profile.update({
      data: {
        firstHearAboutUs: true,
        hearAboutUs: selectedSource,
      },
      onSuccess: () => {
        if (!mounted.current) return;
        const target = nextPage || '/user/home';
        navigate(target, {
          state: {
            universityId,
            universityName,
            courseId,
            courseName,
            semester: semesterId,
            referralSource: selectedSource,
          },
        });
      },
      onError: () => {
        if (!mounted.current) return;
        setSaveError('Failed to save your selection. Please try again.');
      },
      setIsLoading: v => {
        if (!mounted.current) return;
        setIsSaving(v);
      },
    });
  };

  return (
    <div>
      <div className="bg-gray-200 text-white px-6 py-1 relative">
        <div className="flex items-center space-x-1 z-10">
          <img src={images.navBarLogo2} alt="Logo" className="max-w-[150px] py-2" />
        </div>
      </div>

      <div className="bg-white px-4 py-8 h-[calc(100vh-74px)] overflow-auto">
        <div className="w-full max-w-8xl flex flex-col h-full">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-black">
            How did you hear about us?
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            {universityName ? `University: ${universityName}` : ''}{' '}
            {courseName ? `• Course: ${courseName}` : ''}
          </p>

          {saveError && (
            <div className="p-4 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm mb-4">
              {saveError}
            </div>
          )}

          <div
            role="radiogroup"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 rounded-xl"
          >
            {OPTIONS.map(opt => (
              <label
                key={opt.id}
                className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer hover:shadow transition bg-white border ${
                  selectedSource === opt.id ? 'border-black' : 'border-gray-200'
                }`}
              >
                <div className="min-w-0 pr-3">
                  <div className="font-medium text-black truncate">{opt.label}</div>
                </div>
                <input
                  type="radio"
                  name={groupName}
                  className="w-5 h-5 min-w-5 accent-black"
                  checked={selectedSource === opt.id}
                  onChange={() => setSelectedSource(opt.id)}
                  aria-label={opt.label}
                />
              </label>
            ))}
          </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-lg transition bg-gray-100 text-gray-800 hover:bg-gray-200"
              disabled={isSaving}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedSource || isSaving}
              className={`px-4 py-2 rounded-lg transition ${
                !selectedSource || isSaving
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'text-[#fff] bg-[#3DD455] hover:bg-[#000] hover:text-[#fff]'
              }`}
            >
              {isSaving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectHearAboutUs;
