import { Icon } from '@iconify/react/dist/iconify.js';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopMainBannerPages } from '../../../components/common/Banners';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { formatDurationStudyPlanner } from '../../../utils/constants';
import images from '../../../utils/images';

const StudyPlannerAiPage5Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [studySchedule, setStudySchedule] = useState([]);
  const [studyData, setStudyData] = useState(null);
  const [userStudyPlannerId, setUserStudyPlannerId] = useState('');
  const [studyPlannerId, setStudyPlannerId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchasedDate, setPurchasedDate] = useState('');

  const { id, profileId, startDate, endDate, weeks, hours } = location.state || {};

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      fetchStudySchedule();
    }
  }, [isAuthenticated, navigate, user]);

  const fetchStudySchedule = async () => {
    await userApi.studyPlanner.createUserPlan({
      data: {
        page: 1,
        limit: 99999,
        studyPlan: profileId,
        examStartDate: startDate,
        examEndDate: endDate,
        weeks,
        hours,
        goal: user?.goal,
        goalCategory: user?.goalCategory,
      },
      setIsLoading,
      onSuccess: data => {
        setStudyData(data?.data?.plannersWithPurchaseInfo?.[0]?.studyPlannerDetails);

        setIsPurchased(user?.isSubscribed);
        {
          console.log(user);
        }
        setPurchasedDate(data?.data?.plannersWithPurchaseInfo?.[0]?.purchasedDate);
        setUserStudyPlannerId(data?.data?.userStudyPlanner);
        setStudyPlannerId(data?.data?.plannersWithPurchaseInfo?.[0]?.studyPlannerId);
        const planners = data?.data?.plannersWithPurchaseInfo || [];
        setStudySchedule(transformStudySchedule(planners));
      },
      onError: err => {
        setErrorMessage(err?.response?.data?.message);
      },
    });
  };

  const transformStudySchedule = planners => {
    return planners.flatMap(planner =>
      planner.weeklyPlan.map(weekPlan => {
        const tasks = weekPlan.subjectData.map(
          subject =>
            `${subject.videos} Hours on video & Practice, ${subject.tests} Hours on PYQs & Mock Tests`
        );
        return {
          week: `Week ${weekPlan.week}`,
          tasks,
        };
      })
    );
  };

  const handleProceed = () => navigate('/');

  return (
    <div className="">
      <div className="">
        <UserMenuBar />
      </div>

      <div className="">

        <div className="p-4">
          <div className="">
            <TopMainBannerPages image={images.newStudyPlannerAiBannerImage} />
          </div>
          <div className="bg-[#efefef] p-3 rounded-b-2xl">
            {isLoading ? (
              <div className="flex justify-center w-full mt-1">
                <p>Loading...</p>
              </div>
            ) : errorMessage ? (
              <div className="flex items-center justify-center w-full text-red-600 ">
                <p className="text-xl font-bold text-center">{errorMessage}</p>
              </div>
            ) : (
              <div>
                <h2 className="mb-2 text-2xl font-bold text-center text-teal-600">
                  🥳 Congratulations!
                </h2>
                <p className="mb-4 text-xl text-center text-black-900">
                  You have successfully created your study planner.
                </p>
                <p className="mb-4 text-2xl font-bold text-center text-black">
                  Based on your inputs, here is your customized study schedule:
                </p>

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {studyData?.weeklyPlan?.map((week, index) => {
                    return (
                      <div key={index} className="overflow-hidden rounded-2xl bg-white">
                        <h3 className="p-2 mb-2 text-xl font-bold text-center text-blue-500 bg-blue-200 rounded-t-xl ">
                          Week {index + 1}
                        </h3>
                        <div className='p-2'>
<h6 className="mb-2 font-semibold text-md">To do:</h6>
                        <ul className="space-y-3 text-gray-700 list-disc">
                          <li className="flex items-center gap-2">
                            <Icon icon="si:youtube-line" className="text-red-500" />
                            <span>
                              <strong>Video:</strong>{' '}
                              {formatDurationStudyPlanner(week?.weekResources?.videos)}
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Icon icon="iconoir:notes" className="text-yellow-500" />
                            <span>
                              <strong>Notes:</strong>{' '}
                              {formatDurationStudyPlanner(week?.weekResources?.handwrittenNotes)}
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Icon icon="pixelarticons:notes" className="text-green-500" />
                            <span>
                              <strong>Tests:</strong>{' '}
                              {formatDurationStudyPlanner(week?.weekResources?.tests)}
                            </span>
                          </li>
                        </ul>
                        <button
                          className={`font-bold py-2 px-4 rounded-lg mt-4 w-full ${
                            isPurchased
                              ? 'bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-b-3xl'
                              : 'bg-orange-400 hover:bg-orange-500'
                          }`}
                          onClick={() =>
                            isPurchased
                              ? navigate(
                                  `/study-planner/${
                                    index + 1
                                  }/${studyPlannerId}/study-plan-subjects`
                                )
                              : userApi.cart.addToCart({
                                  data: {
                                    userStudyPlanner: [userStudyPlannerId],
                                    studyPlanners: [studyPlannerId],
                                  },
                                  onSuccess: () => {},
                                  showMsg: true,
                                })
                          }
                        >
                          {isPurchased ? 'Start Learning' : 'Unlock'}
                        </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(StudyPlannerAiPage5Main);
