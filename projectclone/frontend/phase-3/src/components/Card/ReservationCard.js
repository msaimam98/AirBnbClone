import React, { useState, useEffect, useContext } from 'react'
import { Card, Form, Button, Col, Row} from 'react-bootstrap'
import AuthContext from '../../context';
// import BsFillStarFill from 'react-icons/bs'
import './cardstyles.css'
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';

const ReservationCard = (props) => {
  const navigate = useNavigate()
  const { propertyInfo } = props;
  const { token } = useContext(AuthContext);
  const [start, setStart] = useState();
  const [startChecker, setStartChecker] = useState(false);
  const [end, setEnd] = useState();
  const [endChecker, setEndChecker] = useState(false);
  const [numGuests, setNumGuests] = useState(1);
  const [ppn, setPpn] = useState(1);
  const [total, setTotal] = useState(0);
  const [numNights, setNumNights] = useState(0);
  const [availableDates, setAvailableDates] = useState([]);
  const [chosenAvailD, setChosenAvailD] = useState();
  const [notifSenderCheck, setNotifSenderCheck] = useState(0);
  const [resoData, setResoData] = useState({
    
  });
  // console.log(propertyInfo, 'this is the property info')

  // available_date/<int:pk>/list/
  useEffect(() => {
    fetch("http://localhost:8000/webpages/available_date/" + propertyInfo.id + "/list/", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
       
      },
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data, "this is before");
          let newData = []
          for (let i = 0; i < data.length;i++) {
            var availableDate = data[i]
            if (!availableDate.booked_for) {
              newData.push(availableDate)
            }
          }
          console.log(newData, 'this is after')
          if (newData.length === 0) {
            $('#notification').text('Oops! Looks like there are currently no available slots for this property.').css('color','red')
          }
          else {
            setAvailableDates(newData);
          }
      })
      .catch((error) => console.error(error));

  }, [])

  function getToday() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd
    } 
    if(mm<10){
      mm='0'+mm
    }
    return yyyy+'-'+mm+'-'+dd;
  }

  function getNights() {
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    console.log(timeDiff, 'this is the timediff')
    const numDays = Math.ceil(timeDiff / (86400000));
    setNumNights(numDays)
  }
  
  function getTotalPrice() {
    return (numNights * ppn * numGuests).toFixed(2)
  }
  function getTotalPrice2() {
    var total23 = 1.3*(numNights * ppn * numGuests).toFixed(2)
    return total23
  }

  useEffect(() => {
    if (startChecker && endChecker) {
      // get the number of nights
      getNights()

      // see which one it is in
      for (let j = 0; j < availableDates.length;j++) {
        let availableDate = availableDates[j]
        let startDate = new Date(availableDate.start_date)
        let endDate = new Date(availableDate.end_date)

        console.log( j ,start >= startDate, start < endDate, end <= endDate, end > startDate)
        if (start >= startDate && start < endDate && end <= endDate && end > startDate) {
          console.log('where you at chief')
          setChosenAvailD(availableDate)
          setPpn(availableDate.price_per_night)

        }
        else {}
      }

    }

  }, [start, end]);

  // console.log('this is the import we need', chosenAvailD)

  
  const onReserve = () => {
    fetch("http://localhost:8000/webpages/" + propertyInfo.id + "/reservations/add/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token['token']
      },
      body: JSON.stringify({
        start_date: start,
        end_date: end,
        num_of_guests: numGuests
      })
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data, 'this is the reso info');
          setResoData(data)
          
          // console.log(resoData, 'this is the reso data')
          setNotifSenderCheck(3);


      })
      .catch((error) => console.error(error));

  }

  useEffect(() => {

      fetch("http://localhost:8000/webpages/notifications/" + resoData.id + "/" + resoData.user + "/create/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token['token']
      },
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data, 'this is the data bro');


      })
      .catch((error) => console.error(error));
      console.log('getting here')
      console.log(resoData, 'this is the reso data')


  }, [notifSenderCheck]);




  return (
    <Card className='sticky-top sticky-offset'>
      <Card.Body>
        <div>
        <p> These are this Property's Available Dates. You may choose your timeline within any given slot </p>
        <p id='notification'> </p>
        {availableDates.map((dateObject, index) => {

          let start_date = new Date(dateObject.start_date)
          let end_date = new Date(dateObject.end_date)
          let price_per_night = dateObject.price_per_night

          return (

            <>
            <Row>
              <Col>
              <div> { start_date.toDateString()} </div>
              </Col>
              <Col>
              <div> { end_date.toDateString() } </div>
              </Col>
              <Col>
                <div> ${ price_per_night }/night </div>
              </Col>
            </Row>
            </>

          )
        })}
        </div>
        <br />
        <Form>
          <div className='row card-center'>
            <div className="form-group col-lg-6 col-md-12">
              <Form.Control 
                type='date'
                required
                id='start'
                name='start_date'
                min={ getToday() }
                onChange={ (e) => {
                  let startDate = new Date(e.target.value)
                  setStart(startDate)
                  setStartChecker(true)
                } }
              />
            </div>
            <div className='form-group col-lg-6 col-md-12'>
              <Form.Control 
                type='date'
                required
                id='end'
                name='end_date'
                min={ getToday() }
                onChange={ (e) => {
                  let endDate = new Date(e.target.value)
                  setEnd(endDate)
                  setEndChecker(true)
                } }
              />
            </div>
            <div className="form-group col-12">
              <Form.Control 
                type='number'
                required
                id='end'
                name='number_of_guest'
                min={ 0 }
                placeholder="Number of Guests"
                onChange={ (e) => {
                  setNumGuests(e.target.value)
                } }
              />
            </div>
            <p className="card-left-align">
              $ { ppn.toFixed() } x { numNights } nights:
              <span className="card-right-align">
                ${ getTotalPrice() }
              </span>
            </p>
            <hr/>
            <strong className="card-left-align">
              Total Price w/ Taxes
              <span className="card-right-align">
                ${ getTotalPrice2() }
              </span>
            </strong>
            <br/>
            <br/>
            <div className="submit-form-btn">
              <Button onClick={onReserve} className='full-width'>
                Request to Reserve
              </Button>
            </div>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ReservationCard;