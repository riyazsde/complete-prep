import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const TestSectionPage4 = () => {
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
        setTestDetails(res.data);
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

  const { currentUserDetails, leaderboard, overview, comparison } = testDetails;

  const { correctAnswers, incorrectAnswers, totalQuestions, marksObtained, totalMarks } =
    currentUserDetails.testPerformance;

  const { accuracy, rank, percentage, percentile, averageTime } = currentUserDetails;

  return (
    <div>
      <div className="bg-white text-white p-3">
        <img src={images.navBarLogo2} alt="Logo" className=" max-w-60 py-2 max-h-[60px] ml-4" onClick={()=> navigate("/user/home")} />
      </div>
      <div className="">
        <div className="mainMaxWidth mx-auto bg-white">
          <div className="bg-green-50 w-full flex flex-col lg:flex-row gap-4 items-stretch">
            <div className="flex gap-4 items-center p-3 pb-0">
              <span
                onClick={() => navigate('/user/home')}
                className="bg-gray-400 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600 transition-colors duration-300"
              >
                <Icon icon="famicons:arrow-back" />
              </span>
              Back To Home
            </div>

            
            <div className="bg-green-50 w-full">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                <div className="w-full bg-green-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-[#FFF176] via-[#fff3cd] to-[#fff9c4] rounded-lg p-4 flex items-center gap-4">
                      <div className="">
                        <img
                          src={images.newTestSectionImage1}
                          alt="User"
                          className="w-[150px] h-[150px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-2xl f ont-bold text-green-800">Congratulations! 🥳</h2>
                        <p className="text-gray-800 font-medium">{user?.fullName || 'User'}</p>
                        <p className="text-gray-700">
                          You fell short of the cut-off, keep striving for improvement.
                        </p>
                        <p className="text-gray-700 mt-1 font-medium">
                          Your score: <span className="font-bold">{marksObtained}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 h-full">
                      {[
                        {
                          label: 'Score',
                          value: `${marksObtained} / ${totalMarks}`,
                        },
                        { label: 'Accuracy', value: `${accuracy}%` },
                        { label: 'Rank', value: `${rank}` },
                        { label: 'Percentage', value: `${percentage}%` },
                        { label: 'Percentile', value: `${percentile}%` },
                        { label: 'Avg Time / Ques', value: `${averageTime}s` },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg shadow text-center flex flex-col justify-center h-full"
                        >
                          <p className="text-gray-500 text-sm">{item.label}</p>
                          <p className="text-xl font-semibold text-gray-800">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4 w-full">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Leaderboard</h3>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Icon icon="emojione:medal" className="text-yellow-500 text-2xl mr-2" />
                      <div>
                        <p className="font-bold">{entry.name}</p>
                        <p className="text-gray-600">{entry.marks}</p>
                      </div>
                    </div>
                    <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                      {entry.rank}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 w-full">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Overview</h3>
              <div className="flex justify-center">
                <div className="w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="10"
                      strokeDasharray={`${overview.correct} ${totalQuestions - overview.correct}`}
                      strokeDashoffset="25"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="10"
                      strokeDasharray={`${overview.wrong} ${totalQuestions - overview.wrong}`}
                      strokeDashoffset={`${overview.correct + 25}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="10"
                      strokeDasharray={`${overview.notVisited} ${
                        totalQuestions - overview.notVisited
                      }`}
                      strokeDashoffset={`${overview.correct + overview.wrong + 25}`}
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span>Correct</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span>Wrong</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>Not Visited</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 w-full">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">You vs Topper</h3>

              <div className="w-full text-sm md:text-base">
                {/* Table Header */}
                <div className="grid grid-cols-3 font-semibold text-gray-600 border-b pb-2 mb-2">
                  <span>Name</span>
                  <span className="text-center">You</span>
                  <span className="text-right">Topper</span>
                </div>

                {/* Table Rows */}
                {[
                  {
                    label: 'Score',
                    you: comparison.yourMarks,
                    topper: comparison.topperMarks,
                  },
                  {
                    label: 'Accuracy',
                    you: comparison.yourAccuracy,
                    topper: comparison.topperAccuracy,
                  },
                  {
                    label: 'Correct',
                    you: comparison.yourCorrect,
                    topper: comparison.topperCorrect,
                  },
                  {
                    label: 'Incorrect',
                    you: comparison.yourIncorrect,
                    topper: comparison.topperIncorrect,
                  },
                ].map(item => (
                  <div key={item.label} className="grid grid-cols-3 py-2 border-b last:border-none">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="text-center text-gray-900">{item.you}</span>
                    <span className="text-right text-gray-900">{item.topper}</span>
                  </div>
                ))}

                {/* Total Time */}
                <div className="grid grid-cols-3 pt-4 font-semibold text-blue-600">
                  <span>Total Time</span>
                  <span className="text-center">{comparison.yourTotalTime}</span>
                  <span className="text-right">{comparison.topperTotalTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full my-6 flex justify-center">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
                onClick={() =>
                  navigate(
                    `/user/test-summary/${testId}?testSeriesFileId=${testSeriesFileId}&bundleId=${bundleId}&testVariant=${testVariant}`
                  )
                }
              >
                View Detailed Solution
              </button>
              {/* <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-6 rounded transition border border-gray-300">
                View Certificate
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSectionPage4;
