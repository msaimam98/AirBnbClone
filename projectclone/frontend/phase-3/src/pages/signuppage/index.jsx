// import './App.css';
// import NavbarD from '../../components/Navbar/Navbar-dashboard';
// import NavbarSI from '../../components/Navbar/Navbar-signedIn';
import NavbarSO from '../../components/Navbar';
import Signup from '../../components/signup';
// import "./index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import '../loginpage/loginstyles.css'


// import { Link, Route, BrowserRouter as Router, Routes} from 'react-router-dom'

function SignUpPage() {
  return (
    <div className="signuppage">
      <NavbarSO/>
      <div className='wrapper3'>
        <Signup />
      </div>
    </div>

  );
}

export default SignUpPage;


// Signed out, not a host not a user -> become a host, log in, signup - NavbarSO
// Signed in through login, a user, and a host -> my listings, my reservations, notifications, username-dropdown -> NavbarD
// Signed in through login, a user, not a host -> become a host, my reservations, notifications, username-dropdown -> NavbarSI