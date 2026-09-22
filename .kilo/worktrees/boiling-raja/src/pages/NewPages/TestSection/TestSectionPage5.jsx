import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const TestSectionPage5 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: testId } = useParams();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [testDetails, setTestDetails] = useState(null);
  const queryParams = new URLSearchParams(location.search);
  const testSeriesFileId = queryParams.get('testSeriesFileId');
  const bundleId = queryParams.get('bundleId');
  const testVariant = queryParams.get('testVariant');

  function transformQuestions(apiResponse) {
    const { questionTimes } = apiResponse.data.currentUserDetails.testPerformance;

    return questionTimes.map(qt => {
      const correctOption = qt.correctAnswer
        ? qt.options.find(opt => opt.label === qt.correctAnswer)
        : null;

      const userAnswerOption = qt.answer ? qt.options.find(opt => opt.label === qt.answer) : null;

      return {
        question: qt.questionText || 'Question with image',
        questionImages: qt.questionImages,
        options: qt.options,
        correctAnswer: correctOption,
        userAnswer: userAnswerOption,
        explanation: qt.solution || 'No explanation provided',
        solutionImages: qt.solutionImages,
        time: formatTime(qt.timeTaken),
        videoSolution: qt.videoSolution || null,
      };
    });
  }

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  }

  const fetchTestDetails = () => {
    userApi.testSeries.trackTest({
      id: testId,
      params: {
        testId,
        testSeriesId: bundleId,
        ...(testVariant === 'currentAffairs' && {
          testId: testSeriesFileId,
          testSeriesId: testSeriesFileId,
          targetcurrentaffairsId: bundleId,
        }),
      },
      onSuccess: res => {
        const transformedQuestions = transformQuestions(res);
        setTestDetails({
          ...res.data,
          currentUserDetails: {
            ...res.data.currentUserDetails,
            testPerformance: {
              ...res.data.currentUserDetails.testPerformance,
              questionTimes: transformedQuestions,
            },
          },
        });
        setIsLoading(false);
      },
      onError: error => {
        console.error('Failed to fetch test details:', error);
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTestDetails();
    } else {
      logout();
      navigate('/login');
    }
  }, [isAuthenticated]);

  if (isLoading || !testDetails) {
    return <div>Loading...</div>;
  }

  const { currentUserDetails } = testDetails;
  const { questionTimes } = currentUserDetails.testPerformance;
  const questions = questionTimes;

  return (
    <div>
      <div className="bg-white text-white p-3">
        <img src={images.navBarLogo2} alt="Logo" className=" max-w-60 py-2 max-h-[60px] ml-4" onClick={()=> navigate("/user/home")} />
      </div>
      <div className="">
        <div className="mainMaxWidth mx-auto mt-6 bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6"></h1>
          {questions?.map((q, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-400">Question {index + 1}</span>
                <span className="flex items-center space-x-1">
                  <Icon
                    icon="memory:time-sand"
                    width="22"
                    height="22"
                    style={{ color: '#114616' }}
                  />
                  {q.time}
                </span>
              </p>
              <hr />
              <h2 className="text-xl font-bold mb-2 text-gray-600">{q.question}</h2>
              {q.questionImages?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Question ${index + 1}`}
                  className="max-w-full max-h-[400px] mx-auto block rounded-md my-2 object-contain"
                />
              ))}
              <div className="space-y-2 mb-4 text-gray-500">
                {q.options?.map((option, idx) => {
                  const isCorrect = q.correctAnswer && option.label === q.correctAnswer.label;
                  const isUser = q.userAnswer && option.label === q.userAnswer.label;
                  const isCorrectByUserOnly = !q.correctAnswer && isUser;

                  let bgClass = 'bg-white';
                  if (isCorrect && isUser) bgClass = 'bg-green-100';
                  else if (isCorrect) bgClass = 'bg-green-100';
                  else if (isUser) bgClass = 'bg-red-100';
                  else if (isCorrectByUserOnly) bgClass = 'bg-green-100';

                  return (
                    <div key={idx} className={`flex items-start p-2 rounded-lg ${bgClass}`}>
                      <div className="flex flex-col space-y-2 w-full">
                        {option.optionImage ? (
                          <img
                            src={option.optionImage}
                            alt={`Option ${idx + 1}`}
                            className="max-w-full max-h-[200px] rounded-md object-contain"
                          />
                        ) : (
                          <label className="cursor-pointer text-gray-700">
                            ({option.label}) {option.option}
                          </label>
                        )}
                        {isCorrect && (
                          <span className="ml-2 text-green-600 font-medium">Correct answer</span>
                        )}
                        {isUser && (!isCorrect || !q.correctAnswer) && (
                          <span className="ml-2 text-red-600 font-medium">Your answer</span>
                        )}
                        {isCorrectByUserOnly && (
                          <span className="ml-2 text-green-600 font-medium">Your answer</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Explanation:</h3>
                <p className="text-gray-700">{q.explanation}</p>
                {q.solutionImages?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Solution ${index + 1}`}
                    className="max-w-full max-h-[400px] mx-auto block rounded-md my-2 object-contain"
                  />
                ))}
                {q.videoSolution !== null &&
                  q.videoSolution !== undefined &&
                  q.videoSolution !== '' &&
                  q.videoSolution !== 'NA' && (
                    <video
                      src={q.videoSolution}
                      controls
                      className="max-w-full max-h-[400px] block rounded-md my-2"
                    />
                  )}
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
              onClick={() => navigate('/user/home')}
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSectionPage5;
