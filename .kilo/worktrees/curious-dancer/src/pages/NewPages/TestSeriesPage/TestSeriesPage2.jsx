import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';
import { addToCart } from '../../../utils/constants';

const TestSeriesPage2 = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '' } = user || {};
  const [activeTab, setActiveTab] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [testList, setTestList] = useState([]);
  const [bundleName, setBundleName] = useState('Test Series');
  const [bundleImage, setBundleImage] = useState('');
  const [languages, setLanguages] = useState('English');
  const [isInCart, setIsInCart] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(null);

  const bundleId = params.bundleId || 'your-default-bundle-id';
  const queryParams = new URLSearchParams(location.search);
  const testVariant = queryParams.get('testVariant');
  const studyPlannerId = queryParams.get('studyPlannerId');
  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else {
      fetchTests();
    }
  }, [isAuthenticated, bundleId]);

  const fetchTests = () => {
    let apiRequestUrl = userApi.testSeries.getById;

    if (testVariant === 'pyq') {
      apiRequestUrl = userApi.pyq.getById;
    }

    apiRequestUrl({
      id: bundleId,
      setIsLoading,
      onSuccess: res => {
        const data = res?.data || {};
        setBundleName(data.bundleName || 'Test Series');
        setBundleImage(data.tileImage || '');
        setLanguages(data.locale || 'English');
        setIsInCart(data.isInCart || false);
        setIsPurchased(data.isPurchased || false);
        setPurchaseDate(data.purchaseDate);

        const uniqueTestTypes = [...new Set(data.test.map(test => test.testType))];
        setTabs(uniqueTestTypes);

        if (uniqueTestTypes.length > 0) {
          setActiveTab(uniqueTestTypes[0]);
        }

        const transformedTests = data.test.map(test => {
          const instructionFile = test.testSeriesFiles?.[0]?.instructionFile || {};
          const testSeriesFileId = test.testSeriesFiles?.[0]?._id || '';
          const totalQuestions = instructionFile.totalQuestion || 0;
          const totalMarks = instructionFile.totalMarks || 0;
          const totalTime = instructionFile.totalTime || 0;

          return {
            title: test.testName,
            category: test.testType,
            totalQuestions,
            totalMarks,
            duration: totalTime,
            testSeriesFileId,
            languages: (test.subjects || [])
              .map(subject => subject.subject?.language)
              .filter(Boolean)
              .join(', '),
            _id: test._id,
          };
        });

        setTestList(transformedTests);
      },
      onError: err => {
        console.error('Failed to fetch test series:', err);
      },
    });
  };

  return (
    <div className="">
      <div className="">
        <UserMenuBar />
      </div>
      <div className="p-6 rounded-lg">
        <div className="p-2.5 mb-6 bg-[#f7f7fa] rounded-lg">
          <div className="flex flex-col">
            <h2 className="flex items-center text-xl font-semibold">
              {bundleImage && (
                <img
                  src={bundleImage || ''}
                  alt="imageLogo"
                  className="object-cover w-10 h-10 mr-2 rounded-full"
                />
              )}
              {bundleName}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{languages}</p>
            {testVariant !== 'studyPlannerTest' && (
              <div className="flex items-center justify-end gap-3">
                {isPurchased ? (
                  <span>
                    {' '}
                    {/* <span className="text-gray-600">
                        Purchased On : //{" "}
                      <span className="font-semibold">
                        {formatPurchaseDate(purchaseDate)}
                      </span>
                    </span> */}
                  </span>
                ) : (
                  <div className="hidden">
                    <button
                      onClick={() =>
                        addToCart({
                          id: bundleId,
                          type: testVariant === 'pyq' ? 'previousYearQuestions' : 'testSeries',
                          onSuccess: () => {
                            fetchTests();
                          },
                        })
                      }
                      className="px-4 py-2 font-semibold text-black bg-yellow-400 rounded hover:bg-yellow-500"
                      disabled={isInCart}
                    >
                      {isInCart ? 'Added To Cart' : 'Add To Cart'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 bg-[#f7f7fa]rounded-xl">
          <h3 className="mb-4 text-lg font-semibold">
            {bundleName} - All Tests ({testList.length})
          </h3>
          <div className="flex w-fit flex-wrap gap-3 mb-5 bg-[#f7f7fa] border border-gray-200 p-1 rounded-3xl">
            {tabs?.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-3xl text-sm ${
                  activeTab === tab ? 'bg-white text-black' : 'text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center mt-10">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="space-y-4">
              {testList?.length === 0 ? (
                <div className="py-10 text-center text-gray-600">No tests available.</div>
              ) : (
                testList
                  ?.filter(test => test.category === activeTab)
                  ?.map((test, idx) => (
                    <div key={idx} className="flex flex-col rounded-b-lg bg-[#f7f7fa]">
                      <div className="flex flex-col space-y-1">
                        <p className="p-2 mb-2 text-lg font-bold text-black bg-gray-300 rounded-t-xl">
                          {test.title}
                        </p>
                        <span className="flex items-center gap-2 text-sm yellow-300 px-3">
                          <Icon
                            icon="solar:earth-linear"
                            width="24"
                            height="24"
                            style={{ color: '#114616' }}
                          />
                          {test.languages}
                        </span>
                        <div className="flex flex-wrap justify-between items-center px-3 py-3">
                          <div className="flex gap-3 text-sm text-gray-700 flex-wrap">
                            <span className="px-2 py-1 bg-stone-200 rounded-3xl">
                              {test.totalQuestions || '0'} Questions
                            </span>
                            <span className="px-2 py-1 bg-stone-200 rounded-3xl">
                              {test.totalMarks || '0'} Marks
                            </span>
                            <span className="px-2 py-1 bg-stone-200 rounded-3xl">
                              {test.duration || '0'} Minutes
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              if (!user?.isSubscribed) {
                                showNotification({
                                  message: "You don't have subscription",
                                  type: 'error',
                                });
                                return;
                              }
                              userApi.cart.addToCart({
                                data: {
                                  testSeries: [bundleId],
                                },
                              });

                              userApi.cart.checkOut({
                                onSuccess: data => {
                                  userApi.cart.placeOrder({
                                    id: data?.data?.orderId,
                                    data: { paymentStatus: 'completed' },

                                    onSuccess: data => {
                                      console.log(data);
                                    },
                                  });
                                },
                              });

                              if (testVariant === 'pyq')
                                userApi.cart.startCourse({
                                  data: {
                                    previousYearQuestionId: bundleId,
                                  },
                                });
                              else if (testVariant === 'studyPlannerTest')
                                userApi.cart.startTestDirectly({
                                  data: {
                                    studyPlannerId: studyPlannerId,
                                    testSeriesId: bundleId,
                                  },
                                });
                              navigate(
                                `/user/test/${test?._id}?testSeriesFileId=${test?.testSeriesFileId}&bundleId=${bundleId}&testVariant=${testVariant}&studyPlannerId=${studyPlannerId}`
                              );
                              // {
                              //   isPurchased ||
                              //   testVariant === "studyPlannerTest"
                              //     ? navigate(
                              //         `/user/test/${test?._id}?testSeriesFileId=${test?.testSeriesFileId}&bundleId=${bundleId}&testVariant=${testVariant}&studyPlannerId=${studyPlannerId}`
                              //       )
                              //     : showNotification({
                              //         type: "error",
                              //         message: isInCart
                              //           ? "Please buy the bundle from cart first"
                              //           : "Please add the bundle to cart first",
                              //       });
                              // }
                            }}
                            className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 mt-2 rounded-3xl min-w-[120px]"
                          >
                            {isPurchased || testVariant === 'studyPlannerTest'
                              ? 'Start'
                              : 'Start Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(TestSeriesPage2);
