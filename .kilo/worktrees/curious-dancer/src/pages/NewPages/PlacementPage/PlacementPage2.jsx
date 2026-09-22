import { Icon } from '@iconify/react/dist/iconify.js';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserMenuBar } from '../../../components/common/MenuBar';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';
import images from '../../../utils/images';

const PlacementPage2 = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const fetchData = () => {
    if (!id) return;
    setLoading(true);
    userApi.job.getById({
      id,
      onSuccess: res => {
        const job = res?.job ?? res?.data ?? {};
        setJobDetails(job);
        setLoading(false);
      },
      onError: () => {
        setJobDetails({});
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const formatSalary = s => {
    if (!s) return '—';
    const currency = s.currency ?? '';
    const min = s.min ?? null;
    const max = s.max ?? null;
    const type = s.type ?? '';
    if (min != null && max != null) {
      const format = n => {
        if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`;
        if (n >= 1_000) return `${Math.round(n / 100) / 10}k`;
        return `${n}`;
      };
      return `${currency} ${format(min)} - ${format(max)} ${type ? `(${type})` : ''}`;
    }
    return '—';
  };

  const formatDate = iso => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const handleApplyNow = () => {
    setFullName('');
    setEmail('');
    setCoverLetter('');
    setResumeUrl('');
    setError('');
    setShowFirstModal(true);
  };

  const handleApply = () => {
    if (!fullName || !email || !resumeUrl) {
      setError('Please provide name, email and resume URL.');
      return;
    }
    setApplying(true);
    const payload = {
      fullName,
      email,
      coverLetter,
      resumeUrl,
    };

    const callApply = () => {
      if (userApi.job.apply && typeof userApi.job.apply === 'function') {
        {
          console.log(payload);
        }
        userApi.job.applyJob({
          id,
          data: payload,
          onSuccess: () => {
            setApplying(false);
            setShowFirstModal(false);
            setShowSecondModal(true);
          },
          onError: () => {
            setApplying(false);
            setError('Failed to apply. Try again.');
          },
        });
        return;
      }

      if (userApi.job.applyJob && typeof userApi.job.applyJob === 'function') {
        userApi.job.applyJob({
          id,
          data: payload,
          onSuccess: () => {
            setApplying(false);
            setShowFirstModal(false);
            setShowSecondModal(true);
          },
          onError: () => {
            setApplying(false);
            setError('Failed to apply. Try again.');
          },
        });
        return;
      }

      if (userApi.job.applyForJob && typeof userApi.job.applyForJob === 'function') {
        userApi.job.applyForJob({
          id,
          data: payload,
          onSuccess: () => {
            setApplying(false);
            setShowFirstModal(false);
            setShowSecondModal(true);
          },
          onError: () => {
            setApplying(false);
            setError('Failed to apply. Try again.');
          },
        });
        return;
      }

      console.log('Apply payload', { id, payload });
      setApplying(false);
      setShowFirstModal(false);
      setShowSecondModal(true);
    };

    try {
      callApply();
    } catch {
      setApplying(false);
      setError('Unexpected error while applying.');
    }
  };

  const handleCloseSecondModal = () => {
    setShowSecondModal(false);
    navigate('/user/home');
  };

  const salaryText = formatSalary(jobDetails.salary);
  const postedAtText = formatDate(jobDetails.postedAt ?? jobDetails.createdAt);
  const expiresAtText = formatDate(jobDetails.expiresAt);
  const experienceText =
    jobDetails.experience?.level ??
    (jobDetails.experience?.minYears != null || jobDetails.experience?.maxYears != null
      ? `${jobDetails.experience?.minYears ?? 0} - ${jobDetails.experience?.maxYears ?? 0} yrs`
      : '');
  const companyLogo = jobDetails.company?.logoUrl || images.newHandwrittenNotesImage1;
  const companyName = jobDetails.company?.name ?? jobDetails.company ?? '';
  const education = jobDetails.education ?? 'Not specified';

  return (
    <div>
      <div />
      <div>
        <UserMenuBar />
      </div>

      <div className="p-6">
        <div className="bg-[#efefef] p-3 rounded-xl">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <h2 className="text-xl font-bold">
                      {jobDetails.title ?? 'Title not available'}
                    </h2>
                    <p className="text-gray-600">{companyName}</p>
                  </div>
                </div>
                <button
                  className="bg-[#3DD455] hover:bg-black text-white font-bold rounded-lg py-2 px-4 flex items-center space-x-2"
                  onClick={() =>
                    user?.isSubscribed
                      ? handleApplyNow()
                      : showNotification({
                          message: 'Please subscribe to apply for jobs',
                          type: 'error',
                        })
                  }
                >
                  <span>Apply Now</span>
                  <span>
                    <Icon icon="material-symbols:arrow-right-alt-rounded" />
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 m-2">
                <div className="w-full">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                    <p className="text-gray-700">
                      {jobDetails.description ?? 'Description not provided.'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {(jobDetails.requirements ?? []).map((req, index) => (
                        <li key={index} className="text-gray-700">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(jobDetails.desirable ?? []).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Desirable</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {(jobDetails.desirable ?? []).map((d, i) => (
                          <li key={i} className="text-gray-700">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(jobDetails.benefits ?? []).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {(jobDetails.benefits ?? []).map((b, i) => (
                          <li key={i} className="text-gray-700">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="w-full rounded-lg">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white rounded border p-2">
                      <div className="flex-1 p-4 text-center border-r">
                        <h3 className="text-sm text-gray-500 font-medium">Salary</h3>
                        <p className="text-green-600 text-md font-semibold">{salaryText}</p>
                        <p className="text-gray-400 text-sm">
                          {jobDetails.salary?.type ?? 'Salary type not specified'}
                        </p>
                      </div>
                      <div className="flex-1 text-center p-4">
                        <div className="flex flex-col items-center mb-1">
                          <Icon icon="tdesign:map-location" className="text-2xl" />
                          <h3 className="text-sm text-gray-500 font-medium">Job Location</h3>
                        </div>
                        <p className="text-green-600 text-lg font-semibold">
                          {jobDetails.location ?? 'Location not specified'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {jobDetails.mode
                            ? `${jobDetails.mode} • ${jobDetails.workType ?? ''}`
                            : jobDetails.workType}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border">
                      <h3 className="text-lg font-semibold mb-6">Job Overview</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          {
                            icon: 'ci:calendar',
                            label: 'Job Posted:',
                            value: postedAtText,
                          },
                          {
                            icon: 'proicons:clock',
                            label: 'Job Expires:',
                            value: expiresAtText,
                          },
                          {
                            icon: 'ri:stack-line',
                            label: 'Job Level:',
                            value:
                              jobDetails.jobLevel ??
                              jobDetails.experience?.level ??
                              'Not specified',
                          },
                          {
                            icon: 'ion:wallet',
                            label: 'Experience:',
                            value: experienceText || 'Not specified',
                          },
                          {
                            icon: 'ph:bag-fill',
                            label: 'Education:',
                            value: education,
                          },
                        ].map((item, idx) => (
                          <div key={idx} className="flex flex-col space-y-1">
                            <Icon icon={item.icon} className="text-black text-xl mb-1" />
                            <span className="text-xs uppercase text-gray-500 font-medium">
                              {item.label}
                            </span>
                            <span className="text-gray-900 font-semibold text-sm">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 mt-6 pt-4">
                        <p className="text-sm text-gray-600 mb-3">Share this job:</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { icon: 'line-md:link', alt: 'Copy Link' },
                            { icon: 'mingcute:linkedin-fill', alt: 'LinkedIn' },
                            { icon: 'mdi:facebook', alt: 'Facebook' },
                            { icon: 'ri:twitter-fill', alt: 'Twitter' },
                            { icon: 'ic:round-email', alt: 'Email' },
                          ].map((btn, idx) => (
                            <button
                              key={idx}
                              className="bg-green-100 text-green-700 rounded-md px-3 py-2 flex items-center justify-center space-x-1"
                            >
                              <Icon icon={btn.icon} />
                              {btn.alt === 'Copy Link' ? (
                                <span className="text-sm font-medium">Copy Links</span>
                              ) : null}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFirstModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-[96%]">
            <h2 className="text-xl font-bold mb-4">Apply Job</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleApply();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Fajar Gunawan"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="fajar123@gmail.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coverLetter">
                  Cover Letter
                </label>
                <textarea
                  id="coverLetter"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Write down your biography here. Let the employer know who you are."
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resumeUrl">
                  Resume URL
                </label>
                <input
                  id="resumeUrl"
                  type="url"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={resumeUrl}
                  onChange={e => setResumeUrl(e.target.value)}
                  placeholder="https://resumes-bucket.s3.amazonaws.com/fajar_resume.pdf"
                />
              </div>

              {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
                  onClick={() => setShowFirstModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-fit px-6 py-2 font-bold bg-[#3DD455] hover:bg-black text-white rounded-lg"
                  disabled={applying}
                >
                  {applying ? 'Applying…' : 'Apply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSecondModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-[96%] text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <Icon icon="akar-icons:check" className="text-green-500 text-4xl" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">Application sent!</h2>
            <p className="text-gray-700 mb-4">
              Your application has been successfully submitted. We will notify you about next steps.
            </p>
            <button
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg w-full"
              onClick={handleCloseSecondModal}
            >
              Back to home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HOC(PlacementPage2);
