// not used 
import {Button} from 'react-bootstrap';
// import { BsList } from 'react-icons/bs';
// import { FaUserAlt, FaBell } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';

import {React, useContext} from 'react';
import AuthContext from '../../../context';

// css styles 
import '../../dashboard-Content/contentstyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import { useProSidebar } from 'react-pro-sidebar';


const UpperBarDashboard = (props) => {
  const {collapsed, setCollapsed} = props.collapseStatus
  const { isHost } = useContext(AuthContext)
  const { collapseSidebar } = useProSidebar()

  const collapse = () => {
    if (collapsed) {
      collapseSidebar()
      setCollapsed(false)
    }
    else if (!collapsed) {
      collapseSidebar()
      setCollapsed(true)
  }

  }

  return (

        <nav id="upperdashboard" className="navbar navbar-expand-lg navbar-light bg-light upper">
            <div className="container-fluid">
                <Button id="sidebarCollapse" className="btn btn-info" onClick={collapse}>  Toggle Sidebar </Button>
                {isHost ? (
                  <Button as={Link} to="/property_register"> Create Listing </Button>

                ) : (
                  <div></div>
                )}
                
            </div>
        </nav>

        

  );
};

export default UpperBarDashboard;