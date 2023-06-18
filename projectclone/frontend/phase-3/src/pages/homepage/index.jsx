import React, { useState, useEffect, useContext } from 'react'
import { InputGroup, Form, Button } from 'react-bootstrap'
// import FilterForm from "../../components/Filter-input"
import { Modal, Container } from 'react-bootstrap';
import NavbarSO from '../../components/Navbar/'
import CardComponentH from '../../components/Card/HomePageCard/'
import './style.css'
import SearchBar from '../../components/Inputs/SearchBar'
import AuthContext from '../../context'
import { useNavigate } from 'react-router-dom';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
const HomePage = () => {
  let navigate = useNavigate();
  const {setIsloggedin, token} = useContext(AuthContext)
  const [start, setStart] = useState(getToday())
  const [end, setEnd] = useState(getToday())
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  const [result, setResult] = useState([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(6)

  const [activeItem, setActiveItem] = useState("Post time: from earliest");
  const handleNextPage = () => { setPage(page + 1) }
  const handlePrevPage = () => { setPage(page - 1) }


  const [FilterformData, setFormData] = useState({
    price_per_night: 100,
    number_of_bed: 0,
    number_of_rooms: 0,
    baths: 0,
    essentials: "",
    features: "",
    location: "",
    safety_features: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [renderFlag, setRenderFlag] = useState(true);

  


  const [address, setLocation] = useState('')
  const [numGuest, setNumGuest] = useState(0)

  const [invalid, setInvalid] = useState(false)

  function handleShowModal() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }
  


  // this is an authenticated view I am calling 
  useEffect(() => {
    setResult([]);
    console.log(token['token'])
    console.log(token['token'] === undefined)
    if (token['token'] === undefined) {
      setIsloggedin(false)
    }
    else {
      setIsloggedin(true)
    }}
  , []);



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

  

  const onSearch = () => {
    if(!address || numGuest < 1) {
      setInvalid(true)
    } else {
      setInvalid(false)
      handleSearch()
    }
  }

  const handleSearch = (event) => {
    setActiveItem('Post time: from earliest');
    console.log('http://localhost:8000/webpages/property/search/?location='+address+'&start_date='+start+'&end_date='+end+'&number_of_guest='+numGuest)
    fetch('http://localhost:8000/webpages/property/search/?location='+address+'&start_date='+start+'&end_date='+end+'&number_of_guest='+numGuest, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      setResult(data);
      console.log( result);
    })
    .catch(error => {
      console.log(error);
    });
  }


  const handlePriceAsc = (event) => {
    setActiveItem('Price: Ascending');

    
    setResult(result.sort((a, b) => (a.price_per_night > b.price_per_night) ? 1 : -1))

    setRenderFlag(!renderFlag);
    
  }

  const handlePriceDes = (event) => {
    setActiveItem('Price:  Descending');
    
    setResult(result.sort((a, b) => (a.price_per_night < b.price_per_night) ? 1 : -1));
    setRenderFlag(!renderFlag);

    
  }

  const handlePostAsc = (event) => {
    
    setActiveItem('Post time: from most recent');
    setResult(result.sort((a, b) => (a.id< b.id) ? 1 : -1))

    setRenderFlag(!renderFlag);
    
  }

  const handlePostDes = (event) => {
    setActiveItem('Post time: from earliest');
    
    setResult(result.sort((a, b) => (a.id> b.id) ? 1 : -1));
    setRenderFlag(!renderFlag);

    
  }


  const handleFilter = (event) => {
    setShowModal(false);
    setActiveItem('Post time: from earliest');
    setPage(1)

    //price_per_night, number_of_rooms, number_of_bed, baths, essentials, features, safety_features, location
  // For filter
  console.log(result);
    console.log('http://localhost:8000/webpages/property/filter/?price_per_night='+FilterformData.price_per_night+'&number_of_rooms='+FilterformData.number_of_rooms+'&number_of_bed='+FilterformData.number_of_bed+'&baths='+FilterformData.baths+'&essentials='+FilterformData.essentials+'&features='+FilterformData.features+'&safety_features='+FilterformData.safety_features+'&location='+FilterformData.location +'&address='+address+'&start_date='+start+'&end_date='+end+'&number_of_guest='+numGuest);
  fetch('http://localhost:8000/webpages/property/filter/?price_per_night='+FilterformData.price_per_night+'&number_of_rooms='+FilterformData.number_of_rooms+'&number_of_bed='+FilterformData.number_of_bed+'&baths='+FilterformData.baths+'&essentials='+FilterformData.essentials+'&features='+FilterformData.features+'&safety_features='+FilterformData.safety_features+'&location='+FilterformData.location +'&address='+address+'&start_date='+start+'&end_date='+end+'&number_of_guest='+numGuest,{
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },

    })
    .then((response) => response.json())
    .then((data) => {
      setResult(data);
      console.log( result);
      setFormData({
        price_per_night: 1000,
        number_of_bed: 0,
        number_of_rooms: 0,
        baths: 0,
        essentials: "",
        features: "",
        location: "",
        safety_features: "",
      });

    })
    .catch(error => {
      console.log(error);
    });
  }
  




const handleChange = (event) => {
  const { name, value, type, checked } = event.target;

if (type === 'checkbox' ) {
  // Handle amenities checkbox inputs
  if (checked){
    if (FilterformData[name] === ""){
      setFormData({
        ...FilterformData,
        [name]: value

      });
    }
    else{
      setFormData({
        ...FilterformData,
        [name]: FilterformData[name]+","+value

      });
      
    }
  }
  
  else{
    var ns;
    if (FilterformData[name].includes(","+value)){
        ns = FilterformData[name].replace(","+value, "");
    }
    else if(FilterformData[name].includes(value+",")){
      ns = FilterformData[name].replace(value+",", "");
    }
    else if(FilterformData[name].includes(value)){
      ns = FilterformData[name].replace(value, "");
    }
    
    setFormData({
      ...FilterformData,
      [name]: ns

    });
  }}
  else if (type === 'number') {
    // Handle number inputs
    setFormData({
      ...FilterformData,
      [name]: parseFloat(value)
    });
  } }
  const totalPages = Math.max(Math.ceil(result.length / pagination), 1) ;
  console.log(result.length)
  console.log(totalPages)
  return (
    <div  className='page-container'>
        <div className='content-wrap'>
          <NavbarSO />

          <div className='wrapper2'>
            <SearchBar
              setLocation={ setLocation }
              setStart={ setStart }
              setEnd={ setEnd }
              setNumGuest={ setNumGuest }
              onSearch={ onSearch }
              invalid={ invalid }
            />
            
          </div>
          
          <button className="btn btn-outline-secondary col-md-4 offset-md-3 mt-3" onClick={handleShowModal}>Filter</button>
          <div className="row sort-btn-container" style={{ position: "absolute",  right: "calc(20vh )" , transform: "translateY(-30px)", zIndex: 999}}>
        <DropdownButton id="dropdown-basic-button" title={"Sort"}>
          <Dropdown.Item onClick={handlePostAsc} active={activeItem === 'Post time: from most recent'}>
            <i className="bi bi-star-fill" id="sort-option1" ></i> Post time: from most recent
          </Dropdown.Item>
          <Dropdown.Item onClick={handlePostDes} active={activeItem === 'Post time: from earliest'}>
            <i className="bi bi-star-fill" id="sort-option2"></i> Post time: from earliest 
          </Dropdown.Item>
          <Dropdown.Item onClick={handlePriceAsc} active={activeItem === 'Price: Ascending'}>

              <i className="bi bi-currency-dollar" id="sort-option3"></i> Price: Ascending

          </Dropdown.Item>
          <Dropdown.Item onClick={handlePriceDes} active={activeItem === 'Price: Descending'}>

              <i className="bi bi-currency-dollar" id="sort-option4"></i> Price: Descending

          </Dropdown.Item>
        </DropdownButton>
        </div>
        <br />

        <br />
          <div className='row   m-4'>
          {(result.slice((page-1)*pagination, page*pagination)).map(r => (
            <div key={r.id} className="col-md-4">
              <CardComponentH property_id={r.property} price={r.price_per_night}/>

            
            </div>
          ))}
          </div>
          

          



          <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title className="fw-bold mb-2 text-uppercase">Filter</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <div className="myform">
            <h4>Happy Filtering</h4>
            <Form  className="p-5 form2" >
                <Form.Group controlId="formPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                    type="number"
                    value={FilterformData.price_per_night}
                    onChange={handleChange}
                    name="price_per_night"

                    />
                </Form.Group>

                <br />
                <Form.Group controlId="formNum_room">
                    <Form.Label>Bed Room Number</Form.Label>
                    <Form.Control
                    type="number"
                    value={FilterformData.number_of_rooms }
                    onChange={handleChange}
                    name="number_of_rooms"
                    />
                </Form.Group>
                <br />
                <Form.Group controlId="formBed">
                    <Form.Label>Bed Number</Form.Label>
                    <Form.Control
                    type="number"
                    value={FilterformData.number_of_bed}
                    onChange={handleChange}
                    name="number_of_bed"
                    />
                </Form.Group>
                <br />
                <Form.Group controlId="formBaths">
                    <Form.Label>Bath Room Number</Form.Label>
                    <Form.Control
                    type="number"
                    value={FilterformData.baths}
                    onChange={handleChange}
                    name="baths"
                    />
                </Form.Group>
                <br />
                <Form.Group controlId="formEssentials">
                  <Form.Label>Features</Form.Label>
                  <div>
                    <Form.Check name="features" type="checkbox" label="Pool" value="pool" onChange={handleChange} />
                    <Form.Check name="features" type="checkbox" label="Hot Tub" value="hot_tub" onChange={handleChange} />
                    <Form.Check name="features" type="checkbox" label="Patio" value="patio" onChange={handleChange} />
                    <Form.Check name="features" type="checkbox" label="Grill" value="grill" onChange={handleChange} />
                    <Form.Check name="features" type="checkbox" label="Gym" value="gym" onChange={handleChange} />
                    <Form.Check name="features" type="checkbox" label="Piano" value="piano" onChange={handleChange} />
                    <Form.Check name="features" type="checkbox" label="Fire Pit" value="fire_pit" onChange={handleChange} />
                    <Form.Check name="features" type="checkbox" label="Outdoor Shower" value="outdoor_shower" onChange={handleChange} />


                    
        </div>
                </Form.Group>
                <br />
                <Form.Group controlId="formFeatures">
                  <Form.Label>Essentials</Form.Label>
                  <div>
                    <Form.Check type="checkbox" name="essentials" label="WiFi" value="wifi" onChange={handleChange} />
                    <Form.Check type="checkbox" name="essentials"  label="TV" value="tv" onChange={handleChange} />
                    <Form.Check type="checkbox" name="essentials" label="Kitchen" value="kitchen" onChange={handleChange} />
                    <Form.Check type="checkbox" name="essentials" label="Workspace" value="workspace" onChange={handleChange} />
                    <Form.Check type="checkbox" name="essentials" label="Air Conditioning" value="air_conditioning" onChange={handleChange} />
                    <Form.Check type="checkbox" name="essentials" label="Heating" value="heating" onChange={handleChange} />
                    <Form.Check type="checkbox" name="essentials" label="Washer" value="washer" onChange={handleChange} />
                    <Form.Check type="checkbox" name="essentials"  label="Dryer" value="dryer" onChange={handleChange} />
                    
                  </div>
                </Form.Group>

                <br />
                <Form.Group controlId="formLocation">
                  <Form.Label>Location</Form.Label>
                  <div>
                    <Form.Check type="checkbox" name="location" label="Lake Access" value="lake_access" onChange={handleChange} />
                    <Form.Check type="checkbox" name="location" label="Beach Access" value="beach_access" onChange={handleChange} />
                    <Form.Check type="checkbox" name="location" label="Ski-in/Ski-out" value="skiin_skiout" onChange={handleChange} />
                  </div>
                </Form.Group>
                <br />

                <Form.Group controlId="formSafety_features">
                  <Form.Label>Safety Features</Form.Label>
                  <div>
                    <Form.Check type="checkbox" name="safety_features" label="Smoke Detector" value="smoke_detector" onChange={handleChange} />
                    <Form.Check type="checkbox" name="safety_features" label="First Aid Kit" value="first_aid_kit" onChange={handleChange} />
                    <Form.Check type="checkbox" name="safety_features" label="Fire Extinguisher" value="fire_extinguisher" onChange={handleChange} />
                  </div>

                </Form.Group>
                <br />


                
                <Button variant="primary"  onClick={handleFilter}>
                    Go Filter!
                </Button>
            </Form>
            <div></div>
        </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
              </Modal.Footer>
            </Modal>
          
        </div>

      <div className='row footer'>
      <div className='col-auto offset-5'>
          <Button 
            variant='outline-secondary'
            size='sm'
            className='rounded-circle'
            onClick={ () => handlePrevPage() }
            disabled={ page === 1 ? true : false }
          >
            <BsArrowLeft/>
          </Button>
        </div>
        <div className='col-auto offset-1'>
          <Button 
            variant='outline-secondary'
            size='sm'
            className='rounded-circle'
            onClick={ () => handleNextPage() }
            disabled={ page === totalPages ? true : false }
          >
            <BsArrowRight/>
          </Button>
        </div>

      </div>
      </div>
    

  )
}

export default HomePage

