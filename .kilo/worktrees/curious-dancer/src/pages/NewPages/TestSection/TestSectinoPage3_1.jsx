import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const TestSectinoPage3_1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: testId } = useParams();
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showProceedModal, setShowProceedModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const testSeriesFileId = queryParams.get('testSeriesFileId');

  // Fetch test data
  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (testId && testSeriesFileId) {
      fetchTestDetails();
    } else {
      console.error('Missing testId or testSeriesFileId');
      setIsLoading(false);
    }
  }, [isAuthenticated, testId, testSeriesFileId]);

  const fetchTestDetails = () => {
    userApi.testSeries.testSeriesByTestId({
      id: testId,
      params: { testId, testSeriesFileId },
      onSuccess: res => {
        const sections = res?.data?.testSeriesFile?.sections || [];
        const instructionFile = res?.data?.instructionFile || {};
        const allQuestions = sections.flatMap(section => section.questions);
        setQuestions(allQuestions);
        setTimeLeft(instructionFile.totalTime * 60 || 1800);
        setIsLoading(false);
      },
      onError: err => {
        console.error('Error fetching test:', err);
        setIsLoading(false);
      },
    });
  };

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 || testSubmitted) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, testSubmitted]);

  const handleAutoSubmit = () => {
    setTestSubmitted(true);
    submitTest();
  };

  const formatTime = seconds => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = option => {
    if (!testSubmitted) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestionIndex]: option,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitTest = () => {
    setIsSubmitting(true);

    // Prepare answers for submission
    const answers = questions.map((question, index) => ({
      questionId: question._id,
      selectedOption: selectedAnswers[index] || null,
    }));

    const payload = {
      testId,
      testSeriesFileId,
      answers,
    };

    // Simulate API submission
    setTimeout(() => {
      const correctAnswers = questions.filter(
        (q, i) => q.correctAnswer === selectedAnswers[i]
      ).length;

      setTestResult({
        total: questions.length,
        answered: Object.keys(selectedAnswers).length,
        correct: correctAnswers,
        incorrect: Object.keys(selectedAnswers).length - correctAnswers,
      });

      setIsSubmitting(false);
      setTestSubmitted(true);
      setShowSubmissionModal(true);
    }, 1500);
  };

  const handleSubmitTest = () => {
    if (!testSubmitted) {
      submitTest();
    }
  };

  const handleViewResult = () => {
    setShowSubmissionModal(false);
    setShowSummaryModal(true);
  };

  const handleProceed = () => {
    setShowSummaryModal(false);
    setShowProceedModal(true);
  };

  const handleCloseProceedModal = () => {
    setShowProceedModal(false);
    navigate('/');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
     <div className="bg-white text-white p-3">
        <img src={images.navBarLogo2} alt="Logo" className=" max-w-60 py-2 max-h-[60px] ml-4" onClick={()=> navigate("/user/home")} />
      </div>

      <div className="mainMaxWidth mx-auto mt-6">
        <div className="flex justify-center py-10 px-4">
          <div className="bg-white rounded-xl p-6 w-full">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <span className="text-sm text-black">14 October 2024</span>
              <span className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Q{currentQuestionIndex + 1}/{totalQuestions}
                </span>
                <span className="text-sm font-medium text-blue-600 border px-2 py-1 rounded">
                  Time: {formatTime(timeLeft)}
                </span>
              </span>
            </div>

            {currentQuestion && (
              <>
                <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>

                {currentQuestion.questionImages?.length > 0 && (
                  <img
                    src={currentQuestion.questionImages[0]}
                    alt="Question"
                    className="mb-4 w-full h-auto"
                  />
                )}

                <div className="space-y-3 mb-6">
                  {currentQuestion?.options?.map((opt, i) => (
                    <label
                      key={i}
                      htmlFor={`opt-${i}`}
                      className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer ${
                        testSubmitted ? 'opacity-75' : 'hover:bg-gray-50'
                      } ${
                        selectedAnswers[currentQuestionIndex] === opt.option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        id={`opt-${i}`}
                        name="question-option"
                        checked={selectedAnswers[currentQuestionIndex] === opt.option}
                        onChange={() => handleOptionSelect(opt.option)}
                        className="accent-blue-600"
                        disabled={testSubmitted}
                      />
                      {opt.optionImage ? (
                        <img
                          src={opt.optionImage}
                          alt={`Option ${i + 1}`}
                          className="w-20 h-auto"
                        />
                      ) : (
                        opt.option
                      )}
                    </label>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-between mt-4">
              {/* <button
                className={`${
                  currentQuestionIndex === 0
                    ? "invisible"
                    : "bg-gray-200 hover:bg-gray-300"
                } text-gray-800 font-medium py-2 px-4 rounded`}
                onClick={handlePreviousQuestion}
                disabled={testSubmitted}
              >
                Previous
              </button> */}

              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                onClick={handleSubmitTest}
                disabled={testSubmitted}
              >
                {testSubmitted ? 'Submitting...' : 'Submit'}
              </button>

              {!isLastQuestion ? (
                <button
                  className=" px-6 py-2 font-bold bg-[#3DD455] hover:bg-black text-white rounded-lg"
                  onClick={handleNextQuestion}
                  disabled={testSubmitted}
                >
                  Save & Next
                </button>
              ) : (
                <button
                  className="px-6 py-2 font-bold bg-[#3DD455] hover:bg-black text-white rounded-lg"
                  onClick={handleSubmitTest}
                  disabled={testSubmitted}
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSubmissionModal && (
        <ModalWrapper>
          {isSubmitting ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p>Submitting your test...</p>
            </div>
          ) : (
            <>
              <Icon icon="akar-icons:check" className="text-green-500 text-4xl" />
              <h2 className="text-2xl font-bold mt-2 mb-4">Test Submitted</h2>
              <button
                className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded mt-4"
                onClick={handleViewResult}
              >
                View Result
              </button>
            </>
          )}
        </ModalWrapper>
      )}

      {showSummaryModal && testResult && (
        <ModalWrapper>
          <h2 className="text-2xl font-bold mb-4">Test Summary</h2>
          <SummaryItem label="Total Questions" value={testResult.total} />
          <SummaryItem label="Answered" value={testResult.answered} />
          <SummaryItem label="Not Answered" value={testResult.total - testResult.answered} />
          <SummaryItem label="Correct" value={testResult.correct} />
          <SummaryItem label="Incorrect" value={testResult.incorrect} />
          <button
            className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg mt-4 w-full"
            onClick={handleProceed}
          >
            Proceed
          </button>
        </ModalWrapper>
      )}

      {showProceedModal && (
        <ModalWrapper>
          <h2 className="text-2xl font-bold mb-4">Proceed</h2>
          <p className="text-gray-700 mb-4">
            You have reviewed your test summary. Click proceed to continue.
          </p>
          <button
            className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg w-full"
            onClick={handleCloseProceedModal}
          >
            Proceed
          </button>
        </ModalWrapper>
      )}
    </div>
  );
};

const ModalWrapper = ({ children }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">{children}</div>
  </div>
);

const SummaryItem = ({ label, value }) => (
  <div className="flex justify-between mb-2">
    <span className="font-medium">{label}</span>
    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-semibold">{value}</span>
  </div>
);

export default TestSectinoPage3_1;
