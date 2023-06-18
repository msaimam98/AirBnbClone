import Add_pic from '../../components/PhotoAdd'
import Display_pic from '../../components/PhotoDisplay'
import Add_Ava from '../../components/Add_available'
import Display_Ava from '../../components/Display_Available'
import NavbarSO from '../../components/Navbar'
import { Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './propertyextrastyle.css'

function Property_extra(props) {
  const searchParams = new URLSearchParams(useLocation().search);
    const id = searchParams.get("property_id");
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [refresh, setRefresh] = useState(0)


  
    function handleShowModal() {
      setShowModal(true);
    }
  
    function handleCloseModal() {
      setShowModal(false);
    }
    function handleShowModal2() {
        setShowModal2(true);
      }
    
      function handleCloseModal2() {
        setShowModal2(false);
      }
      function handleShowModal3() {
        setShowModal3(true);
      }
    
      function handleCloseModal3() {
        setShowModal3(false);
      }
  
    return (
      <>
      <NavbarSO />
      <div>
        <hr className="divider" />
        <h2 className='m-3'>Pictures of Property</h2>
        
        {/* <div className="form-group row m-3">
          <div className="col-md-4">
            <button className="btn btn-outline-primary mt-3" onClick={handleShowModal2}>Add Picture</button>
            
          </div>
          <button className="btn btn-outline-secondary col-md-4 offset-md-3 mt-3" onClick={handleShowModal}>View Uploaded Picture(s)</button>
        </div> */}
        <Row className=''>
          <Col className='styleit1'>
            <Button variant="outline-primary" onClick={handleShowModal2}>Add Picture</Button>
          </Col>
          <Col className='styleit2'>
            <Button variant="outline-secondary" onClick={handleShowModal}>View Uploaded Picture(s)</Button>
          </Col>
          {/* <Button variant="outline-primary" onClick={handleShowModal2}>Add Picture</Button>
          <Button variant="outline-secondary" onClick={handleShowModal}>View Uploaded Picture(s)</Button> */}
        </Row>

        <hr className="divider" />

        <Display_Ava property_id={id} refresh ={{ refresh, setRefresh }}/>
        <Container className="d-flex justify-content-center">
          <Button className='mt-3 mb-3' variant='outline-primary' onClick={handleShowModal3}> Add Available Dates & Price </Button>
          <Button variant='outline-success' className='mt-3 mb-3' onClick={() => {
            navigate('/')
          }}> Done </Button>
        </Container>
      
        
        <Modal show={showModal2} onHide={handleCloseModal2}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold mb-2 text-uppercase">Upload photo!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Add_pic property_id={id} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal2}>Close</Button>
          </Modal.Footer>
        </Modal>
  
        
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold mb-2 text-uppercase">Your Uploaded Photos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Display_pic property_id={id}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModal3} onHide={handleCloseModal3}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold mb-2 text-uppercase">Add Available Dates!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Add_Ava  property_id={id} refresh ={{ setRefresh }}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal3}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
    );
  }
  
  export default Property_extra;