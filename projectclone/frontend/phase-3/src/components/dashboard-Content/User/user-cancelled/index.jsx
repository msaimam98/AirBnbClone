import {React, useEffect, useState, useContext} from 'react'
import '../../../dashboard-Content/contentstyle.css'
import CardComponentDNoButton from '../../../Card/CardDashboard/CardCancellations';
import AuthContext from '../../../../context';
import '../user-approved/approvedstyle.css'
import { Button } from 'react-bootstrap';
import $ from 'jquery'



const Cancellations = () => {

    const [FormDataCancellations, setFormDataCancellations] = useState([]);
    const { token } = useContext(AuthContext)
    const [refresh, setRefresh] = useState(0)
    const [nextURL, setNextUrl] =useState('')
    const [prevURL, setPrevURL] = useState('')
    const [pagination, setPagination] = useState(false)

 
    useEffect(() => {
      fetchCancellations()
    }, []);


    
    const fetchCancellations = (url = "http://localhost:8000/webpages/reservations/cancellations/") => {
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
            console.log('brother in jesus array', data);
            if (data.length > 0) {
              setFormDataCancellations(data);

            }
            else {
              $('#notification').text('You currently have no cancelled reservations!')
            }

          }
          else {
            console.log('brother in jesus dict', data);
            if (data.results.length > 0) {
              setFormDataCancellations(data.results);
              setNextUrl(data.next)
              setPrevURL(data.previous)
              setPagination(true)

            }
            else {

              $('#notification').text('You currently have no cancelled reservations!')
            }

          }

  
  
        })
        .catch((error) => console.error(error));
    }

  // Fetch cancellations data for next page
  const handleNext = () => {
    fetchCancellations(nextURL);
    setPagination(false)
  };

  // Fetch cancellations data for previous page
  const handlePrev = () => {
    fetchCancellations(prevURL);
    setPagination(false)
  };

    // const handleC = (reservationId) => {
    //   fetch("http://localhost:8000/webpages/" + reservationId + "/terminate/", {
    //       method: "PATCH",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization" : "Bearer " + token['token']
    //       },
    //     })
    //       .then((response) => response.json())
    //       .then((data) => {
    //         console.log(data);
    //         // this is to refresh the page and show the change immidietely 
    //         setRefresh(5)

    //       })
    //       .catch((error) => console.error(error));


    //   }
    //   const text = "Cancel Your Reservation"

    // const paginationSupportNext = () => {
    //   if (nextURL) {
    
    //       // Send formDataLogin to backend API via POST request
    //       fetch(nextURL, {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Authorization" : "Bearer " + token['token'],
    //         },
    //       })
    //         .then((response) => response.json())
    //         .then((data) => {
    //           if (Array.isArray(data)) {
    //             console.log('brother in jesus array', data);
    //             setFormDataCancellations(data);
    //             setRefresh(4)
  
    //           }
    //           else {
    //             console.log('brother in jesus dict', data);
    //             setFormDataCancellations(data.results);
    //             setNextUrl(data.next)
    //             if (data.prev !== undefined) {
    //               setPrevURL(data.prev)

    //             }
    //             if (data.next !== undefined) {
    //               setNextUrl(data.next)
    //             }
    //             pagination(true)
                
    //           }
  
      
      
    //         })
    //         .catch((error) => console.error(error));
    //   }
    // }


    useEffect(() => {
        console.log('getting here')


    }, [pagination]);
    

  return (
    <>
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
        {FormDataCancellations.map((propertyInfo) => (<>
            <CardComponentDNoButton value={propertyInfo} />
            </>
        ))}
    </div>
    </>

  )
}

export default Cancellations

