import { useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';
import API from '../API/apiservice';


import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context';

function DisplayPic(props) {
  const [rates, setrates] = useState([]);
  const { token } = useContext(AuthContext)
  


  useEffect(() => {
    fetch('http://localhost:8000/webpages/rating/'+props.property_id +'/list/', {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token['token'],
        "Content-Type": "application/json"
      }

    })
    .then((response) => response.json())
    .then((data) => {
      const d= data.map(rate => ({ id: rate.id, rating: rate.rating }));
      setrates(d);
      console.log(d)

    })
  })
  if (rates.length > 0 ){
    var num = 0
    for (let i=0; i<rates.length; i++ ){
        num += parseFloat(rates[i].rating)
     
    }
    num = num/rates.length
    num = (Math.round(num * 10) / 10).toFixed(1);
    return (
        <div>
            <p className='text-center'>Rating: {num}</p>
        </div>
      );

  }
  else{
    return (
        <div>
            <p>0</p>
        </div>
      );
  }



}

export default DisplayPic;
