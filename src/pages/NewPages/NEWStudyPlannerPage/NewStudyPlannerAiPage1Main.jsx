import { Icon } from '@iconify/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import apiRequest from '../../../services/apiService';

const API_BASE_URL = 'https://prep-project-zej8.onrender.com/api/v1/';

const NewStudyPlannerAiPage1Main = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');

  /*
   * ------------------------------------------------------------
   * Normalize API response
   * ------------------------------------------------------------
   *
   * Different backend versions sometimes return:
   *
   * {
   *   data: [...]
   * }
   *
   * or:
   *
   * {
   *   data: {
   *      data: [...]
   *   }
   * }
   *
   * or:
   *
   * {
   *   data: {
   *      studyPlanners: [...]
   *   }
   * }
   *
   * This helper makes the UI tolerant of those response shapes.
   */
  const extractArray = response => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    if (Array.isArray(response?.data?.studyPlanners)) {
      return response.data.studyPlanners;
    }

    if (Array.isArray(response?.data?.templates)) {
      return response.data.templates;
    }

    if (Array.isArray(response?.studyPlanners)) {
      return response.studyPlanners;
    }

    if (Array.isArray(response?.templates)) {
      return response.templates;
    }

    return [];
  };

  /*
   * ------------------------------------------------------------
   * Fetch Study Planner templates
   * ------------------------------------------------------------
   *
   * IMPORTANT:
   * We intentionally do NOT send goalCategory / semester / search
   * filters here.
   *
   * You confirmed that:
   *
   * GET /api/v1/user/study-planners
   *
   * returns data without filters.
   *
   * Therefore we first fetch everything and filter search results
   * on the frontend.
   */
  const fetchStudyPlannerTemplates = async () => {
    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiRequest(
        'GET',
        `${API_BASE_URL}/user/study-planners`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Study Planner API response:', response);

      const plannerData = extractArray(response);

      console.log('Study Planner templates:', plannerData);

      setTemplates(plannerData);
    } catch (err) {
      console.error('Failed to fetch Study Planner templates:', err);

      setTemplates([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to load study planners.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * ------------------------------------------------------------
   * Authentication
   * ------------------------------------------------------------
   */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchStudyPlannerTemplates();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /*
   * ------------------------------------------------------------
   * Search locally
   * ------------------------------------------------------------
   *
   * This prevents the search text from accidentally becoming an
   * API filter that causes an empty result.
   */
  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return templates;
    }

    return templates.filter(template => {
      const searchableText = [
        template?.name,
        template?.title,
        template?.plannerName,
        template?.courseName,
        template?.goalName,
        template?.mentorName,
        template?.mentor?.name,
        template?.description,
        template?.goal?.name,
        template?.goalCategory?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [templates, searchQuery]);

  /*
   * ------------------------------------------------------------
   * Get useful values from a planner object
   * ------------------------------------------------------------
   */
  const getPlannerId = planner => {
    return (
      planner?._id ||
      planner?.id ||
      planner?.plannerId ||
      planner?.studyPlannerId
    );
  };

  const getPlannerTitle = planner => {
    return (
      planner?.name ||
      planner?.title ||
      planner?.plannerName ||
      planner?.courseName ||
      planner?.goalName ||
      'Study Planner'
    );
  };

  const getPlannerImage = planner => {
    return (
      planner?.image ||
      planner?.thumbnail ||
      planner?.thumbnailUrl ||
      planner?.coverImage ||
      planner?.bannerImage ||
      planner?.imageUrl ||
      ''
    );
  };

  const getPlannerMentor = planner => {
    if (typeof planner?.mentor === 'string') {
      return planner.mentor;
    }

    return (
      planner?.mentorName ||
      planner?.mentor?.name ||
      planner?.createdBy?.name ||
      ''
    );
  };

  /*
   * ------------------------------------------------------------
   * Open planner
   * ------------------------------------------------------------
   */
  const handlePlannerClick = planner => {
    const plannerId = getPlannerId(planner);

    if (!plannerId) {
      console.error('Study Planner ID missing:', planner);
      return;
    }

    navigate(`/study-planner/${plannerId}`, {
      state: {
        id: plannerId,
        planner,
      },
    });
  };

  /*
   * ------------------------------------------------------------
   * Refresh
   * ------------------------------------------------------------
   */
  const handleRefresh = () => {
    fetchStudyPlannerTemplates();
  };

  return (
    <div className="min-h-screen bg-white">
      <UserMenuBar />

      <div className="bg-white p-4 md:p-6">
        <div className="bg-[#EFEFEF] p-4 md:p-6 rounded-lg min-h-[calc(100vh-48px)]">
          {/* Header */}
          <div className="mb-5">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Create Your Personalized
            </h1>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Study Schedule
            </h1>

            <p className="text-gray-500 mt-2">
              Choose a study planner and create your personalized schedule.
            </p>
          </div>

          {/* Search + Refresh */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
            <div className="relative w-full md:w-[70%]">
              <input
                type="text"
                placeholder="Search Course Name, Mentor..."
                className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <Icon
                  icon="akar-icons:search"
                  className="text-gray-500 text-xl"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Icon
                icon="material-symbols:refresh-rounded"
                className={isLoading ? 'animate-spin' : ''}
                width="20"
              />

              Refresh
            </button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center w-full min-h-[300px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />

                <p className="text-gray-500">
                  Loading study planners...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="flex flex-col justify-center items-center w-full min-h-[300px] bg-white rounded-xl border border-red-100 p-6">
              <Icon
                icon="material-symbols:error-outline-rounded"
                className="text-6xl text-red-400 mb-3"
              />

              <p className="text-red-600 text-lg font-semibold text-center">
                Unable to load study planners
              </p>

              <p className="text-gray-500 text-sm mt-1 text-center max-w-lg">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                className="mt-4 px-5 py-2.5 rounded-lg bg-[#3DD455] text-white font-medium hover:bg-black transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Planner list */}
          {!isLoading && !error && filteredTemplates.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredTemplates.map((planner, index) => {
                const plannerId = getPlannerId(planner);
                const title = getPlannerTitle(planner);
                const image = getPlannerImage(planner);
                const mentor = getPlannerMentor(planner);

                return (
                  <div
                    key={plannerId || index}
                    onClick={() => handlePlannerClick(planner)}
                    className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={event => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Icon
                            icon="mdi:calendar-clock-outline"
                            className="text-6xl text-gray-400"
                          />

                          <span className="text-sm text-gray-500 mt-2">
                            Study Planner
                          </span>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                      {/* Open button */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full bg-white text-gray-900 text-center py-2 rounded-lg font-semibold text-sm shadow">
                          Create Schedule
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
                        {title}
                      </h3>

                      {mentor && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Icon
                            icon="mdi:account-outline"
                            className="text-gray-400"
                            width="17"
                          />

                          <span className="text-sm text-gray-500 truncate">
                            {mentor}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty */}
          {!isLoading &&
            !error &&
            filteredTemplates.length === 0 && (
              <div className="flex flex-col justify-center items-center mt-8 w-full min-h-[300px] bg-white rounded-xl border border-gray-100">
                <Icon
                  icon="mdi:calendar-search-outline"
                  className="text-7xl text-gray-300 mb-4"
                />

                <p className="text-gray-600 text-lg font-semibold">
                  {searchQuery
                    ? 'No study planners found'
                    : 'No study planners available'}
                </p>

                <p className="text-gray-400 text-sm mt-1 text-center px-4">
                  {searchQuery
                    ? 'Try a different course or mentor name.'
                    : 'Study planner templates will appear here when available.'}
                </p>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HOC(NewStudyPlannerAiPage1Main);

