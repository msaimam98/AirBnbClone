import '../cardstyles.css'
import { React, useEffect, useState, useContext} from 'react';
import { Card, Button } from 'react-bootstrap';
import AuthContext from '../../../context';
import { useNavigate } from 'react-router-dom';
import DisplayOne from '../../Display_one_pic';
import { Modal, Form} from 'react-bootstrap';

import ReviewGuestModal from '../../modals/ReviewGuestModal';



export const CardComponentHComp = (props) => {
  const { id, property } = props.value;
  const {text} = props.button;
  const { allHostReviews, getAllHostReviews } = props
  const [commentable, showCommentable] = useState([])
  // const [price, setPrice] = useState(0);
  // const [start, setStart] = useState()
  // const [end, setEnd] = useState()
  // const [totalPrice, setTotalPrice] = useState(0);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ShowButton, setShowButton] = useState(true)
  const [UserHistoryModalData, setUserHistoryModalData] = useState({
    content: ""
  })

  // useEffect(() => {
  //   // console.log('this is all host reviews ', allHostReviews)
  // }, [allHostReviews])

  

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)


  const onViewListing = (event) => {
    event.preventDefault()
    fetch('http://localhost:8000/webpages/property/' + property.id + '/detail/', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, 'this is right before the navigate')
      navigate('/property-info', { state: data });
    })
  }

  const getCommentable = () => {
    // console.log('all host reviews is ', allHostReviews, 'and id is ', id)
    if(allHostReviews !== undefined && Array.isArray(allHostReviews)) {
      if(allHostReviews.includes(id)) {
        // console.log('returning true ', id)
        return false
      } else {
        // console.log('returning false ', id)
        return true
      }
    }
  }




  // const handleChange = (e) => {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   setUserHistoryModalData(values => ({ ...values, [name]: value }))
  //     console.log(UserHistoryModalData, 'THIS IS THE MODAL DATA')
  // }

  return (
    <div className='col-sm-12 col-md-6 col-lg-4 results-card'>
      <Card>
        <div className='fixit w-100'>
          { getCommentable() ? (
            <Button className='fixit-button' size='sm' onClick={ handleShow }>{ text }</Button>
          ) : ( <div></div> )}
          {/* the className for img=fixit-img --> its in the displayOne component but we can use it in cardstyles.css */}
          <DisplayOne property_id={ property.id } />
        </div>
        <Card.Body>
          <Card.Title>{ property.address }</Card.Title>
          <Card.Text>{ property.description }</Card.Text>
          {/* <Card.Text>
              <p className='card-left-align'>
                  ${ price }/night
              <span className="card-right-align total-price">
                  ${ totalPrice } total
              </span>
              </p>
          </Card.Text> */}
          <Button onClick={ onViewListing } className="btn btn-primary" size='sm'>View Listing</Button>
        </Card.Body>
      </Card>

      <ReviewGuestModal
        show={ show }
        handleClose={ handleClose }
        reservation_id={ id }
        // setShowButton={ setShowButton }
        getAllHostReviews={ getAllHostReviews }
      />
      
    </div>
  


  )

}

export default CardComponentHComp;