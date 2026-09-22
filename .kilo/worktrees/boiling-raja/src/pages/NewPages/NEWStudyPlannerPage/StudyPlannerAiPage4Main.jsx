import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TopMainBannerPages } from "../../../components/common/Banners";
import { UserMenuBar } from "../../../components/common/MenuBar";
import HOC from "../../../components/layout/HOC";
import images from "../../../utils/images";

const StudyPlannerAiPage4Main = () => {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedHours, setSelectedHours] = useState("");
  const { id, profileId } = useParams();
  const location = useLocation();
  const { startDate, endDate, daysRemaining } = location.state || {};

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = [
    { key: "threeHour", label: "3 hours" },
    { key: "fourAndHalfHour", label: "4.5 hours" },
    { key: "sixHour", label: "6 hours" },
    { key: "sevenAndHalfHour", label: "7.5 hours" },
    { key: "nineHour", label: "9 hours" },
    { key: "tenAndHalfHour", label: "10.5 hours" },
    { key: "twelveHour", label: "12 hours" },
    { key: "thirteenAndHalfHour", label: "13.5 hours" },
    { key: "fifteenHour", label: "15 hours" },
  ];

  const handleDaySelect = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleHourSelect = (hourKey) => {
    setSelectedHours(hourKey);
  };

  const handleProceed = () => {
    if (selectedDays.length > 0 && selectedHours) {
      const daysOutput = {
        monday: selectedDays.includes("Mon"),
        tuesday: selectedDays.includes("Tue"),
        wednesday: selectedDays.includes("Wed"),
        thursday: selectedDays.includes("Thu"),
        friday: selectedDays.includes("Fri"),
        saturday: selectedDays.includes("Sat"),
        sunday: false,
      };
      const hoursOutput = hours.reduce((acc, hour) => {
        acc[hour.key] = selectedHours === hour.key;
        return acc;
      }, {});

      navigate(`/study-planner/${id}/${profileId}/study-plan`, {
        state: {
          startDate,
          endDate,
          id,
          profileId,
          weeks: daysOutput,
          hours: hoursOutput,
        },
      });
    } else {
      alert("Please select at least one day and specify hours per day");
    }
  };

  return (
    <div>
      <div className="">
        <UserMenuBar />
      </div>
      <div className="bg-white p-6">
        <div>
          <TopMainBannerPages image={images.newStudyPlannerAiBannerImage} />
        </div>
        <div className="bg-[#efefef] p-3 rounded-b-2xl">
          <p className="text-black font-semibold text-left text-2xl mb-8">
            Please specify the days and hours you're available for studying
          </p>
          <div className="">
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full bg-[#fff] p-3 rounded-xl shadow-sm">
                <h3 className="fs-5 font-semibold text-gray-800 mb-4">
                  Days Available for Studying
                </h3>
                <div className="flex flex-col gap-2">
                  {days.map((day) => (
                    <label
                      key={day}
                      className="flex items-center gap-2 text-gray-800"
                    >
                      <input
                        type="checkbox"
                        name="selectedDays"
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDaySelect(day)}
                        className="form-checkbox text-blue-600"
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="w-full bg-[#fff] p-3 rounded-xl shadow-sm">
                <h3 className="fs-5 font-semibold text-gray-800 mb-4">
                  Hours Per Day
                </h3>
                <div className="flex flex-col gap-2">
                  {hours.map((hour) => (
                    <label
                      key={hour.key}
                      className="flex items-center gap-2 text-gray-800"
                    >
                      <input
                        type="radio"
                        name="selectedHours"
                        checked={selectedHours === hour.key}
                        onChange={() => handleHourSelect(hour.key)}
                        className="form-radio text-blue-600"
                      />
                      <span>{hour.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-black-800">
                  Days remaining for exam:{" "}
                  <span className="font-bold border border-blue-800 px-2 py-1 rounded-lg text-blue-400">
                    {daysRemaining}
                  </span>
                </p>
              </div>
              <button
                className="bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
                onClick={handleProceed}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(StudyPlannerAiPage4Main);
