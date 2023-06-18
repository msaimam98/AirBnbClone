import { React, useState, useEffect, useContext} from 'react'
import { Modal, Container} from 'react-bootstrap';
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context';
import Add_pic from '../PhotoAdd'
import Display_pic from '../PhotoDisplay'
import Add_Ava from '../Add_available'
import Display_Ava from '../Display_Available'
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddRating(props){
const { setIsHost, token} = useContext(AuthContext);
 const [rated, setRated] = useState(false);
 const [rating, setRating] = useState(1);

let navigate = useNavigate();



const handleRatingChange = (event) => {
    setRating(event.target.value);
  };
  const handleRating = (event) => {
    

    event.preventDefault();
    const formData = new FormData();
    formData.append('rating', rating);
    console.log($("#rating"))


    fetch('http://localhost:8000/webpages/rating/'+ props.property_id +'/'+props.property_id+'/add/', {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": "Bearer " + token['token']
      },
    }).then((response) => {
        console.log('http://localhost:8000/webpages/rating/'+ props.property_id +'/'+props.property_id+'/add/')
        console.log(formData)

        if (response.status === 201) {

            setRated(true);
        }
        else{
            $("#res").text("incorrect rating, should from 0 to 5").css('color', 'red');
        }

      })
  }
  if (!rated){ return (
    <div className='row m-4 border border-primary'>
        <div className='m-2 text-center'>
        <h4>Add your rating</h4>
        <input type="number" className="border-secondary col-2" id="rating" value={rating} onChange={handleRatingChange} name="rating" required />
        <button className="btn btn-outline-primary text-center col-2 m-4"  onClick={handleRating}>Add</button>
        <p id="res"></p>
        </div>
        

    </div>
  );
}
else{
    return (
        <div>

    
        </div>
      );
    
}


  };

  

export default AddRating;
