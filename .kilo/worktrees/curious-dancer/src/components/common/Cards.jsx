import { useNavigate } from "react-router-dom";
import styles from "./common_css/common.module.css";
import { Button, Icon, useState } from "../../utils/imports";
import { Swiper, SwiperSlide } from "swiper/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "swiper/css";
import { Accordion, Card, Form } from "react-bootstrap";
import SemiCircleProgress from "./SemiCircleProgress";
import images from "../../utils/images";
import { showNotification } from "../specific/NotificationItem";
import { endpoints } from "../../services/endPoints";
import { postRequest } from "../../services/apiService";
import {
  convertToHoursAndMinutes,
  removeTrailingColon,
} from "../../utils/dateFormatter";
import { addLoginHistory } from "../../services/auth";
import { convertToHoursAndMinutesFun } from "../../utils/constants";
import { ComingSoon, ComingSoonForDashboard } from "./ComingSoon";
import "./common_css/SharePopup.css";

export const CardComponentHomePage = ({
  name,
  image,
  description,
  exploreText,
  link,
  onClick,
}) => {
  const navigation = useNavigate();
  return (
    <div className={styles.homepageCard1}>
      <div className={styles.homepageCard1Image}>
        <span className={styles.homepageCard1Name}>{name}</span>
        <span className={styles.homepageCard1imag}>
          <img
            className={styles.homepageCard1imageMain}
            src={image}
            alt="alttext"
          />
        </span>
      </div>
      <div className={styles.homepageCard1Description}>
        <span className={styles.homepageCard1description1}>{description}</span>
        <span
          onClick={
            name === "Capsule course" || name === "Course" ? null : onClick
          }
          className={styles.homepageCard1explore}
        >
          <span>{exploreText} </span>
          <span>
            <Icon
              icon="solar:arrow-right-linear"
              style={{ color: "#2A2BFA", marginLeft: "0.5rem" }}
            />
          </span>
          <p>
            {(name === "Capsule course" || name === "Course") && <ComingSoon />}
          </p>
        </span>
      </div>
    </div>
  );
};

export const CardComponentHomePage1 = ({ name, id, yOffsetP, onClick }) => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = yOffsetP || 0;
      const yPosition =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: yPosition, behavior: "smooth" });
      setIsActive(true);
    }
  };

  return (
    <div
      className={`${styles.homepageCard21} ${isActive ? styles.active : ""}`}
      onClick={
        name !== "Capsule Course" && name !== "Courses" ? onClick : undefined
      }
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleCardClick();
          setIsActive(true);
        }
      }}
      onBlur={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
    >
      <span className={styles.homepageCard21Name}>{name}</span>

      {(name === "Courses" || name === "Capsule Course") && <ComingSoon />}
    </div>
  );
};

export const CardComponentHomePage2AI = ({ name, iconImage }) => {
  const navigation = useNavigate();
  return (
    <p className={styles.homepageCard2AI}>
      <p className={styles.homepageCard2AIIcon}>
        <img
          className={styles.homepageCard2AIIconImage}
          src={iconImage}
          alt={name}
        />
      </p>
      <p className={styles.homepageCard2AIName}>{name}</p>
    </p>
  );
};

export const CardComponentHomePage2Course = ({
  name,
  image,
  description,
  courseText,
  onClick,
}) => {
  const navigation = useNavigate();

  return (
    <p className={styles.homepageCard3Course}>
      <p className={styles.homepageCard3CourseIcon}>
        <img src={image} alt={name} />
      </p>
      <p className={styles.homepageCard3CourseName}>{name}</p>
      <p className={styles.homepageCard3CourseDiscription}>{description}</p>
      <p
        //  onClick={onClick}
        className={styles.homepageCard3CourseDiscription2}
      >
        <span>{courseText}</span>
        <span>
          <Icon
            icon="solar:arrow-right-linear"
            style={{
              color: "#2A2BFA",
              marginLeft: "0.5rem",
              width: "30px",
              height: "20px",
            }}
          />
        </span>
      </p>
      <p>
        {" "}
        <ComingSoon />
      </p>
    </p>
  );
};

export const CardComponentHomePage2Community = ({
  name,
  image,
  description,
}) => {
  const navigation = useNavigate();
  return (
    <p className={styles.homepageCard4Community}>
      <p className={styles.homepageCard4CommunityIcon}>
        <img
          className={styles.homepageCard4CommunityIconImage}
          src={image}
          alt={name}
        />
      </p>
      <p className={styles.homepageCard4CommunityName}>{name}</p>
      <p className={styles.homepageCard4CommunityDiscription}>{description}</p>
    </p>
  );
};

export const CardComponentHomePage2Capsule = ({ name, image }) => {
  const navigation = useNavigate();
  return (
    <p className={styles.homepageCard5Capsule}>
      {/* <span className={styles.homepageCard5CapsuleIcon}>
        <img src={image} alt={name} />
      </span> */}

      <span> 💊 {name}</span>
    </p>
  );
};

export const SwiperComponentGoals = ({
  slides = [],
  spaceBetween = 1,
  slidesPerView = 8,
  onSlideChange = () => {},
  onSwiper = () => {},
  slectedSlide = 0,
  setSelectedSlide = () => {},
}) => {
  return (
    <Swiper
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      onSlideChange={onSlideChange}
      onSwiper={onSwiper}
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },

        480: {
          slidesPerView: 1,
          spaceBetween: 10,
        },

        768: {
          slidesPerView: 4,
          spaceBetween: 15,
        },

        1024: {
          slidesPerView: 5,
          spaceBetween: 10,
        },

        1600: {
          slidesPerView: 7,
          spaceBetween: 5,
        },

        2000: {
          slidesPerView: slidesPerView,
          spaceBetween: spaceBetween,
        },
      }}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className={styles.swiperSlideGoalPage}>
          <span
            onClick={() => setSelectedSlide(slide?._id)}
            className={`${
              slectedSlide === slide?._id
                ? styles.selectedSlideGoalPage
                : styles.unselectedSlideGoalPage
            }`}
          >
            {slide?.name}
          </span>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export const DashboardUserHomeCourseCard = ({ name, image, link }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        onClick={() => name !== "Explore Courses" && navigate(link)}
        className={styles.dashboardUserHomeCourseCard}
      >
        <span>
          <Icon icon={image} style={{ width: "30px", height: "30px" }} />
        </span>
        <span>
          <span className="d-flex align-items-center">
            <span>{name}</span>
            {name === "Explore Courses" && (
              <span className="largeScreenCommingSoon">
                {" "}
                <ComingSoon />
              </span>
            )}
            {name === "Explore Courses" && (
              <span className="smallScreenCommingSoon">
                <ComingSoonForDashboard
                  containerCss={{ marginLeft: "0rem" }}
                  textCss={{ marginLeft: "4rem" }}
                />
              </span>
            )}
          </span>
        </span>
      </div>
    </>
  );
};

export const DashboardUserHomeCoursesCard = ({ name, image, time, item }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate(
          `/user/course/${item?.course?.courseCategoryId}/${item?.course?._id}`
        )
      }
      className={styles.dashboardUserHomeCoursesCard}
    >
      <span className={styles.dashboardUserHomeCoursesCardImage}>
        <img src={image} alt="cardImage" />
      </span>
      <span className={styles.dashboardUserHomeCoursesCardName}>{name}</span>
      <span className={styles.dashboardUserHomeCoursesCardTime}>
        <span>
          <Icon
            icon="iconamoon:clock-thin"
            style={{
              color: "A3A3A3",
              width: "20px",
              height: "20px",
              cursor: "pointer",
            }}
          />
        </span>
        <span>{time}</span>
      </span>
    </div>
  );
};

export const DashboardUserHomeRewardCard = ({
  image,
  text,
  description,
  couponCode,
  discount,
}) => {
  return (
    <p className={styles.dashboardUserHomeRewardCard}>
      <span className={styles.dashboardUserHomeRewardCardImage}>
        <img src={image} alt="cardImage" />
      </span>
      <span className={styles.dashboardUserHomeRewardCardText}>
        <span className={styles.dashboardUserHomeRewardCardText1_1}>
          <span className={styles.dashboardUserHomeRewardCardText1}>
            {text}
          </span>
          <span className={styles.dashboardUserHomeRewardCardText2}>
            Code:{" "}
            <span
              onClick={() => {
                navigator.clipboard.writeText(couponCode);
                showNotification({
                  type: "success",
                  message: `Copied ${couponCode} to clipboard`,
                });
              }}
              className={styles.copyCode}
              title="Click to copy the code"
            >
              {couponCode}
            </span>
            {""} , Discount: {discount}%
          </span>
        </span>
        <span>
          {/* <Icon
            icon="iconamoon:arrow-right-2"
            style={{ color: "#000", fontSize: "2.2rem" }}
          /> */}
        </span>
      </span>
    </p>
  );
};

export const DashboardUserHomeTopContentCard = ({ image, title, onClick }) => {
  return (
    <div className={styles.dashboardUserHomeTopContentCard}>
      <span className={styles.dashboardUserHomeTopContentCardImage}>
        <img src={image} alt="image" />
      </span>
      <span className={styles.dashboardUserHomeTopContentCardText}>
        <span className={styles.dashboardUserHomeTopContentCardText1}>
          {title}
        </span>
        <span className={styles.dashboardUserHomeTopContentCardText2}>
          <Icon
            onClick={onClick}
            icon="iconamoon:arrow-right-2"
            style={{ color: "#000", fontSize: "2.2rem", cursor: "pointer" }}
          />
        </span>
      </span>
    </div>
  );
};

export const DashboardUserCourseCard = ({ name, image, description, link }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.dashboardUserCourseCard}>
      <span className={styles.dashboardUserCourseCardImage}>
        <img src={image} alt="image" />
      </span>
      <span className={styles.dashboardUserCourseCardName}> {name}</span>
      <span className={styles.dashboardUserCourseCardDescription}>
        {" "}
        {description}
      </span>
      <span className={styles.dashboardUserCourseCardButton}>
        <Button onClick={() => navigate(link)}>Start</Button>
      </span>
    </div>
  );
};
export const DashboardUserCoursesTypeCard = ({
  name,
  iconImage,
  rating,
  hours,
  leactures,

  onClick,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.dashboardUserCoursesTypeCard}>
      <span className={styles.dashboardUserCoursesTypeCardImage}>
        <img src={iconImage} alt="image" />
      </span>
      <span className={styles.dashboardUserCoursesTypeCardName}>
        <span className={styles.dashboardUserCoursesTypeCardName1}>
          {name}{" "}
        </span>
        <span className={styles.dashboardUserCoursesTypeCardName2}>
          <span>
            {Array.from({ length: Math.floor(rating) }, (_, i) => (
              <Icon
                style={{ color: "red" }}
                icon="material-symbols:star-rounded"
                className="testWithVideoCardIcon"
              />
            ))}
          </span>
          <span>{rating} Star</span>
        </span>
        <span className={styles.dashboardUserCoursesTypeCardName3}>
          Total {hours} | {leactures}
        </span>
      </span>
      <span
        style={{ width: "20%", display: "flex", justifyContent: "flex-end" }}
      >
        <span
          onClick={onClick}
          className={styles.dashboardUserCoursesTypeCardButton}
        >
          <Icon
            icon="iconamoon:arrow-right-2"
            style={{ color: "#000", fontSize: "2.2rem" }}
          />
        </span>
      </span>
    </div>
  );
};

export const TestWithVideoCard = ({
  image,
  name,
  description,
  descriptionArray,
  pointsArray,
  users,
  item,
  path,
}) => {
  const navigate = useNavigate();
  return (
    <div
      style={{ minWidth: "300px", minHeight: "300px" }}
      className={styles.testWithVideoCard}
    >
      <p className={styles.testWithVideoCardImage}>
        <span
          style={{ height: "95px" }}
          className={styles.testWithVideoCardImageIcon}
        >
          {image && (
            <img
              className={styles.testWithVideoCardImageIconImage}
              src={image}
              alt="image"
              style={{ width: "95px", height: "95px" }}
            />
          )}
        </span>
        <span className={styles.testWithVideoCardImageText}>
          <span className={styles.testWithVideoCardImageText1}>
            <span>
              <Icon icon="emojione:star" className="testWithVideoCardIcon" />
            </span>
            <span className={styles.testWithVideoCardImageText2}>
              {users} users
            </span>
          </span>
        </span>
      </p>
      <p className={styles.testWithVideoCardText}>
        <span className="d-flex justify-content-between">
          <span>{name}</span>
          <span>Price: {item?.bundleCost || 0} Rs</span>
        </span>
      </p>
      <hr />
      <p className={styles.testWithVideoCardDescription}>
        <span className="testWithVideoCardDescriptionText1">
          {item?.testCount} Total Tests
        </span>
        <span className="testWithVideoCardDescriptionText1">
          {item?.freeTestsCount} Free tests
        </span>
        {/* {descriptionArray.map((item, index) => (
          <span className="testWithVideoCardDescriptionText1" key={index}>
            {item}
          </span>
        ))} */}
      </p>
      <hr />
      <p className={styles.testWithVideoCardPoints}>
        <span> {item?.locale}</span>
      </p>
      <hr />
      <p className={styles.testWithVideoCardPointsList}>
        <ul>
          {item?.bundleDescription?.split("\n").map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </p>
      <p className={styles.testWithVideoCardButton}>
        <Button
          onClick={() => {
            // addLoginHistory({
            //   payload: {
            //     event: "Click",
            //     timeSpent: 0,
            //     testSeries: item?._id,
            //     tasttaken:1
            //   },
            // });
            {
              path ? navigate(path) : navigate(`/user/test/${item?._id}`);
            }
          }}
        >
          View Test Series
        </Button>
      </p>
    </div>
  );
};
export const TestWithVideoCard123 = ({
  image,
  name,
  description,
  descriptionArray,
  pointsArray,
  users,
  item,
  path,
}) => {
  const navigate = useNavigate();
  return (
    <div
      style={{ minWidth: "300px", minHeight: "300px" }}
      className={styles.testWithVideoCard}
    >
      <p className={styles.testWithVideoCardImage}>
        <span
          style={{ height: "95px" }}
          className={styles.testWithVideoCardImageIcon}
        >
          {image && (
            <img
              className={styles.testWithVideoCardImageIconImage}
              src={image}
              alt="image"
              style={{ width: "95px", height: "95px" }}
            />
          )}
        </span>
        <span className={styles.testWithVideoCardImageText}>
          <span className={styles.testWithVideoCardImageText1}>
            <span>
              <Icon icon="emojione:star" className="testWithVideoCardIcon" />
            </span>
            <span className={styles.testWithVideoCardImageText2}>
              {users} users
            </span>
          </span>
        </span>
      </p>
      <p className={styles.testWithVideoCardText}>
        <span className="d-flex justify-content-between">
          <span>{name}</span>
          <span>Price: {item?.price || 0} Rs</span>
        </span>
      </p>
      <hr />

      <p className={styles.testWithVideoCardPointsList}>
        <ul>
          {item?.bundleDescription?.split("\n").map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </p>
      <p className={styles.testWithVideoCardButton}>
        <Button
          onClick={() => {
            addLoginHistory({
              payload: {
                event: "Click",
                timeSpent: 120,
                testSeries: item?._id,
              },
            });
            {
              console.log(item, "ad");
            }
            // return;
            {
              path
                ? navigate(path)
                : navigate(
                    `/user/course/${item?.courseCategoryId?._id}/${item?._id}`
                  );
            }
          }}
        >
          View Course
        </Button>
      </p>
    </div>
  );
};
export const TestWithVideoCard1 = ({
  image,
  name,
  description,
  descriptionArray,
  pointsArray,
  users,
  onClick,
  id,
  isPurchased,
  courseId1,
  isMainTest = false,
  CourseType,
}) => {
  const navigate = useNavigate();
  return (
    <div onClick={onClick} className={styles.testWithVideoCard12}>
      <p className={styles.testWithVideoCardImage}>
        <span className={styles.testWithVideoCardImageIcon}>
          <img
            className={styles.testWithVideoCardImageIconImage}
            src={image}
            alt="image"
          />
        </span>
        <span className={styles.testWithVideoCardImageText}>
          <span className={styles.testWithVideoCardImageText1}>
            <span>
              <Icon icon="emojione:star" className="testWithVideoCardIcon" />
            </span>
            <span className={styles.testWithVideoCardImageText2}>
              {users} users
            </span>
          </span>
        </span>
      </p>
      <p className={styles.testWithVideoCardText1}>
        <span>{name || ""}</span>
      </p>

      <p className={styles.testWithVideoCardButton}>
        <Button
          onClick={() => {
            if (isPurchased) {
              navigate(`/user/course-test/${id}`, {
                state: { courseId1, isMainTest, CourseType },
              });
            } else {
              showNotification({
                type: "error",
                message: "Please buy the course first",
              });
            }
          }}
        >
          View Test Series
        </Button>
      </p>
    </div>
  );
};
export const TestWithVideoCard1s = ({
  image,
  name,
  description,
  descriptionArray,
  pointsArray,
  users,
  onClick,
  id,
  isPurchased,
}) => {
  const navigate = useNavigate();
  return (
    <div onClick={onClick} className={styles.testWithVideoCard12}>
      <p className={styles.testWithVideoCardImage}>
        <span className={styles.testWithVideoCardImageIcon}>
          <img
            className={styles.testWithVideoCardImageIconImage}
            src={image}
            alt="image"
          />
        </span>
        <span className={styles.testWithVideoCardImageText}>
          <span className={styles.testWithVideoCardImageText1}>
            <span>
              <Icon icon="emojione:star" className="testWithVideoCardIcon" />
            </span>
            <span className={styles.testWithVideoCardImageText2}>
              {users} users
            </span>
          </span>
        </span>
      </p>
      <p className={styles.testWithVideoCardText1}>
        <span>{name || ""}</span>
      </p>

      <p className={styles.testWithVideoCardButton}>
        <Button
          onClick={() => {
            if (isPurchased) {
              navigate(`/user/study-planner-ai/subject/${id}`);
            } else {
              showNotification({
                type: "error",
                message: "Please buy the course first",
              });
            }
          }}
        >
          View Test Series
        </Button>
      </p>
    </div>
  );
};

export const HandWrittenNotesUserCardComponent = ({
  name,
  image,
  title,
  pages,
  subtopics,
  rating,
  path,
  item,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent click event from bubbling if Explore button is clicked.
    if (e.target.tagName !== "BUTTON") {
      addLoginHistory({
        payload: {
          event: "Click",
          timeSpent: 120,
          handwrittenNotes: item?._id,
        },
      });
      navigate(path);
    }
  };

  const handleButtonClick = (e) => {
    // Stop propagation to avoid triggering the card click event.
    e.stopPropagation();
    addLoginHistory({
      payload: {
        event: "Click",
        timeSpent: 120,
        handwrittenNotes: item?._id,
      },
    });
    navigate(path);
  };

  return (
    <Card
      className="shadow-sm m-3 hover-card"
      style={{
        width: "20rem",
        cursor: "pointer",
        transition: "transform 0.2s",
        backgroundColor: "#B2DFF7",
      }}
      onClick={handleCardClick}
    >
      <Card.Img
        variant="top"
        src={image}
        alt={name || "Handwritten note image"}
        style={{
          height: "290px",
          objectFit: "cover",
          padding: "1rem",
          borderRadius: "10px",
        }}
      />
      <Card.Body>
        <Card.Title className="text-truncate">{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted text-truncate">
          {name}
        </Card.Subtitle>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <Icon
              icon="gravity-ui:book-open"
              style={{
                color: "#646464",
                fontSize: "1.2rem",
                marginRight: "5px",
              }}
            />
            <small>{pages} Pages</small>
          </div>
          <div className="d-flex align-items-center">
            <small>Price : {item?.price || 0} Rs</small>
          </div>
          {/* <div className="d-flex align-items-center">
            <Icon
              icon="octicon:stack-24"
              style={{
                color: "#646464",
                fontSize: "1.2rem",
                marginRight: "5px",
              }}
            />
            <small>{subtopics} Sub Topics</small>
          </div> */}
        </div>
        <div className="d-flex align-items-center mb-3">
          {Array.from({ length: Math.floor(rating) }, (_, i) => (
            <Icon
              key={i}
              icon="noto:star"
              style={{ color: "#ffc107", marginRight: "2px" }}
            />
          ))}
          {/* <small className="ml-2">
            {rating} star{rating > 1 ? "s" : ""}
          </small> */}
        </div>
        <Button variant="primary" block onClick={handleButtonClick}>
          Explore
        </Button>
      </Card.Body>
      <style jsx>{`
        .hover-card:hover {
          transform: scale(1.02);
        }
      `}</style>
    </Card>
  );
};
export const CapsuleUserCardComponent = ({
  name,
  image,
  title,
  pages,
  subtopics,
  rating,
  key,
  item,
  path,
}) => {
  const navigate = useNavigate();
  return (
    <div key={key} className={styles.handWrittenNotesUserCard}>
      <span className={styles.handWrittenNotesUserCardImage}>
        <img src={image} alt={name || "Image"} />
      </span>

      <span className={styles.handWrittenNotesTitle}>{title}</span>
      <span className={styles.handWrittenNotesName}>{name}</span>
      <span className={styles.handWrittenNotesRatingStar}>
        {Array.from({ length: Math.floor(rating) }, (_, i) => (
          <Icon
            key={i}
            icon="noto:star"
            className={styles.handWrittenNotesRatingStarIcon}
          />
        ))}
        {` ${rating} star${rating > 1 ? "s" : ""}`}
      </span>

      <span className={styles.handWrittenNotesRating}>
        <span className={styles.handWrittenNotesPages1}>
          <span> {pages} </span>
        </span>
        <span className={styles.handWrittenNotesRatingButton}>
          <Button onClick={() => navigate(path)}>View</Button>
        </span>
      </span>
    </div>
  );
};
export const CapsuleUserCardComponentexam = ({
  name,
  image,
  title,
  pages,
  subtopics,
  rating,
  key,
  item,
  path,
}) => {
  const navigate = useNavigate();
  return (
    <div
      style={{ minWidth: "300px", minHeight: "300px" }}
      key={key}
      className={styles.handWrittenNotesUserCard}
    >
      <span className={styles.handWrittenNotesUserCardImage}>
        <img src={image} alt={name || "Image"} />
      </span>

      <span className={styles.handWrittenNotesTitle}>{title}</span>
      <span className={styles.handWrittenNotesName}>{name}</span>
      <span className={styles.handWrittenNotesRatingStar}>
        {Array.from({ length: Math.floor(rating) }, (_, i) => (
          <Icon
            key={i}
            icon="noto:star"
            className={styles.handWrittenNotesRatingStarIcon}
          />
        ))}
        {` ${rating} star${rating > 1 ? "s" : ""}`}
      </span>

      <span className={styles.handWrittenNotesRating}>
        <span className={styles.handWrittenNotesPages1}>
          <span> {pages} </span>
        </span>
        {/* <span className={styles.handWrittenNotesRatingButton}>
          <Button onClick={() => navigate(path)}>View</Button>
        </span> */}
      </span>
    </div>
  );
};
export const CapsuleUserCardComponentPurchase = ({
  name,
  image,
  title,
  pages,
  subtopics,
  rating,
  key,
  item,
  path,
}) => {
  const navigate = useNavigate();
  return (
    <div key={key} className={styles.handWrittenNotesUserCard}>
      <span className={styles.handWrittenNotesUserCardImage}>
        <img src={image} alt={name || "Image"} />
      </span>

      <span className={styles.handWrittenNotesTitle}>{title}</span>
      <span className={styles.handWrittenNotesName}>{name}</span>
      <span className={styles.handWrittenNotesRatingStar}>
        {item?.purchaseDate?.slice(0, 10)?.split("-").reverse().join("-")}
      </span>

      <span className={styles.handWrittenNotesRating}>
        <span className={styles.handWrittenNotesPages1}>
          <span> </span>
        </span>
        <span className={styles.handWrittenNotesRatingButton}>
          <Button onClick={() => navigate(path)}>View</Button>
        </span>
      </span>
    </div>
  );
};
export const CapsuleUserCardComponentWishlist = ({
  name,
  image,
  title,
  pages,
  subtopics,
  rating,
  key,
  item,
  path,
  price,
  addToCart,
}) => {
  const navigate = useNavigate();
  return (
    <div key={key} className={styles.handWrittenNotesUserCard}>
      <span className={styles.handWrittenNotesUserCardImage}>
        <img
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={image}
          alt={name || "Image"}
        />
      </span>

      <span className={styles.handWrittenNotesTitle}>{title}</span>
      <span className={styles.handWrittenNotesName}>{name}</span>
      <span className={styles.handWrittenNotesName}>
        Price:
        <span style={{ color: "gray" }}> {price}</span>
      </span>

      <span className={styles.handWrittenNotesRating}>
        <span className={styles.handWrittenNotesPages1}>
          <span> {pages} </span>
        </span>
        <span className={styles.handWrittenNotesRatingButton}>
          {/* <Button onClick={() => navigate(path)}>View</Button> */}
          <Button onClick={() => addToCart()}>Add to Cart</Button>
        </span>
      </span>
    </div>
  );
};
export const CapsuleUserCardComponentTranscript = ({
  name,
  image,
  title,
  pages,
  subtopics,
  rating,
  key,
  item,
  path,
  price,
}) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        border: "1px solid #a3a3a3",
        cursor: "pointer",
        borderRadius: "10px",
      }}
      key={key}
      className={styles.handWrittenNotesUserCard}
    >
      <span className={styles.handWrittenNotesUserCardImage}>
        <img src={image} alt={name || "Image"} />
      </span>

      <span className={styles.handWrittenNotesTitle}>{title}</span>
      <span className={styles.handWrittenNotesName}>{name}</span>
      <span className={styles.handWrittenNotesRatingStar}>
        {/* {Array.from({ length: Math.floor(rating) }, (_, i) => (
          <Icon
            key={i}
            icon="noto:star"
            className={styles.handWrittenNotesRatingStarIcon}
          />
        ))} */}
        {/* {` ${rating} star${rating > 1 ? "s" : ""}`} */}
      </span>

      <span className={styles.handWrittenNotesRating}>
        <span
          style={{ color: "#000", fontWeight: "bold", fontSize: "16px" }}
          className={styles.handWrittenNotesPages1}
        >
          <span>₹ {price || 0} </span>
        </span>
        <span
          style={{ color: "#000", fontWeight: "bold", fontSize: "16px" }}
          className={styles.handWrittenNotesRatingButton}
        >
          <Button onClick={() => navigate(path)}>View</Button>
        </span>
      </span>
    </div>
  );
};

export const SkillsUserCardComponent = ({
  key,
  name,
  image,
  title,
  pages,
  subtopics,
  rating,
  id,
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/user/skills/${id}`)}
      key={key}
      className={styles.handWrittenNotesUserCard}
    >
      <span className={styles.handWrittenNotesUserCardImage}>
        <img src={image} alt={name || "Handwritten note image"} />
      </span>

      <span className={styles.handWrittenNotesTitle}>{title}</span>

      <span className={styles.handWrittenNotesRatingStar}>
        {Array.from({ length: Math.floor(rating) }, (_, i) => (
          <Icon
            key={i}
            icon="noto:star"
            className={styles.handWrittenNotesRatingStarIcon}
          />
        ))}
        {`${rating > 1 ? "s" : ""}`}
      </span>

      <span className={styles.handWrittenNotesRating}>
        <span className={styles.handWrittenNotesPages1}>
          <span> {pages} Hrs</span>
        </span>
      </span>
    </div>
  );
};
export const SkillsUserCardComponentCart = ({
  key,
  name,
  image,
  title,
  pages,
  subtopics,
  rating,
  id,
  price,
}) => {
  const navigate = useNavigate();
  return (
    <div
      style={{ border: "1px solid #a3a3a3" }}
      // onClick={() => navigate(`/user/skills/${id}`)}
      key={key}
      className={styles.handWrittenNotesUserCard}
    >
      <span className={styles.handWrittenNotesUserCardImage}>
        <img src={image} alt={name || "image"} />
      </span>

      <span className={styles.handWrittenNotesTitle}>{title}</span>

      <span className={styles.handWrittenNotesRatingStar}>
        {Array.from({ length: Math.floor(rating) }, (_, i) => (
          <Icon
            key={i}
            icon="noto:star"
            className={styles.handWrittenNotesRatingStarIcon}
          />
        ))}
        {` ${rating} star${rating > 1 ? "s" : ""}`}
      </span>

      <span className={styles.handWrittenNotesRating}>
        <span
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          <span> {pages} </span>
          <span>Price : ₹ {price || 0}</span>
        </span>
      </span>
    </div>
  );
};

export const PYQsNotesUserCardComponent = ({
  mainTitle,
  isFree,
  title,
  noOFQuestions,
  marks,
  time,
  subject,
  locale,
  id,
  item,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.pyqsNotesUserCard}>
      <p className={styles.pyqsNotesUserCardMainTitle}>{mainTitle}</p>
      <p className={styles.pyqsNotesUserCardContainer1}>
        <span className={styles.pyqsNotesUserCardContainer1_1}>
          <span className={styles.pyqsNotesUserCardContainer1Span1}>
            {isFree ? "Free" : "Free"}
          </span>
          <span className={styles.pyqsNotesUserCardContainer1Span2}>
            {title}
          </span>
          {/* <span className={styles.pyqsNotesUserCardContainer1Span3}>
            <span className={styles.pyqsNotesUserCardContainer1Span3Span1}>
              {noOFQuestions} Questions
            </span>
            <span>{marks} Marks</span>
            <span>{time}</span>
          </span> */}
          {/* <span className={styles.pyqsNotesUserCardContainer1Span3Span123}>
            {locale}
          </span> */}
        </span>
        <span className={styles.pyqsNotesUserCardContainer2}>
          <Button
            onClick={() => {
              addLoginHistory({
                payload: {
                  event: "Click",
                  timeSpent: 120,
                  previousYearQuestion: item?._id,
                },
              });
              navigate(`/user/pyq-with-videos/${id}`);
            }}
          >
            Start
          </Button>
        </span>
      </p>
    </div>
  );
};

export const CommunityNotesUserCard = ({
  name,
  iconImage,
  time,
  description,
  like,
  comment,
  views,
  save,
  handleLike,
  id,
  comments,
  handlePin,
  handleCommentData,
  isLike,
  item,
}) => {
  const [isComment, setIsComment] = useState(false);
  const [commentData, setCommentData] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleComment = () => setIsComment(!isComment);

  const submitComment = async (id) => {
    if (commentData && id) {
      handleCommentData(id, commentData);
    }
    setIsComment(false);
    setCommentData("");
  };

  const visibleComments = showAllComments ? comments : comments.slice(0, 2);
  const shareLink = "https://digital-bencher-api.vercel.app/";

  const togglePopup = () => setPopupVisible(!isPopupVisible);

  const shareOnPlatform = (platformUrl) => {
    window.open(platformUrl, "_blank");
  };

  return (
    <div className={styles.communityNotesUserCard}>
      <div className={styles.communityNotesUserCardImage}>
        <span className={styles.communityNotesUserCardImageSpan}>
          <span className={styles.communityNotesUserCardImageSpan1}></span>
          <span className={styles.communityNotesUserCardImageSpan2}>
            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              {name}
            </span>
            <span style={{ fontSize: "1rem" }}>{time}</span>
          </span>
        </span>
        <span className={styles.communityNotesUserCardImageSpan3}>
          <span className="p-2 mt-2 mb-1 d-flex justify-content-center align-items-center">
            <img
              src={iconImage}
              style={{
                width: "400px",
                height: "400px",
                borderRadius: "10px",
                objectFit: "fill",
              }}
              alt="post"
            />
          </span>
          <p style={{ padding: "1.2rem", fontSize: "1.2rem" }}>{description}</p>
        </span>
        {isComment && (
          <div className={styles.communityNotesUserCardImageSpan5}>
            <Form.Control
              as="textarea"
              rows={1}
              placeholder="Add a comment"
              value={commentData}
              onChange={(e) => setCommentData(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => submitComment(id)}
            >
              Submit
            </Button>
          </div>
        )}
        {/* Comments Section */}
        <div className={styles.communityNotesUserCardFooter}>
          <span className={styles.communityNotesUserCardFooterSpan}>
            <span>
              <Icon
                onClick={() => handleLike(id)}
                className={styles.footerIcon}
                style={{ color: isLike ? "red" : "black", cursor: "pointer" }}
                icon={
                  isLike ? "ant-design:like-filled" : "ant-design:like-outlined"
                }
              />{" "}
              {item?.likes?.length}
            </span>
            <span>
              <Icon
                onClick={() => handleComment(id)}
                className={styles.footerIcon}
                style={{ cursor: "pointer" }}
                icon="ant-design:message-outlined"
              />{" "}
              {item?.comments?.length}
            </span>

            <div className="share-button-container">
              <span
                style={{ fontSize: "1rem", padding: "0px" }}
                className="share-button"
                onClick={togglePopup}
              >
                <Icon icon="ic:twotone-share" />
              </span>
              {isPopupVisible && (
                <div className="share-popup-container">
                  <a
                    href="#"
                    className="share-button whatsapp"
                    onClick={() =>
                      shareOnPlatform(
                        `https://wa.me/?text=${encodeURIComponent(shareLink)}`
                      )
                    }
                  >
                    <Icon icon="ri:whatsapp-line" />
                  </a>
                  <a
                    href="#"
                    className="share-button telegram"
                    onClick={() =>
                      shareOnPlatform(
                        `https://t.me/share/url?url=${encodeURIComponent(
                          shareLink
                        )}`
                      )
                    }
                  >
                    <Icon icon="ri:telegram-line" />
                  </a>
                  <a
                    href="#"
                    className="share-button facebook"
                    onClick={() =>
                      shareOnPlatform(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          shareLink
                        )}`
                      )
                    }
                  >
                    <Icon icon="ri:facebook-circle-line" />
                  </a>
                  <a
                    className="share-button instagram"
                    onClick={() =>
                      shareOnPlatform(
                        `https://www.instagram.com/?url=${encodeURIComponent(
                          shareLink
                        )}
                      `
                      )
                    }
                  >
                    <Icon icon="ri:instagram-line" />
                  </a>
                  <a
                    className="share-button instagram"
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      showNotification({
                        title: "Copied to clipboard",
                        message: "Link copied to clipboard",
                        icon: <Icon icon="ri:check-line" />,
                      });
                    }}
                  >
                    <Icon icon="uiw:copy" style={{ color: "black" }} />
                  </a>
                </div>
              )}
            </div>
          </span>

          <span className={styles.communityNotesUserCardFooterSpan1}>
            <span>
              <Icon
                className={styles.footerIcon}
                icon="ant-design:eye-outlined"
              />{" "}
              {views}
            </span>
            <span>
              <Icon
                onClick={() => handlePin(id)}
                className={styles.footerIcon}
                icon="bxs:pin"
              />{" "}
              {save}
            </span>
          </span>
        </div>
        <span className={styles.communityNotesUserCardImageSpan4Container}>
          <span>Comments: </span>
          {visibleComments.map((item) => (
            <div
              key={item.id}
              className={styles.communityNotesUserCardImageSpan4}
            >
              <span className={styles.communityNotesUserCardImageSpan4Span1}>
                <span>{item?.user?.fullName}:</span>
                <span>{item.comment}</span>
              </span>
            </div>
          ))}
          {comments.length > 2 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className={styles.showMoreButton}
            >
              {showAllComments ? "Read Less" : "Read more"}
            </button>
          )}
        </span>

        {/* Comment Input Box */}
      </div>

      {/* Footer Section */}
    </div>
  );
};

export const StudyPlannerUserCardComponent = ({
  key,
  image,
  name,
  onClick,
}) => {
  return (
    <div key={key} className={styles.studyPlannerUserCard} onClick={onClick}>
      <span className={styles.studyPlannerUserCardImage}>
        <img
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          src={image}
          alt={""}
        />
      </span>
      <span className={styles.studyPlannerUserCardName}>{name}</span>
    </div>
  );
};

export const StudyPlannerPage2UserCardComponent = ({
  name,
  image,
  id,
  setSelectedId,
  selectedId,
}) => {
  return (
    <div
      className={`${styles.studyPlannerPage2UserCard} ${
        id === selectedId ? styles.active : styles.inactive
      }`}
      onClick={() => setSelectedId(id)}
    >
      <span className={styles.studyPlannerPage2UserCardImage}>
        <img style={{ width: "100%", height: "100%" }} src={image} alt={name} />
      </span>
      <span className={styles.studyPlannerPage2UserCardName}>{name}</span>
    </div>
  );
};

export const StudyPlannerUserCardComponentPage5 = ({
  todo,
  link,
  key,
  week,
  isLocked,
  studyPlannerId,
  weekResources,
  userId,
  subjectTime,
}) => {
  const navigate = useNavigate();

  const addToCart = () => {
    postRequest({
      endpoint: endpoints.addToCart,

      data: {
        studyPlanners: [studyPlannerId],
        userStudyPlanner: [userId],
        quantity: 1,
      },
    }).then((res) => {});
  };
  return (
    <div className={styles.studyPlannerUserCardPage5} key={key}>
      <div className={styles.cardContent}>
        <p
          className={`${styles.studyPlannerUserCardPage5P1} ${
            isLocked && styles.Active
          }`}
        >
          Week {week}
        </p>
        <p className={styles.studyPlannerUserCardPage5P2}>To do</p>
        <p className={styles.studyPlannerUserCardPage5P3}>
          <span className={styles.studyPlannerUserCardPage5P4}>
            <span>
              <Icon
                className="studyPlannerUserCardPage5P4Icon"
                icon={
                  todo?.resources?.video
                    ? "lucide:youtube"
                    : "lucide:book-check"
                }
              />
            </span>
            <span>
              Videos -{" "}
              {convertToHoursAndMinutes(weekResources?.videos) || `0 hours`}{" "}
            </span>
          </span>
          <span className={styles.studyPlannerUserCardPage5P4}>
            <span>
              <Icon
                className="studyPlannerUserCardPage5P4Icon"
                icon={
                  todo?.resources?.video
                    ? "lucide:youtube"
                    : "lucide:book-check"
                }
              />
            </span>
            <span>
              Test -{" "}
              {convertToHoursAndMinutes(weekResources?.tests || `0 hours`)}{" "}
            </span>
          </span>
          <span className={styles.studyPlannerUserCardPage5P4}>
            <span>
              <Icon
                className="studyPlannerUserCardPage5P4Icon"
                icon={
                  todo?.resources?.video
                    ? "lucide:youtube"
                    : "lucide:book-check"
                }
              />
            </span>
            <span>
              Practice Questions -{" "}
              {convertToHoursAndMinutes(
                weekResources?.practiceQuestions || `0 hours`
              )}
            </span>
          </span>
          <span className={styles.studyPlannerUserCardPage5P4}>
            <span>
              <Icon
                className="studyPlannerUserCardPage5P4Icon"
                icon={
                  todo?.resources?.video
                    ? "lucide:youtube"
                    : "lucide:book-check"
                }
              />
            </span>
            <span>
              Notes -{" "}
              {convertToHoursAndMinutes(
                weekResources?.handwrittenNotes || `0 hours`
              )}
            </span>
          </span>
        </p>
      </div>

      <p className={styles.studyPlannerUserCardPage5P5}>
        <Button
          className={`${styles.studyPlannerUserCardPage5Button} ${
            isLocked ? styles.Active : ""
          }`}
          onClick={() => {
            isLocked
              ? addToCart()
              : navigate(`/user/study-planner-ai/subject/${studyPlannerId}`, {
                  state: {
                    todo,
                    week,
                    itemName: "StudyPlanner",
                    itemId: studyPlannerId,
                    isPurchased: true,
                    subjectTime,
                  },
                });
          }}
        >
          {isLocked ? (
            <span className={styles.studyPlannerUserCardPage5Button1}>
              <span>
                <Icon
                  className="studyPlannerUserCardPage5ButtonIcon"
                  icon="ic:twotone-lock"
                />
              </span>
              <span>Unlock</span>
            </span>
          ) : (
            "Start Learning"
          )}
        </Button>
      </p>
    </div>
  );
};

export const DashboardUserCoursesTypeCardCoursePage3 = ({
  name,
  image,
  subTopics,
  path,
  onClick,
  subjectTime,
  id,
}) => {
  const navigate = useNavigate();
  const subjectTimeData = subjectTime?.find(
    (subject) => subject?.subjectId === id
  );

  return (
    <div className={styles.dashboardUserCoursesTypeCardCoursePage3}>
      <span className={styles.dashboardUserCoursesTypeCardCoursePage3Span1}>
        <span
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span1Span1}
        >
          <img
            className={
              styles.dashboardUserCoursesTypeCardCoursePage3Span1Span1Img
            }
            src={image}
            alt="imageCourse"
          />
        </span>
        <span
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span1Span2}
        >
          <span>{name}</span>

          <span
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: "12px",
            }}
          >
            <span></span>
          </span>
        </span>
      </span>
      <span>
        <Icon
          onClick={onClick}
          icon="iconamoon:arrow-right-2"
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span2}
        />{" "}
      </span>
    </div>
  );
};
export const DashboardUserCoursesTypeCardCoursePage3Capsule = ({
  name,
  image,
  subTopics,
  path,
  onClick,
  subjectTime,
  id,
}) => {
  const navigate = useNavigate();
  const subjectTimeData = subjectTime?.find(
    (subject) => subject?.subjectId === id
  );

  return (
    <div className={styles.dashboardUserCoursesTypeCardCoursePage3}>
      <span className={styles.dashboardUserCoursesTypeCardCoursePage3Span1}>
        <span
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span1Span1}
        >
          <img
            className={
              styles.dashboardUserCoursesTypeCardCoursePage3Span1Span1Img
            }
            src={image}
            alt="imageCourse"
          />
        </span>
        <span
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span1Span2}
        >
          <span>{name}</span>

          <span
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: "12px",
            }}
          >
            <span></span>
          </span>
        </span>
      </span>
      <span>
        <Icon
          onClick={onClick}
          icon="iconamoon:arrow-right-2"
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span2}
        />{" "}
      </span>
    </div>
  );
};
export const DashboardUserCoursesTypeCardCoursePage32 = ({
  name,
  image,
  subTopics,
  path,
  onClick,
  subjectTime,
  id,
}) => {
  const navigate = useNavigate();
  const subjectTimeData = subjectTime?.find(
    (subject) => subject?.subjectId === id
  );

  return (
    <div className={styles.dashboardUserCoursesTypeCardCoursePage3}>
      <span className={styles.dashboardUserCoursesTypeCardCoursePage3Span1}>
        <span
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span1Span1}
        >
          <img
            className={
              styles.dashboardUserCoursesTypeCardCoursePage3Span1Span1Img
            }
            src={image}
            alt="imageCourse"
          />
        </span>
        <span
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span1Span2}
        >
          <span>{name}</span>

          <span
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: "12px",
            }}
          >
            <span></span>
          </span>
        </span>
      </span>
      <span>
        <Icon
          onClick={onClick}
          icon="iconamoon:arrow-right-2"
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span2}
        />{" "}
      </span>
    </div>
  );
};
export const DashboardUserCoursesTypeCardCoursePage31 = ({
  name,
  image,
  subTopics,
  path,
  onClick,
  subjectTime,
  id,
}) => {
  const navigate = useNavigate();
  const subjectTimeData = subjectTime?.find(
    (subject) => subject?.subjectId === id
  );

  return (
    <div className={styles.dashboardUserCoursesTypeCardCoursePage3}>
      <span className={styles.dashboardUserCoursesTypeCardCoursePage3Span1}>
        <span
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span1Span1}
        >
          <img
            className={
              styles.dashboardUserCoursesTypeCardCoursePage3Span1Span1Img
            }
            src={image}
            alt="imageCourse"
          />
        </span>
        <span
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span1Span2}
        >
          <span>{name}</span>

          <span
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: "12px",
              color: "#000057",
            }}
          >
            <span
              style={{
                fontWeight: "400",
                fontSize: "14px",
                marginBottom: "5px",
              }}
            >
              {" "}
              Practice Questions:{" "}
              {convertToHoursAndMinutesFun(
                subjectTimeData?.practiceQuestions?.toFixed(2)
              )}
            </span>
            <span
              style={{
                fontWeight: "normal",
                fontSize: "14px",
                marginBottom: "5px",
              }}
            >
              {" "}
              Tests:{" "}
              {convertToHoursAndMinutesFun(subjectTimeData?.tests?.toFixed(2))}
            </span>
            <span
              style={{
                fontWeight: "normal",
                fontSize: "14px",
                marginBottom: "5px",
              }}
            >
              {" "}
              Videos:{" "}
              {convertToHoursAndMinutesFun(subjectTimeData?.videos?.toFixed(2))}
            </span>
            <span
              style={{
                fontWeight: "normal",
                fontSize: "14px",
                marginBottom: "5px",
              }}
            >
              {" "}
              Notes:{" "}
              {convertToHoursAndMinutesFun(
                subjectTimeData?.handwrittenNotes?.toFixed(2)
              )}
            </span>
          </span>
        </span>
      </span>
      <span>
        <Icon
          onClick={onClick}
          icon="iconamoon:arrow-right-2"
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span2}
        />{" "}
      </span>
    </div>
  );
};
export const DashboardUserCoursesTypeCardCoursePage61 = ({
  name,
  image,
  subTopics,
  path,
  onClick,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.dashboardUserCoursesTypeCardCoursePage3}>
      <span className={styles.dashboardUserCoursesTypeCardCoursePage3Span1}>
        <span
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span1Span1}
        >
          <img
            className={
              styles.dashboardUserCoursesTypeCardCoursePage3Span1Span1Img
            }
            src={image}
            alt="imageCourse"
          />
        </span>
        <span
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span1Span2}
        >
          <span>{name}</span>
          <span>{subTopics} Sub Topics</span>
        </span>
      </span>
      <span>
        <Icon
          onClick={onClick}
          icon="iconamoon:arrow-right-2"
          className={styles.dashboardUserCoursesTypeCardCoursePage3Span2}
        />{" "}
      </span>
    </div>
  );
};

export const CapsuleUserCardComponentCourseP4 = ({
  index,
  name,
  Videos = [],
  Docs = [],
  Tests = [],
  path,
  params,
  chapterId,
  PracticeTests,
  topicName,
}) => {
  const [selectedComponent, setSelectedComponent] = useState("Videos");

  const navigate = useNavigate();
  return (
    <div className={styles.capsuleUserCardComponentCourseP4}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{name || topicName || ""} </Accordion.Header>
          <Accordion.Body>
            <div className={styles.capsuleUserCardComponentCourseP4Body}>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Videos" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Videos")}
              >
                {Videos?.topicVideo?.length} Videos
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Docs" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Docs")}
              >
                {Docs.length} Docs
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests")}
              >
                {Tests.length} Tests
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests1" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests1")}
              >
                {Tests.length} Practice
              </span>
            </div>

            {selectedComponent === "Videos" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Videos?.map((item, index) => (
                  <div
                    onClick={() => {
                      navigate(
                        `/user/course/${params.CourseType}/${params.course}/${
                          params?.subject
                        }/${chapterId && chapterId}/${item._id}`
                      );
                    }}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.videoName}</span>
                        <span>Video | {item.videoDuration}</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Tests?.map((item, index) => (
                  <div
                    onClick={() => navigate(`/user/test/${item._id}`)}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span> Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests1" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {PracticeTests?.map((item, index) => (
                  <div
                    onClick={() => navigate(`/user/test/${item._id}`)}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span>Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {console.log("Docs", Docs)}
            {selectedComponent === "Docs" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Docs.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/notes/${item._id}`, {
                        state: {
                          noteData: item?.handWrittenNotesPdf?.[index],
                          title: "Notes",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.name}</span>
                        <span>Doc | {item.pagesCount} Pages</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
export const CapsuleUserCardComponentCourseP4r = ({
  index,
  name,
  Videos = [],
  Docs = [],
  Tests = [],
  path,
  params,
  chapterId,
  PracticeTests,
  topicName,
  itemName,
  itemId,
  isPurchased,
}) => {
  const [selectedComponent, setSelectedComponent] = useState("Videos");

  const navigate = useNavigate();
  return (
    <div className={styles.capsuleUserCardComponentCourseP4}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{name || topicName || ""} </Accordion.Header>
          <Accordion.Body>
            <div className={styles.capsuleUserCardComponentCourseP4Body}>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Videos" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Videos")}
              >
                {Videos?.length} Videos
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Docs" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Docs")}
              >
                {Docs.length} Docs
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests")}
              >
                {Tests.length} Tests
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests1" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests1")}
              >
                {Tests.length} Practice
              </span>
            </div>

            {selectedComponent === "Videos" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Videos?.map((item, index) => (
                  <div
                    onClick={() => {
                      navigate(
                        `/user/course/${params.CourseType}/${params.course}/${
                          params?.subject
                        }/${chapterId && chapterId}/${item._id}`,
                        {
                          state: {
                            todo: Videos,
                          },
                        }
                      );
                    }}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.videoName}</span>
                        <span>Video | {item.videoDuration}</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Tests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isInnerTestName: "test",
                          isChapterTest: true,
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span> Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests1" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {PracticeTests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isInnerTestName: "practice",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span>Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {selectedComponent === "Docs" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Docs.map((item, index) => (
                  <div
                    onClick={
                      () =>
                        // console.log("clicked",params)
                        navigate(`/user/notes/1`, {
                          state: {
                            noteData:
                              item?.subjects?.[0]?.subSubjects?.[0]
                                ?.chapters?.[0]?.topics?.[0]
                                ?.handwrittenNotes?.[0],
                            title: "Notes",
                            progressData: {
                              courseId: params.course || "",
                              progressType: "note",
                              chapterId:
                                item?.subjects?.[0]?.subSubjects?.[0]
                                  ?.chapters?.[0]?.chapter || "",
                              topicId:
                                item?.subjects?.[0]?.subSubjects?.[0]
                                  ?.chapters?.[0]?.topics?.[0]?.topic || "",
                              videoId: item?._id || "",
                            },
                          },
                        })
                      // navigate(`/user/notesn/${item._id}`, {
                      //   state: {
                      //     noteData: item?.handWrittenNotesPdf?.[index],
                      //     title: "Notes",
                      //   },
                      // })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    {console.log(item?.subjects?.[0])}
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span>Doc | {item.pagesCount} Pages</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
export const CapsuleUserCardComponentCourseP4rCapsuleCourse = ({
  index,
  name,
  Videos = [],
  Docs = [],
  Tests = [],
  path,
  params,
  chapterId,
  PracticeTests,
  topicName,
  itemName,
  itemId,
  isPurchased,
}) => {
  const [selectedComponent, setSelectedComponent] = useState("Videos");

  const navigate = useNavigate();
  return (
    <div className={styles.capsuleUserCardComponentCourseP4}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{name || topicName || ""} </Accordion.Header>
          <Accordion.Body>
            <div className={styles.capsuleUserCardComponentCourseP4Body}>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Videos" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Videos")}
              >
                {Videos?.length} Videos
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Docs" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Docs")}
              >
                {Docs.length} Docs
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests")}
              >
                {Tests.length} Tests
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests1" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests1")}
              >
                {Tests.length} Practice
              </span>
            </div>

            {selectedComponent === "Videos" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Videos?.map((item, index) => (
                  <div
                    onClick={() => {
                      navigate(
                        `/user/capsule-course/${params.course}/${params?.subjectId}/${item._id}`,
                        {
                          state: {
                            todo: Videos,
                          },
                        }
                      );
                    }}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.videoName}</span>
                        <span>Video | {item.videoDuration}</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Tests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isInnerTestName: "test",
                          isChapterTest: true,
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span> Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests1" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {PracticeTests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isInnerTestName: "practice",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span>Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {selectedComponent === "Docs" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Docs.map((item, index) => (
                  <div
                    onClick={
                      () =>
                        // console.log("clicked",params)
                        navigate(`/user/notes/1`, {
                          state: {
                            noteData:
                              item?.subjects?.[0]?.subSubjects?.[0]
                                ?.chapters?.[0]?.topics?.[0]
                                ?.handwrittenNotes?.[0],
                            title: "Notes",
                            progressData: {
                              courseId: params.course || "",
                              progressType: "note",
                              chapterId:
                                item?.subjects?.[0]?.subSubjects?.[0]
                                  ?.chapters?.[0]?.chapter || "",
                              topicId:
                                item?.subjects?.[0]?.subSubjects?.[0]
                                  ?.chapters?.[0]?.topics?.[0]?.topic || "",
                              videoId: item?._id || "",
                            },
                          },
                        })
                      // navigate(`/user/notesn/${item._id}`, {
                      //   state: {
                      //     noteData: item?.handWrittenNotesPdf?.[index],
                      //     title: "Notes",
                      //   },
                      // })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    {console.log(item?.subjects?.[0])}
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span>Doc | {item.pagesCount} Pages</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
export const CapsuleUserCardComponentCourseP4Study = ({
  index,
  name,
  Videos = [],
  Docs = [],
  Tests = [],
  path,
  params,
  chapterId,
  PracticeTests,
  itemName,
  itemId,
  week,
  todo,
  item,
}) => {
  const [selectedComponent, setSelectedComponent] = useState("Videos");

  const navigate = useNavigate();
  return (
    <div className={styles.capsuleUserCardComponentCourseP4}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{name || ""} </Accordion.Header>
          <Accordion.Body>
            <div className={styles.capsuleUserCardComponentCourseP4Body}>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Videos" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Videos")}
              >
                {Videos?.topicVideo?.length} Videos
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Docs" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Docs")}
              >
                {Docs.length} Docs
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests")}
              >
                {Tests.length} Tests
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests1" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests1")}
              >
                {PracticeTests.length} Practice
              </span>
            </div>

            {selectedComponent === "Videos" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Videos?.map((item, index) => (
                  <div
                    onClick={() => {
                      navigate(
                        `/user/study-planner-ai/subject/${params.id}/${week}/${item?._id}`,
                        {
                          state: { todo: todo },
                        }
                      );
                    }}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.videoName}</span>
                        <span>Video | {item.videoDuration}</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Tests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          week,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isInnerTestName: "test",
                          isChapterTest: true,
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span> Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests1" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {PracticeTests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          week,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isInnerTestName: "practice",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span>Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Docs" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Docs.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/notes/${index}`, {
                        state: {
                          noteData: item?.handWrittenNotesPdf?.[index],
                          title: "Notes",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    {}
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.name}</span>
                        <span>Doc | {item.pagesCount} Pages</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
export const CapsuleUserCardComponentCourseP4Studyb = ({
  index,
  name,
  Videos = [],
  Docs = [],
  Tests = [],
  path,
  params,
  chapterId,
  PracticeTests,
  topicName,
  week,
  todo,
  item,
  itemName,
  itemId,
  isPurchased,
}) => {
  const [selectedComponent, setSelectedComponent] = useState("Videos");

  const navigate = useNavigate();
  return (
    <div className={styles.capsuleUserCardComponentCourseP4}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{name || topicName || ""} </Accordion.Header>
          <Accordion.Body>
            <div className={styles.capsuleUserCardComponentCourseP4Body}>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Videos" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Videos")}
              >
                {Videos?.length} Videos
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Docs" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Docs")}
              >
                {Docs.length} Docs
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests")}
              >
                {Tests.length} Tests
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests1" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests1")}
              >
                {Tests.length} Practice
              </span>
            </div>

            {selectedComponent === "Videos" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Videos?.map((item, index) => (
                  <div
                    onClick={() => {
                      navigate(
                        `/user/study-planner-ai/subject/${params.id}/${week}/${item?._id}`,
                        {
                          state: { todo: todo },
                        }
                      );
                    }}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    {}
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.videoName}</span>
                        <span>Video | {item.videoDuration}</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Tests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          week,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isInnerTestName: "test",
                          isChapterTest: true,
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span> Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests1" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {PracticeTests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          week,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isInnerTestName: "practice",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span>Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Docs" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Docs.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/notes/${item._id}`, {
                        state: {
                          noteData: item?.handWrittenNotesPdf?.[index],
                          title: "Notes",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.name}</span>
                        <span>Doc | {item.pagesCount} Pages</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
export const CapsuleUserCardComponentCourseP4Studyb61 = ({
  index,
  name,
  Videos = [],
  Docs = [],
  Tests = [],
  path,
  params,
  chapterId,
  PracticeTests,
  topicName,
  week,
  todo,
  item,
  itemName,
  itemId,
  isPurchased,
}) => {
  const [selectedComponent, setSelectedComponent] = useState("Videos");

  const navigate = useNavigate();
  return (
    <div className={styles.capsuleUserCardComponentCourseP4}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header> {item?.chapter?.name || ""} </Accordion.Header>
          <Accordion.Body>
            <div className={styles.capsuleUserCardComponentCourseP4Body}>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Videos" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Videos")}
              >
                {Videos?.length} Videos
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Docs" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Docs")}
              >
                {Docs.length} Docs
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests")}
              >
                {Tests.length} Tests
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests1" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests1")}
              >
                {PracticeTests.length} Practice
              </span>
            </div>

            {selectedComponent === "Videos" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Videos?.map((item, index) => (
                  <div
                    onClick={() => {
                      // return console.log(item);
                      navigate(
                        `/user/study-planner-ai/subject/${params.id}/${week}/${item?._id}`,
                        {
                          state: { todo: { subSubjects: [todo] } },
                        }
                      );
                    }}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.videoName}</span>
                        <span>Video | {item.videoDuration}</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Tests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          week,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isChapterTest: true,
                          isInnerTestName: "test",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span> Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests1" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {PracticeTests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          week,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isInnerTestName: "practice",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span>Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Docs" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Docs.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/notes/${item._id}`, {
                        state: {
                          noteData: item?.handWrittenNotesPdf?.[index],
                          title: "Notes",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.name}</span>
                        <span>Doc | {item.pagesCount} Pages</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
export const CapsuleUserCardComponentCourseP4CC = ({
  index,
  name,
  Videos = [],
  Docs = [],
  Tests = [],
  path,
  params,
  chapterId,
  PracticeTests,
  topicName,
  itemName,
  itemId,
  isPurchased,
}) => {
  const [selectedComponent, setSelectedComponent] = useState("Videos");
  const navigate = useNavigate();
  return (
    <div className={styles.capsuleUserCardComponentCourseP4}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{name || topicName || ""} </Accordion.Header>
          <Accordion.Body>
            <div className={styles.capsuleUserCardComponentCourseP4Body}>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Videos" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Videos")}
              >
                {Videos?.length} Videos
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Docs" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Docs")}
              >
                {Docs.length} Docs
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests")}
              >
                {Tests.length} Tests
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests1" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests1")}
              >
                {Tests.length} Practice
              </span>
            </div>

            {selectedComponent === "Videos" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Videos?.map((item, index) => (
                  <div
                    onClick={() => {
                      navigate(
                        `/user/capsule-course/${params.id}/${params.id}/${params?.subjectId}/${params.id}`
                      );
                    }}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    {}
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.videoName}</span>
                        <span>Video | {item.videoDuration}</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Tests?.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/mainTest/${item._id}`, {
                        state: {
                          todo: item,
                          itemName,
                          itemId,
                          isPurchased: true,
                          isInnerTest: true,
                          isChapterTest: true,
                          isInnerTestName: "test",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span> Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests1" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {PracticeTests?.map((item, index) => (
                  <div
                    onClick={() => navigate(`/user/test/${item._id}`)}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.image || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span>Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Docs" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Docs.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/notes/${index}`, {
                        state: {
                          noteData: item?.handWrittenNotesPdf?.[index],
                          title: "Notes",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    {}
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.name}</span>
                        <span>Doc | {item.pagesCount} Pages</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
export const CapsuleUserCardComponentCourseP4Page2 = ({
  index,
  name,
  Videos = [],
  Docs = [],
  Tests = [],
  path,
  params,
  chapterId,
}) => {
  const [selectedComponent, setSelectedComponent] = useState("Videos");
  const navigate = useNavigate();
  return (
    <div className={styles.capsuleUserCardComponentCourseP4}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header
            className={styles.capsuleUserCardComponentCourseP4HeaderCapsule}
          >
            <p>
              <span>{name}</span>
            </p>
          </Accordion.Header>

          <Accordion.Body>
            <div className={styles.capsuleUserCardComponentCourseP4Body}>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Videos" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Videos")}
              >
                {Videos?.topicVideo?.length} Videos
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Docs" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Docs")}
              >
                {Docs.length} Docs
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests")}
              >
                {Tests.length} Tests
              </span>
              <span
                className={`${
                  styles.capsuleUserCardComponentCourseP4BodySpan
                } ${selectedComponent === "Tests1" ? styles.active : ""}`}
                onClick={() => setSelectedComponent("Tests1")}
              >
                {Tests.length} Practice
              </span>
            </div>

            {selectedComponent === "Videos" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Videos?.map((item, index) => (
                  <div
                    onClick={() => {
                      navigate(
                        `/user/course/${params.CourseType}/${params.course}/${
                          params.subject
                        }/${chapterId && chapterId}/${item._id}`
                      );
                    }}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.videoName}</span>
                        <span>Video | {item.videoDuration}</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Tests.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/test-instructions/${item._id}`)
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.tileImage || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.bundleName}</span>
                        <span> Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Tests1" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Tests.map((item, index) => (
                  <div
                    onClick={() => navigate(`/user/test-video-solution/1/1`)}
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img
                          src={item?.tileImage || images.UserSubjectsImage}
                          alt="CImage"
                        />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.name}</span>
                        <span>Test | {item.bundleDuration} </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedComponent === "Docs" && (
              <div className={styles.capsuleUserCardComponentCourseP4Content}>
                {Docs.map((item, index) => (
                  <div
                    onClick={() =>
                      navigate(`/user/notes/${index}`, {
                        state: {
                          noteData: item?.handWrittenNotesPdf?.[index],
                          title: "Notes",
                        },
                      })
                    }
                    className={styles.capsuleUserCardComponentCourseP4BodyDiv}
                    key={index}
                  >
                    <span
                      className={
                        styles.capsuleUserCardComponentCourseP4BodyDivicon
                      }
                    >
                      <span>
                        <img src={images.UserSubjectsImage} alt="CImage" />
                      </span>
                      <span
                        className={
                          styles.capsuleUserCardComponentCourseP4BodyDiviconSpan
                        }
                      >
                        <span>{item.name}</span>
                        <span>Doc | {item.pagesCount} Pages</span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export const SwiperComponentSettings = ({
  slides = [],
  spaceBetween = 1,
  slidesPerView = 5,
  onSlideChange = () => {},
  onSwiper = () => {},
  slectedSlide = 0,
  setSelectedSlide = () => {},
}) => {
  return (
    <Swiper
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      onSlideChange={onSlideChange}
      onSwiper={onSwiper}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className={styles.swiperSlideGoalPage1}>
          <div
            onClick={() => setSelectedSlide(index)}
            className={`${
              slectedSlide === index
                ? styles.selectedSlideGoalPage1
                : styles.unselectedSlideGoalPage1
            }`}
          >
            {slide?.name}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export const SwiperComponent2Settings = ({ data = [] }) => {
  return (
    <div>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
        }}
        className="mySwiper"
      >
        {/* {console.log(data)} */}
        {Object.entries(data).map(([key, value]) => {
          if (key === "isLocked" || key === "week") return null;
          return (
            <SwiperSlide
              key={key}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div>
                <CircularProgressbar
                  value={value}
                  text={`${value}%`}
                  styles={buildStyles({
                    pathColor: "green",
                    trailColor: "#d6d6d6",
                    textColor: "blue",
                  })}
                />

                <span
                  style={{
                    display: "block",
                    marginTop: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {key === "videosCompleted"
                    ? "Videos"
                    : key === "practiceQuestionsSolved"
                    ? "Practice Questions"
                    : key === "notesCompleted"
                    ? "Notes"
                    : key === "testsCompleted"
                    ? "Tests"
                    : key === "timeSpent"
                    ? "Time Spent"
                    : key}
                </span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
export const SwiperComponent2SettingsMain = ({ data = [] }) => {
  return (
    <div>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
        }}
        className="mySwiper"
      >
        {Object.entries(data).map(([key, value]) => {
          if (key === "isLocked" || key === "week") return null;
          return (
            <SwiperSlide
              key={key}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div>
                <CircularProgressbar
                  value={value}
                  text={`${value}%`}
                  styles={buildStyles({
                    pathColor: "green",
                    trailColor: "#d6d6d6",
                    textColor: "blue",
                  })}
                />

                <span
                  style={{
                    display: "block",
                    marginTop: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {key === "notesCompleted"
                    ? "Notes"
                    : key === "practiceQuestionsSolved"
                    ? "Practice Questions"
                    : key === "testsCompleted"
                    ? "Tests"
                    : key === "timeSpent"
                    ? "Time Spent"
                    : key === "videosCompleted"
                    ? " Videos"
                    : ""}
                </span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
export const SwiperComponent2Settingsrk = ({ data = [] }) => {
  return (
    <div>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
        }}
        className="mySwiper"
      >
        {Object.entries(data).map(([key, value]) => {
          if (key === "isLocked" || key === "week") return null;
          return (
            <SwiperSlide
              key={key}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div>
                <SemiCircleProgress progress={40} label={key} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export const DashboardCardSingleItem = ({ image, link }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.dashboardCardSingleItem}>
      <div>
        <img src={image} alt="itemImage" />
      </div>
      <div className={styles.dashboardCardSingleItemBody}>
        <Button
          className={styles.dashboardCardSingleItemButton}
          onClick={() => {
            navigate(link);
          }}
        >
          <span>View Dashboard</span>
        </Button>
      </div>
    </div>
  );
};

export const TestWithDetailedAnswerCard = ({ key, test, index }) => {
  const {
    questionNo,
    question,
    timeSpent,
    AnswerExplaniation,
    options,
    solution,
    solutionImages,
    questionImages,
    VideoLink,
  } = test;

 const formatTimeSpent = (time) => {
  if (!time || isNaN(time)) return "00:00:00";

  const totalSeconds = Math.round(time * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

  return (
    <div className={styles.testWithDetailedAnswerCard}>
      <div className={styles.testWithDetailedAnswerCardHeader}>
        <span>Question {index + 1}</span>
        <span>
          <span>
            <Icon icon="mdi:timer-sand-complete" />
          </span>
          <span>{formatTimeSpent(timeSpent)}</span>
        </span>
      </div>
      <div className={styles.testWithDetailedAnswerCardBody}>
        <div className={styles.testWithDetailedAnswerCardBodyQuestion}>
          <span>{question}</span>
        </div>
        <p>
          {questionImages && (
            <img
              key={index}
              src={questionImages}
              alt="Question Image"
              style={{
                maxHeight: "400px",
                maxWidth: "100%",
                width: "auto",
                height: "auto",
              }}
            />
          )}
        </p>
        <div className={styles.testWithDetailedAnswerCardBodyOptions}>
          {options.map((option, index) => {
            const isCorrectAnswer = option.correct === option.option;
            const isYourAnswer = option.yourAnswer === option.option;
            const isWrongAnswer =
              isYourAnswer && option.yourAnswer !== option.correct;
            const answerClass =
              isYourAnswer && isCorrectAnswer
                ? "CorrectAnswer"
                : isWrongAnswer
                ? "IncorrectAnswer"
                : isCorrectAnswer
                ? "highlightCorrect"
                : "unselected";

            return (
              <div
                key={index}
                className={`${styles.testWithDetailedAnswerCardBodyOption} ${styles[answerClass]}`}
              >
                <span>
                  <span>
                    ( {option.option} ) {option.value || ""}
                    {option?.optionImage && (
                      <img
                        src={option?.optionImage}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          width: "auto",
                          height: "auto",
                        }}
                        alt="Option"
                      />
                    )}
                  </span>
                  {isYourAnswer && (
                    <span className="ml-2 text-blue-500">Your Answer</span>
                  )}
                </span>
                <span className="font-bold">
                  {isYourAnswer &&
                    (isCorrectAnswer ? "Correct answer" : "Wrong answer")}
                </span>
              </div>
            );
          })}
        </div>
        <div className={styles.testWithDetailedAnswerCardBodyAnswer}>
          {/* <p>
            <span>Explanation : </span>
            <span>{AnswerExplaniation}</span>
          </p> */}
          <p>
            <span>Solution : {solution && solution} </span>
            <span>
              <p>
                {solutionImages && (
                  <img
                    key={index}
                    src={removeTrailingColon(solutionImages)}
                    alt="Solution Image"
                    style={{
                      maxHeight: "400px",
                      maxWidth: "100%",
                      width: "auto",
                      height: "auto",
                    }}
                  />
                )}
              </p>
            </span>
          </p>
        </div>

        <div className={styles.testWithDetailedAnswerCardBodyAnswer1}>
          <span>Video Link : </span>
          <span
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
              fontSize: "14px",
            }}
            onClick={() => window.open(VideoLink)}
          >
            {VideoLink}
          </span>
        </div>
      </div>
    </div>
  );
};

export const TeachersCardAboutUs = ({ name, description, image, key }) => {
  return (
    <div className={styles.teachersCardAboutUs} key={key}>
      <div className={styles.teachersCardAboutUsImage}>
        <img src={image} alt="teacher" />
      </div>
      <div className={styles.teachersCardAboutUsContent}>
        <div className={styles.teachersCardAboutUsContentName}>{name}</div>
        <div className={styles.teachersCardAboutUsContentDescription}>
          {description}
        </div>
      </div>
    </div>
  );
};
