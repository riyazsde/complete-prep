import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';
import images from '../../../utils/images';

const NewCurrentAffairsPage1 = () => {
  const [activeTab, setActiveTab] = useState('Daily News');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '' } = user || {};
  const [newsArticles, setNewsArticles] = useState([]);
  const [dailyQuizzes, setDailyQuizzes] = useState([]);
  const [monthlyQuizzes, setMonthlyQuizzes] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchDataForActiveTab();
    }
  }, [isAuthenticated, goal, activeTab, selectedDate]);

  const fetchDataForActiveTab = () => {
    setIsLoading(true);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const formattedNextDate = nextDate.toISOString().split('T')[0];
    switch (activeTab) {
      case 'Daily News':
        userApi.currentAffairs.getDailyNews({
          params: {
            page: 1,
            limit: 99999,
            type: 'Daily News',
            startDate: selectedDate,
            endDate: formattedNextDate,
          },
          onSuccess: res => {
            setNewsArticles(res?.data || []);
            setIsLoading(false);
          },
          onError: err => {
            setNewsArticles([]);
            setIsLoading(false);
          },
        });
        break;
      case 'Editorial Analysis':
        userApi.currentAffairs.getEditorialAnalysis({
          params: {
            startDate: selectedDate,
            endDate: formattedNextDate,
            type: 'Editorial Analysis',
          },
          onSuccess: res => {
            setNewsArticles(res?.data || []);
            setIsLoading(false);
          },
          onError: err => {
            setNewsArticles([]);
            setIsLoading(false);
          },
        });
        break;
      case 'Daily Quiz':
        userApi.currentAffairs.getTargetCurrentAffairs({
          params: {
            startDate: selectedDate,
            endDate: formattedNextDate,
            type: 'Daily Quiz',
            status: 'Publish',
          },
          onSuccess: res => {
            setDailyQuizzes(res?.data || []);
            setIsLoading(false);
          },
          onError: err => {
            console.error('Failed to fetch daily quiz:', err);
            setIsLoading(false);
          },
        });
        break;
      case 'Target Current Affairs':
        userApi.currentAffairs.getTargetCurrentAffairs({
          onSuccess: res => {
            setMonthlyQuizzes(res?.data || []);
            setIsLoading(false);
          },
          onError: err => {
            console.error('Failed to fetch monthly quizzes:', err);
            setIsLoading(false);
          },
        });
        break;
      case 'Youtube Videos':
        userApi.currentAffairs.getYoutubeVideos({
          onSuccess: res => {
            setYoutubeVideos(res?.data || []);
            setIsLoading(false);
          },
          onError: err => {
            console.error('Failed to fetch YouTube videos:', err);
            setIsLoading(false);
          },
        });
        break;
      default:
        setIsLoading(false);
    }
  };

  const handleDateChange = event => {
    setSelectedDate(event.target.value);
  };

  const tabs = [
    'Daily News',
    'Editorial Analysis',
    // "Daily Quiz",
    'Target Current Affairs',
    'Youtube Videos',
  ];

  const handleDownloadPdf = () => {
    userApi.currentAffairs.getPdf({
      params: { startDate: selectedDate, endDate: selectedDate },
      onSuccess: res => {
        console.log(res);

        res.data?.[0]?.url && window.open(res.data?.[0]?.url);
      },
      onError: err => {
        console.log(err);
      },
    });
  };

  return (
    <div className="">
      <div className="">
        <UserMenuBar />
      </div>
      <div className="bg-white p-6 rounded-3xl">
        <div className="w-full">
          <div className="smallScreenFlex justify-between items-center mb-4 bg-[#f3f4f6] rounded-3xl flex-wrap p-1">
            {tabs?.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? 'bg-white text-black font-semibold shadow rounded-3xl'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="smallScreenFlex gap-2 justify-between items-center mb-4">
            {(activeTab === 'Daily News' ||
              activeTab === 'Editorial Analysis' ||
              activeTab === 'Daily Quiz') && (
              <div className="flex items-center space-x-2 bg-stone-50 rounded-3xl px-4 py-2">
                <Icon icon="akar-icons:calendar" className="text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="bg-transparent outline-none"
                />
              </div>
            )}
            {activeTab === 'Daily News' && (
              <button
                onClick={handleDownloadPdf}
                className="bg-[#3DD455] hover:bg-black text-white font-bold rounded-lg py-2 px-4 flex items-center"
              >
                <Icon icon="akar-icons:download" className="mr-2" />
                Download PDF for Today
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center mt-10">
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'Daily News' && (
                <div className="space-y-4">
                  {newsArticles?.map((article, index) => (
                    <div key={index} className="bg-[#efefef] rounded-xl p-4 flex gap-4 border">
                      <div className="w-[20%] min-w-[200px] h-auto">
                        <img
                          src={article.image || images.newHandwrittenNotesImage1}
                          alt={article.headline}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-2">{article.heading}</h2>
                        <h3 className="text-lg font-bold mb-2">{article.subheading}</h3>
                        <p className="text-gray-400 mb-4">{article.content}</p>
                        <p className="flex justify-end">
                          {/* <button className="flex items-center text-gray-900 hover:text-gray-900 font-semibold">
                            Read more{" "}
                            <Icon
                              icon="akar-icons:chevron-right"
                              className="ml-1"
                            />
                          </button> */}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Editorial Analysis' && (
                <div className="space-y-4">
                  {newsArticles.map((article, index) => (
                    <div key={index} className="bg-white rounded-xl shadow">
                      <h2 className="text-xl font-bold mb-2 text-black hover:text-violet-600 bg-violet-200 p-2 rounded-t-xl">
                        {article.heading}
                      </h2>
                      <p className="text-gray-600 mb-4 p-2">{article.content}</p>
                      <p className="flex justify-end p-1">
                        <button className="flex items-center text-gray-900 hover:text-green-800">
                          Read more <Icon icon="akar-icons:chevron-right" className="ml-1" />
                        </button>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Daily Quiz' && (
                <div className="space-y-4">
                  {dailyQuizzes.map((quiz, index) => (
                    <div key={index} className="bg-white">
                      <h2 className="text-xl font-bold mb-2 bg-violet-200 p-2 rounded-t-xl">
                        {quiz.date}
                      </h2>
                      <div className="flex justify-between items-center mb-4 mt-4">
                        <p className="text-black mb-4 flex gap-3">
                          <span>{quiz.questions}</span> <span>{quiz.marks}</span>{' '}
                          <span>{quiz.minutes}</span>
                        </p>
                        <button
                          className="bg-[#3DD455] hover:bg-black text-white font-bold rounded-lg py-2 px-4"
                          onClick={() =>
                            user?.isSubscribed
                              ? navigate(`/user/test-section/1`)
                              : showNotification({
                                  message: 'Please Subscribe to access this feature',
                                  type: 'error',
                                })
                          }
                        >
                          Attempt Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Target Current Affairs' && (
                <div className=" space-y-4">
                  {/* <div className="smallScreenFlex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Monthly MCQs</h2>
                    <div className="smallScreenFlex gap-2 space-x-2 w-full">
                      <button className="bg-gray-200 px-4 py-2 rounded-lg sm:hidden">
                        August
                      </button>
                      <button className="bg-gray-200 px-4 py-2 rounded-lg sm:hidden">
                        September
                      </button>
                      <button className="bg-gray-200 px-4 py-2 rounded-lg sm:hidden">
                        October
                      </button>
                    </div>
                  </div> */}
                  {monthlyQuizzes?.map((quiz, index) => (
                    <div key={index} className="rounded-xl overflow-hidden">
                      <h2 className="text-xl font-bold bg-gray-300 p-2 m-0">
                        Current Affairs Quiz
                      </h2>
                      <div className="smallScreenFlex justify-between gap-2 items-center p-4 px-2 bg-[#efefef]">
                        <div className="flex gap-3">
                          <span className="p-2 rounded-2xl bg-white text-black text-sm">
                            {quiz.questions} Questions
                          </span>
                          <span className="p-2 rounded-2xl bg-white text-black text-sm">
                            {quiz.marks} Marks
                          </span>
                          <span className="p-2 rounded-2xl bg-white text-black text-sm">
                            {quiz.minutes || 0} Minutes
                          </span>
                        </div>
                        <button
                          className="bg-[#3DD455] hover:bg-black text-white font-bold rounded-lg py-2 px-4"
                          onClick={() => {
                            user?.isSubscribed
                              ? navigate(
                                  `/user/test/${quiz?._id}?testSeriesFileId=${quiz?.testSeriesFiles?.[0]?._id}&bundleId=${quiz?._id}&testVariant=currentAffairs`
                                )
                              : showNotification({
                                  message: 'Please Subscribe to access this feature',
                                  type: 'error',
                                });
                          }}
                        >
                          Attempt Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Youtube Videos' && (
                <div className="space-y-4">
                  {youtubeVideos?.map((video, index) => (
                    <div
                      key={index}
                      className="bg-[#efefef] rounded-xl shadow p-4 flex sm:flex-col lg:flex-row gap-4"
                      onClick={() =>
                        user?.isSubscribed
                          ? window.open(
                              `https://www.youtube.com/watch?v=${video?.videoFileLink}`,
                              '_blank'
                            )
                          : showNotification({
                              message: 'Please Subscribe to access this feature',
                              type: 'error',
                            })
                      }
                    >
                      <div>
                        <img
                          src={video.thumbnail || images.newCoursePage4Image1}
                          alt={video.title}
                          className="w-full sm:w-[150px] lg:w-[350px] h-48 object-contain rounded-lg mb-4 sm:mb-0"
                        />
                      </div>
                      <div className="flex flex-col justify-between w-full">
                        <div>
                          <h2 className="text-xl font-bold mb-2">{video.description}</h2>
                          <p className="text-gray-600 mb-4">
                            {video.creatorName} | {video.views} | {video.daysAgo}
                          </p>
                        </div>
                        <div className="flex justify-end items-end">
                          <button className="flex items-center bg-[#3DD455] hover:bg-black text-white font-bold rounded-lg py-2 px-4">
                            Watch Now <Icon icon="akar-icons:chevron-right" className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(NewCurrentAffairsPage1);
