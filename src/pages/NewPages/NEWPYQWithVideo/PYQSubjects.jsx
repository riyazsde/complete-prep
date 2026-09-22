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

  const [testSeriesList, setTestSeriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startingTestId, setStartingTestId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      logout();
      navigate('/login', { replace: true });
      return;
    }

    fetchTestSeries();
  }, [isAuthenticated]);

  const fetchTestSeries = () => {
    setIsLoading(true);

    if (!userApi?.subjects?.getAll) {
      console.error('userApi.subjects.getAll is not available');

      setTestSeriesList([]);
      setIsLoading(false);

      showNotification({
        message: 'Test series API is not configured.',
        type: 'error',
      });

      return;
    }

    const params = {};

    if (user?.semester !== undefined && user?.semester !== null) {
      params.semester = user.semester;
    }

    userApi.subjects.getAll({
      params,

      onSuccess: res => {
        console.log('Test Series Response:', res);

        let list = [];

        if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (Array.isArray(res?.data?.data)) {
          list = res.data.data;
        } else if (Array.isArray(res?.data?.subjects)) {
          list = res.data.subjects;
        } else if (Array.isArray(res?.data?.testSeries)) {
          list = res.data.testSeries;
        } else if (Array.isArray(res?.data?.bundles)) {
          list = res.data.bundles;
        } else if (Array.isArray(res?.subjects)) {
          list = res.subjects;
        }

        setTestSeriesList(list);
        setIsLoading(false);
      },

      onError: error => {
        console.error('Failed to fetch test series:', error);

        setTestSeriesList([]);
        setIsLoading(false);

        showNotification({
          message:
            error?.response?.data?.message ||
            error?.message ||
            'Failed to load test series.',
          type: 'error',
        });
      },
    });
  };

  const handleStart = test => {
    // Don't use the page's isLoading state here.
    // Otherwise the entire page/card section can show loading.
    if (!user?.isSubscribed) {
      showNotification({
        message: 'Please subscribe to access this feature',
        type: 'error',
      });
      return;
    }

    const testId = test?._id || test?.id;

    if (!testId) {
      showNotification({
        message: 'Test series ID is missing.',
        type: 'error',
      });
      return;
    }

    // Only disable the clicked button.
    setStartingTestId(testId);

    navigate(`/user/pyq-with-videos/${testId}`, {
      state: {
        data: test,
      },
    });
  };

  const formatDate = iso => {
    if (!iso) return '';

    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div>
      <div className="user_container_width">
        <UserMenuBar />
      </div>

      <div className="px-3 sm:px-4 md:px-6 py-4">
        <div className="bg-white rounded-xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Previous Year Questions
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Practice tests and previous year questions
              </p>
            </div>

            {!isLoading && testSeriesList.length > 0 && (
              <span className="text-xs sm:text-sm text-gray-500">
                {testSeriesList.length}{' '}
                {testSeriesList.length === 1 ? 'Test' : 'Tests'}
              </span>
            )}
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#3DD455] rounded-full animate-spin" />

              <p className="mt-3 text-sm text-gray-500">
                Loading test series...
              </p>
            </div>
          ) : testSeriesList.length === 0 ? (
            /* Empty State */
            <div className="text-center py-14">
              <Icon
                icon="solar:document-text-linear"
                width="42"
                height="42"
                className="mx-auto text-gray-400"
              />

              <p className="mt-3 text-sm font-medium text-gray-700">
                No test series available
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Please check your semester or try again.
              </p>

              <button
                type="button"
                onClick={fetchTestSeries}
                className="mt-4 px-4 py-2 bg-[#3DD455] hover:bg-black text-white text-sm font-semibold rounded-lg transition"
              >
                Retry
              </button>
            </div>
          ) : (
            /* Cards */
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                2xl:grid-cols-5
                gap-3
              "
            >
              {testSeriesList.map((test, index) => {
                const testId = test?._id || test?.id || index;

                const subCount = Array.isArray(test?.subSubject)
                  ? test.subSubject.length
                  : Array.isArray(test?.subjects)
                  ? test.subjects.length
                  : 0;

                const goalName =
                  test?.goal?.name ||
                  test?.goalName ||
                  '';

                const goalCategoryName =
                  test?.goalCategory?.name ||
                  test?.goalCategoryName ||
                  '';

                const title =
                  test?.bundleName ||
                  test?.name ||
                  test?.title ||
                  'Untitled Test Series';

                const description =
                  test?.bundleDescription ||
                  test?.description ||
                  '';

                const isStarting = startingTestId === testId;

                return (
                  <div
                    key={testId}
                    className="
                      group
                      bg-[#f7f7f7]
                      border border-gray-200
                      rounded-xl
                      p-3
                      flex
                      flex-col
                      min-w-0
                      transition-all
                      duration-200
                      hover:bg-white
                      hover:border-gray-300
                      hover:shadow-md
                    "
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#3DD455]/15 flex items-center justify-center shrink-0">
                        <Icon
                          icon="solar:document-text-bold"
                          width="18"
                          height="18"
                          className="text-[#159b2b]"
                        />
                      </div>

                      {test?.createdAt && (
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {formatDate(test.createdAt)}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="mt-3 min-h-[42px]">
                      <h3
                        className="
                          text-sm
                          font-semibold
                          text-gray-900
                          leading-5
                          line-clamp-2
                        "
                        title={title}
                      >
                        {title}
                      </h3>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2 min-h-[24px]">
                      {goalName && (
                        <span className="px-2 py-0.5 rounded-md bg-[#065f46] text-white text-[10px] font-medium">
                          {goalName}
                        </span>
                      )}

                      {goalCategoryName && (
                        <span className="px-2 py-0.5 rounded-md bg-[#0f766e] text-white text-[10px] font-medium">
                          {goalCategoryName}
                        </span>
                      )}

                      {test?.language && (
                        <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 text-[10px] font-medium">
                          {test.language}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="mt-3 space-y-1.5">

                      {subCount > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Icon
                            icon="solar:layers-linear"
                            width="14"
                            height="14"
                          />

                          <span>
                            {subCount} sub-topic
                            {subCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Icon
                          icon="iconoir:globe"
                          width="14"
                          height="14"
                        />

                        <span className="truncate">
                          {test?.locale ||
                            test?.language ||
                            'Global'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-2 flex-1">
                      <p className="text-[11px] leading-4 text-gray-500 line-clamp-2">
                        {description ||
                          'Practice this test and improve your preparation.'}
                      </p>
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      disabled={isStarting}
                      onClick={() => handleStart(test)}
                      className="
                        w-full
                        mt-3
                        py-2
                        px-3
                        rounded-lg
                        bg-[#3DD455]
                        hover:bg-black
                        disabled:bg-gray-400
                        disabled:cursor-not-allowed
                        text-white
                        text-xs
                        sm:text-sm
                        font-semibold
                        transition
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      {isStarting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Opening...
                        </>
                      ) : (
                        <>
                          Start
                          <Icon
                            icon="solar:arrow-right-linear"
                            width="16"
                            height="16"
                          />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(PYQSubjects);
