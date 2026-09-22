import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import api from '../../../services/api';
import { showNotification } from '../../../services/exportComponents';
import images from '../../../utils/images';

const TestSeriesPage1 = () => {
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const [testSeriesList, setTestSeriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check authentication and fetch practice questions
   */
  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
      return;
    }

    fetchPracticeQuestions();
  }, [isAuthenticated]);

  /**
   * Fetch Practice Questions
   *
   * API:
   * GET /user/practice-questions
   *
   * NOTE: The axios instance (`api`) already has `/api/v1`
   * in its baseURL, so we must NOT include it here again.
   */
  const fetchPracticeQuestions = async () => {
    try {
      setIsLoading(true);

      const response = await api.get('/user/practice-questions');

      console.log('Practice Questions API Response:', response);

      const practiceQuestions = response?.data?.data || [];

      setTestSeriesList(practiceQuestions);
    } catch (error) {
      console.error('Failed to fetch practice questions:', error);

      setTestSeriesList([]);

      showNotification({
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch practice questions',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Start Test
   */
  const handleStartTest = test => {
    if (!test?._id) {
      showNotification({
        message: 'Test information is missing',
        type: 'error',
      });

      return;
    }

    if (!user?.isSubscribed) {
      showNotification({
        message: "You don't have subscription",
        type: 'error',
      });

      return;
    }

    navigate(`/user/test-series/${test._id}`);
  };

  /**
   * Get image safely
   */
  const getTestImage = test => {
    return (
      test?.goalCategory?.imageUrl ||
      test?.goal?.image ||
      images.newCoursePage1Image1
    );
  };

  /**
   * Format description
   */
  const getDescription = description => {
    if (!description) {
      return 'Practice with mock tests and improve your preparation.';
    }

    return description;
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="p-3 md:p-5">
        {/* =========================================
            PAGE HEADER
        ========================================= */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                Practice Questions
              </h1>

              <p className="mt-0.5 text-xs text-gray-500 md:text-sm">
                Practice mock tests and improve your preparation.
              </p>
            </div>

            {!isLoading && testSeriesList.length > 0 && (
              <div className="hidden px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm sm:block">
                <div className="flex items-center gap-1.5">
                  <Icon
                    icon="mdi:clipboard-text-outline"
                    width="16"
                    height="16"
                    className="text-green-500"
                  />

                  <span className="text-xs font-medium text-gray-700">
                    {testSeriesList.length}{' '}
                    {testSeriesList.length === 1 ? 'Bundle' : 'Bundles'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}
        <div className="bg-white rounded-xl">
          {/* LOADING */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner
                animation="border"
                variant="success"
                style={{ width: '36px', height: '36px' }}
              />

              <p className="mt-3 text-sm text-gray-500">
                Loading practice questions...
              </p>
            </div>
          ) : testSeriesList.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <Icon
                  icon="mdi:clipboard-text-outline"
                  width="32"
                  height="32"
                  className="text-gray-400"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                No Practice Tests Available
              </h3>

              <p className="max-w-md mt-2 text-sm text-gray-500">
                There are currently no practice tests available. Please check
                again later.
              </p>

              <button
                onClick={fetchPracticeQuestions}
                className="flex items-center gap-2 px-4 py-2 mt-5 text-sm font-medium text-white bg-[#3DD455] rounded-lg hover:bg-black transition"
              >
                <Icon icon="mdi:refresh" width="18" height="18" />
                Try Again
              </button>
            </div>
          ) : (
            /* =========================================
               TEST CARDS — compact responsive grid
            ========================================= */
            <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-5">
              {testSeriesList.map(test => {
                const subjects = test?.semester?.subjects || [];
                const tests = test?.test || [];
                const semesterNumber = test?.semester?.semesterNumber;
                const isFree = Number(test?.bundleCost) === 0;

                return (
                  <div
                    key={test?._id}
                    className="group relative flex flex-col overflow-hidden bg-white border border-gray-200/80 rounded-xl shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:shadow-[0_8px_20px_-6px_rgba(16,24,40,0.15)] hover:-translate-y-0.5 hover:border-green-200 transition-all duration-300"
                  >
                    {/* =============================================
                        TOP GRADIENT BANNER (compact)
                    ============================================= */}
                    <div className="relative h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500">
                      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
                      <div className="absolute -bottom-6 -left-3 w-16 h-16 rounded-full bg-white/10" />

                      {/* Price badge */}
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-extrabold tracking-wide rounded-full shadow-sm ${
                          isFree
                            ? 'bg-white text-green-700'
                            : 'bg-white text-orange-600'
                        }`}
                      >
                        {isFree ? 'FREE' : `₹${test?.bundleCost || 0}`}
                      </span>

                      {/* Avatar */}
                      <div className="absolute -bottom-6 left-4">
                        <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-white border-[3px] border-white rounded-xl shadow-sm">
                          <img
                            src={getTestImage(test)}
                            alt={test?.goalCategory?.name || 'Practice Test'}
                            className="object-cover w-full h-full"
                            onError={event => {
                              event.currentTarget.src =
                                images.newCoursePage1Image1;
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* =============================================
                        CARD BODY
                    ============================================= */}
                    <div className="flex flex-col flex-1 p-3.5 pt-9">
                      {/* Title */}
                      <h2 className="text-sm font-bold leading-5 text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors">
                        {test?.bundleName || 'Practice Test Bundle'}
                      </h2>

                      {/* Description */}
                      <p className="mt-1 text-[11.5px] leading-4 text-gray-500 line-clamp-2">
                        {getDescription(test?.bundleDescription)}
                      </p>

                      {/* Meta pills */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {test?.goalCategory?.name && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 bg-blue-50 rounded">
                            <Icon
                              icon="mdi:school-outline"
                              width="11"
                              height="11"
                            />
                            <span className="max-w-[100px] truncate">
                              {test.goalCategory.name}
                            </span>
                          </span>
                        )}

                        {semesterNumber && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-orange-700 bg-orange-50 rounded">
                            <Icon
                              icon="mdi:calendar-outline"
                              width="11"
                              height="11"
                            />
                            Sem {semesterNumber}
                          </span>
                        )}
                      </div>

                      {/* Stats strip */}
                      <div className="grid grid-cols-2 gap-1.5 mt-3">
                        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-gray-50">
                          <Icon
                            icon="mdi:clipboard-text-outline"
                            width="14"
                            height="14"
                            className="text-gray-500"
                          />
                          <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-wide text-gray-400 leading-none">
                              Tests
                            </p>
                            <p className="text-xs font-bold text-gray-900 leading-tight mt-0.5">
                              {tests.length}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-gray-50">
                          <Icon
                            icon="mdi:gift-outline"
                            width="14"
                            height="14"
                            className="text-green-600"
                          />
                          <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-wide text-gray-400 leading-none">
                              Free
                            </p>
                            <p className="text-xs font-bold text-gray-900 leading-tight mt-0.5">
                              {test?.freeTestsCount || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Subjects chips */}
                      {subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {subjects.slice(0, 2).map(subject => (
                            <span
                              key={subject?._id}
                              className="px-1.5 py-0.5 text-[10px] text-gray-600 bg-gray-100 rounded max-w-[110px] truncate"
                            >
                              {subject?.name}
                            </span>
                          ))}
                          {subjects.length > 2 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 rounded">
                              +{subjects.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* =============================================
                        FOOTER CTA (compact)
                    ============================================= */}
                    <div className="p-3.5 pt-0">
                      <button
                        type="button"
                        onClick={() => handleStartTest(test)}
                        className="group/btn flex items-center justify-center w-full gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-sm hover:from-gray-900 hover:to-gray-900 active:scale-[0.98] transition-all duration-200"
                      >
                        <span>Start Test</span>
                        <Icon
                          icon="mdi:arrow-right"
                          width="15"
                          height="15"
                          className="transition-transform group-hover/btn:translate-x-0.5"
                        />
                      </button>
                    </div>
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

export default HOC(TestSeriesPage1);