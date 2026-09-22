export const jeeMainFeeTable = {
  single: {
    India: {
      Male: {
        General: 1000,
        "Gen-EWS/ OBC (NCL)": 900,
        "SC/ST": 500,
        PWD: 500,
      },
      Female: {
        General: 800,
        "Gen-EWS/ OBC (NCL)": 800,
        "SC/ST": 500,
        PWD: 500,
      },
      "Third gender": {
        NA: 500,
      },
    },
    "Outside India": {
      Male: {
        General: 5000,
        "Gen-EWS/ OBC (NCL)": 4500,
        "SC/ST": 2500,
        PWD: 2500,
      },
      Female: {
        General: 4000,
        "Gen-EWS/ OBC (NCL)": 4000,
        "SC/ST": 2500,
        PWD: 2500,
      },
      "Third gender": {
        NA: 3000,
      },
    },
  },
  double: {
    India: {
      Male: {
        General: 2000,
        "Gen-EWS/ OBC (NCL)": 1800,
        "SC/ST": 1000,
        PWD: 1000,
      },
      Female: {
        General: 1600,
        "Gen-EWS/ OBC (NCL)": 1600,
        "SC/ST": 1000,
        PWD: 1000,
      },
      "Third gender": {
        NA: 1000,
      },
    },
    "Outside India": {
      Male: {
        General: 10000,
        "Gen-EWS/ OBC (NCL)": 9000,
        "SC/ST": 5000,
        PWD: 5000,
      },
      Female: {
        General: 8000,
        "Gen-EWS/ OBC (NCL)": 8000,
        "SC/ST": 5000,
        PWD: 5000,
      },
      "Third gender": {
        NA: 5000,
      },
    },
  },
  triple: {
    India: {
      Male: {
        General: 2000,
        "Gen-EWS/ OBC (NCL)": 1800,
        "SC/ST": 1000,
        PWD: 1000,
      },
      Female: {
        General: 1600,
        "Gen-EWS/ OBC (NCL)": 1600,
        "SC/ST": 1000,
        PWD: 1000,
      },
      "Third gender": {
        NA: 1000,
      },
    },
    "Outside India": {
      Male: {
        General: 10000,
        "Gen-EWS/ OBC (NCL)": 9000,
        "SC/ST": 5000,
        PWD: 5000,
      },
      Female: {
        General: 8000,
        "Gen-EWS/ OBC (NCL)": 8000,
        "SC/ST": 5000,
        PWD: 5000,
      },
      "Third gender": {
        NA: 5000,
      },
    },
  },
};

export const neetFeeTable = {
  India: {
    General: 1700,
    "General-EWS": 1000,
    "OBC (NCL)": 1000,
    "SC/ST": 1600,
    "PWD/PwBD": 1000,
  },
  "Non-Resident of India (NRIs)": {
    General: 9500,
    "General-EWS": 9500,
    "OBC (NCL)": 9500,
    "SC/ST": 9500,
    "PWD/PwBD": 9500,
  },
  "Overseas Citizen of India (OCIs)": {
    General: 9500,
    "General-EWS": 9500,
    "OBC (NCL)": 9500,
    "SC/ST": 9500,
    "PWD/PwBD": 9500,
  },
  "Foreign Nationals": {
    General: 9500,
    "General-EWS": 9500,
    "OBC (NCL)": 9500,
    "SC/ST": 9500,
    "PWD/PwBD": 9500,
  },
  "Outside India": {
    General: 9500,
    "General-EWS": 9500,
    "OBC (NCL)": 9500,
    "SC/ST": 9500,
    "PWD/PwBD": 9500,
  },
};

export const bitsatFeeTable = {
  "India or Nepal": {
    Male: {
      1: 3500,
      2: 5500,
    },
    Female: {
      1: 3000,
      2: 4500,
    },
    Transgender: {
      1: 3000,
      2: 4500,
    },
  },
  Dubai: {
    Male: {
      1: 7150,
      2: 9150,
    },
    Female: {
      1: 7150,
      2: 9150,
    },
    Transgender: {
      1: 7150,
      2: 9150,
    },
  },
};
export const ndaFeeTable = {
  India: {
    General: 200,
    "Gen-EWS/ OBC (NCL)": 200,
    "SC/ST": 200,
    PWD: 200,
  },
  "Outside India": {
    General: 200,
    "Gen-EWS/ OBC (NCL)": 200,
    "SC/ST": 200,
    PWD: 200,
  },
};

export const isEligibleForNEET = (dobString) => {
  const dob = new Date(dobString);
  if (isNaN(dob)) return false;

  const today = new Date();
  const eligibilityDate = new Date(today.getFullYear(), 11, 31);

  let age = eligibilityDate.getFullYear() - dob.getFullYear();
  const monthDiff = eligibilityDate.getMonth() - dob.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && eligibilityDate.getDate() < dob.getDate())
  ) {
    age -= 1;
  }

  return age >= 17;
};
