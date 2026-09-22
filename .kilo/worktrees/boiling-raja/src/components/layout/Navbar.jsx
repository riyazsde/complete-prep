import "./css/Navbar.css";
import images from "../../utils/images";
import { Button, Form, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ComingSoon } from "../common/ComingSoon";

const Navbar = ({ isCSS }) => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const handleInitialPageClick = ({ page }) => {
    localStorage.setItem("startingPage", page);
    navigate(`/signup`);
  };

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div className="home-modal-container">
            <span
              onClick={() =>
                handleInitialPageClick({ page: "user/study-planner-ai" })
              }
            >
              Study Planner
            </span>
            <span
            // onClick={() => handleInitialPageClick({ page: "user/course" })}
            >
              <p className="d-flex align-items-center justify-content-between">
                <span>Courses</span>
                <span>
                  <ComingSoon />
                </span>
              </p>
            </span>
            <span
              onClick={() =>
                handleInitialPageClick({ page: "user/test-video-solution" })
              }
            >
              Test with video solution
            </span>
            <span
              onClick={() =>
                handleInitialPageClick({ page: "user/notes" })
              }
            >
              Notes by Educators
            </span>
            <span
              onClick={() =>
                handleInitialPageClick({ page: "user/pyq-with-videos" })
              }
            >
              PYQs with videos
            </span>
            <span
            // onClick={() =>
            //   handleInitialPageClick({ page: "user/capsule-course" })
            // }
            >
              <p className="d-flex align-items-center justify-content-between">
                {" "}
                <span>Capsule Course</span>
                <span>
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    <ComingSoon />
                  </p>
                </span>
              </p>
            </span>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <div className={isCSS ? "navbar" : ""}>
        <div className="navbar_container fixMaxWidth gridLayoutNavbar">
          <div className="navbar_logo_container">
            <span className="navbar_logo_container_1"></span>
            <span className="navbar_logo_container_2">
              <span className="navbar_logo_container_2_1">
                <img
                  onClick={() => {
                    navigate("/");
                    window.scroll(0, 0);
                  }}
                  src={images?.navBarLogo}
                  alt="logo"
                />
              </span>
              <span className="navbar_logo_container_2_2">
                Digital Benchers
              </span>
            </span>
          </div>
          <div className="navbar_search_container">
            <div className="navbar_search_container_1">
              <div>
                <Form.Control
                  type="search"
                  placeholder="Search courses, test series and exams"
                  className="navbar_search_container_1_1"
                  aria-label="Search courses, test series and exams"
                />
              </div>
              <div>
                <Icon
                  icon="ic:round-search"
                  className="navbar_search_container_1_2"
                />
              </div>
            </div>
          </div>
          <div className="navbar_user_container">
            {/* <span className="navbar_user_container_1">
              <img src={images?.navBarGiftIcon} alt="icon" />
            </span> */}
            <span className="navbar_user_container_2">
              <Icon
                icon="ic:baseline-menu"
                className="navbar_logo_container_1_1"
                onClick={() => setModalShow(true)}
              />
              <Button
                onClick={() => handleInitialPageClick({ page: "user/home" })}
              >
                Login
              </Button>
            </span>
            {/* <span className="navbar_user_container_3">
              <Button variant="primary">Get the App</Button>
            </span> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
