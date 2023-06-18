import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
// import API from '../API/apiservice'; // need this to sign the user up 
import "./signupstyles.css"
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [formData, setFormData] = useState({
        username: "", 
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirmPassword: "",
      });

    let navigate = useNavigate();

    const handleSubmit = (event) => {
      event.preventDefault();
      // Send formData to backend API via POST request
      fetch("http://localhost:8000/webpages/signup/", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          navigate('/login')
        })
        .catch((error) => console.error(error));
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({
        ...values,
        [name]: value 
    }))


  }

  useEffect(() => {
    // Code to run after form data changes
    console.log(formData, 'this is the formdata');
  }, [formData]);


  return (
    <div className="myform">
        <h4>Please Sign Up here!</h4>
        <Form onSubmit={handleSubmit} className="p-5 form2" >
            <Form.Group controlId="formusername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
                name="username"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formfirst_name">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
                name="first_name"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formlast_name">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
                name="last_name"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formphone_number">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone_number}
                onChange={handleChange}
                name="phone_number"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                name="password"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                />
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
                Sign Up
            </Button>
        </Form>
        <div></div>
    </div>
  );
}

export default Signup;
