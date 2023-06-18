import {React, useContext} from 'react'
import { Button } from 'react-bootstrap';
import AuthContext from '../../context';
import API from '../API/apiservice';

const LogOut = () => {

  const {setIsHost, setIsloggedin, removeCookie} = useContext(AuthContext);

  removeCookie('token')
  setIsHost(false)
  setIsloggedin(false)

}

export default LogOut
