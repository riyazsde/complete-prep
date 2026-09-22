import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState } from 'react';
import { Range } from 'react-range';
import { useNavigate } from 'react-router-dom';
import HOC from '../../../components/layout/HOC';
import { userApi } from '../../../services/apiFunctions';

const PlacementPage1 = () => {
  const navigate = useNavigate();

  const [officeType, setOfficeType] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [salaryRange, setSalaryRange] = useState([0, 1000000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = () => {
    setLoading(true);
    userApi.job.getAll({
      onSuccess: res => {
        const data = res?.jobs ?? res?.data ?? [];
        setJobs(data);
        setLoading(false);
      },
      params: {
        mode: officeType,
        experience: workExperience,
        minSalary: salaryRange[0],
        maxSalary: salaryRange[1],
        ...(searchQuery && { search: searchQuery }),
        ...(locationQuery && { location: locationQuery }),
      },
      onError: () => {
        setJobs([]);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    // Only fetch on initial load or when officeType/workExperience changes
    fetchJobs();
  }, [officeType, workExperience]);

  const formatSalary = s => {
    if (!s) return '—';
    const { currency, min, max, type } = s;
    if (min != null && max != null) {
      const short = n => {
        if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`;
        if (n >= 1_000) return `${Math.round(n / 100) / 10}k`;
        return `${n}`;
      };
      return `${currency ?? ''} ${short(min)} - ${short(max)} ${type ? `/${type}` : ''}`;
    }
    return '—';
  };

  const handleOfficeTypeChange = type => {
    setOfficeType(type);
  };

  const handleWorkExperienceChange = experience => {
    setWorkExperience(experience);
  };

  const handleApplyFilters = () => {
    fetchJobs();
  };

  const handleClearFilters = () => {
    setOfficeType('In-Office');
    setWorkExperience('');
    setSalaryRange([0, 1000000]);
    setSearchQuery('');
    setLocationQuery('');
  };

  const handleFindJobClick = () => {
    fetchJobs();
  };

  return (
    <div>
      <div />
      {/* <div>
        <UserMenuBar />
      </div> */}

      <div className=" p-6">
        <div className="w-full">
          <div>
            <div className="flex smallScreenFlex gap-4">
              <div className="bg-[#efefef] rounded-xl p-3 sm:w-full lg:w-[70%] ">
                <div className="flex flex-wrap sm:flex-col md:flex-row items-start sm:items-center gap-4 mb-4 border py-3 px-4 rounded-lg bg-white shadow-sm w-full">
                  <div className="flex flex-wrap sm:flex-col md:flex-row items-center gap-4 flex-1 w-full">
                    <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 w-full sm:w-full md:w-auto flex-1">
                      <Icon
                        icon="iconamoon:search-thin"
                        className="text-green-800"
                        width="20"
                        height="20"
                      />
                      <input
                        type="text"
                        placeholder="Search Skill or Title..."
                        className="outline-none text-sm placeholder-gray-400 bg-transparent w-full"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 w-full sm:w-full md:w-auto flex-1">
                      <Icon
                        icon="mingcute:location-line"
                        className="text-blue-500"
                        width="20"
                        height="20"
                      />
                      <input
                        type="text"
                        placeholder="City, state or zip code"
                        className="outline-none text-sm placeholder-gray-400 bg-transparent w-full"
                        value={locationQuery}
                        onChange={e => setLocationQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    <button
                      className="w-full sm:w-auto bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-md"
                      onClick={handleFindJobClick}
                    >
                      Find Job
                    </button>
                  </div>
                </div>

                  {loading && (
                    <div className="flex items-center justify-center text-center py-8 text-sm text-gray-500">Loading jobs…</div>
                  )}
                <div className="w-full gc-2 gap-4">
                  {jobs?.map(job => (
                    <div
                      key={job._id}
                      onClick={() =>
                        navigate(`/user/placement-jobs/${job._id}`, {
                          state: { job: job },
                        })
                      }
                      className="bg-white rounded-lg border border-yellow-100 p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                      <h2 className="text-lg font-semibold text-black mb-1">{job.title}</h2>

                      <p className="text-green-700 text-sm mb-3 flex flex-wrap gap-2 items-center">
                        <span>{job.workType.replace('-', ' ')}</span>
                        <span className="text-gray-500 font-medium">
                          • {job.salary.currency} {job.salary.min} - {job.salary.max}{' '}
                          {job.salary.type}
                        </span>
                        {job.experience && (
                          <span className="text-gray-500 font-medium">
                            • {job.experience.minYears} - {job.experience.maxYears} years (
                            {job.experience.level})
                          </span>
                        )}
                      </p>

                      <div className="flex justify-between items-start mt-auto">
                        <div className="flex gap-2">
                          {job?.company?.logoUrl && (
                            <img
                              src={job.company.logoUrl}
                              alt={job.company.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div className="flex flex-col text-sm text-gray-600">
                            <span className="font-medium text-gray-800">{job.company.name}</span>
                            <span className="flex items-center gap-1">
                              <Icon icon="mingcute:location-line" />
                              {job.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                 {!loading && jobs?.length === 0 && (
                    <div className="flex items-center justify-center text-center py-8 text-sm text-gray-500">
                      <span>No jobs available</span>
                    </div>
                  )}
              </div>

              <div className="bg-[#efefef] rounded-xl p-3 sm:full lg:w-[30%]">
                <h2 className="text-xl font-bold mb-4">Apply Filter</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Office Type</h3>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="officeType"
                        checked={officeType === 'Remote'}
                        onChange={() => handleOfficeTypeChange('Remote')}
                        className="mr-2"
                      />
                      Remote
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="officeType"
                        checked={officeType === 'In-Office'}
                        onChange={() => handleOfficeTypeChange('In-Office')}
                        className="mr-2"
                      />
                      In-Office
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="officeType"
                        checked={officeType === 'Hybrid'}
                        onChange={() => handleOfficeTypeChange('Hybrid')}
                        className="mr-2"
                      />
                      Hybrid
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
                  <select
                    value={workExperience}
                    onChange={e => handleWorkExperienceChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  >
                    <option value="">Select Experience</option>
                    <option value="Internship or Entry Level">Internship or Entry Level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>

                {workExperience !== 'Internship or Entry Level' && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Salary Range</h3>
                    <div className="p-4 bg-white rounded-lg">
                      <Range
                        step={50000}
                        min={0}
                        max={1000000}
                        values={salaryRange}
                        onChange={values => setSalaryRange(values)}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            style={{
                              ...props.style,
                              height: '6px',
                              width: '100%',
                              backgroundColor: '#ccc',
                              borderRadius: '3px',
                            }}
                          >
                            {children}
                          </div>
                        )}
                        renderThumb={({ props }) => (
                          <div
                            {...props}
                            style={{
                              ...props.style,
                              height: '20px',
                              width: '20px',
                              backgroundColor: '#102726',
                              borderRadius: '50%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          />
                        )}
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-600">
                        <span>0</span>
                        <span>250k</span>
                        <span>500k</span>
                        <span>750k</span>
                        <span>1M</span>
                      </div>
                      <div className="flex justify-between mt-4 text-sm font-medium">
                        <span>Min: ₹{salaryRange[0].toLocaleString()}</span>
                        <span>Max: ₹{salaryRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </button>
                  <button
                    className="bg-[#3DD455] hover:bg-black text-white font-bold rounded-lg py-2 px-4"
                    onClick={handleApplyFilters}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(PlacementPage1);
