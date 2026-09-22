import apiRequest from './apiService';
import { endpoints } from './endpoints';

const createApiRequest =
  (method, endpoint) =>
  (args = {}) => {
    let finalEndpoint = endpoint;
    if (typeof endpoint === 'function' && args.id) {
      finalEndpoint = endpoint(args.id);
    }

    const {
      data = {},
      params = {},
      setIsLoading,
      setData,
      onSuccess,
      onError,
      showMsg,
      ...rest
    } = args;

    return apiRequest({
      method,
      endpoint: finalEndpoint,
      data,
      params,
      setIsLoading,
      setData,
      onSuccess,
      onError,
      showMsg,
      ...rest,
    });
  };

export const userApi = {
  auth: {
    login: createApiRequest('POST', endpoints.auth.userLogin),
    emailLogin: createApiRequest('POST', endpoints.auth.userEmailLogin),

    registerUser: createApiRequest('POST', endpoints.auth.registerUser),
    forgotPassword: createApiRequest('POST', endpoints.auth.forgotPassword),
    changePassword: createApiRequest('PUT', endpoints.auth.changePassword),
    verifyOtp: createApiRequest('POST', id => endpoints.auth.verifyOtp(id)),

  },
  subscriptions: {
    getSubscription: createApiRequest('GET', 'user/user-subscription/me'),
    getAll: createApiRequest('GET', 'user/subscription-plans'),
    create: createApiRequest('POST', `user/user-subscription/add`),
    update: createApiRequest('PUT', id => `user/user-subscription/payment/${id}`),
    coupons: {
      getAll: createApiRequest('GET', 'user/coupons'),

    },
    transactions: createApiRequest('GET', 'user/transactions'),
  },
  profile: {
    registration: createApiRequest('POST', endpoints.user.profile.registration),
    login: createApiRequest('POST', endpoints.user.profile.login),
    forgetPassword: createApiRequest('POST', endpoints.user.profile.forgetPassword),
    verifyOtp: createApiRequest('POST', endpoints.user.profile.forgotVerifyOtp),
    changePassword: createApiRequest('PUT', endpoints.user.profile.changePassword),
    update: createApiRequest('PUT', endpoints.user.profile.update),
    getUserProfile: createApiRequest('GET', endpoints.user.profile.getUserProfile),
    getAllUser: createApiRequest('GET', endpoints.user.profile.getAllUser),
    getAllUserByType: createApiRequest('GET', endpoints.user.profile.getAllUserByType),
    getUserById: createApiRequest('GET', endpoints.user.profile.getUserById),
    getUserRoles: createApiRequest('GET', endpoints.user.profile.getUserRoles),
    deleteUser: createApiRequest('DELETE', endpoints.user.profile.deleteUser),
    updateUserById: createApiRequest('PUT', endpoints.user.profile.updateUserById),
    uploadProfilePicture: createApiRequest('POST', endpoints.user.profile.uploadProfilePicture),
    uploadId: createApiRequest('POST', endpoints.user.profile.uploadId),
    uploadCourseContent: createApiRequest('POST', endpoints.user.profile.uploadCourseVideoImagePdf),
    searchUser: createApiRequest('GET', endpoints.user.profile.searchUser),
  },
  goalCategory: {
    create: createApiRequest('POST', endpoints.user.goalCategory.createGoalCategory),
    getAll: createApiRequest('GET', endpoints.user.goalCategory.getAllGoalCategories),
    getById: createApiRequest('GET', endpoints.user.goalCategory.getGoalCategoryById),
    update: createApiRequest('PUT', endpoints.user.goalCategory.updateGoalCategory),
    delete: createApiRequest('DELETE', endpoints.user.goalCategory.deleteGoalCategory),
  },
  goal: {
    create: createApiRequest('POST', endpoints.user.goal.createGoal),
    getAll: createApiRequest('GET', endpoints.user.goal.getAllGoals),
    getByGoalCategory: createApiRequest('GET', id =>
      endpoints.user.goal.getAllGoalsByGoalCategory(id)
    ),
    getById: createApiRequest('GET', endpoints.user.goal.getGoalById),
    update: createApiRequest('PUT', endpoints.user.goal.updateGoal),
    delete: createApiRequest('DELETE', endpoints.user.goal.deleteGoal),
  },
  subjects: {
    getAll: createApiRequest('GET', endpoints.user.subjects.getAll),
    getByGoalCategory: createApiRequest('GET', endpoints.user.subjects.getByGoalCategory),
  },
  notifications: {
    getAllNotifications: createApiRequest('GET', endpoints.user.notifications.getAllNotifications),
    getUnreadNotifications: createApiRequest(
      'GET',
      endpoints.user.notifications.getUnreadNotifications
    ),
    markAllAsRead: createApiRequest('PUT', endpoints.user.notifications.markAllAsRead),
  },
  aboutExam: {
    create: createApiRequest('POST', endpoints.user.aboutExam.createAboutExam),
    getAll: createApiRequest('GET', endpoints.user.aboutExam.getAllAboutExams),
    getByGoalId: createApiRequest('GET', endpoints.user.aboutExam.getAboutExamsByGoalId),
    update: createApiRequest('PUT', endpoints.user.aboutExam.updateAboutExam),
    delete: createApiRequest('DELETE', endpoints.user.aboutExam.deleteAboutExam),
  },
  courses: {
    getAll: createApiRequest('GET', endpoints.user.courses.getAll),
    getById: createApiRequest('GET', endpoints.user.courses.getById),
    askQuestion: createApiRequest('POST', endpoints.user.courses.askQuestion),
    getQA: createApiRequest('GET', endpoints.user.courses.getQa),
    getPopularCourses: createApiRequest('GET', endpoints.user.courses.getPopularCourses),
    getCoursePercentage: createApiRequest('GET', endpoints.user.courses.getCoursePercentage),
  },
  capsuleCourse: {
    getAll: createApiRequest('GET', endpoints.user.capsuleCourse.getAll),
    getById: createApiRequest('GET', endpoints.user.capsuleCourse.getById),
  },
  handWrittenNotes: {
    getAll: createApiRequest('GET', endpoints.user.handWrittenNotes.getAll),
    getById: createApiRequest('GET', endpoints.user.handWrittenNotes.getById),
  },
  logs: {
    create: createApiRequest('POST', endpoints.user.logs.create),
    getAll: createApiRequest('GET', endpoints.user.logs.getAllLogs),
    getByGoalId: createApiRequest('GET', endpoints.user.logs.getLogsByGoalId),
    update: createApiRequest('PUT', endpoints.user.logs.updateLogs),
  },
  testSeries: {
    getAll: createApiRequest('GET', endpoints.user.testSeries.getAll),
    getById: createApiRequest('GET', endpoints.user.testSeries.get),
    testSeriesByTestId: createApiRequest('GET', endpoints.user.testSeries.testSeriesByTestId),
    submitTest: createApiRequest('POST', endpoints.user.testSeries.submitTest),
    trackTest: createApiRequest('GET', endpoints.user.testSeries.trackTest),
  },
  pyq: {
    getAll: createApiRequest('GET', endpoints.user.pyq.getAll),
    getById: createApiRequest('GET', endpoints.user.pyq.getById),
    create: createApiRequest('POST', endpoints.user.pyq.create),
    update: createApiRequest('PUT', endpoints.user.pyq.update),
    delete: createApiRequest('DELETE', endpoints.user.pyq.delete),
    pyqByTestId: createApiRequest('GET', endpoints.user.pyq.pyqByTestId),
    pyqTestSubmit: createApiRequest('POST', endpoints.user.pyq.pyqTestSubmit),
  },
  skills: {
    getAll: createApiRequest('GET', endpoints.user.skills.getAll),
    getById: createApiRequest('GET', id => endpoints.user.skills.get(id)),
    create: createApiRequest('POST', endpoints.user.skills.create),
    update: createApiRequest('PUT', endpoints.user.skills.update),
    delete: createApiRequest('DELETE', endpoints.user.skills.delete),
  },
  currentAffairs: {
    getDailyNews: createApiRequest('GET', endpoints.user.currentAffairs.getDailyNews),
    getEditorialAnalysis: createApiRequest(
      'GET',
      endpoints.user.currentAffairs.getEditorialAnalysis
    ),
    getDailyQuiz: createApiRequest('GET', endpoints.user.currentAffairs.getDailyQuiz),
    getTargetCurrentAffairs: createApiRequest(
      'GET',
      endpoints.user.currentAffairs.getTargetCurrentAffairs
    ),
    getYoutubeVideos: createApiRequest('GET', endpoints.user.currentAffairs.getYoutubeVideos),
    getTargetCurrentAffairsById: createApiRequest(
      'GET',
      endpoints.user.currentAffairs.getTargetCurrentAffairsById
    ),
    getPdf: createApiRequest('GET', endpoints.user.currentAffairs.getPdf),
    getTargetCurrentAffairsTest: createApiRequest(
      'POST',
      endpoints.user.currentAffairs.getTargetCurrentAffairsTest
    ),
  },
  community: {
    getAll: createApiRequest('GET', endpoints.user.community.getAll),
    likePost: createApiRequest('PUT', endpoints.user.community.likePost),
    pinPost: createApiRequest('PUT', endpoints.user.community.pinPost),
    addComment: createApiRequest('POST', endpoints.user.community.addComment),
    createPost: createApiRequest('POST', endpoints.user.community.createPost),
  },
  studyPlanner: {
    getUserPlans: createApiRequest('GET', endpoints.user.studyPlanner.getUserPlans),
    createUserPlan: createApiRequest('POST', endpoints.user.studyPlanner.createUserPlan),
    getPlanById: createApiRequest('GET', endpoints.user.studyPlanner.getPlanById),
  },
  cart: {
    addToCart: createApiRequest('POST', endpoints.user.cart.addToCart),
    getCart: createApiRequest('GET', endpoints.user.cart.getCart),
    removeFromCart: createApiRequest('DELETE', endpoints.user.cart.removeFromCart),
    checkOut: createApiRequest('POST', endpoints.user.cart.checkOut),
    placeOrder: createApiRequest('POST', endpoints.user.cart.placeOrder),
    startCourse: createApiRequest('POST', endpoints.user.cart.startCourse),
    startTestDirectly: createApiRequest('POST', endpoints.user.cart.startTestDirectly),
  },
  staticContent: {
    aboutUs: {
      create: createApiRequest('POST', endpoints.user.staticContent.aboutUs.create),
      update: createApiRequest('PUT', endpoints.user.staticContent.aboutUs.update),
      get: createApiRequest('GET', endpoints.user.staticContent.aboutUs.get),
      getById: createApiRequest('GET', endpoints.user.staticContent.aboutUs.getById),
      delete: createApiRequest('DELETE', endpoints.user.staticContent.aboutUs.delete),
    },
    privacy: {
      create: createApiRequest('POST', endpoints.user.staticContent.privacy.create),
      update: createApiRequest('PUT', endpoints.user.staticContent.privacy.update),
      get: createApiRequest('GET', endpoints.user.staticContent.privacy.get),
      getById: createApiRequest('GET', endpoints.user.staticContent.privacy.getById),
      delete: createApiRequest('DELETE', endpoints.user.staticContent.privacy.delete),
    },
    terms: {
      create: createApiRequest('POST', endpoints.user.staticContent.terms.create),
      update: createApiRequest('PUT', endpoints.user.staticContent.terms.update),
      get: createApiRequest('GET', endpoints.user.staticContent.terms.get),
      getById: createApiRequest('GET', endpoints.user.staticContent.terms.getById),
      delete: createApiRequest('DELETE', endpoints.user.staticContent.terms.delete),
    },
    faq: {
      create: createApiRequest('POST', endpoints.user.staticContent.faq.create),
      getAll: createApiRequest('GET', endpoints.user.staticContent.faq.getAll),
      getAllByCategory: createApiRequest('GET', endpoints.user.staticContent.faq.getAllByCategory),
      update: createApiRequest('PUT', endpoints.user.staticContent.faq.update),
      getById: createApiRequest('GET', endpoints.user.staticContent.faq.getById),
      delete: createApiRequest('DELETE', endpoints.user.staticContent.faq.delete),
    },
    callUs: {
      create: createApiRequest('POST', endpoints.user.staticContent.callUs.create),
      getAll: createApiRequest('GET', endpoints.user.staticContent.callUs.getAll),
      getById: createApiRequest('GET', endpoints.user.staticContent.callUs.getById),
      update: createApiRequest('PUT', endpoints.user.staticContent.callUs.update),
      delete: createApiRequest('DELETE', endpoints.user.staticContent.callUs.delete),
    },
    banner: {
      create: createApiRequest('POST', endpoints.user.staticContent.banner.create),
      getAll: createApiRequest('GET', endpoints.user.staticContent.banner.getAll),
      getByPosition: createApiRequest('GET', endpoints.user.staticContent.banner.getByPosition),
      updatePosition: createApiRequest('PUT', endpoints.user.staticContent.banner.updatePosition),
      getById: createApiRequest('GET', endpoints.user.staticContent.banner.getById),
      delete: createApiRequest('DELETE', endpoints.user.staticContent.banner.delete),
    },
  },
  settingPage: {
    getUser: createApiRequest('GET', endpoints.user.settingPage.getUser),
    updateProfile: createApiRequest('PUT', endpoints.user.settingPage.updateProfile),
    updateProfileImage: createApiRequest('PUT', endpoints.user.settingPage.updateProfilePicture),
    getPurchasedCourses: createApiRequest('GET', endpoints.user.settingPage.getPurchasedCourses),
    getTimeLine: createApiRequest('GET', endpoints.user.settingPage.getTimeLine),
  },
  university: {
    getAll: createApiRequest('GET', endpoints.user.university.getAll),
  },
  universityCourse: {
    getAll: createApiRequest('GET', endpoints.user.universityCourse.getAll),
    getByUniversity: createApiRequest('GET', id =>
      endpoints.user.universityCourse.getByUniversity(id)
    ),
  },
  semesterExam: {
    getAll: createApiRequest('GET', endpoints.user.semesterExam.getAll),
  },

  testMonial: {
    getAll: createApiRequest('GET', endpoints.user.testMonial.getAll),
  },
  faq: {
    getAll: createApiRequest('GET', endpoints.user.faq.getAll),
  },
  aboutUs: {
    getAll: createApiRequest('GET', endpoints.user.aboutUs.getAll),
  },
  topContent: {
    getAll: createApiRequest('GET', endpoints.user.topContent.getAll),
  },
  subscription: {
    getAll: createApiRequest('GET', endpoints.user.subscription.getAll),
    getAllCourses: createApiRequest('GET', endpoints.user.subscription.getAllCourses),
  },
  job: {
    getAll: createApiRequest('GET', endpoints.user.job.getAll),
    getById: createApiRequest('GET', id => endpoints.user.job.getById(id)),
    applyJob: createApiRequest('POST', id => endpoints.user.job.applyJob(id)),
  },
  landingPage: {
    getAll: createApiRequest('GET', endpoints.user.landingPage.getAll),
    getTopBanner: createApiRequest('GET', endpoints.user.landingPage.getTopBanner),
    updateBannerStatus: createApiRequest('PUT', endpoints.user.landingPage.updateBannerStatus),
  },
};
