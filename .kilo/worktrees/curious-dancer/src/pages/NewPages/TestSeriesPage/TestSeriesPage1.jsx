import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';
import images from '../../../utils/images';

const TestSeriesPage1 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '' } = user || {};
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
    userApi.testSeries.getAll({
      setIsLoading,
      onSuccess: res => {
        setTestSeriesList(res?.data || []);
      },
      onError: err => {
        console.error('Failed to fetch test series:', err);
      },
    });
  };

  return (
    <div className="">
      <div className="p-6">


        <div className="bg-white rounded">
          {/* <div>
            <img src={images.newTestSeriesImage1Image} alt="" />
          </div> */}
          {isLoading ? (
            <div className="flex justify-center mt-10">
              <Spinner animation="border" />
            </div>
          ) : testSeriesList.length === 0 ? (
            <div className="py-10 text-center text-gray-600">No test series available.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {testSeriesList?.map((test, idx) => (
                <div
                  key={idx}
                  className="p-2.5 transition bg-[#efefef] border rounded-lg"
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
                    onClick={() =>
                      user?.isSubscribed
                        ? navigate(`/user/test-series/${test._id}`)
                        : showNotification({
                            message: "You don't have subscription",
                            type: 'error',
                          })
                    }
                    className="w-full bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg mt-4"
                  >
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(TestSeriesPage1);
