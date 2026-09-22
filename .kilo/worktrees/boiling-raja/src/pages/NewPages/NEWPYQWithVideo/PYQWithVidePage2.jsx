import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import images from '../../../utils/images';

const PYQWithVidePage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else {
      if (data?.test?.[0]?.testSeriesFiles?.[0]?.testSeriesFile?.sections?.length) {
        const allQuestions = data.test[0].testSeriesFiles[0].testSeriesFile.sections.flatMap(
          section => section.questions || []
        );
        setQuestions(allQuestions);
      }
      setIsLoading(false);
    }
  }, [isAuthenticated, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <div className="overflow-hidden">
          <div className="bg-green-900 text-white flex items-center justify-between px-6 py-1 relative">
            <div
              onClick={() => navigate('/user/home')}
              className="flex items-center space-x-1 z-10"
            >
              <img src={images.navBarLogo2} alt="Logo" className="max-w-[150px] py-4 max-h-[90px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="mainMaxWidth mx-auto mt-6 bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">
            {data?.bundleName || 'PYQ With Video Solutions'}
          </h1>

          {questions?.map((q, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-400">Question {index + 1}</span>
                <span className="flex items-center space-x-1">
                  <Icon
                    icon="memory:time-sand"
                    width="22"
                    height="22"
                    style={{ color: '#114616' }}
                  />
                  {q.difficulty || 'N/A'}
                </span>
              </p>
              <hr />

              {q.text && <h2 className="text-xl font-bold mb-2 text-gray-600">{q.text}</h2>}

              {q.questionImages?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Question ${index + 1}`}
                  className="max-w-full max-h-[400px] mx-auto block rounded-md my-2 object-contain"
                />
              ))}

              <div className="space-y-2 mb-4 text-gray-500">
                {q.options?.map((option, idx) => {
                  const isCorrect = option.label === q.answer;
                  let bgClass = 'bg-white';
                  if (isCorrect) bgClass = 'bg-green-100';

                  return (
                    <div key={idx} className={`flex items-start p-2 rounded-lg ${bgClass}`}>
                      <div className="flex flex-col space-y-2 w-full">
                        {option.optionImage ? (
                          <img
                            src={option.optionImage}
                            alt={`Option ${idx + 1}`}
                            className="max-w-full max-h-[200px] rounded-md object-contain"
                          />
                        ) : (
                          <label className="cursor-pointer text-gray-700">
                            ({option.label}) {option.option}
                          </label>
                        )}
                        {isCorrect && (
                          <span className="ml-2 text-green-600 font-medium">Correct Answer</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Explanation:</h3>
                <p className="text-gray-700">{q.solution || 'No explanation provided.'}</p>

                {q.solutionImages?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Solution ${index + 1}`}
                    className="max-w-full max-h-[400px] mx-auto block rounded-md my-2 object-contain"
                  />
                ))}

                {q.videoSolution && q.videoSolution !== 'NA' && q.videoSolution !== '' && (
                  <video
                    src={q.videoSolution}
                    controls
                    className="max-w-full max-h-[400px] block rounded-md my-2"
                  />
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              className="w-fit mt-6 px-6 py-2 font-bold bg-[#3DD455] hover:bg-black text-white rounded-lg"
              onClick={() => navigate('/user/home')}
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PYQWithVidePage2;
