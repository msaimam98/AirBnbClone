// css 
import "../signup/signupstyles.css";


// imports 
import { useState, useEffect, useContext, React } from 'react';
import { Form, Button } from 'react-bootstrap';
import AuthContext from "../../context";
// import API from '../API/apiservice';
import { useNavigate, Link} from 'react-router-dom';

function LogIn() {
  const { isloggedin, setIsloggedin, setToken } = useContext(AuthContext);
  const [formDataLogin, setFormDataLogin ] = useState({
    username : "",
    password : ""
  })

  let navigate = useNavigate()




  const handleSubmit = (event) => {
    event.preventDefault();
    // Send formDataLogin to backend API via POST request
    fetch("http://localhost:8000/webpages/login/", {
      method: "POST",
      body: JSON.stringify(formDataLogin),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'this is from loggedin')
        setIsloggedin(true);
        setToken('token', data.token)
        navigate("/")
        


      })
      .catch((error) => console.error(error));
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormDataLogin(values => ({
        ...values,
        [name]: value 
    }))


  }


  return (
    <div className="myform">
        <p>{isloggedin.toString()}</p>
        <h4>Please Log In here!</h4>
        <Form onSubmit={handleSubmit} className="p-5 form2" >
            <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter Username"
                value={formDataLogin.username}
                onChange={handleChange}
                name="username"
                />
            </Form.Group>
            <br />
            <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                type="password"
                placeholder="Enter password"
                value={formDataLogin.password}
                onChange={handleChange}
                name="password"
                />
            </Form.Group>
            <br />

            <Button variant="primary" type="submit">
                Log In
            </Button>
            <br />
            <p>Dont have an account? <Link to="/signup"> Sign Up!</Link></p>

        </Form>
        <div></div>
    </div>
  );
}

export default LogIn;
