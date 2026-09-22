import "./css/Footer.css";
import images from "../../utils/images";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import { endpoints } from "../../services/endPoints";
import { getRequest } from "../../services/apiService";
const Footer = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const getUserData = () => {
    getRequest({
      endpoint: endpoints.getContactUs,
      setIsLoading,
    }).then((res) => {
      setData(res?.data?.[res?.data?.length - 1]);
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleInitialPageClick = ({ page }) => {
    localStorage.setItem("startingPage", page);
    navigate(`/signup`);
  };
  return (
    <div className="footerSection">
      <div className="footerSectionContainer">
        <div className="footerContainer">
          <div className="footerContent1">
            <p className="footerLogo">
              <span>
                <img src={images.footerLogo} alt="footerLogo" />
              </span>
              <span>
                Digital Benchers is democratising education, making it
                accessible to all. Join the revolution, learn on India's largest
                learning platform.
              </span>
            </p>
            <p className="footerLine">
              <hr />
            </p>
            <p className="footerContact">
              <span>Reach out to us</span>
              <span>
                Get your questions answered about learning with Digital
                Benchers.
              </span>
              <span>
                <span>
                  <Icon icon="bi:telephone-fill" />
                </span>
                <span>{data?.mobileNumber || ""}</span>
              </span>
              <span>
                <span>
                  {" "}
                  <Icon icon="bi:envelope-fill" />{" "}
                </span>
                <span>{data?.email || ""}</span>
              </span>
              <p className="footerSocial">
                <span>
                  <Icon
                    icon="bi:instagram"
                    className="icon-instagram"
                    onClick={() =>
                      window.open(
                        "https://www.instagram.com/digitalbenchers/profilecard/?igsh=ZDU0NDJqb3Jrc2Rq",
                        "_blank"
                      )
                    }
                  />
                </span>
                <span>
                  <Icon icon="bi:linkedin"
                  className="icon-linkedin" onClick={() => window.open("https://www.linkedin.com/company/digital-benchers/", "_blank")} />
                </span>
                <span>
                  <Icon icon="bi:whatsapp" className="icon-whatsapp" onClick={() => window.open("https://whatsapp.com/channel/0029VaebfqFAjPXE9Svse20B", "_blank")} />
                </span>
                <span>
                  <Icon icon="bi:telegram" className="icon-telegram" onClick={() => window.open("https://t.me/digitalbenchers", "_blank")} />
                </span>
              </p>
            </p>
          </div>
          <div style={{ color: "white" }} className="footerContent2">
            <div>
              <div className="footerContent2Div1">
                <p style={{ color: "white" }}>Company</p>
                <p style={{ color: "white" }}>
                  <span
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate("/about-us");
                    }}
                  >
                    About us
                  </span>
                  <span
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate("/user-careers");
                    }}
                    style={{ color: "white" }}
                  >
                    Careers
                  </span>
                  <span
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate("/privacy-policy");
                    }}
                    style={{ color: "white" }}
                  >
                    Privacy Policy
                  </span>
                  <span
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate("/terms-and-conditions");
                    }}
                    style={{ color: "white" }}
                  >
                    {" "}
                    Terms & Conditions
                  </span>
                </p>
              </div>
              <div className="footerContent2Div1">
                <p style={{ color: "white" }}>Help & support</p>
                <p style={{ color: "white" }}>
                  <span
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate("/user-guidelines");
                    }}
                    style={{ color: "white" }}
                  >
                    User Guidelines
                  </span>
                  <span
                    style={{ color: "white" }}
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate("/user-sitemap");
                    }}
                  >
                    Site Map
                  </span>
                  <span
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate("/refund-policy");
                    }}
                    style={{ color: "white" }}
                  >
                    Refund Policy
                  </span>
                  <span
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate("/take-down-policy");
                    }}
                    style={{ color: "white" }}
                  >
                    Takedown Policy
                  </span>
                  <span
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate("/grievance-policy");
                    }}
                    style={{ color: "white" }}
                  >
                    Grievance Redressal
                  </span>
                </p>
              </div>
            </div>
            <div className="footerContent2Div2">
              <div style={{ color: "white" }} className="footerContent2Div1">
                <p style={{ color: "white" }}>Popular goals</p>
                <p>
                  <span
                    style={{ color: "white" }}
                    onClick={() => navigate("/signup")}
                  >
                    IIT JEE
                  </span>
                  <span
                    style={{ color: "white" }}
                    onClick={() => navigate("/signup")}
                  >
                    UPSC
                  </span>
                  <span
                    style={{ color: "white" }}
                    onClick={() => navigate("/signup")}
                  >
                    SSC
                  </span>
                  <span
                    style={{ color: "white" }}
                    onClick={() => navigate("/signup")}
                  >
                    {" "}
                    SDIR UGC NET
                  </span>
                  <span
                    style={{ color: "white" }}
                    onClick={() => navigate("/signup")}
                  >
                    NEET UG
                  </span>
                </p>
              </div>
              <div className="footerContent2Div1">
                <p style={{ color: "white" }}>Digital Benchers</p>
                <p style={{ color: "white" }}>
                  <span
                    onClick={() =>
                      handleInitialPageClick({ page: "user/study-planner-ai" })
                    }
                  >
                    Study Planner
                  </span>
                  <span
                    onClick={() =>
                      handleInitialPageClick({ page: "user/course" })
                    }
                  >
                    Courses
                  </span>
                  <span
                    onClick={() =>
                      handleInitialPageClick({
                        page: "user/test-video-solution",
                      })
                    }
                  >
                    Test series
                  </span>
                  <span
                    onClick={() =>
                      handleInitialPageClick({ page: "user/notes" })
                    }
                  >
                    Notes
                  </span>
                  <span
                    onClick={() =>
                      handleInitialPageClick({ page: "user/community" })
                    }
                  >
                    Community
                  </span>
                  <span
                    onClick={() =>
                      handleInitialPageClick({ page: "user/capsule-course" })
                    }
                  >
                    Capsule course
                  </span>
                  {/* <span
                    onClick={() =>
                      handleInitialPageClick({ page: "user/skills" })
                    }
                  >
                    skills
                  </span> */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
