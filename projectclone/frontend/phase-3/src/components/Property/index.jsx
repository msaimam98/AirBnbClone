import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import API from '../API/apiservice';

import { useNavigate } from 'react-router-dom';

function Create_property() {
  
    const [formData, setFormData] = useState({
        address: "",
        number_of_guest: 0,
        number_of_bed: 0,
        number_of_rooms: 0,
        baths: 0,
        description: "",
        essentials: "",
        features: "",
        location: "",
        safety_features: "",
      });

    let navigate = useNavigate();

    const handleSubmit = (event) => {
      event.preventDefault();
      // Send formData to backend API via POST request
      const {
        address,
        number_of_guest,
        number_of_bed,
        number_of_rooms,
        baths,
        description,
        essentials,
        features,
        location,
        safety_features,
      } = formData;
      const queryParams = `?address=${address}&number_of_guest=${number_of_guest}&number_of_bed=${number_of_bed}&number_of_rooms=${number_of_rooms}&baths=${baths}&description=${description}&essentials=${essentials}&features=${features}&location=${location}&safety_features=${safety_features}`;
      fetch(`http://localhost:8000/webpages/property/add/${queryParams}`,{
        method: "POST",
        body: FormData,
        headers: {
          "Content-Type": "application/json",
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem('token')
        },
      })
        .then((response) => response.json())
        .then((data) => {

        })
        .catch((error) => console.error(error));
  };


  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

  if (type === 'checkbox' ) {
    // Handle amenities checkbox inputs
    if (checked){
      if (formData[name] === ""){
        setFormData({
          ...formData,
          [name]: value

        });
      }
      else{
        setFormData({
          ...formData,
          [name]: formData[name]+","+value

        });
        
      }
    }
    else{
      var ns;
      if (formData[name].includes(","+value)){
          ns = formData[name].replace(","+value, "");
      }
      else if(formData[name].includes(value+",")){
        ns = formData[name].replace(value+",", "");
      }
      else if(formData[name].includes(value)){
        ns = formData[name].replace(value, "");
      }
      
      setFormData({
        ...formData,
        [name]: ns

      });
    }
    
  } else {
    // Handle other form inputs
    setFormData({
      ...formData,
      [name]: value
    });
  }
};


  

  useEffect(() => {
    // Code to run after form data changes
    console.log(formData, 'this is the formdata');
  }, [formData]);


  return (
    <div className="myform">
        <h4>REGISTER YOUR PROPERTY!</h4>
        <Form onSubmit={handleSubmit} className="p-5 form2" >
            <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                name="address"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formNum_guest">
                <Form.Label>Guest Number</Form.Label>
                <Form.Control
                type="number"
                value={formData.number_of_guest}
                onChange={handleChange}
                name="number_of_guest"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formNum_room">
                <Form.Label>Bed Room Number</Form.Label>
                <Form.Control
                type="number"
                value={formData.number_of_rooms }
                onChange={handleChange}
                name="number_of_rooms"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formBed">
                <Form.Label>Bed Number</Form.Label>
                <Form.Control
                type="number"
                value={formData.number_of_bed}
                onChange={handleChange}
                name="number_of_bed"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formBaths">
                <Form.Label>Bath Room Number</Form.Label>
                <Form.Control
                type="number"
                value={formData.baths}
                onChange={handleChange}
                name="baths"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formEssentials">
              <Form.Label>Essentials</Form.Label>
              <div>
                <Form.Check name="essentials" type="checkbox" label="Pool" value="pool" onChange={handleChange} />
                <Form.Check name="essentials" type="checkbox" label="Hot Tub" value="hot_tub" onChange={handleChange} />
                <Form.Check name="essentials" type="checkbox" label="Patio" value="patio" onChange={handleChange} />
                <Form.Check name="essentials" type="checkbox" label="Grill" value="grill" onChange={handleChange} />
                <Form.Check name="essentials" type="checkbox" label="Gym" value="gym" onChange={handleChange} />
                <Form.Check name="essentials" type="checkbox" label="Piano" value="fire_pit" onChange={handleChange} />
                <Form.Check name="essentials" type="checkbox" label="Fire Pit" value="washer" onChange={handleChange} />
                <Form.Check name="essentials" type="checkbox" label="Outdoor Shower" value="outdoor_shower" onChange={handleChange} />


                
              </div>
            </Form.Group>
            <br />
            <Form.Group controlId="formFeatures">
              <Form.Label>Features</Form.Label>
              <div>
                <Form.Check type="checkbox" name="features" label="WiFi" value="wifi" onChange={handleChange} />
                <Form.Check type="checkbox" name="features" label="TV" value="tv" onChange={handleChange} />
                <Form.Check type="checkbox" name="features" label="Kitchen" value="kitchen" onChange={handleChange} />
                <Form.Check type="checkbox" name="features" label="Workspace" value="workspace" onChange={handleChange} />
                <Form.Check type="checkbox" name="features" label="Air Conditioning" value="air_conditioning" onChange={handleChange} />
                <Form.Check type="checkbox" name="features" label="Heating" value="heating" onChange={handleChange} />
                <Form.Check type="checkbox" name="features" label="Washer" value="washer" onChange={handleChange} />
                <Form.Check type="checkbox" name="features" label="Dryer" value="dryer" onChange={handleChange} />
                
              </div>
            </Form.Group>

            <br />
            <Form.Group controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <div>
                <Form.Check type="checkbox" name="location" label="Lake Access" value="lake_access" onChange={handleChange} />
                <Form.Check type="checkbox" name="location" label="Beach Access" value="beach_access" onChange={handleChange} />
                <Form.Check type="checkbox" name="location" label="Ski-in/Ski-out" value="skiin_skiout'" onChange={handleChange} />
              </div>
            </Form.Group>
            <br />
            <Form.Group controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <div>
                <Form.Check type="checkbox" label="Lake Access" value="lake_access" onChange={handleChange} />
                <Form.Check type="checkbox" label="Beach Access" value="beach_access" onChange={handleChange} />
                <Form.Check type="checkbox" label="Ski-in/Ski-out" value="skiin_skiout'" onChange={handleChange} />
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
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                name="description"
              />
            <br />
            
            </Form.Group>

            
            <Button variant="primary" type="submit">
                Register Your Property Infomartion!
            </Button>
        </Form>
        <div></div>
    </div>
  );
}

export default Create_property;
