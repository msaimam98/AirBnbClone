import React, {useState, useEffect, useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';
import { FaUserAlt, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../Sidebar/sidebarstyle.css';
import Collapse from 'react-bootstrap/Collapse';
import Accordion from 'react-bootstrap/Accordion';
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from 'react-pro-sidebar';
import AuthContext from '../../context';



const CustomSidebar = (props) => {
    const {collapsed, setCollapsed} = props.collapseStatus
    const {collapseSidebar, toggleSidebar} = useProSidebar()
    const {isHost, setIsHost} = useContext(AuthContext);

    const handleResize = () => {
        // console.log(window.innerWidth, 'this is the width of the viewport')
        if (window.innerWidth < 910) {
            console.log('value of collapsed when width < 460',collapsed)
            if (!collapsed) { // if not collapsed, collapse it and update its state
                collapseSidebar(false) //only closes
                setCollapsed(true)

            }
            else {
                collapseSidebar(true) //only opens 
                setCollapsed(false)
            }
            
        }
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }

    },[])


    return (
            <Sidebar collapsedWidth="0px" className='sidebarcontainer' id='container-sidebar'>
                <Menu className='bg-color h-100' id='sidebar'>
                    <br />
                    <br />
                    <br />
                    <Navbar.Brand className="w-100 m-0">
                        
                        <Nav.Link as={Link} className="fs-2" to="/" >Restify</Nav.Link>
    
                    </Navbar.Brand>
                    <br />
                    <br />
                    <br />
                    <MenuItem className='sidebarstyling'> 
                        <Link className='cheetah w-100 h-100' to="/dashboard/profile"><FaUserAlt/> Profile </Link>
                    </MenuItem>
                    <br />
                    <br />
                    <h4> Your Dashboard </h4>
                    <SubMenu label="Your Orders">
                        <MenuItem ><Link className='cheetah' to="/dashboard/approved" > Approved </Link></MenuItem> 
                        <MenuItem > <Link className='cheetah' to="/dashboard/requested" > Requested </Link></MenuItem>
                        <MenuItem > <Link className='cheetah' to="/dashboard/cancellations" > Cancellations </Link></MenuItem>
                        <MenuItem > <Link className='cheetah' to="/dashboard/completed" > Completed </Link> </MenuItem>
                        <MenuItem > <Link className='cheetah' to="/dashboard/terminated" > Terminated </Link> </MenuItem>
                    </SubMenu>
                    {/* <MenuItem className='hoverit'> <FaBell/> Notifications </MenuItem> */}
                    <br />
                    <MenuItem >
                        <Link className='cheetah' to="/dashboard/notifications"> <FaBell/> Notifications </Link>
                    </MenuItem>
                    <br />
                    <br />
                    <br />



                    
                    {isHost ? (      
                              <> <h4> Host Dashboard </h4>
                            <SubMenu label="Your Listings" className='hoverit'>
                                <MenuItem ><Link className='cheetah' to="/dashboard/host_approved" > Approved </Link></MenuItem> 
                                <MenuItem > <Link className='cheetah' to="/dashboard/host_requested" > Requested </Link></MenuItem>
                                <MenuItem > <Link className='cheetah' to="/dashboard/host_cancellations" > Cancellations </Link></MenuItem>
                                <MenuItem > <Link className='cheetah' to="/dashboard/host_completed" > Completed </Link> </MenuItem>
                                <MenuItem > <Link className='cheetah' to="/dashboard/host_terminated" > Terminated </Link> </MenuItem>
                                <MenuItem > <Link className='cheetah' to="/dashboard/host_all_listings" > All Listings </Link> </MenuItem>
                            </SubMenu> </>

                    ) : (
                        <div></div>
                    )}
                </Menu>
            </Sidebar>

        
        

  );
};

export default CustomSidebar;

{/* <div className="sidebar-wrapper">
<Navbar classNameName="sidebar" expand="lg">
    <Navbar.Brand>
        <Nav.Link to="../index.html">Restify</Nav.Link>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav">
        <BsList />
    </Navbar.Toggle>
    <Navbar.Collapse id="basic-navbar-nav">
        <Nav classNameName="flex-column">
            <h4 classNameName="smallheader">Your Dashboard</h4>
            <Nav.Item>
                <Nav.Link to="../Profile_pageBoth/ProfilePageDashboard.html">
                    <FaUserAlt /> Profile
                </Nav.Link>
            </Nav.Item>
            <NavDropdown title="Your Orders" id="basic-nav-dropdown">
                <NavDropdown.Item href="#">Approved</NavDropdown.Item>
                <NavDropdown.Item href="../Your_OrdersUser/UserRequested.html">Requested</NavDropdown.Item>
                <NavDropdown.Item href="../Your_OrdersUser/UserCancellations.html">Cancellations</NavDropdown.Item>
                <NavDropdown.Item href="../Your_OrdersUser/UserCompleted.html">Completed</NavDropdown.Item>
                <NavDropdown.Item href="../Your_OrdersUser/UserTerminated.html">Terminated</NavDropdown.Item>
            </NavDropdown>
            <Nav.Item>
                <Nav.Link to="../NotificationsBoth/notifications.html">
                    <FaBell />Notifications
                </Nav.Link>
            </Nav.Item>
            <h4 classNameName="smallheader">Host Dashboard</h4>
            <NavDropdown title="Your Listings" id="basic-nav-dropdown">
                <NavDropdown.Item href="../Your_ListingsHost/HostRequests.html">Requests</NavDropdown.Item>
                <NavDropdown.Item href="../Your_ListingsHost/HostCancellations.html">Approved</NavDropdown.Item>
                <NavDropdown.Item href="../Your_ListingsHost/HostCancellations.html">Cancellations</NavDropdown.Item>
                <NavDropdown.Item href="../Your_ListingsHost/HostCompleted.html">Completed</NavDropdown.Item>
                <NavDropdown.Item href="../Your_ListingsHost/HostTerminated.html">Terminated</NavDropdown.Item>
                <NavDropdown.Item href="../Your_ListingsHost/AllListings.html">All Listings</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    </Navbar.Collapse>
</Navbar>
</div> */}


        {/* <nav id="sidebar">
            <div className="sidebar-header">
                <h3><a href="../index.html">Restify</a></h3>
            </div>
            <br />
            <ul className="list-unstyled components">
                <h4 className="smallheader">Your Dashboard</h4>
                <li>
                    <a href="../Profile_pageBoth/ProfilePageDashboard.html">Profile</a>
                </li>
                <li>
                    <a href="#homeSubmenu" data-toggle="collapse" data-bs-toggle="collapse" aria-expanded="true" className="dropdown-toggle">Your Orders</a>
                    <ul className="collapse list-unstyled" id="homeSubmenu">
                        <li className="active">
                            <a href="#">Approved</a>
                        </li>
                        <li>
                            <a href="../Your_OrdersUser/UserRequested.html">Requested</a>
                        </li>
                        <li>
                            <a href="../Your_OrdersUser/UserCancellations.html">Cancellations</a>
                        </li>
                        <li>
                            <a href="../Your_OrdersUser/UserCompleted.html">Completed</a>
                        </li>
                        <li>
                            <a href="../Your_OrdersUser/UserTerminated.html">Terminated</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="../NotificationsBoth/notifications.html">Notifications</a>
                </li>
                <br />
                <br />
                <h4 className="smallheader">Host Dashboard</h4>
                <li>
                    <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Your Listings</a>
                    <ul className="collapse list-unstyled" id="pageSubmenu">
                        <li>
                            <a href="../Your_ListingsHost/HostRequests.html">Requests</a>
                        </li>
                        <li>
                            <a href="../Your_ListingsHost/HostCancellations.html">Approved</a>
                        </li>
                        <li>
                            <a href="../Your_ListingsHost/HostCancellations.html">Cancellations</a>
                        </li>
                        <li>
                            <a href="../Your_ListingsHost/HostCompleted.html">Completed</a>
                        </li>
                        <li>
                            <a href="../Your_ListingsHost/HostTerminated.html">Terminated</a>
                        </li>
                        <li>
                            <a href="../Your_ListingsHost/AllListings.html">All Listings</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
        <script>
            

        </script> </> */}

    //     <Navbar id="sidebar" expand="lg" className="flex-wrap">
    //     <Navbar.Brand className="w-100 m-0">
    //         <Nav.Link className="fs-2" to="../index.html">Restify</Nav.Link>
    //     </Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav">
    //         <BsList />
    //     </Navbar.Toggle>
    //     <br />
    //     <br />
    //     <br />
    //     <Navbar.Collapse className='align-items-stretch w-100' id="basic-navbar-nav">
    //         <Nav className="flex-column w-100 m-0">
    //             <h4 className="smallheader">Your Dashboard</h4>
    //             <Nav.Item>
    //                 <Nav.Link to="../Profile_pageBoth/ProfilePageDashboard.html">
    //                     Profile
    //                 </Nav.Link>
    //             </Nav.Item>
    //             <Accordion id="the-accordion">
    //                 <Accordion.Header id='dropdown-header'>Your Orders</Accordion.Header>
    //                 <Accordion.Body className='p-0'>
    //                     <Nav.Link href="#">Approved</Nav.Link>
    //                     <Nav.Link href="../Your_OrdersUser/UserRequested.html">Requested</Nav.Link>
    //                     <Nav.Link href="../Your_OrdersUser/UserCancellations.html">Cancellations</Nav.Link>
    //                     <Nav.Link href="../Your_OrdersUser/UserCompleted.html">Completed</Nav.Link>
    //                     <Nav.Link href="../Your_OrdersUser/UserTerminated.html">Terminated</Nav.Link>
    //                 </Accordion.Body>
    //             </Accordion>
                
    //             <Nav.Item>
    //                 <Nav.Link to="../NotificationsBoth/notifications.html">
    //                     Notifications
    //                 </Nav.Link>
    //             </Nav.Item>
    //             <br />
    //             <br />
    //             <br />
    //             <h4 className="smallheader">Host Dashboard</h4>
    //             <Accordion id="the-accordion">
    //                 <Accordion.Header id='dropdown-header'>Your Listings</Accordion.Header>
    //                 <Accordion.Body className='p-0'>
    //                     <Nav.Link href="../Your_ListingsHost/HostRequests.html">Requests</Nav.Link>
    //                     <Nav.Link href="../Your_ListingsHost/HostCancellations.html">Approved</Nav.Link>
    //                     <Nav.Link href="../Your_ListingsHost/HostCancellations.html">Cancellations</Nav.Link>
    //                     <Nav.Link href="../Your_ListingsHost/HostCompleted.html">Completed</Nav.Link>
    //                     <Nav.Link href="../Your_ListingsHost/HostTerminated.html">Terminated</Nav.Link>
    //                     <Nav.Link href="../Your_ListingsHost/AllListings.html">All Listings</Nav.Link>
    //                 </Accordion.Body>
    //             </Accordion>
    //         </Nav>
    //     </Navbar.Collapse>
    // </Navbar>
