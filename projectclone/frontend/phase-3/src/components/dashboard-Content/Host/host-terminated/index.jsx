import {React, useEffect, useState, useContext} from 'react'
// import '../../dashboard-Content/contentstyle.css';
// import '../../../dashboard-Content/contentstyle.css'
import CardComponentHTerminated from '../../../Card/CardDashboard/CardHostTerminated';
import AuthContext from '../../../../context';
import { Button } from 'react-bootstrap';
import '../../../dashboard-Content/contentstyle.css'
import $ from 'jquery'

const HostTerminated = () => {

    const [FormDataTerminations, setFormDataTerminations] = useState([]);
    const { token } = useContext(AuthContext)
    const [refresh, setRefresh] = useState(0)
    const [nextURL, setNextUrl] =useState('')
    const [prevURL, setPrevURL] = useState('')
    const [pagination, setPagination] = useState(false)

    useEffect(() => {
      fetchTerminations()
    }, []);

    const fetchTerminations = (url = "http://localhost:8000/webpages/listings/terminated/") => {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token['token'],
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            console.log('brother in mustafa array', data);
            if (data.length > 0) {
              setFormDataTerminations(data);
            }
            else {
              $('#notification').text('You currently have no Terminated reservations!')

            }

          }
          else {
            console.log('brother in mustafa dict', data);
            if (data.results.length > 0) {
              setFormDataTerminations(data.results);
              setNextUrl(data.next)
              setPrevURL(data.previous)
              setPagination(true)
            }
            else {
              $('#notification').text('You currently have no Terminated reservations!')

            }

          }

  
  
        })
        .catch((error) => console.error(error));
    }

    // useEffect(() => {
    //     // Send formDataLogin to backend API via POST request
    //     fetch("http://localhost:8000/webpages/reservations/approved/", {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization" : "Bearer " + token['token']
    //       },
    //     })
    //       .then((response) => response.json())
    //       .then((data) => {
    //         if (Array.isArray(data)) {
    //           console.log(data, 'array response');
    //           setFormDataTerminations(data);

    //         }
    //         else {
    //           console.log(data.results, 'dict response');
    //           setFormDataTerminations(data.results);

    //         }
    //       })
    //       .catch((error) => console.error(error));
        
        
    //     }, [refresh]);
    


    // const handleC = (reservationId) => {
    //     fetch("http://localhost:8000/webpages/" + reservationId + "/terminate_request/", {
    //         method: "PATCH",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Authorization" : "Bearer " + token['token']
    //         },
    //       })
    //         .then((response) => response.json())
    //         .then((data) => {
    //           console.log(data);
    //           setRefresh(5)

    //         })
    //         .catch((error) => console.error(error));


    //     }
    // const text = "Request to Cancel"

  // Fetch cancellations data for next page
  const handleNext = () => {
    fetchTerminations(nextURL);
    setPagination(false)
  };

  // Fetch cancellations data for previous page
  const handlePrev = () => {
    fetchTerminations(prevURL);
  };

  return (<>
    <div className='nextprevbuttons'>
      <div className='prevbutton'>
        {prevURL && <Button onClick={handlePrev}>Previous</Button>}
      </div>
      <div className='nextbutton'>
        {nextURL && <Button onClick={handleNext}>Next</Button>}
      </div>
    </div>
    <div className='heybro'>
      <h3 id='notification' className='d-flex justify-content-end'></h3>
    </div>
    <div id='card' className='card2'>
        {FormDataTerminations.map((propertyInfo) => (
            <CardComponentHTerminated value={propertyInfo}/>
        ))}
    </div>
    
    </>
  )
}

export default HostTerminated
