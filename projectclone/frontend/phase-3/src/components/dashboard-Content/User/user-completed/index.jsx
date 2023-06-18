import {React, useEffect, useState, useContext} from 'react'
// import '../../dashboard-Content/contentstyle.css';
// import '../../../dashboard-Content/contentstyle.css'
// import CardComponentD from '../../../Card/CardDashboard/Card';
import CardComponentC from '../../../Card/CardDashboard/CardCompleted';
import AuthContext from '../../../../context';
import { Button } from 'react-bootstrap';
import '../../../dashboard-Content/contentstyle.css'
import $ from 'jquery'

const Completed = () => {

    const [formDataCompleted, setFormDataCompleted] = useState([]);
    const { token } = useContext(AuthContext)
    const [refresh, setRefresh] = useState(0)
    const [nextURL, setNextUrl] =useState('')
    const [prevURL, setPrevURL] = useState('')
    const [pagination, setPagination] = useState(false)
    


    useEffect(() => {
      fetchCompleted()
    }, []);

    const fetchCompleted = (url = "http://localhost:8000/webpages/reservations/completed/") => {
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
            console.log('brother in gabriel array', data);
            if (data.length > 0) {
              setFormDataCompleted(data);
            }
            else {
              $('#notification').text('You currently have no Completed reservations!')

            }

          }
          else {
            console.log('brother in gabriel dict', data);
            if (data.results.length > 0) {
              setFormDataCompleted(data.results);
              setNextUrl(data.next)
              setPrevURL(data.previous)
              setPagination(true)
            }
            else {
              $('#notification').text('You currently have no Completed reservations!')

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
    //           setFormDataCompleted(data);

    //         }
    //         else {
    //           console.log(data.results, 'dict response');
    //           setFormDataCompleted(data.results);

    //         }
    //       })
    //       .catch((error) => console.error(error));
        
        
    //     }, [refresh]);
    


    const text = "Leave A Review For The Host"

  // Fetch cancellations data for next page
  const handleNext = () => {
    fetchCompleted(nextURL);
    setPagination(false)
  };

  // Fetch cancellations data for previous page
  const handlePrev = () => {
    fetchCompleted(prevURL);
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
        {formDataCompleted.map((propertyInfo) => (
            <CardComponentC value={propertyInfo} button={{text}}/>
        ))}
    </div>
    
    </>
  )
}

export default Completed
