import {React, useState} from 'react';
import {Button} from "react-bootstrap"
// import NavbarD from '../../components/Navbar/Navbar-dashboard';
import NavbarSO from '../../components/Navbar';
// import NavbarSI from '../../components/Navbar/Navbar-signedIn';
import CustomSidebar from '../../components/Sidebar'
import UpperBarDashboard from '../../components/dashboard-Content/upperBarDashboard';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'




function Dashboard() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className='dashboard-wrapper'>
      <NavbarSO/>
      <div className='wrapper'>
        <CustomSidebar collapseStatus={ {collapsed, setCollapsed} }/>
        <div id='content'>
          <UpperBarDashboard collapseStatus={ {collapsed, setCollapsed} }/>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


// Signed out, not a host not a user -> become a host, log in, signup - NavbarSO
// Signed in through login, a user, and a host -> my listings, my reservations, notifications, username-dropdown -> NavbarD
// Signed in through login, a user, not a host -> become a host, my reservations, notifications, username-dropdown -> NavbarSI