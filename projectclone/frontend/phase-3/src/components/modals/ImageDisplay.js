import React, { useState } from 'react'
import { Modal, Carousel, Button } from 'react-bootstrap';

const ImageDisplay = (props) => {
  const {
    images
  } = props;

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const renderCarousel = () => (
    <div className="col-sm-10 form-group-button d-flex justify-content-end">
      { images.map((image, index) => (
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={ image.src }
            alt={ index }
            key={ index }
          />
      </Carousel.Item>
      ))}
    </div>
  )

  return (
    <>
      <div className='overlay-btn'>
        <Button className='view-all-photos-btn' onClick={ handleShow }>
          All
        </Button>
      </div>
      <Modal show={ showModal } onHide={ handleClose }>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          { renderCarousel() }
        </Modal.Body>
      </Modal>
    </>

  )
}

export default ImageDisplay;