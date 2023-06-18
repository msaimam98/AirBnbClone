import './App.css';


import NavbarSO from './components/Navbar';
import Dashboard from './pages/dashboard';
import Signup from './components/signup';
import SignUpPage from './pages/signuppage';
import LogIn from './components/login';
import LogOut from './components/logout';
import LogInPage from './pages/loginpage';
import HomePage from './pages/homepage';
import PropertyInfo from './pages/properties/PropertyInfo';
// import AuthContext from './context';
import { AuthProvider } from './context';
import PropertyRegister from './pages/property-register';
import PropertyUpdater from './pages/PropertyUpdate';
import Property_extra from './pages/property_extra_page';
import { useContext, useState } from 'react';
import Profile from './components/dashboard-Content/profile';
import "./index.css"
import 'bootstrap/dist/css/bootstrap.min.css';


import { Route, BrowserRouter as Router, Routes} from 'react-router-dom'

// User
import Approved from './components/dashboard-Content/User/user-approved';
import Requested from './components/dashboard-Content/User/user-requested';
import Cancellations from './components/dashboard-Content/User/user-cancelled';
import Completed from './components/dashboard-Content/User/user-completed';
import Terminated from './components/dashboard-Content/User/user-terminated';


// Host
import HostApproved from './components/dashboard-Content/Host/host-approved'; 
import HostTerminated from './components/dashboard-Content/Host/host-terminated';
import HostCancellations from './components/dashboard-Content/Host/host-cancellations';
import HostCompleted from './components/dashboard-Content/Host/host-completed';
import HostRequested from './components/dashboard-Content/Host/host-requested';
import AllListings from './components/dashboard-Content/Host/host-all-listings';

// notifications 
import Notifications from './components/dashboard-Content/Notifications';
import 'react-bootstrap'


function App() {
  // const [ isloggedin, setIsloggedin ]= useState(false);

  return (
    <AuthProvider>
      <Router>
          <Routes>
            <Route path='/'>
              <Route path="login" element={<LogInPage/>} />
              <Route index element={<HomePage />}/>
              <Route path="home" element={<HomePage />}/>
              <Route path="signup" element={<SignUpPage/>}/>
              <Route path="logout" element={<LogOut />}/>
              <Route path="property_extra_page" element={<Property_extra/>} />
              <Route path="property_update" element={<PropertyUpdater/>} />
              <Route path="property-info" element={<PropertyInfo />} />
              <Route path="property_register" element={<PropertyRegister />} />
              <Route path='dashboard/' element={<Dashboard/>}>
                <Route path='profile/' element={<Profile />}/>
                <Route path='approved/' element={<Approved />}/>
                <Route path='requested/' element={<Requested />}/>
                <Route path='cancellations/' element={<Cancellations />}/>
                <Route path='completed/' element={<Completed />}/>
                <Route path='terminated/' element={<Terminated />}/>
                <Route path='notifications/' element={<Notifications />}/>
                <Route path='host_approved/' element={<HostApproved />}/>
                <Route path='host_requested/' element={<HostRequested />}/>
                <Route path='host_cancellations/' element={<HostCancellations />}/>
                <Route path='host_completed/' element={<HostCompleted />}/>
                <Route path='host_terminated/' element={<HostTerminated />}/>
                <Route path='host_all_listings/' element={<AllListings />}/>
              </Route>
            </Route>
          </Routes>
      </Router>
    </AuthProvider>

  );
}

export default App;


// Signed out, not a host not a user -> become a host, log in, signup - NavbarSO
// Signed in through login, a user, and a host -> my listings, my reservations, notifications, username-dropdown -> NavbarD
// Signed in through login, a user, not a host -> become a host, my reservations, notifications, username-dropdown -> NavbarSI