import { useState, useEffect, useContext} from 'react';
import { Form, Button } from 'react-bootstrap';
import API from '../API/apiservice';
import './displayonestyles.css'


import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context';




function DisplayOne(props) {
    const [pictures, setPictures] = useState([]);
    const { token } = useContext(AuthContext)
    
  
  
    useEffect(() => {
      fetch('http://localhost:8000/webpages/picture/'+ props.property_id +'/list/', {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token['token'],
          "Content-Type": "application/json"
        }
  
      })
      .then((response) => response.json())
      .then((data) => {
        const pictureData = data.map(picture => ({ id: picture.id, name: picture.name, image: picture.image }));
        setPictures(pictureData);

  
      })
    }, [])
  
    if (pictures.length > 0) {
        return (
          <div className='fixit-wrapper'>
            <img style={{ width: '25vw', height: '25vw' }} src={pictures[0].image} alt={pictures[0].name} />
          </div>
        );
      } else {
        return (
          <div className='fixit-wrapper'>
            <img src="https://newhomelistingservice.com/assets/default_logo/large_emg_default-04cb60da994cb5a009f5f7640a7881a7b035e7bddba555c218b5e084b2a64f93.jpg" />
          </div>
        );
      }}

export default DisplayOne;
