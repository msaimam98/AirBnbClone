import { useContext, React, useEffect } from 'react';
// import { Link, Route, BrowserRouter as Router } from 'react-router-dom'
import "./navbarstyle.css"

import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap'
import { BiHomeHeart, BiBell } from 'react-icons/bi';
import LogIn from '../login';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context';
import API from '../API/apiservice';


{/* <Nav.Link as={Link} className="navbar-background" to="login">Log In</Nav.Link> */}

const NavbarSO = () => {
    const { isloggedin, setIsloggedin, isHost, setIsHost, removeCookie, token } = useContext(AuthContext);
    let navigate = useNavigate()

    // useEffect(() => {
    //     console.log("Is user logged in", isloggedin);
        
    // }, [isloggedin]);

    const LogOut = () => {
        removeCookie('token')
        setIsHost(false)
        setIsloggedin(false)
        navigate('/')
    }

    useEffect(() => {
   
        if (token['token'] === undefined) {
            setIsloggedin(false)
        }
        else {
            setIsloggedin(true)
            fetch("http://localhost:8000/webpages/properties/all/", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization" : "Bearer " + token['token']
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log(data, 'this comes from the properties');
                  if (data.results.length > 0) {
                    setIsHost(true)
                  }
                  else {
                    setIsHost(false)
                  }
          
          
                })
                .catch((error) => console.error(error));
        }
        

    }, []);



    
    return (

    <Navbar variant="dark" expand="lg" className='w-100'>
      
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <BiHomeHeart id="nav-house-icon" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarNavDropdown" />
                <Navbar.Collapse id="navbarNavDropdown">
                    <Nav className="me-auto">
                        
                    {isHost ? (
                        <Nav.Link className="navbar-background" as={Link} to="/dashboard/host_all_listings">My Listings</Nav.Link>
                    ) : 
                    ( isloggedin ? (
                        <Nav.Link as={Link} className="navbar-background" to="/property_register">Become a Host!</Nav.Link>
                    ) :
                    ( 
                        <Nav.Link as={Link} className="navbar-background" to="/signup">Become a Host!</Nav.Link>
                    )
                    )}
                    

                    {isloggedin ? (
                        <Nav.Link className="navbar-background" as={Link} to='/dashboard/approved' >My Reservations</Nav.Link>
                    ) : 
                    (
                        <div></div>
                    )}

                    </Nav>  
                    


                    <Nav className="right-nav">
                        {isloggedin ? (
                            <Nav.Item>
                                <Nav.Link className="navbar-background notif-link" data-bs-toggle="modal" data-bs-target="#modal-notif" as={Link} to='/dashboard/notifications'> {/* send this to notifications */}
                                    <BiBell className="navbar-background" />
                                    <span className="badge-notification badge navbar-background" id="badge-notification">{4}</span>
                                </Nav.Link>
                            </Nav.Item>
                        ) :
                        (
                            <div></div>
                        )}
                        <Nav.Item>
                            {isloggedin ? (
                            <NavDropdown bg="primary" title="username" id="navbarDropdownMenuLink" className="navbar-background">
                                <NavDropdown.Item as={Link} to='/dashboard/profile' >View Profile</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/property_register">Create Listing</NavDropdown.Item>
                                {/* <NavDropdown.Item as={Link} to="/dashboard/approved" >View Reservations</NavDropdown.Item> */}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={LogOut}>Log Out</NavDropdown.Item>
                            </NavDropdown>
                            ) : 
                            (
                            <Nav.Link as={Link} className="navbar-background" to="/login">Log In</Nav.Link>
                            )}
                            
                        </Nav.Item>
                        <Nav.Item>
                            {isloggedin ? (
                                <div></div>
                            ) :
                            <Nav.Link as={Link} className="navbar-background" to="/signup">Sign Up!</Nav.Link>
                            }
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>

    </Navbar>





    )

}



export default NavbarSO