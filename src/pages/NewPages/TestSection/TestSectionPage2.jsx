import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const TestSectionPage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: testId } = useParams();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [instructions, setInstructions] = useState([]);
  const [instructionDetails, setInstructionDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const testSeriesFileId = queryParams.get('testSeriesFileId');
  const bundleId = queryParams.get('bundleId');
  const testVariant = queryParams.get('testVariant');

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (testId && testSeriesFileId) {
      fetchInstructions();
    } else {
      setIsLoading(false);
      console.error('Missing testId or testSeriesFileId');
    }
  }, [isAuthenticated, testId, testSeriesFileId]);

  const fetchInstructions = () => {
    let apiRequestUrl = userApi.testSeries.testSeriesByTestId;
    if (testVariant === 'pyq') {
      apiRequestUrl = userApi.pyq.pyqByTestId;
    }
    apiRequestUrl({
      id: testId,
      params: { testId, testSeriesFileId },
      setIsLoading,
      onSuccess: res => {
        const data = res?.data || {};
        const file = data.instructionFile || {};
        const rawContent = file.instructionsPage2 || '';
        const imageTag = file.instructionsPage2Image
          ? `<img src="${file.instructionsPage2Image}" alt="Instruction" class="my-4 rounded shadow-md max-w-full h-auto" />`
          : '';
        const formattedContent = rawContent.replace(/@img@:/gi, imageTag).replace(/\n/g, '<br />');
        setInstructions([formattedContent]);
        setInstructionDetails({
          totalMarks: file.totalMarks || 'N/A',
          totalTime: file.totalTime || 'N/A',
          totalQuestions: file.totalQuestion || 'N/A',
        });
        setIsLoading(false);
      },
      onError: err => {
        console.error('Error fetching instructions:', err);
        setIsLoading(false);
      },
    });
  };

  return (
    <div>
      {/* Header */}
      {/* <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-green-900 text-white">
        <img
          src={images.navBarLogo2}
          alt="Logo"
          className="max-w-[180px] md:max-w-[250px] max-h-[70px] md:max-h-[90px]"
        />
      </div> */}
       <div className="bg-white text-white p-3">
        <img src={images.navBarLogo2} alt="Logo" className=" max-w-60 py-2 max-h-[60px] ml-4" onClick={()=> navigate("/user/home")} />
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 mt-6 mb-6">
        <div className="bg-[#efefef] p-4 md:p-6 border rounded-xl">
          <h2 className="mb-4 text-lg md:text-xl font-bold">General Instructions</h2>

          {isLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : instructions.length === 0 ? (
            <div className="text-center text-gray-500">No instructions available.</div>
          ) : (
            <div className="mb-6 space-y-4 text-sm md:text-base">
              {instructions?.map((html, index) => (
                <div
                  key={index}
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ))}

              <div className="mt-4 text-gray-700">
                <p>Total Marks: {instructionDetails.totalMarks}</p>
                <p>Total Time: {instructionDetails.totalTime} minutes</p>
                <p>Total Questions: {instructionDetails.totalQuestions}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between gap-4 mt-6">
            <button
              className="w-full sm:w-auto px-4 py-2 font-semibold text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
            <button
              className="w-full sm:w-auto px-4 py-2 font-semibold text-[#f7f700] bg-[#3DD455] hover:bg-[#f7f700] hover:text-[#3DD455] rounded-md"
              onClick={() =>
                navigate(
                  `/user/test-questions/${testId}?testSeriesFileId=${testSeriesFileId}&bundleId=${bundleId}&testVariant=${testVariant}`
                )
              }
            >
              I Am Ready To Begin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSectionPage2;
