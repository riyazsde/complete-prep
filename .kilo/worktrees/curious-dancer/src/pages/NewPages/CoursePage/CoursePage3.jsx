import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const CoursePage3 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '' } = user || {};
  const { id, courseId, subjectId } = useParams();
  const [activeChapter, setActiveChapter] = useState(null);
  const [activeTab, setActiveTab] = useState('Videos');
  const [chapters, setChapters] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchChapters();
    }
  }, [isAuthenticated, goal]);

  const fetchChapters = () => {
    userApi.courses.getById({
      params: { courseId, CourseType: id, subjectId, page: 1, limit: 9999 },
      setIsLoading,
      onSuccess: res => {
        const fetchedData = res?.data || [];
        const currentSubjectData = fetchedData?.[0]?.subjects?.find(
          item => item.subject?._id === subjectId
        );
        setCurrentSubject(currentSubjectData);
        setChapters(fetchedData);
        setIsLoading(false);
      },
      onError: err => {
        setIsLoading(false);
      },
    });
  };

  const filterContent = (courseVideos, tab) => {
    switch (tab) {
      case 'Videos':
        return courseVideos.filter(item => item.videoLink);
      case 'Notes':
        return courseVideos.filter(item => item.educatorNotes && item.educatorNotes.length > 0);
      case 'Tests':
        return courseVideos.filter(item => item.testSeries && item.testSeries.length > 0);
      default:
        return courseVideos;
    }
  };
  console.log({ currentSubject, chapters });
  return (
    <div className="user_container">
      <div className="">
        <UserMenuBar />
      </div>

      <div className="p-6">
        <div className=" p-3 rounded-xl bg-[#efefef] border md:min-h-[calc(100vh-48px)]">
        {/* <div>
          <img
            src={images.newAboutPageBannerCoursePageImage}
            alt="banner"
            style={{ maxHeight: '300px', width: '100%' }}
          />
        </div> */}
        {/* <div className="overflow-hidden rounded-xl"></div> */}
        <div className="w-full">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {currentSubject?.subject?.name || ''}
          </h1>
          {
            currentSubject?.subSubjects && currentSubject?.subSubjects?.length > 0 && (
          <p className="text-xs text-gray-500 mt-1 mb-4">
                          {/* Total {subSubject?.subSubject?.totalHours || '0'} Hours |{' '}
                          {subSubject?.subSubject?.totalLectures || '0'} lectures */}
                            Total {chapters[0]?.duration || '0'} Hours |{' '}
                          {chapters[0]?.lessons || '0'} lessons
                        </p>
            )
          }
          {/* <p className="text-sm text-gray-500">
            {chapters?.[0]?.courseCategoryId?.students || '42,826'} students learning this week
          </p> */}
        </div>
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
              {currentSubject?.subSubjects?.map((subSubject, subSubIndex) => (
                <div key={subSubIndex} className="bg-white rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between px-2 py-2 cursor-pointer w-full"
                    onClick={() =>
                      setActiveChapter(activeChapter === subSubIndex ? null : subSubIndex)
                    }
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-lg font-semibold text-black h-10 min-w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {String(subSubIndex + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black leading-[1.2] line-clamp-2 capitalize">
                          {subSubject?.subSubject?.name || 'Chapter'}
                        </p>

                      </div>
                    </div>
                    <Icon
                      icon={activeChapter === subSubIndex ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                      className="text-xl text-gray-500"
                    />
                  </div>

                  {activeChapter === subSubIndex && (
                    <div className="px-2 pb-2 space-y-3">
                      <div className="flex bg-[#efefef] rounded-3xl p-1 gap-2 justify-between sm:flex-wrap text-sm font-medium text-gray-700">
                        {['Videos', 'Notes', 'Tests'].map(tab => (
                          <button
                            key={tab}
                            className={`sm:px-4 px-2 py-1 rounded-3xl flex gap-2 items-center ${
                              activeTab === tab ? 'bg-[#fff] text-[#000]' : 'text-gray-800'
                            }`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab} 
                          <span className='bg-[#3dd455] text-white text-[9px] rounded-full w-4 h-4 min-w-4 flex items-center justify-center'>
  {tab === 'Videos'
    ? subSubject?.chapters?.[0]?.topics?.filter(Boolean)?.length || 0
    : tab === 'Notes'
    ? (
        subSubject?.chapters?.[0]?.topics?.[0]?.courseVideos?.filter(
          item => item?.educatorNotes?.length > 0
        )?.length ||
        subSubject?.chapters?.[0]?.topics?.[0]?.educatorNotes?.filter(Boolean)?.length ||
        0
      )
    : tab === 'Tests'
    ? (
        subSubject?.chapters?.[0]?.topics?.[0]?.courseVideos?.filter(
          item => item?.testSeries?.length > 0
        )?.length ||
        subSubject?.chapters?.[0]?.topics?.[0]?.testSeries?.filter(Boolean)?.length ||
        0
      )
    : 0}
</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3">
                        {subSubject?.chapters?.map((chapterData, chapIndex) => (
                          <div key={chapIndex} className="space-y-2 ">
                            {/* <h3 className="font-semibold text-md text-black">
                              {chapterData.chapter?.name || "Topic"}
                            </h3> */}
                            {chapterData?.topics?.map((topic, topicIndex) =>
                              filterContent(topic.courseVideos || [], activeTab).map(
                                (filteredContent, i) => {
                                  return(
                                  <div
                                    key={i}
                                    className="flex items-center justify-between px-2 bg-[#efefef] rounded-lg cursor-pointer hover:shadow transition py-2"
                                    onClick={() => {
                                      if (activeTab === 'Videos' && filteredContent.videoLink) {
                                        // console.log({i})
                                        // return navigate(
                                          
                                        //   `/user/course/${id}/${courseId}/${subjectId}/${subSubject._id}/${chapterData._id}?topicId=${topic._id}&videoId=${filteredContent._id}`
                                        // );
                                        return navigate(
  `/user/course/${id}/${courseId}/${subjectId}/${subSubject?.subSubject?._id}/${chapterData?.chapter?._id}?topicId=${topic?.topic?._id}&videoId=${filteredContent?._id}`
);
                                      }
                                      if (activeTab === 'Notes' && filteredContent.educatorNotes) {
                                        return navigate(
                                          `/user/notes/${filteredContent._id}/view`,
                                          {
                                            state: {
                                              pdfUrl:
                                                filteredContent?.handwrittenNotes?.[0]
                                                  ?.subjects?.[0]?.subSubjects?.[0]?.chapters?.[0]
                                                  ?.topics?.[0]?.handwrittenNotes?.[0],
                                            },
                                          }
                                        );
                                      }
                                      if (activeTab === 'Tests' && filteredContent._id) {
                                        return navigate(
                                          `/user/test-series/${filteredContent?.testSeries?.[0]}?testVariant=studyPlannerTest&studyPlannerId=${id}`
                                        );
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      {/* <img
                                        src={images.newHandwrittenNotesImage1}
                                        alt={
                                          filteredContent.videoName ||
                                          filteredContent.educatorNotes?.[0] ||
                                          'Content'
                                        }
                                        className="object-cover rounded-md w-14 h-14"
                                      /> */}
                                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-semibold">
                                        {topic?.topic?.name
                                          ?.trim()
                                          ?.split(" ")
                                          ?.filter(Boolean)
                                          ?.slice(0, 2)
                                          ?.map((word) => word[0]?.toUpperCase())
                                          ?.join("") || `T${topicIndex + 1}`}
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold text-gray-800 capitalize">
                                          {topic?.topic?.name || `Topic ${topicIndex + 1}`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {activeTab.slice(0, -1)}
                                           {/* | 12 Pages */}
                                        </p>
                                      </div>
                                    </div>
                                    <Icon
                                      icon="mdi:chevron-right"
                                      className="text-lg text-gray-400"
                                    />
                                  </div>
                                )}
                              )
                            )}
                          </div>
                        ))}
                        {!subSubject?.chapters?.length && (
                          <div className="p-4 text-center text-gray-600">
                            No content available for this chapter.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {!currentSubject?.subject?.subSubject?.length && !isLoading && (
            <div className="flex flex-col items-center gap-4 flex-1 h-full bg-white p-6 rounded-lg">
              <p className="text-gray-600 text-sm">No content available for this subject.</p> 
              </div>)}
        </div>
      </div>
      </div>
    </div>
  );
};

export default HOC(CoursePage3);
