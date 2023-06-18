import { React, useState, useEffect, useContext} from 'react'
import { Modal, Container} from 'react-bootstrap';
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context';
import Add_pic from '../PhotoAdd'
import Display_pic from '../PhotoDisplay'
import Add_Ava from '../Add_available'
import Display_Ava from '../Display_Available'

import 'bootstrap/dist/css/bootstrap.min.css';

function DeleteProp(props){
    const { setIsHost, token} = useContext(AuthContext);
const [showModal, setShowModal] = useState(false);
let navigate = useNavigate();


function handleShowModal() {
  setShowModal(true);
}

function handleCloseModal() {
  setShowModal(false);
}

  const handleSubmit = (event) => {
    handleCloseModal();
    event.preventDefault();


    fetch('http://localhost:8000/webpages/property/'+ props.property_id +'/delete/', {
      method: 'DELETE',
      headers: {
        "Authorization": "Bearer " + token['token']
      },
    })
    .then(navigate('/home')
    )
    .then((data) => {

   
      

      // once a host always a host 


    })
      .catch((error) => {
        // Handle error
      });}
      return (
    <div>
        <Button variant='danger' onClick={handleShowModal} size='sm'> Delete Property </Button>
        {/* <button className="btn btn-outline-secondary col-md-4 offset-md-3 m-2" onClick={handleShowModal}>Delete Property</button> */}


        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold mb-2 text-uppercase">Confirmation Box</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>Are you sure you want to delete this property?</h3>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleSubmit}>Yes</Button>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
    </div>
  );

  };

  

export default DeleteProp;
