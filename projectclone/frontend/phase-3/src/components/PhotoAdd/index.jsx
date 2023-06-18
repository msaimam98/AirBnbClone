import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import API from '../API/apiservice';
import $ from 'jquery';

import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context';

function Add_pic(props) {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const { token } = useContext(AuthContext)

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    fetch('http://localhost:8000/webpages/picture/'+ props.property_id +'/add/', {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": "Bearer " + token['token']
      },
    })
      .then((response) => {
        if (response.status === 201) {

          $("#result").text("congrats! You added the photo to the property").css('color', 'red');
        }
        else{
          $("#result").text("photo not added successfully").css('color', 'red');
        }
      })
      .catch((error) => {
        // Handle error
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
    
        <br />
        <label>
          Image:
          <br />
          <input type="file" onChange={handleImageChange} />
        </label>
        <br />
        <br />
        <label>
          Description:
          <br />
          <textarea  value={name} onChange={handleNameChange} />
        
        </label>
        <br />
        <button type="submit">Submit</button>
        <p id='result'></p>
      </form>
    </div>
  );
}

export default Add_pic;
