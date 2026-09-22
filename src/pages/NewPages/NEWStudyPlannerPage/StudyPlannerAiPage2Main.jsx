import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopMainBannerPages } from '../../../components/common/Banners';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import images from '../../../utils/images';

const StudyPlannerAiPage2Main = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchProfiles();
    }
  }, [isAuthenticated, navigate]);

  const fetchProfiles = async () => {
    try {
      await userApi.studyPlanner.getUserPlans({
        params: {
          page: 1,
          limit: 99999,
        },
        onSuccess: data => {
          const fetchedProfiles = data?.data?.docs || [];
          setProfiles(fetchedProfiles);
          setIsLoading(false);
        },
        onError: err => {
          console.error('Error fetching profiles:', err);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Error in fetching profiles:', error);
      setIsLoading(false);
    }
  };

  const handleProfileSelect = profileId => {
    setSelectedProfile(profileId);
  };

  const handleNext = () => {
    if (selectedProfile) {
      navigate(`/study-planner/${id}/${selectedProfile}`);
    } else {
      alert('Please select a profile');
    }
  };

  return (
    <div>
      <div>
        <div className="">
          <UserMenuBar />
        </div>
      </div>
      <div className="bg-white p-6">
        <div className="">
          <div className="">
            <TopMainBannerPages image={images.newStudyPlannerAiBannerImage} />
          </div>
          <div className="bg-[#efefef] p-4 rounded-b-xl">
            <div>
              {/* <div className="w-full">
                <img
                  src={images.newAboutPageBanner}
                  alt="Community Banner"
                  className="w-full rounded-xl object-cover"
                />
              </div> */}
              <h2 className="text-lg font-medium mb-4 text-black">
                Before we start creating your study plan, could you please provide a few details
                about yourself?
              </h2>
              <div className="">
                <h3 className="text-2xl mb-3 text-black font-semibold">
                  What is your current profile?
                </h3>

                {isLoading ? (
                  <div className="flex justify-center items-center mt-8 w-full">
                    <p>Loading...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {profiles?.map((profile, index) => {
                      const isSelected = selectedProfile === profile._id;

                      const colorSchemes = [
                        {
                          cardBg: 'bg-green-50',
                          border: 'border-green-300',
                          iconBg: 'bg-green-300',
                        },
                        {
                          cardBg: 'bg-red-50',
                          border: 'border-red-300',
                          iconBg: 'bg-red-300',
                        },
                        {
                          cardBg: 'bg-[#efefef]',
                          border: 'border-yellow-300',
                          iconBg: 'bg-yellow-300',
                        },
                        {
                          cardBg: 'bg-blue-50',
                          border: 'border-blue-300',
                          iconBg: 'bg-blue-300',
                        },
                      ];

                      const color = colorSchemes[index % colorSchemes.length];

                      return (
                        <div
                          key={index}
                          onClick={() => handleProfileSelect(profile._id)}
                          className={`rounded-lg p-3 flex flex-col items-center justify-between text-center border cursor-pointer transition duration-200
            ${color.cardBg} ${color.border}
            ${isSelected ? 'border border-black' : ''}
          `}
                        >
                          <div
                            className={`w-14 h-14 flex items-center justify-center rounded-lg mb-4 ${color.iconBg}`}
                          >
                            <img
                              src={profile.image || images.defaultProfileImage}
                              alt={profile.title}
                              className="w-8 h-8"
                            />
                          </div>
                          <h2 className="text-base font-semibold mb-4">{profile.title}</h2>
                          <button className="px-2 w-full py-1.5 font-medium max-w-[140px] mx-auto bg-[#3DD455] hover:bg-black text-white rounded-lg">
                            SELECT
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!isLoading && profiles.length === 0 && (
                  <div className="flex justify-center items-center mt-8 w-full">
                    <p>No profiles found. Please create a profile to proceed.</p>
                  </div>
                )}

                {selectedProfile && (
                  <div className="flex justify-center mt-6">
                    <button
                      className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
                      onClick={handleNext}
                    >
                      Proceed
                    </button>
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

export default HOC(StudyPlannerAiPage2Main);
