import { useState, useEffect, useContext} from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import API from '../API/apiservice';
import $ from 'jquery';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context';

function Display_Ava(props) {
  const [availableDates, setAvailableDates] = useState([]);
  const {refresh, setRefresh} = props.refresh
  const { token } = useContext(AuthContext)

  useEffect(() => {
    fetch('http://localhost:8000/webpages/available_date/'+ props.property_id +'/list/', {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + token['token']
      },
    })
    .then((response) => response.json())
      .then((data) => {
        console.log(data, 'this is it')
        const Data = data.map(availableDate=> ({ id: availableDate.id, start_date: availableDate.start_date.substring(0, 10), end_date: availableDate.end_date.substring(0, 10), price_per_night: availableDate.price_per_night, booked_for: availableDate.booked_for }));
        setAvailableDates(Data);
  
      })}, [refresh])

    // useEffect(() => {

    //   console.log('point is that')

    // }, [availableDates]);

  return (
    
    <div className='row border border-primary  border-solid bg-warning m-4'>

      
      {availableDates.map(date => (
        <div className='col-sm-4' key={date.id}>

          {date.booked_for ? (
            <div></div>

          ) : (
            <>
            <div className=" p-2 m-2 border border-primary  border-solid">
            <p>Start Date: {date.start_date}</p>
            <p>End Date: {date.end_date}</p>
            <p>Price per night: {date.price_per_night}</p>
          </div>
            
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Display_Ava;
