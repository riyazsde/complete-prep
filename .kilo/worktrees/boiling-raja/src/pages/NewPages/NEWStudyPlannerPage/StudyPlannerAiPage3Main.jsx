import { Icon } from "@iconify/react";
import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useNavigate, useParams } from "react-router-dom";
import { TopMainBannerPages } from "../../../components/common/Banners";
import { UserMenuBar } from "../../../components/common/MenuBar";
import HOC from "../../../components/layout/HOC";
import images from "../../../utils/images";

const StudyPlannerAiPage3Main = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const { id, profileId } = useParams();

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      if (diffTime > 0) {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysRemaining(diffDays);
      } else {
        setDaysRemaining(0);
      }
    } else {
      setDaysRemaining(0);
    }
  }, [startDate, endDate]);

  const handleProceed = () => {
    if (startDate && endDate && daysRemaining > 0) {
      const payload = {
        profileId,
        id,
        startDate: startDate?.toISOString().split("T")[0],
        endDate: endDate?.toISOString().split("T")[0],
        daysRemaining: daysRemaining,
      };

      navigate(`/study-planner/${id}/${profileId}/choose-availability`, {
        state: payload,
      });
    } else {
      alert("Please select a valid start and end date.");
    }
  };

  return (
    <div>
      <div>

        <div className="">
          <UserMenuBar />
        </div>
      </div>
      <div className="">
        <div className="bg-white p-6">

          <div>
            <div>
              {" "}
              <TopMainBannerPages image={images.newStudyPlannerAiBannerImage} />
            </div>
            <div className="">
              <div className="bg-[#efefef] p-3 rounded-b-2xl">
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Kindly choose the examination date
                  </h2>
                  <p className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">
                      <Icon icon="material-symbols:calendar-month-outline-rounded" />
                    </span>
                    <span className="text-gray-600 font-semibold ">
                      Start Date - End Date
                    </span>
                  </p>
                  <div className="lg:flex gap-6 space-y-6 lg:space-y-0">
                    <div className="sm:bg-white sm:p-4 sm:rounded-2xl transition duration-300 sm:border sm:border-blue-100">
                      <h3 className="text-lg font-semibold text-blue-600 mb-3 text-center">
                        Select Start Date
                      </h3>
                      <Calendar
                        className="CalanderClass !w-full !h-[350px]"
                        onChange={setStartDate}
                        value={startDate}
                        minDate={addDays(new Date(), 1)}
                      />
                    </div>

                    <div className="sm:bg-white sm:p-4 sm:rounded-2xl transition duration-300 sm:border sm:border-blue-100">
                      <h3 className="text-lg font-semibold text-pink-600 mb-3 text-center">
                        Select End Date
                      </h3>
                      <Calendar
                        className="CalanderClass !w-full !h-[350px]"
                        onChange={setEndDate}
                        value={endDate}
                        minDate={addDays(new Date(), 2)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <p className="text-black-800">
                        Days remaining for exam:{" "}
                        <span className="font-bold border border-blue-800 px-2 py-1 rounded-lg text-blue-400">
                          {daysRemaining > 0 ? daysRemaining : "--"} Days
                        </span>
                      </p>
                    </div>
                    <button
                      className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg "
                      onClick={handleProceed}
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(StudyPlannerAiPage3Main);
