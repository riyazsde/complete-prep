import styles from "./common_css/AddToCart.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddToCart = ({
  name,
  image,
  courseHighlights,
  courseHighlightsText,
  price,
  promoCodes,
  purchased,
  purchasedDate,
  addToWishlist,
  addToCart,
  id,
  removeCartItem,
  item,
  hideBelow = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.addToCart}>
      <div className={styles.addToCartImage}>
        <img src={image} alt="image" />
      </div>
      <div className={styles.addToCartName}>{name}</div>
      <div className={styles.addToCartCourseHighlights}>
        <p className={styles.addToCartCourseHighlightsText}>
          {courseHighlightsText ? courseHighlightsText : "Course Highlights"}
        </p>
        <div className={styles.addToCartCourseHighlightsItems}>
          {courseHighlights.split("\n").map((line, index) => (
            <div
              className={styles.addToCartCourseHighlightsItem}
              key={`highlight-${index}`}
            >
              {/* <span>
                <Icon
                  icon="icon-park-outline:dot"
                  className="addToCartIcon"
                  style={{ width: "25px", height: "25px", color: "#B3DEF7" }}
                />
              </span> */}
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
      {/* <div className={styles.addToCartPrice}>
        {purchased
          ? `Purchased on ${formatDateCurrentAffairs(purchasedDate)}`
          : `Rs. ${price}`}
      </div> */}
      {!purchased && (
        <>
          <div className={styles.addToCartPromoCodes}>
            <div className={styles.addToCartPromoCodesText}>
              <Form.Control
                className={styles.addToCartPromoCodesInput}
                type="text"
                placeholder="Enter promo code"
              />
              {promoCodes?.map((item, index) => {
                return (
                  <div className={styles.addToCartPromoCodesItem} key={index}>
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
          {hideBelow !== true && (
            <div className={styles.addToCartButton}>
              <p className={"TestWithVideoPage2Containe1P4"}>
                <span>
                  <span
                    style={{ border: "none" }}
                    onClick={() => addToWishlist(id)}
                  >
                    <Icon
                      icon={
                        item?.isWishlist
                          ? "twemoji:red-heart"
                          : "system-uicons:heart"
                      }
                      style={{ width: "20px", height: "20px" }}
                    />
                  </span>
                  <span
                    onClick={() =>
                      item?.isCart !== true && addToCart(item?._id)
                    }
                  >
                    {/* {item?.isCart !== true ? "Add to Cart" : "Added to Cart"} */}
                  </span>
                  <span
                    style={{
                      border: "1px solid #a3a3a3",
                      cursor: "pointer",
                      borderRadius: "10px",
                      padding: "1rem",
                    }}
                    onClick={() => removeCartItem(id)}
                  >
                    Buy Now
                  </span>
                </span>
              </p>
              {/* <span>
              <Icon
                icon={
                  item?.isInWishlist
                    ? "twemoji:red-heart"
                    : "system-uicons:heart"
                }
                onClick={() => addToWishlist(id)}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
            </span>
            <span className="d-flex g-2">
              <span style={{ marginRight: "10px" }}>
                <Button
                  onClick={() => removeCartItem(id)}
                  className={styles.addToCartButtonAdd}
                >
                  Buy Now
                </Button>
              </span>
              <span>
                <Button
                  onClick={() => addToCart(id)}
                  className={styles.addToCartButtonAdd}
                >
                  Add to cart
                </Button>
              </span> */}
              {/* </span> */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddToCart;
