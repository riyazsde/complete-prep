import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import styles from "./common_css/modal.module.css";
import { useForm } from "react-hook-form";
import { endpoints } from "../../services/endPoints";
import { postRequest } from "../../services/apiService";

export const CommunityModal = ({ show, handleClose, getUserData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const onSubmit = (data) => {
    
    const payload = new FormData();
    if (image) payload.append("image", image);
    if (data.title) payload.append("title", data.title);
    if (data.desc) payload.append("desc", data.desc);

    postRequest({
      endpoint: endpoints.createPost,
      data: payload,
      setIsLoading,
    }).then((res) => {
      setImage(null);
      setSelectedImage(null);
      reset();

      getUserData();
      handleClose();
    });
  };

  return (
    <div>
      <Modal size="lg" show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)} className="w-100">
          <Modal.Body>
            <Form.Group controlId="formHeadline" className="mb-3">
              <Form.Label className={styles.CommunityModalLabel}>
                Headline
              </Form.Label>
              <Form.Control
                required
                className={styles.CommunityModalInput}
                type="text"
                placeholder="Enter headline"
                {...register("title", { required: "Headline is required" })}
              />
            </Form.Group>

            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label className={styles.CommunityModalLabel}>
                Description
              </Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={3}
                placeholder="Enter description"
                className={styles.CommunityModalInput}
                {...register("desc", { required: "Description is required" })}
              />
            </Form.Group>

            <Form.Group controlId="formUploadImage" className="mb-4">
              <Form.Label className={styles.CommunityModalLabel}>
                Upload Image
              </Form.Label>
              <div className="d-flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  id="selectImageInput"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                <Button
                  variant="outline-secondary"
                  className="d-flex align-items-center gap-2"
                  onClick={() =>
                    document.getElementById("selectImageInput").click()
                  }
                >
                  Open Gallery
                </Button>
              </div>
              {selectedImage && (
                <div className={styles.CommunityModalimageContainer}>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className={styles.CommunityModalImage}
                  />
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className={styles.CommunityModalButton}
              variant="primary"
              type="submit"
            >
              Publish Post
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
