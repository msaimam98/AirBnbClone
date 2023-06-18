import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Modal } from 'react-bootstrap'
import AuthContext from '../../context';
import { useNavigate } from 'react-router-dom';

const ReviewGuestModal = (props) => {

  const {
    show,
    handleClose,
    reservation_id,
    setShowButton,
    getAllHostReviews
  } = props;

  const [comment, setComment] = useState('')
  const [userRating, setUserRating] = useState(null)
  const [showValidation, setShowValidation] = useState('')

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();


  const onAddComment = () => {
    if(comment === '' || userRating === null) {
      setShowValidation('Comment or rating is empty!')
      return
    }
    fetch('http://localhost:8000/webpages/' + reservation_id + '/review_for_guest/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token'],
      },
      body: JSON.stringify({
        rating: userRating,
        text_content: comment
      })
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, 'this is the response from userhistory')
      // setShowButton(false)
      handleClose()
      getAllHostReviews()
      navigate('/dashboard/host_completed/')
    })
    .catch((error) => console.error(error))
  }


  const renderAddComment = () => {
    return (
      <>
        <div className='row'>
          <div className='col-md-6'>
            <Form.Group className="mb-3">
              <Form.Control type="number" max="5" min="0" placeholder="Enter rating" onChange={ e => setUserRating(e.target.value) }/>
            </Form.Group>
          </div>
        </div>

        <Form.Group className='pb-4'>
          <Form.Control
            className="addComment"
            as="textarea"
            rows="3"
            placeholder="Add comment"
            value={ comment }
            onChange={ e => setComment(e.target.value) }
            type="text"
          />
        <div>
          <Button
            className="addCommentBtn"
            variant="outline-primary"
            size='sm'
            onClick={ () => onAddComment() }
          >
            Add new review
          </Button>
        </div>
        </Form.Group>
        { showValidation.length > 0 && (
          <p className='error'>{ showValidation }</p>
        )}
      </>
    )
  }

  return (
    <Modal show={ show } onHide={ handleClose }>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold mb-2">Leave a Review for Your Guest!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label> </Form.Label>
              {/* <Form.Control 
                type='text'
                as="textarea" 
                name='content'
                rows={5}
                onChange={handleChange}/> */}
              { renderAddComment() }
            </Form.Group>
            <br />
            <div className='makeitwork'>
              {/* <Button variant='primary' onClick={sendUserHistory} > Submit </Button> */}
              {/* <Button variant='dark' onClick={ handleClose }> Close </Button> */}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
  )
}

export default ReviewGuestModal;