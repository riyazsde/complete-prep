import { Icon } from '@iconify/react/dist/iconify.js';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const PyqWithVideoPage1 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '', semester } = user || {};
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchTestSeries();
    }
  }, [isAuthenticated, goal]);

  const fetchTestSeries = () => {
    userApi.pyq.getAll({
      setIsLoading,
      params: {
        subject: id,
        semester,
      },
      onSuccess: res => {
        setTestSeriesList(res?.data || []);
      },
      onError: err => {
        console.error('Failed to fetch test series:', err);
      },
    });
  };

  return (
    <div>
      <div></div>
      <div className="user_container_width">
        <UserMenuBar />
      </div>

      <div className="">
        <div className="p-6">
          <div className="rounded-lg p-3 mb-4 bg-[#efefef]">
            <div>
              <div className="space-y-4 ">
                {isLoading ? (
                  <div className="flex justify-center mt-10">
                    <p>Loading...</p>
                  </div>
                ) : testSeriesList.length === 0 ? (
                  <div className="text-center text-gray-600 py-10">No PYQ series available.</div>
                ) : (
                  <div className="grid grid-cols-4">
                    {testSeriesList?.map((test, index) => (
                      <div
                        key={test?._id || index}
                        className="p-2.5 transition bg-[#fff] border rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <img
                            src={test.tileImage || images.newCoursePage1Image1}
                            alt="Test Logo"
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="flex items-center gap-1 px-2 py-1 text-xs text-black">
                            <Icon icon="twemoji:star" width="16" height="16" />
                            {test.users || '0 Users'}
                          </span>
                        </div>

                        <div className="mt-4">
                          <p className="text-lg text-black border-b">{test.bundleName}</p>
                        </div>

                        <div className="flex items-center gap-2 pb-2 mt-2 text-sm text-gray-600 border-b">
                          <span>
                            <Icon icon="iconoir:globe" width="16" height="16" />
                          </span>{' '}
                          <span>{test.locale}</span>
                        </div>

                        <ul className="mt-2 space-y-1 text-sm text-gray-700">
                          {test?.bundleDescription?.slice(0, 50)}
                        </ul>

                        <button
                          onClick={
                            () =>
                              navigate(`/user/pyq-with-video/${test._id}`, {
                                state: { data: test },
                              })
                            // navigate(
                            //   `/user/test-series/${test._id}?testVariant=pyq`
                            // )
                          }
                          className="w-full py-2 mt-4 bg-[#3DD455] hover:bg-black text-white font-bold rounded-lg"
                        >
                          Start
                        </button>
                      </div>
                    ))}
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

export default HOC(PyqWithVideoPage1);
