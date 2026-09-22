import { Icon } from "@iconify/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import {
  loadRazorpayScript,
  triggerRazorpay,
} from "../../../components/ThirdParty/RazorpayCheckout";
import HOC from "../../../components/layout/HOC";
import { userApi } from "../../../services/apiFunctions";

const AddToCartPage = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState({
    courses: [],
    testSeries: [],
    handwrittenNotes: [],
    previousYearQuestion: [],
    studyPlanner: [], // Add studyPlanner to the state
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState({
    checkout: false,
    removeItemId: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  const handleProceedToCheckout = async () => {
    setButtonLoading({ ...buttonLoading, checkout: true });
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load. Please try again.");
      setButtonLoading({ ...buttonLoading, checkout: false });
      return;
    }
    triggerRazorpay({
      amount: totalPrice,
      name: user?.fullName || "User",
      email: user?.email || "email@example.com",
      contact: user?.mobileNumber || "0000000000",
      onSuccess: (paymentRes) => {
        userApi.cart.checkOut({
          onSuccess: (checkoutRes) => {
            userApi.cart.placeOrder({
              id: checkoutRes.data?.orderId,
              data: {
                paymentMode: "UPI",
                transactionId: paymentRes?.razorpay_payment_id,
                paymentStatus: "completed",
              },
              onSuccess: (orderRes) => {
                const studyPlannerIds = orderRes?.data?.items
                  ?.map((item) => item?.studyPlanner)
                  ?.filter(Boolean);

                studyPlannerIds?.forEach((id) => {
                  userApi.cart.startCourse({
                    data: { studyPlannerId: id },
                  });
                });

                const startCoursePromises = [
                  ...cartItems.courses.map((item) =>
                    userApi.cart.startCourse({
                      data: { courseId: item.id },
                    })
                  ),
                  ...cartItems.courses.map((item) =>
                    userApi.cart.startTestDirectly({
                      data: { courseId: item.id },
                    })
                  ),
                  ...cartItems.testSeries.map((item) =>
                    userApi.cart.startCourse({
                      data: { testSeriesId: item.id },
                    })
                  ),
                  ...cartItems.testSeries.map((item) =>
                    userApi.cart.startTestDirectly({
                      data: { testSeriesId: item.id },
                    })
                  ),
                  ...cartItems.handwrittenNotes.map((item) =>
                    userApi.cart.startCourse({
                      data: { handwrittenNotesId: item.id },
                    })
                  ),
                  ...cartItems.handwrittenNotes.map((item) =>
                    userApi.cart.startTestDirectly({
                      data: { handwrittenNotesId: item.id },
                    })
                  ),
                ];
                Promise.all(startCoursePromises)
                  .then((responses) => {
                    setButtonLoading({ ...buttonLoading, checkout: false });
                    fetchCartItems();
                  })
                  .catch((error) => {
                    console.error("Error starting one or more courses:", error);
                    setButtonLoading({ ...buttonLoading, checkout: false });
                  });
              },
              onFailure: (err) => {
                console.error("Failed to place order:", err);
                setButtonLoading({ ...buttonLoading, checkout: false });
              },
            });
          },
          onFailure: (err) => {
            console.error("Checkout failed:", err);
            setButtonLoading({ ...buttonLoading, checkout: false });
          },
        });
      },
      onFailure: (err) => {
        console.error("Payment Failed", err);
        setButtonLoading({ ...buttonLoading, checkout: false });
      },
      onCancel: () => {
        console.warn("User closed payment window");
        setButtonLoading({ ...buttonLoading, checkout: false });
      },
    });
  };

  const fetchCartItems = async () => {
    try {
      const response = await userApi.cart.getCart({
        onSuccess: () => {},
        onError: () => {
          setCartItems({
            courses: [],
            testSeries: [],
            handwrittenNotes: [],
            previousYearQuestion: [],
            studyPlanner: [],
          });
        },
      });
      if (response.data && response.data.items) {
        const {
          courses,
          testSeries,
          handwrittenNotes,
          previousYearQuestion,
          studyPlanner,
        } = response.data.items.reduce(
          (acc, item) => {
            if (item?.course) {
              acc.courses.push({
                id: item.course._id,
                name: item.course.title,
                description: item.course.description,
                price: item.price,
                image:
                  item.course.courseImage?.[0] ||
                  "https://via.placeholder.com/100",
              });
            } else if (item?.testSeries) {
              acc.testSeries.push({
                id: item.testSeries._id,
                name: item.testSeries.bundleName,
                description: item.testSeries.bundleDescription,
                price: item.price,
                image:
                  item.testSeries.tileImage ||
                  "https://via.placeholder.com/100",
              });
            } else if (item?.handwrittenNotes) {
              acc.handwrittenNotes.push({
                id: item.handwrittenNotes._id,
                name: item.handwrittenNotes.bundleName,
                description: `By ${item.handwrittenNotes.topperName}`,
                price: item.price,
                image:
                  item.handwrittenNotes.image ||
                  "https://via.placeholder.com/100",
              });
            } else if (item?.previousYearQuestion) {
              acc.previousYearQuestion.push({
                id: item.previousYearQuestion._id,
                name: item.previousYearQuestion.bundleName,
                description: item.previousYearQuestion.bundleDescription,
                price: item.price,
                image:
                  item.previousYearQuestion.tileImage ||
                  "https://via.placeholder.com/100",
              });
            } else if (item?.studyPlanner) {
              acc.studyPlanner.push({
                id: item.studyPlanner._id,
                name: item.studyPlanner.title,
                description: item.studyPlanner.description,
                price: item.price,
                image: "https://via.placeholder.com/100", // Placeholder image for study planner
              });
            }
            return acc;
          },
          {
            courses: [],
            testSeries: [],
            handwrittenNotes: [],
            previousYearQuestion: [],
            studyPlanner: [],
          }
        );
        setCartItems({
          courses,
          testSeries,
          handwrittenNotes,
          previousYearQuestion,
          studyPlanner,
        });
        setTotalPrice(response.data.totalPrice);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (itemId, type) => {
    setButtonLoading({ ...buttonLoading, removeItemId: itemId });
    userApi.cart.removeFromCart({
      params: { [type]: itemId },
      onSuccess: () => {
        fetchCartItems();
        setButtonLoading({ ...buttonLoading, removeItemId: null });
      },
    });
  };

  const handleRemoveFromCart = (itemId, type) => {
    const typeMap = {
      "Your Courses": "courseId",
      "Test Series": "testSeriesId",
      "Notes": "handwrittenNotesId",
      "Previous Year Questions": "previousYearQuestionId",
      "Study Planner": "studyPlannerId",  
    };
    handleRemoveItem(itemId, typeMap[type]);
  };

  const renderCartItems = (items, title, icon) => (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
        <Icon icon={icon} className="text-2xl text-blue-600" />
        {title}
      </h2>
      {items?.length === 0 ? (
        <p className="italic text-gray-500">No {title.toLowerCase()} added.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 transition-all bg-white shadow-md rounded-xl hover:shadow-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="object-cover w-24 h-24 rounded-lg"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <p className="mt-2 font-semibold text-green-600 text-md">
                  ₹ {item.price}
                </p>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.id, title)}
                disabled={buttonLoading.removeItemId === item.id}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded-md font-medium flex items-center justify-center"
              >
                {buttonLoading.removeItemId === item.id ? (
                  <>
                    <Icon icon="eos-icons:loading" className="mr-2" />
                    Removing...
                  </>
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="py-10 text-lg font-medium text-center">Loading...</div>
    );
  }

  const totalItems =
    cartItems.courses?.length +
    cartItems.testSeries?.length +
    cartItems.handwrittenNotes?.length +
    cartItems.previousYearQuestion?.length +
    cartItems.studyPlanner?.length; // Include studyPlanner in total items count

  return (
    <div className="min-h-screen px-4 py-6 space-y-8 user_container md:px-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Your Cart
      </h1>
      {renderCartItems(
        cartItems.courses,
        "Your Courses",
        "ph:chalkboard-teacher"
      )}
      {renderCartItems(
        cartItems.testSeries,
        "Test Series",
        "carbon:study-previous"
      )}
      {renderCartItems(
        cartItems.handwrittenNotes,
        "Notes",
        "mdi:pen"
      )}
      {renderCartItems(
        cartItems.previousYearQuestion,
        "Previous Year Questions",
        "mdi:file-question"
      )}
      {renderCartItems(
        cartItems.studyPlanner,
        "Study Planner",
        "mdi:calendar-clock"
      )}
      <div className="sticky bottom-0 flex items-center justify-between px-4 pt-4 pb-4 bg-white border-t shadow-md">
        <div className="flex items-center gap-4">
          <p className="text-gray-700 text-md">
            Total Items: <span className="font-bold">{totalItems}</span>
          </p>
          <p className="text-gray-700 text-md">
            Total Price:{" "}
            <span className="font-bold">₹ {totalPrice.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={handleProceedToCheckout}
          disabled={buttonLoading.checkout}
          className="flex items-center justify-center px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          {buttonLoading.checkout ? (
            <>
              <Icon icon="eos-icons:loading" className="mr-2" />
              Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </button>
      </div>
    </div>
  );
};

export default HOC(AddToCartPage);
