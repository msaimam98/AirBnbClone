import { React, useState, useContext} from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context';

import './prop_register.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// import { BsTextarea } from 'react-icons/bs';
// import { DateRangePicker } from 'rsuite';
// import AvailableDatePicker from '../date-range';


const PropertyRegisterForm = () => {
    let navigate = useNavigate();
    const { setIsHost, token} = useContext(AuthContext);
    const [guestNum, setGuestNum] = useState(0);
    const [bedroomNum, setBedroomNum] = useState(0);
    const [bathroomNum, setBathroomNum] = useState(0);
    const [bedNum, setBedNum] = useState(0);

    // Amenities
    const [essentials, setEssentials] = useState([]);
    const handleEssentialsChange = (name, isChecked) => {
        if (isChecked) {
            setPropertyFormData((prevState) => ({
                ...prevState,
                essentials: [...prevState.essentials, name]
              }));



        } else {
          setPropertyFormData((prevState) => ({
            ...prevState,
            essentials: prevState.essentials.filter((item) => item !== name)
            }));
        }
      };

    const [features, setFeatures] = useState([]);
    const handleFeaturesChange = (name, isChecked) => {
        if (isChecked) {
            setPropertyFormData((prevState) => ({
                ...prevState,
                features: [...prevState.features, name]
            }));



            
        } else {
            setPropertyFormData((prevState) => ({
                ...prevState,
                features: prevState.features.filter((item) => item !== name)
            }));
        }
      };

    const [safetyFeatures, setsafetyFeatures] = useState([]);
    const handleSafetyFeaturesChange = (name, isChecked) => {
        if (isChecked) {
            setPropertyFormData((prevState) => ({
                ...prevState,
                safety_features: [...prevState.safety_features, name]
            }));
          



        } else {
            setPropertyFormData((prevState) => ({
                ...prevState,
                safety_features: prevState.safety_features.filter((item) => item !== name)
            }));
        }
      };

    const [location, setLocation] = useState([]);
    const handleLocationChange = (name, isChecked) => {
        if (isChecked) {
            setPropertyFormData((prevState) => ({
                ...prevState,
                location: [...prevState.location, name]
            }));
       


        } else {
            setPropertyFormData((prevState) => ({
                ...prevState,
                location: prevState.location.filter((item) => item !== name)
            }));        
        }
      };




    const [propertyFormData, setPropertyFormData] = useState({
        address: "", 
        number_of_guest: 0, 
        number_of_bed: 0,
        number_of_rooms: 0,
        baths: 0,
        description: "",
        essentials: essentials,
        features: features,
        safety_features: safetyFeatures, 
        location: location, 
        slider_images: [],

    })
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setPropertyFormData(values => ({
            ...values,
            [name]: value 
        }))

      }


    // only takes multiple photos if they are added all at once, if added one by one, the current will override the previous one 
    const handleSliderImages = (e) => {
        if (e.target.files) {
            // setPropertyFormData({ ...propertyFormData, slider_images: [...e.target.files] });
            setPropertyFormData((prevState) => ({
                ...prevState,
                slider_images: [...prevState.slider_images, ...e.target.files]
            }));
        }

      };

  
    function incrementGuest() {
        setPropertyFormData({...propertyFormData,  number_of_guest: propertyFormData.number_of_guest + 1})

    }
  
    function decrementGuest() {
        if (propertyFormData.number_of_guest  > 0) {
            setPropertyFormData({...propertyFormData,  number_of_guest: propertyFormData.number_of_guest - 1})
            
        }

    }
  
    function incrementBedroom() {
      setPropertyFormData({...propertyFormData,  number_of_rooms: propertyFormData.number_of_rooms + 1})
    }
  
    function decrementBedroom() {
        if (propertyFormData.number_of_rooms > 0) {
            setPropertyFormData({...propertyFormData,  number_of_rooms: propertyFormData.number_of_rooms - 1})
        }
    }
  
    function incrementBathroom() {
      setPropertyFormData({...propertyFormData,  baths: propertyFormData.baths + 1})
    }
  
    function decrementBathroom() {
        if (propertyFormData.baths> 0) {
            setPropertyFormData({...propertyFormData,  baths: propertyFormData.baths - 1})
        }
    }
  
    function incrementBed() {
      setPropertyFormData({...propertyFormData,  number_of_bed: propertyFormData.number_of_bed + 1})
    }
  
    function decrementBed() {
        if (propertyFormData.number_of_bed  > 0) {
            setPropertyFormData({...propertyFormData,  number_of_bed: propertyFormData.number_of_bed - 1})
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // Send formData to backend API via POST request
        fetch("http://localhost:8000/webpages/property/add/", {
          method: "POST",
          body: JSON.stringify(propertyFormData),
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token['token']
          },
        })
          .then((response) => response.json()
          )
          .then((data) => {
            
            setIsHost(true)
            console.log(data.id);
            console.log("dasdasdasdsad");
            
            navigate('/property_extra_page?property_id=' + data.id) // after creating the property, navigate to the home page 
            // once a host always a host 


          })
          .catch((error) => console.error(error));
    };

  return (
<div id='propertyregister' className='prop'>

    <h2>REGISTER YOUR PROPERTY!</h2>
    <hr />
    <Form onSubmit={handleSubmit} className="p-5">
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">

            <Form.Label>Location :</Form.Label>
            <Form.Control
            placeholder="Please enter your property's location here"
            aria-label="Location"
            aria-describedby="basic-addon1"
            name='address'
            onChange={handleChange}
            />
        </Form.Group>

        <Form.Group className="mb-3">
              <Row>
                <Col md={4}>
                  <Form.Label>Guest Capacity:</Form.Label>
                </Col>
                <Col md={4} className="offset-md-4 incrementer">
                  <Button type="button" variant="outline-primary" className="rounded-pill mx-1 float-start" onClick={decrementGuest}>-</Button>
                  <Form.Control name='number_of_guest' id="GuestInput" type="number" className="float-start mt-1 border-secondary" value={propertyFormData.number_of_guest} readOnly/>
                  <Button type="button" variant="outline-primary" className="rounded-pill mx-1 float-start" onClick={incrementGuest}>+</Button>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Label>Bedrooms:</Form.Label>
                </Col>
                <Col md={4} className="offset-md-4 incrementer">
                  <Button type="button" variant="outline-primary" className="rounded-pill mx-1 float-start" onClick={decrementBedroom}>-</Button>
                  <Form.Control id="GuestInput" name="number_of_rooms" type="number" className="float-start mt-1 border-secondary" value={propertyFormData.number_of_rooms} readOnly />
                  <Button type="button" variant="outline-primary" className="rounded-pill mx-1 float-start" onClick={incrementBedroom}>+</Button>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Label>Bathrooms:</Form.Label>
                </Col>
                <Col md={4} className="offset-md-4 incrementer">
                  <Button type="button" variant="outline-primary" className="rounded-pill mx-1 float-start" onClick={decrementBathroom}>-</Button>
                  <Form.Control name="baths" id="GuestInput" type="number" className="float-start mt-1 border-secondary" value={propertyFormData.baths} readOnly/>
                  <Button type="button" variant="outline-primary" className="rounded-pill mx-1 float-start" onClick={incrementBathroom}>+</Button>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Label>Number of beds:</Form.Label>
                </Col>
                <Col md={4} className="offset-md-4 incrementer">
                  <Button type="button" variant="outline-primary" className="rounded-pill mx-1 float-start" onClick={decrementBed}>-</Button>
                  <Form.Control name="number_of_bed" id="GuestInput" type="number" className="float-start mt-1 border-secondary" value={propertyFormData.number_of_bed} readOnly />
                  <Button type="button" variant="outline-primary" className="rounded-pill mx-1 float-start" onClick={incrementBed}>+</Button>
                </Col>
              </Row>
        </Form.Group>
        <Form.Group className="mb-3">
            <hr className="divider" />
            <Form.Label>
                <h5 className="fw-bold text-uppercase">Amenities: </h5>
            </Form.Label>
            <div className="amenities-title">
                <strong className="text-dark">Essentials</strong>
            </div>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential1"
                        label="Wifi"
                        name='wifi'
                        onChange={(e) => handleEssentialsChange(e.target.name, e.target.checked)}
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential2"
                        label="TV"
                        onChange={(e) => handleEssentialsChange(e.target.name, e.target.checked)}
                        name="tv"
                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential3"
                        label="Kitchen"
                        onChange={(e) => handleEssentialsChange(e.target.name, e.target.checked)}
                        name="kitchen"
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential4"
                        label="Workspace"
                        name='workspace'
                        onChange={(e) => handleEssentialsChange(e.target.name, e.target.checked)}
                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential5"
                        label="Air Conditioning"
                        name='air_conditioning'
                        onChange={(e) => handleEssentialsChange(e.target.name, e.target.checked)}
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential6"
                        label="Heating"
                        name='heating'
                        onChange={(e) => handleEssentialsChange(e.target.name, e.target.checked)}
                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential6"
                        label="Washer"
                        name='washer'
                        onChange={(e) => handleEssentialsChange(e.target.name, e.target.checked)}
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential7"
                        label="Dryer"
                        onChange={(e) => handleEssentialsChange(e.target.name, e.target.checked)}
                        name="dryer"
                    />
                </Col>
            </Row>
        </Form.Group>

            <br />
            <br />
        <Form.Group className="mb-3">
            <div className="amenities-title">
                <strong className="text-dark">Features</strong>
            </div>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential1"
                        label="Pool"
                        name='pool'
                        onChange={(e) => handleFeaturesChange(e.target.name, e.target.checked)}
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential2"
                        label="Hot Tub"
                        onChange={(e) => handleFeaturesChange(e.target.name, e.target.checked)}
                        name="hot_tub"
                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential3"
                        label="Patio"
                        name='patio'
                        onChange={(e) => handleFeaturesChange(e.target.name, e.target.checked)}
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential4"
                        label="Grill"
                        name='grill'
                        onChange={(e) => handleFeaturesChange(e.target.name, e.target.checked)}
                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential5"
                        label="Gym"
                        name='gym'
                        onChange={(e) => handleFeaturesChange(e.target.name, e.target.checked)}
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential6"
                        label="Piano"
                        onChange={(e) => handleFeaturesChange(e.target.name, e.target.checked)}
                        name="piano"
                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential6"
                        label="Fire Pit"
                        name='fire_pit'
                        onChange={(e) => handleFeaturesChange(e.target.name, e.target.checked)}
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential7"
                        label="Outdoor Shower"
                        name='outdoor_shower'
                        onChange={(e) => handleFeaturesChange(e.target.name, e.target.checked)}
                    />
                </Col>
            </Row>
        </Form.Group>
            <br />
            <br />
        <Form.Group className="mb-3">
            <div className="amenities-title">
                <strong className="text-dark">Location benefits</strong>
            </div>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential6"
                        label="Lake Access"
                        name='lake_access'
                        onChange={(e) => handleLocationChange(e.target.name, e.target.checked)}
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential7"
                        label="Beach Access"
                        name="beach_access"
                        onChange={(e) => handleLocationChange(e.target.name, e.target.checked)}
                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential6"
                        label="Ski-in/Ski-out"
                        name='skiin_skiout'
                        onChange={(e) => handleLocationChange(e.target.name, e.target.checked)}
                    />
                </Col>
            </Row>
        </Form.Group>
            <br />
            <br />
        <Form.Group className="mb-3" name="safety_features" >
            <div className="amenities-title">
                <strong className="text-dark">Safety Features</strong>
            </div>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential6"
                        label="Smoke detector"
                        name='smoke_detector'
                        onChange={(e) => handleSafetyFeaturesChange(e.target.name, e.target.checked)}
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential7"
                        label="First Aid Kit"
                        onChange={(e) => handleSafetyFeaturesChange(e.target.name, e.target.checked)}
                        name="first_aid_kit"

                    />
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={4}>
                    <Form.Check
                        className="border-secondary"
                        type="checkbox"
                        id="essential6"
                        label="Fire Extinguisher"
                        onChange={(e) => handleSafetyFeaturesChange(e.target.name, e.target.checked)}
                        name="fire_extinguisher"
                    />
                </Col>
            </Row>
        </Form.Group>


        <hr />
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">

            <Form.Label>Description about the property :</Form.Label>
            <Form.Control
            as="textarea"
            placeholder="Please enter a description of your property here"
            aria-label="Location"
            aria-describedby="basic-addon1"
            name='description'
            onChange={handleChange}
            rows={5}
            />
        </Form.Group>
        

        <Button type='submit'> Register Your Property!</Button>
    </Form>
</div> 
      
    
  )
}

export default PropertyRegisterForm




// onChange={(e) => setBedNum(parseInt(e.target.value) || 0)}
// onChange={(e) => setBathroomNum(parseInt(e.target.value) || 0)}