import { Icon } from '@iconify/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const TestSectionPage3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: testId } = useParams();
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
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
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [questionStatuses, setQuestionStatuses] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState({});
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const prevIndexRef = useRef(0);
  const questionStartTimeRef = useRef(Date.now());
  const timePerQuestionRef = useRef([]);

  const queryParams = new URLSearchParams(location.search);
  const testSeriesFileId = queryParams.get('testSeriesFileId');
  const bundleId = queryParams.get('bundleId');
  const testVariant = queryParams.get('testVariant');

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
    let apiRequestUrl = userApi.testSeries.testSeriesByTestId;

    if (testVariant === 'pyq') {
      apiRequestUrl = userApi.pyq.pyqByTestId;
    }
    if (testVariant === 'currentAffairs') {
      apiRequestUrl = userApi.currentAffairs.getTargetCurrentAffairsById;
    }
    apiRequestUrl({
      id: testId,
      params: { testId, testSeriesFileId },
      onSuccess: res => {
        const sectionsData =
          testVariant === 'currentAffairs'
            ? res?.data?.testSeriesFiles?.[0]?.testSeriesFile?.sections
            : res?.data?.testSeriesFile?.sections || [];
        const instructionFile =
          testVariant === 'currentAffairs'
            ? res?.data?.testSeriesFiles?.[0]?.testSeriesFile
            : res?.data?.instructionFile || {};
        const allQuestions = sectionsData.flatMap(section => section.questions);

        const initialStatuses = {};
        const initialMarked = {};
        allQuestions.forEach((_, index) => {
          initialStatuses[index] = index === 0 ? 'current' : 'not-visited';
          initialMarked[index] = false;
        });

        setSections(sectionsData);
        setQuestions(allQuestions);
        setQuestionStatuses(initialStatuses);
        setMarkedQuestions(initialMarked);
        setTimeLeft(instructionFile.totalTime * 60 || 1800);
        setTotalMarks(instructionFile.totalMarks || 0);

        timePerQuestionRef.current = Array(allQuestions.length).fill(0);
        questionStartTimeRef.current = Date.now();

        setIsLoading(false);
      },
      onError: err => {
        console.error('Error fetching test:', err);
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    if (questions.length === 0) return;

    const prevIndex = prevIndexRef.current;
    const now = Date.now();

    const timeSpent = (now - questionStartTimeRef.current) / 1000;

    if (prevIndex >= 0 && prevIndex < questions.length) {
      timePerQuestionRef.current[prevIndex] += timeSpent;
    }

    questionStartTimeRef.current = now;

    setQuestionStatuses(prev => {
      const newStatuses = { ...prev };

      if (prevIndex !== currentQuestionIndex) {
        if (selectedAnswers[prevIndex] !== undefined) {
          newStatuses[prevIndex] = markedQuestions[prevIndex] ? 'marked-answered' : 'answered';
        } else {
          newStatuses[prevIndex] = markedQuestions[prevIndex] ? 'marked' : 'not-answered';
        }

        newStatuses[currentQuestionIndex] = 'current';
      }

      return newStatuses;
    });

    prevIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex, selectedAnswers, markedQuestions, questions.length]);

  useEffect(() => {
    if (timeLeft <= 0 || testSubmitted) return;

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
    const now = Date.now();
    const timeSpent = (now - questionStartTimeRef.current) / 1000;
    timePerQuestionRef.current[currentQuestionIndex] += timeSpent;

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

  const handleSectionClick = sectionIndex => {
    setCurrentSectionIndex(sectionIndex);
    const startIndex = sections
      .slice(0, sectionIndex)
      .reduce((sum, section) => sum + section.questions.length, 0);
    setCurrentQuestionIndex(startIndex);
  };

  const handleMarkForReview = () => {
    if (!testSubmitted) {
      setMarkedQuestions(prev => ({
        ...prev,
        [currentQuestionIndex]: !prev[currentQuestionIndex],
      }));

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  const submitTest = () => {
    setIsSubmitting(true);

    const now = Date.now();
    const timeSpent = (now - questionStartTimeRef.current) / 1000;
    timePerQuestionRef.current[currentQuestionIndex] += timeSpent;

    const answers = questions.map((question, index) => ({
      questionId: question._id,
      selectedOption: selectedAnswers[index] || null,
    }));

    const payload = {
      testId,
      answers: answers?.map(answer => answer.selectedOption),
      timesTaken: timePerQuestionRef.current,
    };
    if (testVariant === 'pyq') {
      payload.previousYearQuestionId = bundleId;
      payload.testSeriesId = bundleId;
    } else {
      payload.testSeriesId = bundleId;
    }

    userApi.logs.create({
      data: {
        event: 'Click',
        timeSpent,
        testSeries: bundleId,
        testTaken: 1,
        timeSpent: timeSpent,
      },
      onSuccess: res => {
        // console.log('Log Response:', res);
      },
    });
    let apiRequestUrl = userApi.testSeries.submitTest;
    if (testVariant === 'currentAffairs') {
      apiRequestUrl = userApi.pyq.pyqTestSubmit;
    }

    apiRequestUrl({
      data: {
        ...payload,
        ...(testVariant === 'currentAffairs' && {
          targetcurrentaffairsId: bundleId,
          testId: testSeriesFileId,
          testSeriesId: testSeriesFileId,
        }),
      },
      setIsLoading: setIsSubmitLoading,
      onSuccess: res => {
        setIsSubmitting(false);
        setShowSubmissionModal(true);
        setTestSubmitted(true);
        setTestResult({
          total: res?.data?.questionTimes?.length || 0,
          answered: answeredCount,
          correct: res?.data?.correctAnswers,
          incorrect: res?.data?.questionTimes?.length - res?.data?.correctAnswers,
        });
      },
    });
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
    navigate(
      `/user/test-result/${testId}?testSeriesFileId=${testSeriesFileId}&bundleId=${bundleId}&testVariant=${testVariant}`
    );
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const totalQuestions = questions.length;

  const statusCounts = {
    answered: 0,
    marked: 0,
    'not-visited': 0,
    'not-answered': 0,
    'marked-answered': 0,
  };

  Object.values(questionStatuses).forEach(status => {
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  if (statusCounts['current']) {
    if (selectedAnswers[currentQuestionIndex] !== undefined) {
      statusCounts['answered']++;
    } else {
      statusCounts['not-answered']++;
    }
    statusCounts['current'] = 0;
  }

  const answeredCount = statusCounts['answered'] + statusCounts['marked-answered'];
  const markedCount = statusCounts['marked'] + statusCounts['marked-answered'];
  const notVisitedCount = statusCounts['not-visited'];
  const notAnsweredCount = statusCounts['not-answered'];
  const markedAndAnsweredCount = statusCounts['marked-answered'];

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;

  const currentSection = sections[currentSectionIndex] || {};

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white text-white p-3">
        <img src={images.navBarLogo2} alt="Logo" className=" max-w-60 py-2 max-h-[60px] ml-4" onClick={()=> navigate("/user/home")} />
      </div>

      <div className="mainMaxWidth mx-auto mt-0">
        <div className="flex gap-6 px-6 py-10 smallScreenFlex">
          <div className="sm:w-[100%] lg:w-[70%] bg-white rounded-xl p-2">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-4 bg-[#efefef] p-2 rounded">
              {sections?.map((section, index) => (
                <button
                  key={index}
                  onClick={() => handleSectionClick(index)}
                  className={`px-4 py-2 rounded ${
                    currentSectionIndex === index ? 'bg-[#0f2524] text-[#e1f342]' : 'text-black'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            <div className="border rounded-xl">
              <div className="flex gap-2 border-b p-4 mb-6">
                <span>Section : </span>
                <span> {currentSection.title}</span>
              </div>
              <div className="flex justify-between items-center border-b p-4 py-0 pb-2  mb-6">
                <span className="text-md text-black font-semibold">
                  Question {currentQuestionIndex + 1}
                </span>
                <span className="flex items-center gap-3">
                  {/* <span className="text-sm text-gray-600">
                    Q{currentQuestionIndex + 1}/{totalQuestions}
                  </span> */}
                  <span className="text-sm py-1 rounded flex gap-2 text-blue-600 font-semibold">
                    <span className="border border-blue-400 rounded-md px-2 py-1">
                      Time:{' '}
                      <span className="font-semibold text-gray-600">{formatTime(timeLeft)}</span>
                    </span>
                    <span className="border border-blue-400 rounded-md px-2 py-1">
                      Marks:{' '}
                      <span className="font-semibold text-gray-600">
                        {currentSection.maximumMarks || 0}
                      </span>
                    </span>
                  </span>
                </span>
              </div>
              <div className="p-4">
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
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
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
                            checked={selectedAnswers[currentQuestionIndex] === opt.label}
                            onChange={() => handleOptionSelect(opt.label)}
                            className="accent-blue-600"
                            disabled={testSubmitted}
                          />
                          ({opt?.label}){' '}
                          {opt?.optionImage ? (
                            <img
                              src={opt.optionImage}
                              alt={`Option ${i + 1}`}
                              className="w-20 h-auto"
                            />
                          ) : (
                            opt?.option
                          )}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between mt-4 p-4">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                  onClick={handleMarkForReview}
                  disabled={testSubmitted}
                >
                  {markedQuestions[currentQuestionIndex]
                    ? 'Unmark Review'
                    : 'Mark for Review & Next'}
                </button>

                {!isLastQuestion ? (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
                    onClick={handleNextQuestion}
                    disabled={testSubmitted || isSubmitLoading}
                  >
                    Save & Next
                  </button>
                ) : (
                  <button
                    className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
                    onClick={handleSubmitTest}
                    disabled={testSubmitted || !isLastQuestion || isSubmitLoading}
                  >
                    {isSubmitLoading ? 'Submitting...' : 'Submit Test'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#efefef] rounded-xl p-6 flex flex-col items-center gap-4 shadow-md sm:w-full lg:w-[30%]">
            <div className="flex flex-col items-center gap-2">
              {user?.image && (
                <img
                  src={user?.image || images.defaultUser}
                  alt="Student"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <h2 className="text-lg font-semibold">{user?.fullName}</h2>
            </div>

            <div className="mt-4 space-y-2 text-sm w-full">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                <span className="flex gap-1 items-center">
                  <span className="font-semibold text-black bg-green-600 px-2 py-1 rounded text-xl">
                    {answeredCount}
                  </span>
                  <span>Attempted</span>
                </span>
                <span className="flex gap-1 items-center">
                  <span className="font-semibold text-black bg-yellow-500 px-2 py-1 rounded text-xl">
                    {markedCount}
                  </span>
                  <span>Marked</span>
                </span>

                <span className="flex gap-1 items-center">
                  <span className="font-semibold text-black bg-gray-500 px-2 py-1 rounded text-xl">
                    {notVisitedCount}
                  </span>
                  <span>Not Visited</span>
                </span>

                <span className="flex gap-1 items-center">
                  <span className="font-semibold text-black bg-red-600 px-2 py-1 rounded text-xl">
                    {notAnsweredCount}
                  </span>
                  <span>Not Answered</span>
                </span>
                <span className="flex gap-1 items-center">
                  <span className="font-semibold text-black bg-yellow-600 px-2 py-1 rounded text-xl">
                    {markedAndAnsweredCount}
                  </span>
                  <span>Marked & Answered</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 mt-4 w-full">
              {Array.from({ length: totalQuestions }).map((_, i) => {
                let bgColor = 'bg-white';

                if (questionStatuses[i] === 'answered') {
                  bgColor = 'bg-green-500';
                } else if (questionStatuses[i] === 'marked') {
                  bgColor = 'bg-yellow-400';
                } else if (questionStatuses[i] === 'not-visited') {
                  bgColor = 'bg-gray-400';
                } else if (questionStatuses[i] === 'not-answered') {
                  bgColor = 'bg-red-500';
                } else if (questionStatuses[i] === 'marked-answered') {
                  bgColor = 'bg-yellow-600';
                }

                return (
                  <button
                    key={i}
                    className={`border text-md px-2 py-2 rounded  ${bgColor} ${
                      currentQuestionIndex === i
                        ? 'ring-2 ring-blue-500 ring-offset-2 text-black'
                        : 'text-gray-800'
                    }`}
                    onClick={() => setCurrentQuestionIndex(i)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <button
              className="w-full mt-6 px-6 py-2 font-bold bg-[#3DD455] hover:bg-black text-white rounded-sm"
              onClick={handleSubmitTest}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading ? 'Submitting...' : 'Submit Test'}
            </button>
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
              <p className="flex justify-center">
                <Icon icon="mdi:tick-circle" className="text-green-500 text-8xl" />
              </p>
              <h2 className="text-2xl font-bold mt-2 mb-4">Test Submitted</h2>
              <button
                className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg mt-4"
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

export default TestSectionPage3;
