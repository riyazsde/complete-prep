import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';

import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../../../services/apiFunctions';
import { showNotification } from '../../../services/exportComponents';
import images from '../../../utils/images';
import './New-Component.css';

export const ColorfulProgressBar = ({
  progress,
  color = '',
  height = 20,
  currentValue,
  totalValue,
  bottomItem,
}) => {
  const calculatedProgress =
    currentValue != null && totalValue ? (currentValue / totalValue) * 100 : (progress ?? 0);

  const containerStyle = {
    height: `${height}px`,
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const progressStyle = {
    width: `${calculatedProgress}%`,
    background: color,
    height: '100%',
    transition: 'width 0.3s ease',
  };

  return (
    <div>
      <div className="progress-bar-container" style={containerStyle}>
        <div className="progress-bar" style={progressStyle}></div>
      </div>
      {bottomItem && <div className="mt-1 text-center">{bottomItem}</div>}
    </div>
  );
};

export const SuccessMsgComponent = ({ message }) => {
  return (
    <div className="success-msg-container text-primary-green-3">
      <p className="bg-text-primary-green-2 rounded p-2 fw-normal w-full text-left pl-4 pb-3 pt-2">
        {message}
      </p>
    </div>
  );
};

export const ReusableStepper = ({ steps, initialIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === steps.length - 1;

  return (
    <div className="container py-3">
      <ul className="nav nav-tabs justify-content-center" role="tablist">
        {steps.map((step, idx) => (
          <li className="nav-item" key={idx}>
            <button
              className={`nav-link ${activeIndex === idx ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
            >
              {step.header}
            </button>
          </li>
        ))}
      </ul>

      {/* Step content */}
      <div className="tab-content border p-3 mt-3">
        <div className="tab-pane fade show active">{steps[activeIndex].content}</div>
      </div>

      {/* Navigation controls */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => setActiveIndex(i => Math.max(i - 1, 0))}
          disabled={isFirst}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setActiveIndex(i => Math.min(i + 1, steps.length - 1))}
          disabled={isLast}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const ClockIconSvg = () => {
  return (
    <svg
      class="clock-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      style={{
        width: '200px',
        height: '200px',
        marginRight: '10px',
      }}
    >
      <circle cx="100" cy="100" r="80" stroke="#0033ff" stroke-width="4" fill="none"></circle>
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="40"
        stroke="#0033ff"
        stroke-width="4"
        stroke-linecap="round"
      ></line>
      <line
        x1="100"
        y1="100"
        x2="140"
        y2="100"
        stroke="#0033ff"
        stroke-width="4"
        stroke-linecap="round"
      ></line>
      <circle cx="100" cy="100" r="8" fill="#0033ff"></circle>
      <line
        x1="60"
        y1="60"
        x2="65"
        y2="65"
        stroke="#0033ff"
        stroke-width="4"
        stroke-linecap="round"
      ></line>
      <line
        x1="60"
        y1="140"
        x2="65"
        y2="135"
        stroke="#0033ff"
        stroke-width="4"
        stroke-linecap="round"
      ></line>
      <line
        x1="140"
        y1="60"
        x2="135"
        y2="65"
        stroke="#0033ff"
        stroke-width="4"
        stroke-linecap="round"
      ></line>
      <line
        x1="140"
        y1="140"
        x2="135"
        y2="135"
        stroke="#0033ff"
        stroke-width="4"
        stroke-linecap="round"
      ></line>
      <line
        x1="100"
        y1="20"
        x2="100"
        y2="30"
        stroke="#0033ff"
        stroke-width="4"
        stroke-linecap="round"
      ></line>
      <line
        x1="100"
        y1="170"
        x2="100"
        y2="180"
        stroke="#0033ff"
        stroke-width="4"
        stroke-linecap="round"
      ></line>
      <line
        x1="20"
        y1="100"
        x2="30"
        y2="100"
        stroke="#0033ff"
        stroke-width="4"
        stroke-linecap="round"
      ></line>
      <line
        x1="170"
        y1="100"
        x2="180"
        y2="100"
        stroke="#0033ff"
        stroke-width="4"
        stroke-linecap="round"
      ></line>
    </svg>
  );
};

const computeAge = (dateString, cutoffDate) => {
  const birthDate = new Date(dateString);
  const cutoff = new Date(cutoffDate);

  let age = cutoff.getFullYear() - birthDate.getFullYear();
  const monthDiff = cutoff.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && cutoff.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const calculateBMI = (height, weight) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  return parseFloat(bmi.toFixed(2));
};

export const QuestionForm = ({ questionData, register, errors, watch, trigger, setValue }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const navigate = useNavigate();
  const genderValue = watch('gender');
  useEffect(() => {
    if (questionData.subcategory === 'caste' && genderValue === 'Third Gender') {
      setValue('caste', 'Third Gender');
    }
  }, [genderValue, questionData.subcategory, setValue]);

  if (!questionData.answerType) {
    return (
      <div className="question-form-intro">
        {questionData.introductionLine1 && <p>{questionData.introductionLine1}</p>}
        {questionData.introductionLine2 && <p>{questionData.introductionLine2}</p>}
      </div>
    );
  }

  const formatDate = date => {
    if (!date) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date?.toLocaleDateString('en-GB', options)?.replace(/(\d+) (\w+) (\d+)/, '$1 $2 $3');
  };

  const fieldName =
    typeof questionData.subcategory === 'string'
      ? questionData.subcategory.replace(/\./g, '_')
      : 'default_field';

  const minSelect = questionData.minSelect || 0;
  const maxSelect = questionData.maxSelect || null;

  const watchedValue = watch(fieldName);
  const nameValue = watch('name');
  const heightValue = watch('height');
  const weightValue = watch('weight');

  let dynamicResponse = '';

  if (questionData.answerType === 'checkbox') {
    const selected = Array.isArray(watchedValue) ? watchedValue : [];
    {
      console.log(selected);
    }
    if (selected.length < minSelect) {
      dynamicResponse =
        questionData.minSelectMessage || `Please select at least ${minSelect} options.`;
    } else if (maxSelect && selected.length > maxSelect) {
      dynamicResponse = `Please select no more than ${maxSelect} options.`;
    } else if (selected.length !== 5) {
      dynamicResponse =
        'Oops! You need to select exactly 5 subjects. Please choose 1 more subject to complete your selection.';
    } else if (selected.includes('biology')) {
      dynamicResponse =
        'Thanks for your response! We can see you have chosen Biology as one of your subjects.';
    } else {
      dynamicResponse =
        'Thanks for your response! We can see you have not chosen Biology as one of your subjects.';
    }
  } else if (questionData.responses) {
    const raw = watchedValue ? questionData.responses[watchedValue] || '' : '';
    dynamicResponse = raw.includes('[name]') ? raw.replace(/\[name\]/g, nameValue || '') : raw;
  } else {
    const raw = questionData.response || '';
    dynamicResponse = raw.includes('[name]') ? raw.replace(/\[name\]/g, nameValue || '') : raw;
  }

  if (questionData.answerType === 'text' && !watchedValue) {
    dynamicResponse = '';
  }

  if (
    questionData.categoryLabel === 'Physical & Medical' &&
    questionData.subcategory === 'height'
  ) {
    if (heightValue && weightValue) {
      const bmi = calculateBMI(heightValue, weightValue);
      const bmiCutoff = questionData.bmiCutoff || 18.5;
      if (bmi < bmiCutoff) {
        dynamicResponse = `Your BMI indicates you are underweight. The minimum BMI requirement is ${bmiCutoff}.`;
      } else {
        dynamicResponse =
          'Physical measurements registered successfully. You meet the height requirements.';
      }
    }
  }

  const validationRules = {};
  if (questionData.answerType === 'checkbox') {
    validationRules.validate = value => {
      const selected = Array.isArray(value) ? value : [];
      const len = Array.isArray(value) ? value.length : 0;
      if (len < minSelect) return questionData.errorMessage;
      if (maxSelect && len > maxSelect) return questionData.errorMessage;
      if (questionData.requiredSubjects?.length > 0) {
        const missingRequired = questionData.requiredSubjects.some(
          subj => !selected.includes(subj)
        );
        if (missingRequired) {
          return questionData.errorMessage;
        }
      }
      return true;
    };
  } else {
    validationRules.required = questionData.errorMessage;
    if (questionData.errorResponse && questionData.answerType !== 'date') {
      validationRules.validate = value => questionData.errorResponse[value] || true;
    }
  }

  if (questionData.answerType === 'date') {
    validationRules.validate = value => {
      if (!value) {
        return {
          message: questionData.errorMessage,
          comment: questionData.errorComment?.noValue || '',
        };
      }

      const inputDate = new Date(value);
      const minDate = new Date(questionData.minDate);
      const maxDate = new Date(questionData.maxDate);
      const cutoffDate = new Date(questionData.cutoffDate);

      const ageAtCutoff = computeAge(value, questionData.cutoffDate);
      const formattedCutoff = formatDate(cutoffDate);

      if (inputDate < minDate) {
        const msg = questionData.errorResponse.lessThenminDate
          .replace('[age]', ageAtCutoff)
          .replace('[cutoffDate]', formattedCutoff);
        return msg;
      }

      if (inputDate > maxDate) {
        const msg = questionData.errorResponse.greaterThanMaxDate
          .replace('[age]', ageAtCutoff)
          .replace('[cutoffDate]', formattedCutoff);
        return msg;
      }

      return true;
    };
  }

  const categoryClass = questionData.category
    ? questionData.category.toLowerCase().replace(/\s/g, '-')
    : 'default-category';

  const renderInput = () => {
    switch (questionData.answerType) {
      case 'dropdown': {
        // Lock caste dropdown if needed
        console.log(' Lock caste dropdown if needed: ', questionData.subcategory, genderValue);
        const isCasteLock = questionData.subcategory === 'caste' && genderValue === 'Third Gender';
        return (
          <Form.Select
            className="input-dropdown"
            {...register(fieldName, validationRules)}
            value={isCasteLock ? 'Third Gender' : watchedValue}
            disabled={isCasteLock}
          >
            <option value="">Select...</option>
            {questionData.options.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Form.Select>
        );
      }
      case 'text':
        if (
          questionData.categoryLabel === 'Physical & Medical' &&
          questionData.subcategory === 'height'
        ) {
          return (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Form.Control
                  className="input-text"
                  type="text"
                  placeholder="Height (cm)"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  {...register('height', { required: 'Height is required' })}
                />
                <Form.Control
                  className="input-text"
                  type="text"
                  placeholder="Weight (kg)"
                  {...register('weight', { required: 'Weight is required' })}
                />
              </div>
            </>
          );
        }
        return (
          <Form.Control
            className="input-text"
            type="text"
            {...register(fieldName, validationRules)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        );
      case 'radio':
        return questionData.options.map(o => {
          const { onChange, onBlur, name, ref } = register(fieldName, validationRules);
          return (
            <label
              key={o.value}
              className={`new-component-radio-label ${selectedValue === o.value ? 'selected' : ''}`}
            >
              <Form.Check
                className="radio-input"
                type="radio"
                label={o.label}
                value={o.value}
                name={name}
                ref={ref}
                onChange={e => {
                  setSelectedValue(o.value);
                  onChange(e);
                  trigger(fieldName);
                }}
                onBlur={onBlur}
              />
            </label>
          );
        });
      case 'checkbox':
        const selectedCheckboxes = Array.isArray(watchedValue) ? watchedValue : [];
        return questionData.options.map(o => {
          const { onChange, onBlur, name, ref } = register(fieldName, validationRules);
          const isSelected = selectedCheckboxes.includes(o.value);
          return (
            <label
              key={o.value}
              className={`new-component-radio-label-checkbox ${isSelected ? 'selected' : ''}`}
            >
              <Form.Check
                className="checkbox-input"
                type="checkbox"
                label={o.label}
                value={o.value}
                name={name}
                ref={ref}
                onChange={e => {
                  onChange(e);
                  trigger(fieldName);
                }}
                onBlur={onBlur}
              />
            </label>
          );
        });
      case 'date': {
        const { ref, onChange, onBlur, name } = register(fieldName, validationRules);
        return (
          <Form.Control
            className="input-date"
            type="date"
            name={name}
            ref={ref}
            onBlur={onBlur}
            onChange={e => {
              onChange(e);
              trigger(fieldName);
              trigger(fieldName).then(valid => {
                {
                  fieldName?.isError && setValue(`${fieldName}.isError`, !valid);
                }
              });
            }}
          />
        );
      }
      case 'dropdown':
        return (
          <Form.Select className="input-dropdown" {...register(fieldName, validationRules)}>
            <option value="">Select...</option>
            {questionData.options.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Form.Select>
        );
      case 'calculation':
        return (
          <input
            className="input-calc"
            type="text"
            readOnly
            value="Calculated fee details will be shown here."
          />
        );
      default:
        return null;
    }
  };

  const renderResponseQuestion = () => {
    if (questionData.responseQuestion && questionData.responseQuestion[watchedValue]) {
      return questionData.responseQuestion[watchedValue].map((q, index) => {
        const nestedSubcategory = `${questionData.subcategory}.${q.subcategory}`;
        const nestedQuestion = {
          ...q,
          subcategory: nestedSubcategory,
        };
        return (
          <QuestionForm
            key={`${nestedSubcategory}-${index}`}
            questionData={nestedQuestion}
            register={register}
            errors={errors}
            watch={watch}
            trigger={trigger}
            setValue={setValue}
          />
        );
      });
    }
    return null;
  };

  const getErrorMessage = error => {
    if (error && error.message) {
      return error.message.includes('[name]')
        ? error.message.replace(/\[name\]/g, nameValue || '')
        : error.message;
    }
    return '';
  };

  return (
    <div className={`question-form-wrapper ${categoryClass}`}>
      {questionData?.question !== 'Do you have any children?' && (
        <p className="text-3xl fw-semibold text-intro-primary-3 border-bottom-category">
          {questionData.categoryLabel}
        </p>
      )}

      <div className="question-text-block flex flex-col">
        {questionData.question && (
          <span className="text-intro-primary-4 fw-normal text-2xl mt-3 ">
            {questionData.question}
          </span>
        )}
        {questionData.label && (
          <span className="question-label text-intro-primary-4 fw-thin text-lg mt-3 italic">
            {/* {questionData.label} */}
          </span>
        )}
      </div>
      <div className="input-container mt-4 mb-3 o-h-150px">{renderInput()}</div>

      {questionData.categoryLabel === 'Physical & Medical' &&
        questionData.subcategory === 'height' &&
        heightValue &&
        weightValue && (
          <div className="bmi-result">
            <h4>BMI Results</h4>
            <p>
              Your BMI: <strong>{calculateBMI(heightValue, weightValue)}</strong> - Normal weight
            </p>
          </div>
        )}
      {errors[fieldName] && (
        <div className="error-container">
          <span className="error-message">{getErrorMessage(errors[fieldName])}</span>

          {errors[fieldName].comment && (
            <span className="error-comment">{errors[fieldName].comment}</span>
          )}

          {errors[fieldName] && questionData?.errorResponseLink?.[watchedValue] && (
            <Link
              href={questionData?.errorResponseLink?.[watchedValue]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                onClick={e => {
                  e.stopPropagation();
                  window.open(
                    questionData?.errorResponseLink?.[watchedValue],
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
                className="error-comment-link mt-2"
              >
                {questionData?.errorResponseLink?.[watchedValue]}
              </span>
            </Link>
          )}
        </div>
      )}

      {renderResponseQuestion()}
      {dynamicResponse && !errors[fieldName] && (
        <div className="success-container">
          <span className="success-message">
            {dynamicResponse?.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
};

const computeAge2 = (dateString, cutoffDate) => {
  const birthDate = new Date(dateString);
  const cutoff = new Date(cutoffDate);

  let age = cutoff.getFullYear() - birthDate.getFullYear();
  const monthDiff = cutoff.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && cutoff.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const calculateBMI2 = (height, weight) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  return parseFloat(bmi.toFixed(2));
};

export const QuestionForm2 = ({
  questionData,
  register,
  errors,
  watch,
  trigger,
  setValue,
  goToNext,
  onSubQuestionComplete,
}) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [currentSubQIndex, setCurrentSubQIndex] = useState(-1);
  const navigate = useNavigate();
  const genderValue = watch('gender');

  useEffect(() => {
    if (questionData.subcategory === 'caste' && genderValue === 'Third Gender') {
      setValue('caste', 'Third Gender');
    }
  }, [genderValue, questionData.subcategory, setValue]);

  if (!questionData) {
    return null;
  }

  if (!questionData.answerType) {
    return (
      <div className="question-form-intro">
        {questionData.introductionLine1 && <p>{questionData.introductionLine1}</p>}
        {questionData.introductionLine2 && <p>{questionData.introductionLine2}</p>}
      </div>
    );
  }

  const formatDate = date => {
    if (!date) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date?.toLocaleDateString('en-GB', options)?.replace(/(\d+) (\w+) (\d+)/, '$1 $2 $3');
  };

  const fieldName =
    typeof questionData.subcategory === 'string'
      ? questionData.subcategory.replace(/\./g, '_')
      : 'default_field';

  const minSelect = questionData.minSelect || 0;
  const maxSelect = questionData.maxSelect || null;

  const watchedValue = watch(fieldName);
  const nameValue = watch('name');
  const heightValue = watch('height');
  const weightValue = watch('weight');

  let dynamicResponse = '';
  if (questionData.answerType === 'checkbox') {
    const selected = Array.isArray(watchedValue) ? watchedValue : [];
    if (selected.length < minSelect) {
      dynamicResponse =
        questionData.minSelectMessage || `Please select at least ${minSelect} options.`;
    } else if (maxSelect && selected.length > maxSelect) {
      dynamicResponse =
        questionData.maxSelectMessage || `Please select no more than ${maxSelect} options.`;
    } else {
      const key = selected.sort().join(',');
      dynamicResponse = questionData.responses?.[key] || '';
    }
  } else if (questionData.responses) {
    const raw = watchedValue ? questionData.responses[watchedValue] || '' : '';
    dynamicResponse = raw.includes('[name]') ? raw.replace(/\[name\]/g, nameValue || '') : raw;
  } else {
    const raw = questionData.response || '';
    dynamicResponse = raw.includes('[name]') ? raw.replace(/\[name\]/g, nameValue || '') : raw;
  }

  if (questionData.answerType === 'text' && !watchedValue) {
    dynamicResponse = '';
  }

  if (
    questionData.categoryLabel === 'Physical & Medical' &&
    questionData.subcategory === 'height'
  ) {
    if (heightValue && weightValue) {
      const bmi = calculateBMI2(heightValue, weightValue);
      const bmiCutoff = questionData.bmiCutoff || 18.5;
      if (bmi < bmiCutoff) {
        dynamicResponse = `Your BMI indicates you are underweight. The minimum BMI requirement is ${bmiCutoff}.`;
      } else {
        dynamicResponse =
          'Physical measurements registered successfully. You meet the height requirements.';
      }
    }
  }

  const validationRules = {};
  if (questionData.answerType === 'checkbox') {
    validationRules.validate = value => {
      const selected = Array.isArray(value) ? value : [];
      const len = Array.isArray(value) ? value.length : 0;
      if (len < minSelect) return `Please select at least ${minSelect} subjects.`;
      if (maxSelect && len > maxSelect) return `Please select no more than ${maxSelect} subjects.`;

      if (questionData.requiredSubjects?.length > 0) {
        const missingRequired = questionData.requiredSubjects.some(
          subj => !selected.includes(subj)
        );
        if (missingRequired) {
          return `The following subject(s) are mandatory: ${questionData.requiredSubjects.join(
            ', '
          )}`;
        }
      }

      return true;
    };
  } else {
    validationRules.required = questionData.errorMessage;
    if (questionData.errorResponse && questionData.answerType !== 'date') {
      validationRules.validate = value => questionData.errorResponse[value] || true;
    }
  }

  if (questionData.answerType === 'date') {
    validationRules.validate = value => {
      if (!value) {
        return {
          message: questionData.errorMessage,
          comment: questionData.errorComment?.noValue || '',
        };
      }

      const inputDate = new Date(value);
      const minDate = new Date(questionData.minDate);
      const maxDate = new Date(questionData.maxDate);
      const cutoffDate = new Date(questionData.cutoffDate);

      const ageAtCutoff = computeAge2(value, questionData.cutoffDate);
      const formattedCutoff = formatDate(cutoffDate);

      if (inputDate < minDate) {
        const msg = questionData.errorResponse.lessThenminDate
          .replace('[age]', ageAtCutoff)
          .replace('[cutoffDate]', formattedCutoff);
        return msg;
      }

      if (inputDate > maxDate) {
        const msg = questionData.errorResponse.greaterThanMaxDate
          .replace('[age]', ageAtCutoff)
          .replace('[cutoffDate]', formattedCutoff);
        return msg;
      }

      return true;
    };
  }

  const categoryClass = questionData.category
    ? questionData.category.toLowerCase().replace(/\s/g, '-')
    : 'default-category';

  const renderInput = () => {
    console.log(questionData);
    switch (questionData.answerType) {
      case 'dropdown': {
        // Lock caste dropdown if needed
        console.log(' Lock caste dropdown if needed: ', questionData.subcategory, genderValue);
        const isCasteLock = questionData.subcategory === 'caste' && genderValue === 'Third Gender';
        return (
          <Form.Select
            className="input-dropdown"
            {...register(fieldName, validationRules)}
            value={isCasteLock ? 'Third Gender' : watchedValue}
            disabled={isCasteLock}
          >
            <option value="">Select...</option>
            {questionData.options.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Form.Select>
        );
      }
      case 'text':
        if (
          questionData.categoryLabel === 'Physical & Medical' &&
          questionData.subcategory === 'height'
        ) {
          return (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Form.Control
                  className="input-text"
                  type="text"
                  placeholder="Height (cm)"
                  {...register('height', { required: 'Height is required' })}
                />
                <Form.Control
                  className="input-text"
                  type="text"
                  placeholder="Weight (kg)"
                  {...register('weight', { required: 'Weight is required' })}
                />
              </div>
            </>
          );
        }
        return (
          <Form.Control
            className="input-text"
            type="text"
            {...register(fieldName, validationRules)}
          />
        );
      case 'radio':
        return questionData.options.map(o => {
          const { onChange, onBlur, name, ref } = register(fieldName, validationRules);
          return (
            <label
              key={o.value}
              className={`new-component-radio-label ${selectedValue === o.value ? 'selected' : ''}`}
            >
              <Form.Check
                className="radio-input"
                type="radio"
                label={o.label}
                value={o.value}
                name={name}
                ref={ref}
                onChange={e => {
                  setSelectedValue(o.value);
                  onChange(e);
                  trigger(fieldName);
                }}
                onBlur={onBlur}
              />
            </label>
          );
        });
      case 'checkbox':
        const selectedCheckboxes = Array.isArray(watchedValue) ? watchedValue : [];
        return questionData.options.map(o => {
          const { onChange, onBlur, name, ref } = register(fieldName, validationRules);
          const isSelected = selectedCheckboxes.includes(o.value);
          return (
            <label
              key={o.value}
              className={`new-component-radio-label-checkbox ${isSelected ? 'selected' : ''}`}
            >
              <Form.Check
                className="checkbox-input"
                type="checkbox"
                label={o.label}
                value={o.value}
                name={name}
                ref={ref}
                onChange={e => {
                  onChange(e);
                  trigger(fieldName);
                }}
                onBlur={onBlur}
              />
            </label>
          );
        });
      case 'date': {
        const { ref, onChange, onBlur, name } = register(fieldName, validationRules);
        return (
          <Form.Control
            className="input-date"
            type="date"
            name={name}
            ref={ref}
            onBlur={onBlur}
            onChange={e => {
              onChange(e);
              trigger(fieldName);
            }}
          />
        );
      }
      case 'dropdown':
        return (
          <Form.Select className="input-dropdown" {...register(fieldName, validationRules)}>
            <option value="">Select...</option>
            {questionData.options.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Form.Select>
        );
      case 'calculation':
        return (
          <input
            className="input-calc"
            type="text"
            readOnly
            value="Calculated fee details will be shown here."
          />
        );
      default:
        return null;
    }
  };

  const applicableSubQuestions = [
    ...(questionData.subQuestions?._any || []),
    ...(questionData.subQuestions?.[watchedValue] || []),
  ];
  const hasSubQuestions = applicableSubQuestions.length > 0;
  const handleResponseClick = response => {
    setCurrentSubQIndex(prev => prev + 1);
  };
  return (
    <div className={`question-form-wrapper ${categoryClass}`}>
      {currentSubQIndex === -1 ? (
        <>
          {questionData?.question !== 'Do you have any children?' && (
            <p className="text-3xl fw-semibold text-intro-primary-3 border-bottom-category">
              {questionData.categoryLabel}
            </p>
          )}

          <div className="question-text-block flex flex-col">
            {questionData.question && (
              <span className="text-intro-primary-4 fw-normal text-2xl mt-3 ">
                {questionData.question}
              </span>
            )}
            {questionData.label && (
              <span className="question-label text-intro-primary-4 fw-thin text-lg mt-3 italic">
                {/* {questionData.label} */}
              </span>
            )}
          </div>
          <div className="input-container mt-4 mb-3 o-h-150px">{renderInput()}</div>

          {questionData.categoryLabel === 'Physical & Medical' &&
            questionData.subcategory === 'height' &&
            heightValue &&
            weightValue && (
              <div className="bmi-result">
                <h4>BMI Results</h4>
                <p>
                  Your BMI: <strong>{calculateBMI2(heightValue, weightValue)}</strong> - Normal
                  weight
                </p>
              </div>
            )}
          {errors[fieldName] && (
            <div className="error-container">
              <span className="error-message">{errors[fieldName].message}</span>
              {errors[fieldName].comment && (
                <span className="error-comment">{errors[fieldName].comment}</span>
              )}

              {errors[fieldName] && questionData?.errorResponseLink?.[watchedValue] && (
                <Link
                  href={questionData?.errorResponseLink?.[watchedValue]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    onClick={e => {
                      e.stopPropagation();
                      window.open(
                        questionData?.errorResponseLink?.[watchedValue],
                        '_blank',
                        'noopener,noreferrer'
                      );
                    }}
                    className="error-comment-link mt-2"
                  >
                    {questionData?.errorResponseLink?.[watchedValue]}
                  </span>
                </Link>
              )}
            </div>
          )}

          {dynamicResponse && !errors[fieldName] && (
            <div className="success-container">
              <span className="success-message">
                {dynamicResponse?.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </span>
            </div>
          )}

          {hasSubQuestions && (
            <button className="next-button mt-3" onClick={() => setCurrentSubQIndex(0)}>
              Next
            </button>
          )}
        </>
      ) : (
        <>
          <QuestionForm2
            key={currentSubQIndex}
            questionData={applicableSubQuestions[currentSubQIndex]}
            register={register}
            errors={errors}
            watch={watch}
            trigger={trigger}
            setValue={setValue}
          />
          {currentSubQIndex < applicableSubQuestions.length - 1 && (
            <button
              className="next-button mt-3"
              onClick={() => {
                if (currentSubQIndex < applicableSubQuestions.length - 1) {
                  setCurrentSubQIndex(prev => prev + 1);
                }
              }}
            >
              Next
            </button>
          )}
        </>
      )}
    </div>
  );
};

export const ProfileEditFormMain = ({ closeModal, nextPage, setUser, seletedStep, onRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log({ seletedStep });
  const { user } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(seletedStep || 'login');
  const [loginMethod, setLoginMethod] = useState('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState(null);
  const [otpEmailSentTo, setOtpEmailSentTo] = useState(null);

  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const onSubmitLogin = async data => {
    userApi.auth.login({
      data: { mobileNumber: data.mobileNumber },
      setIsLoading,
      onSuccess: res => {
        setUserId(res?.data?.id);
        res?.data?.universityId && sessionStorage.setItem('universityId', res?.data?.universityId);
        res?.data?.semesterId && sessionStorage.setItem('semesterId', res?.data?.semesterId);
        res?.data?.courseId && sessionStorage.setItem('courseId', res?.data?.courseId);
        showNotification({
          type: 'success',
          message: 'OTP sent to your registered mobile number.',
        });

        setOtpSentTo(data.mobileNumber);
        setOtpEmailSentTo(data.email);
        setStep('otp');
      },
      onError: e => {
        console.log(e);
        showNotification({
          type: 'error',
          message: e?.response?.data?.message || 'Login failed. Please try again.',
        });
      },
    });
  };

  const onSubmitEmailLogin = async data => {
    userApi.auth.emailLogin({
      data: { email: data.email },
      setIsLoading,
      onSuccess: res => {
        setUserId(res?.data?.id);
        showNotification({
          type: res?.data?.otp ? 'success' : 'error',
          message: res?.data?.otp ? `Otp is ${res?.data?.otp}` : 'Something went wrong',
        });
        setOtpSentTo(data.email);
        setOtpEmailSentTo(data.email);
        setStep('otp');
      },
    });
  };

  const onVerifyOtp = data => {
    userApi.auth.verifyOtp({
      data: { id: data.id },
      setIsLoading,
      onSuccess: res => {
        setUserId(res?.data?.id);
        showNotification({
          type: res?.data?.otp ? 'success' : 'error',
          message: res?.data?.otp ? `Otp is ${res?.data?.otp}` : 'Something went wrong',
        });
        setOtpSentTo(data.email);
        setOtpEmailSentTo(data.email);
      },
    });
  };

  const onSubmitOtp = data => {
    userApi.auth.verifyOtp({
      id: userId,
      data: { otp: data.otp },
      showMsg: true,
      onSuccess: res => {
        localStorage.setItem('authToken', res?.data?.token);
        const savedToken = localStorage.getItem('authToken');

        if (res?.data?.userId && savedToken) {
          userApi.profile.getUserProfile({
            onSuccess: data => {
              setUser(data?.data?.user);
            },
          });
        }
        const universityId = sessionStorage.getItem('universityId');
        const semesterId = sessionStorage.getItem('semesterId');
        const courseId = sessionStorage.getItem('courseId');
        if (savedToken) {
          if (courseId && semesterId && universityId) {
            userApi.profile.update({
              data: {
                goalCategory: universityId,
                goal: courseId,
                semester: semesterId,
                firstHearAboutUs: true,
              },
              onSuccess: () => {
                if (user?.firstHearAboutUs) {
                  navigate('/user/home');
                } else {
                  navigate('/choose/hear-about-us');
                }
                // sessionStorage.removeItem('universityId');
                // sessionStorage.removeItem('semesterId');
                // sessionStorage.removeItem('courseId');
              },
              onError: e => {
                console.log(e);
                navigate(-1);
              },
            });
          } else {
            if (onRegister) {
              onRegister();
              return;
            }
            navigate('/choose-curriculum', { state: { nextPage } });
          }
        }
        {
          savedToken && navigate('/choose-curriculum', { state: { nextPage } });
        }
      },
    });
  };

  const onSubmitRegister = data => {
    localStorage.clear();
    userApi.auth.registerUser({
      data: {
        fullName: data.fullName,
        mobileNumber: data.mobileNumber,
        email: data.email,
        hearAboutUs: data.hearAboutUs,
        firstHearAboutUs: true,
        referralCode: data.referralCode,
      },
      setIsLoading,
      showMsg: true,
      onSuccess: res => {
        setOtpSentTo(data.mobileNumber);
        setOtpEmailSentTo(data.email);
        setStep('login');
      },
    });
  };

  const onSubmitForgot = data => {
    setStep('confirmation');
  };

  return (
    <div className="p-4 relative">
      <p className="flex justify-end absolute top-3 right-3 bg-gray-200 rounded-full p-1">
        <Icon onClick={closeModal} icon="material-symbols:close" className="cursor-pointer" />
      </p>
      <div className="mx-auto w-full">
        <p className="text-center my-2">
          <img
            onClick={() => navigate('/')}
            src={images.newMainLogo}
            className="max-w-[150px] mx-auto mb-5"
            alt="logo"
          />
        </p>

        {step === 'login' && (
          <>
            <h2 className="text-2xl font-semibold text-center text-[#3DD455] mb-3">Log in</h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmitLogin)}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  type="tel"
                  {...register('mobileNumber', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter a valid 10-digit number',
                    },
                  })}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="9876543210"
                />
                {errors.mobileNumber && (
                  <p className="text-xs italic text-red-500">{errors.mobileNumber.message}</p>
                )}
              </div>
              {false && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email address',
                      },
                    })}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs italic text-red-500">{errors.email.message}</p>
                  )}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Send OTP'}
              </button>
            </form>
            <p className="text-sm text-center mt-4">
              No account yet?{' '}
              <button onClick={() => setStep('register')} className="text-blue-500 underline">
                Register
              </button>
            </p>
            {/* <p className="mt-4 text-center">
              <button onClick={() => setStep('forgot')} className="text-sm text-blue-600 underline">
                Forgot password?
              </button>
            </p> */}
          </>
        )}

        {step === 'otp' && (
          <>
            <h2 className="text-xl font-semibold text-center text-black">Enter OTP</h2>
            <p className="text-sm text-center mb-3">OTP sent to {otpSentTo}</p>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmitOtp)}>
              <div>
                <label className="block text-sm font-medium text-gray-700">OTP</label>
                <input
                  type="text"
                  {...register('otp', {
                    required: 'OTP is required',
                    pattern: {
                      value: /^[0-9]{4}$/,
                      message: 'Enter a valid 4-digit OTP',
                    },
                  })}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="1234"
                />
                {errors.otp && <p className="text-xs italic text-red-500">{errors.otp.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-[#3DD455] hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}

        {step === 'register' && (
          <>
            <h2 className="text-2xl font-semibold text-center text-[#3DD455]">Register</h2>
            <p className="text-sm text-center mb-3">
              Already have an account?{' '}
              <button onClick={() => setStep('login')} className="text-blue-500 underline">
                Log in
              </button>
            </p>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmitRegister)}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  {...register('fullName', { required: 'Full name is required' })}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-xs italic text-red-500">{errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  type="tel"
                  {...register('mobileNumber', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter a valid 10-digit number',
                    },
                  })}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="9876543210"
                />
                {errors.mobileNumber && (
                  <p className="text-xs italic text-red-500">{errors.mobileNumber.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-xs italic text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  {...register('referralCode')}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="D8ANEL0LO"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-2 font-bold bg-[#3DD455] hover:bg-black text-white rounded-lg"
              >
                Register
              </button>
            </form>
          </>
        )}

        {step === 'forgot' && (
          <>
            <h2 className="text-xl font-semibold text-center text-green-600">
              Forgot your password?
            </h2>
            <form onSubmit={handleSubmit(onSubmitForgot)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-xs italic text-red-500">{errors.email.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2 font-semibold text-black transition bg-yellow-300 rounded-md hover:bg-yellow-400"
              >
                Reset
              </button>
            </form>
            <p className="mt-4 text-center">
              <span
                className="text-sm text-blue-600 underline cursor-pointer"
                onClick={() => setStep('login')}
              >
                Return to the login page
              </span>
            </p>
          </>
        )}

        {step === 'confirmation' && (
          <div className="text-center">
            <h2 className="mt-4 text-xl font-semibold text-green-600">
              We have sent you a message.
            </h2>
            <p className="text-green-700">Go to the mail</p>
            <p className="mt-4">
              <span
                className="text-sm text-blue-600 underline cursor-pointer"
                onClick={() => setStep('login')}
              >
                Return to the login page
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
