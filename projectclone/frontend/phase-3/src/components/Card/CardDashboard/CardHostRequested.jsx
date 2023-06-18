import '../cardstyles.css'
import { React, useEffect, useState, useContext} from 'react';
import { Card, Button } from 'react-bootstrap';
import AuthContext from '../../../context';
import { useNavigate } from 'react-router-dom';
import DisplayOne from '../../Display_one_pic';
import { Modal, Form} from 'react-bootstrap';

import GuestCommentsModal from '../../modals/GuestCommentsModal';

export const CardComponentHRequested = (props) => {
    const { id, available_date, property} = props.value;
    const {handleApprove, handleDeny} = props.button;
    const [price, setPrice] = useState(0);
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [userHistory, setUserHistory] = useState([])
    const [totalPrice, setTotalPrice] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true)
    const handleHide = () => setShowModal(false)

    const [user, setUser] = useState(null)

    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleShowModal() {
        setShowModal(true);
    }
    
    function handleCloseModal() {
        setShowModal(false);
    }

    useEffect(() => {
      // console.log('user here is ', props.value)
      if(id) {
        getRequestedReservations()
      }
      
    }, [])

    // gets specific reservation
    const getRequestedReservations = (url = "http://localhost:8000/webpages/reservations/requested/" + id + '/') => {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token['token'],
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('got these ', data, data[0].user)
          if(data[0].user) {
            setUser(data[0].user)
          }          
        })
        .catch((error) => console.error(error));
    }


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
        navigate('/property-info', {state: data});

        })
    }


    useEffect(() => {
        fetch("http://localhost:8000/webpages/available_date/" + available_date + "/detail/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + token['token']
        },
        })
        .then((response) => response.json())
        .then((data) => {
            // console.log('available date data' ,data);
            setPrice(data.price_per_night)


            // now calculate total price
            const startDate = new Date(data.start_date);
            setStart(startDate)
            const endDate = new Date(data.end_date);
            setEnd(endDate)
            const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
            const numDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const totalPrice2 = numDays*data.price_per_night;
            setTotalPrice(totalPrice2)




        })
        .catch((error) => console.error(error));
        
        
        }, []);


    // const getHistory = () => {


    //     fetch("http://localhost:8000/webpages/" + user + "/history/", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization" : "Bearer " + token['token']
    //         },
    //         })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log('this is the history' ,data)
    //             setUserHistory(data)
    
    //         })
    //         .catch((error) => console.error(error));

    // }

    const onHistory = () => {

        // getHistory()
        handleShow()

    }



  return (
    <div className='col-sm-12 col-md-6 col-lg-4 results-card'>
        <Card>
            <div className='fixit w-100'>
                {/* <Button className='fixit-button' size='sm' onClick={() => handleC(id)}>{text}</Button> */}
                <Button onClick={() => onHistory() } className="btn btn-primary fixit-button" size='sm'>History</Button>
                {/* the className for img=fixit-img --> its in the displayOne component but we can use it in cardstyles.css */}
                <DisplayOne property_id={property.id} />
            </div>
            <Card.Body>
                <Card.Title>{ property.address }</Card.Title>
                <Card.Text>{ property.description }</Card.Text>
                <Card.Text>
                    <p className='card-left-align'>
                        ${ price }/night
                    <span className="card-right-align total-price">
                        ${ totalPrice } total
                    </span>
                    </p>
                </Card.Text>
                <Button onClick={() => handleApprove(id)} variant='success' size='sm'>Approve</Button>
                <Button onClick={() => handleDeny(id)} variant='danger' size='sm'>Deny</Button>
                <hr />
                <Button onClick={onViewListing} className="btn btn-primary" size='sm'>View Listing</Button>
            </Card.Body>

            
            {/* <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold mb-2">This User's History</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                {userHistory.map((commentInfo) => (
                
                <p> { commentInfo.content } </p>
            ))}

                </Form>
            </Modal.Body>

        </Modal> */}

          <GuestCommentsModal
            user={ user }
            showModal={ showModal }
            handleHide={ handleHide }
          />

        </Card>
    </div>
  


  )

}

export default CardComponentHRequested;