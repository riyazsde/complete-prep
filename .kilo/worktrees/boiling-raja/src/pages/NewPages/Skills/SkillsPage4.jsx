import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const SkillsPage4 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '' } = user || {};
  const { id, subjectId, courseId } = useParams();
  const [activeChapter, setActiveChapter] = useState(null);
  const [activeTab, setActiveTab] = useState('Videos');
  const [skill, setSkill] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchSkill();
    }
  }, [isAuthenticated, goal, id, subjectId]);

  const fetchSkill = () => {
    setIsLoading(true);
    userApi.skills.getById({
      id,
      setIsLoading,
      onSuccess: res => {
        const payload = res?.data?.data || res?.data || res || null;
        if (!payload) {
          setIsLoading(false);
          return;
        }
        setSkill(payload);
        const found = Array.isArray(payload.subjects)
          ? payload.subjects.find(s => s?.subject?._id === subjectId)
          : null;
        setCurrentSubject(found || null);
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  const getStudentsText = () => {
    if (!skill) return '42,826';
    if (skill.students) return skill.students;
    if (skill.numberOfCourses) return `${skill.numberOfCourses} courses`;
    return '42,826';
  };

  const renderTopicItems = (topicWrapper, subSubject, chapterData) => {
    const videoItems = Array.isArray(topicWrapper.courseVideos) ? topicWrapper.courseVideos : [];
    const docItems = Array.isArray(topicWrapper.educatorNotes) ? topicWrapper.educatorNotes : [];
    const testItems = Array.isArray(topicWrapper.testSeries) ? topicWrapper.testSeries : [];

    if (activeTab === 'Videos') {
      return videoItems.map(video => (
        <div
          key={video._id || video.videoLink || Math.random()}
          className="flex items-center justify-between p-2 bg-[#efefef] rounded-lg cursor-pointer hover:shadow transition"
          // onClick={() => console.log(video)}
          onClick={() =>
            navigate(
              `/user/skill/${id}/${subjectId}/${subSubject._id}/${chapterData._id}?topicId=${
                video?.topic?._id || topicWrapper._id
              }&videoId=${video?._id}`
            )
          }
        >
          <div className="flex items-center gap-4">
            <img
              src={video.thumbnail || images.newHandwrittenNotesImage1}
              alt={video.videoName || topicWrapper.topic?.name || 'Video'}
              className="object-cover rounded-md w-14 h-14"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {video.videoName || topicWrapper.topic?.name || 'Video'}
              </p>
              <p className="text-xs text-gray-500">{video.duration || '—'} | Video</p>
            </div>
          </div>
          <Icon icon="mdi:chevron-right" className="text-lg text-gray-400" />
        </div>
      ));
    }

    if (activeTab === 'Docs') {
      return docItems.map((docUrl, idx) => (
        <div
          key={docUrl || idx}
          className="flex items-center justify-between p-2 bg-[#efefef] rounded-lg cursor-pointer hover:shadow transition"
          onClick={() =>
            navigate(`/user/notes/${idx}/view`, {
              state: {
                pdfUrl: docUrl,
              },
            })
          }
        >
          <div className="flex items-center gap-4">
            <img
              src={images.newHandwrittenNotesImage1}
              alt={topicWrapper.topic?.name || 'Doc'}
              className="object-cover rounded-md w-14 h-14"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {topicWrapper.topic?.name || `Document ${idx + 1}`}
              </p>
              <p className="text-xs text-gray-500">
                Document | {Math.max(1, String(docUrl).length % 20)} pages
              </p>
            </div>
          </div>
          <Icon icon="mdi:chevron-right" className="text-lg text-gray-400" />
        </div>
      ));
    }

    if (activeTab === 'Tests') {
      return testItems.map((testId, idx) => (
        <div
          key={testId || idx}
          className="flex items-center justify-between p-2 bg-[#efefef] rounded-lg cursor-pointer hover:shadow transition"
          onClick={() =>
            navigate(
              `/user/test-series/${testId}?testVariant=studyPlannerTest&studyPlannerId=${id}`
            )
          }
        >
          <div className="flex items-center gap-4">
            <img
              src={images.newHandwrittenNotesImage1}
              alt={topicWrapper.topic?.name || 'Test'}
              className="object-cover rounded-md w-14 h-14"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {topicWrapper.topic?.name || `Test ${idx + 1}`}
              </p>
              <p className="text-xs text-gray-500">
                Test | {topicWrapper.testSeries?.length || 1} items
              </p>
            </div>
          </div>
          <Icon icon="mdi:chevron-right" className="text-lg text-gray-400" />
        </div>
      ));
    }

    return null;
  };

  return (
    <div className="user_container">
      <div className="">
        <UserMenuBar />
      </div>

      <div className="p-6">
        <div className="space-y-4 p-4 rounded-xl bg-[#efefef] border md:min-h-[calc(100vh-48px)]">
        <div className="overflow-hidden rounded-xl"></div>
        <div className="w-full">
          {/* <h1 className="text-2xl font-bold text-gray-800">
            {currentSubject?.subject?.name || ''}
          </h1> */}
          <p className="text-sm text-gray-500"></p>
        </div>
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              {currentSubject?.subSubjects?.map((subSubject, subSubIndex) => (
                <div
                  key={subSubject?._id || subSubIndex}
                  className="bg-white rounded-xl overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer"
                    onClick={() =>
                      setActiveChapter(activeChapter === subSubIndex ? null : subSubIndex)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-semibold text-black w-10">
                        {String(subSubIndex + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black">
                          {subSubject.subSubject?.name || 'Chapter'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Total {subSubject?.totalHours || '0'} Hours |{' '}
                          {subSubject?.totalLectures || '0'} lectures
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
                        {['Videos', 'Docs', 'Tests'].map(tab => (
                          <button
                            key={tab}
                            className={`sm:px-4 px-2 py-1 rounded-3xl ${
                              activeTab === tab ? 'bg-white text-black font-semibold px-4 py-1 rounded-3xl' : 'text-gray-800'
                            }`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3">
                        {subSubject?.chapters?.map((chapterData, chapIndex) => (
                          <div key={chapterData?._id || chapIndex} className="space-y-2 ">
                            {chapterData?.topics?.map((topicWrapper, topicIndex) => (
                              <div key={topicWrapper?._id || topicIndex}>
                                {renderTopicItems(topicWrapper, subSubject, chapterData)}
                              </div>
                            ))}
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

              {!currentSubject?.subSubjects?.length && (
                <div className="col-span-2 p-6 text-center text-gray-600">
                  No content available for this subject.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default HOC(SkillsPage4);
