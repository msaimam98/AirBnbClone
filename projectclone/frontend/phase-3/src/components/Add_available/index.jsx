import { useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';
import API from '../API/apiservice';
import $ from 'jquery';

import AuthContext from '../../context';

function Add_Ava(props) {
  const { token } = useContext(AuthContext);
  const [start_date, setSd] = useState(new Date().toLocaleDateString());
  const [end_date, setEd] = useState(new Date().toLocaleDateString());
  const [price_per_night, setPpn] = useState(0);
  const {setRefresh} = props.refresh

  

  const handleSd = (event) => {
    setSd(event.target.value);
  };

  const handleEd = (event) => {
    setEd(event.target.value);
  };
  const handlePpn = (event) => {
    setPpn(event.target.value);
  };

  const handleAvaSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('start_date', start_date);
    formData.append('end_date', end_date);
    formData.append('price_per_night', price_per_night)
    console.log('http://localhost:8000/webpages/'+ props.property_id +'/create_timerange_price/');

    fetch('http://localhost:8000/webpages/'+ props.property_id +'/create_timerange_price/', {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": "Bearer " + token['token']
      },
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 400) {

          $("#result").text("overlapped available days").css('color', 'red');
        }

        else if (response.status === 201) {

          $("#result").text("congrats! You added available dates successfully").css('color', 'red');
          setRefresh(2)
        }
        else{
          $("#result").text("available date not added successfully").css('color', 'red');
          
        }
      })
      .catch((error) => {console.error(error)
        // Handle error
      });
  };

  return (
    <form onSubmit={handleAvaSubmit}>
      <div className="input-group">
        <label className="m-3"> From</label>
        <input type="date" className="border-secondary" id="start" name="start" value={start_date} onChange={handleSd} required />
        <label className="m-3"> To</label>
        <input type="date" className="border-secondary" id="end" name="end" value={end_date} onChange={handleEd} required />
      </div>
      <div>
        <label className="m-3"> Asking Price: </label>
        <input className="border-secondary" type="number" min="0" max="9999999999999" value={price_per_night} onChange={handlePpn} required />
        <label className="m-3">$ </label>
        <button type="submit" className="btn btn-outline-primary text-center float-end m-3">Add</button>
        
        
      </div>
      <p id='result'></p>
    </form>
  );
}

export default Add_Ava;
