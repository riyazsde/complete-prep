import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';
import images from '../../../utils/images';

const TestSectionPage1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: testId } = useParams();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [instructions, setInstructions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [instructionDetails, setInstructionDetails] = useState({});
  const [instructionImage, setInstructionImage] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const testSeriesFileId = queryParams.get('testSeriesFileId');
  const bundleId = queryParams.get('bundleId');
  const testVariant = queryParams.get('testVariant');
  const studyPlannerId = queryParams.get('studyPlannerId');
  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (testId && testSeriesFileId) {
      fetchInstructions();
    } else {
      console.error('Missing testId or testSeriesFileId');
      setIsLoading(false);
    }
  }, [isAuthenticated, testId, testSeriesFileId]);

  const fetchInstructions = () => {
    let apiRequestUrl = userApi.testSeries.testSeriesByTestId;

    if (testVariant === 'pyq') {
      apiRequestUrl = userApi.pyq.pyqByTestId;
    }
    if (testVariant === 'currentAffairs') {
      apiRequestUrl = userApi.currentAffairs.getTargetCurrentAffairsById;

      userApi.cart.startTestDirectly({
        data: {
          targetcurrentaffairsId: testId,
          testSeriesId: testSeriesFileId,
        },
      });
    }
    if (testVariant === 'studyPlanner') {
      userApi.cart.startTestDirectly({
        data: {
          studyPlannerId: studyPlannerId,
          testSeriesId: testSeriesFileId,
        },
      });
    }

    apiRequestUrl({
      id: testId,
      params: { testId, testSeriesFileId },
      setIsLoading,
      onSuccess: res => {
        const data =
          testVariant === 'currentAffairs' ? res?.data?.testSeriesFiles?.[0] : res?.data || {};
        const instructionFile = data?.instructionFile || {};

        setInstructionImage(instructionFile?.instructionsPage2Image || '');

        const page2 = instructionFile?.instructionsPage1 || '';
        const parts = page2.split('@img@:');

        setInstructions(parts.filter(Boolean));

        setInstructionDetails({
          totalMarks: instructionFile?.totalMarks,
          totalTime: instructionFile?.totalTime,
          totalQuestions: instructionFile?.totalQuestion,
        });
      },
      onError: err => {
        console.error('Error fetching instructions:', err);
        setIsLoading(false);
      },
    });
  };

  return (
    <div>
     <div className="bg-white text-white p-3">
        <img src={images.navBarLogo2} alt="Logo" className=" max-w-60 py-2 max-h-[60px] ml-4" onClick={()=> navigate("/user/home")} />
      </div>
      <div className="sp-4 mx-auto max-w-5xl mt-5 mb-5 overflow-hidden">
        <div className="bg-[#efefef] p-6  border rounded-xl">
          <h2 className="mb-4 text-xl font-bold">General Instructions </h2>

          {isLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : instructions.length === 0 ? (
            <div className="text-center text-gray-500">No instructions available.</div>
          ) : (
            <div className="mb-6 space-y-4">
              {instructions.map((text, index) => (
                <div key={index} className="text-gray-700">
                  <p className="whitespace-pre-line">{text.trim()}</p>
                  {/* {index === 0 && instructionImage && (
                    <img
                      src={instructionImage}
                      alt="Instruction Visual"
                      className="w-full max-w-xl mx-auto my-4 rounded-md shadow"
                    />
                  )} */}
                </div>
              ))}
              <div className="mt-4 text-gray-700">
                <p>Total Marks: {instructionDetails.totalMarks}</p>
                <p>Total Time: {instructionDetails.totalTime} minutes</p>
                <p>Total Questions: {instructionDetails.totalQuestions}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 font-bold text-gray-900 bg-gray-200  rounded-3xl"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
            <button
              className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
              // onClick={() =>
              //   navigate(
              //     `/user/test-instructions/${testId}?testSeriesFileId=${testSeriesFileId}&bundleId=${bundleId}&testVariant=${testVariant}`
              //   )
              // }
              onClick={() =>
                user?.isSubscribed
                  ? navigate(
                      `/user/test-questions/${testId}?testSeriesFileId=${testSeriesFileId}&bundleId=${bundleId}&testVariant=${testVariant}`
                    )
                  : showNotification({
                      message: "You don't have subscription",
                      type: 'error',
                    })
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSectionPage1;
