import { createContext, useState } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({children}) => { 

    // all global variables need to be here 
    let [isloggedin, setIsloggedin] = useState(false)
    let [isHost, setIsHost] = useState(false)
    let [properties, setProperties] = useState([])
    const [token, setToken, removeCookie] = useCookies(['token'])

    let contextData = {
        isloggedin: isloggedin,
        setIsloggedin: setIsloggedin,
        isHost: isHost,
        setIsHost: setIsHost,
        properties: properties,
        setProperties: setProperties,
        token: token,
        setToken: setToken,
        removeCookie: removeCookie,

    }


    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
