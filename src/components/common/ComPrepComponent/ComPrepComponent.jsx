import { Modal, Button } from "react-bootstrap";

export const ReusableModal = ({
  title = "Modal Title",
  body,
  footer,
  header = true,
  size = "lg",
  centered = true,
  show,
  onHide,
  closeButton = true,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      aria-labelledby="reusable-modal-title"
      centered={centered}
    >
      {header && (
        <Modal.Header closeButton={closeButton}>
          {title && (
            <Modal.Title id="reusable-modal-title">{title}</Modal.Title>
          )}
        </Modal.Header>
      )}

      <Modal.Body style={{padding:"0px"}} >{body} </Modal.Body>

      {footer !== false && (
        <Modal.Footer>
          {footer || <Button onClick={onHide}>Close</Button>}
        </Modal.Footer>
      )}
    </Modal>
  );
};
