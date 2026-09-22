import { Icon } from '@iconify/react/dist/iconify.js';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';

const PYQSubjects = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '', semester, goalCategory } = user || {};
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchTestSeries();
    }
  }, [isAuthenticated, goal]);

  const fetchTestSeries = () => {
    userApi.subjects.getAll({
      setIsLoading,
      params: {
        semester: semester,
      },
      onSuccess: res => {
        setTestSeriesList(res?.data || []);
        setIsLoading(false);
      },
      onError: err => {
        console.error('Failed to fetch test series:', err);
        setIsLoading(false);
      },
    });
  };

  const formatDate = iso => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  return (
    <div>
      <div />
      <div className="user_container_width">
        <UserMenuBar />
      </div>

      <div>
        <div className="p-6">
          <div className="rounded-lg mb-4 bg-white">
            <div>
              <div className="space-y-4 ">
                {isLoading ? (
                  <div className="flex justify-center mt-10">
                    <p>Loading...</p>
                  </div>
                ) : testSeriesList.length === 0 ? (
                  <div className="text-center text-gray-600 py-10">No test series available.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {testSeriesList.map((test, index) => {
                      const subCount = Array.isArray(test.subSubject) ? test.subSubject.length : 0;
                      const goalName = test.goal?.name || test.goalName || '';
                      const goalCategoryName =
                        test.goalCategory?.name || test.goalCategoryName || '';
                      return (
                        <div
                          key={test?._id || index}
                          className="p-3 transition bg-[#efefef] border md:rounded-xl rounded-lg flex flex-col"
                        >
                          {/* <div className="flex items-center justify-between">
                            <img
                              src={test.tileImage || images.newCoursePage1Image1}
                              alt="Test Logo"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="flex items-center gap-1 px-2 py-1 text-xs text-black">
                              <Icon icon="twemoji:star" width="16" height="16" />
                              {test.users || '0 Users'}
                            </span>
                          </div> */}

                          <div className="flex-1">
                            <p className="text-lg text-black border-b pb-2">
                              {test.bundleName || test.name || 'Untitled'}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                              {/* {goalCategoryName && (
                                <span className="px-2 py-1 rounded-md bg-[#0f766e] text-white">
                                  {goalCategoryName}
                                </span>
                              )} */}
                              {goalName && (
                                <span className="px-2 py-1 rounded-md bg-[#065f46] text-white">
                                  {goalName}
                                </span>
                              )}
                              {test.language && (
                                <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-800">
                                  {test.language}
                                </span>
                              )}
                              {subCount > 0 && (
                                <span className="px-2 py-1 rounded-md bg-[#eef2ff] text-[#3730a3]">
                                  {subCount} sub-topic{subCount > 1 ? 's' : ''}
                                </span>
                              )}
                              {test.createdAt && (
                                <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-500">
                                  {formatDate(test.createdAt)}
                                </span>
                              )}
                            </div>

                            <div className="mt-3 text-sm text-gray-700">
                              <div className="flex items-center gap-2 pb-2 text-sm text-gray-600 border-b">
                                <span>
                                  <Icon icon="iconoir:globe" width="16" height="16" />
                                </span>
                                <span>{test.locale || test.language || 'Global'}</span>
                              </div>

                              <div className="mt-2 text-sm text-gray-700">
                                {/* {test.bundleDescription ? test.bundleDescription.slice(0, 120) : test.description || test.name} */}
                                {test.bundleDescription &&
                                  test.bundleDescription.length > 120 &&
                                  '...'}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              user?.isSubscribed
                                ? navigate(`/user/pyq-with-videos/${test._id}`, {
                                    state: { data: test },
                                  })
                                : showNotification({
                                    message: 'Please subscribe to access this feature',
                                    type: 'error',
                                  })
                            }
                            className="w-full py-2 mt-2 bg-[#3DD455] hover:bg-black text-white font-bold rounded-lg"
                          >
                            Start
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(PYQSubjects);
