import {React, useEffect, useState, useContext} from 'react'
// import '../../dashboard-Content/contentstyle.css';
// import '../../../dashboard-Content/contentstyle.css'
import CardComponentHComp from '../../../Card/CardDashboard/CardHostCompleted';
import AuthContext from '../../../../context';
import { Button } from 'react-bootstrap';
import '../../../dashboard-Content/contentstyle.css'
import $ from 'jquery'

const Approved = () => {

    const [FormDataCompleted, setFormDataCompleted] = useState([]);
    const { token } = useContext(AuthContext)
    const [refresh, setRefresh] = useState(0)
    const [nextURL, setNextUrl] =useState('')
    const [prevURL, setPrevURL] = useState('')
    const [pagination, setPagination] = useState(false)
    const [allHostReviews, setAllHostReviews] = useState([])

    useEffect(() => {
      fetchCompleted()
      getAllHostReviews()
    }, []);

    const fetchCompleted = (url = "http://localhost:8000/webpages/listings/completed/") => {
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
            console.log('brother in completed array', data);
            if (data.length > 0) {
              setFormDataCompleted(data);

            }
            else {
              $('#notification').text('You currently have no approved reservations!')
            }

          }
          else {
            console.log('brother in completed dict', data);
            if (data.results.length > 0) {
              
              setFormDataCompleted(data.results);
              setNextUrl(data.next)
              setPrevURL(data.previous)
              setPagination(true)

            }
            else {

              $('#notification').text('You currently have no approved reservations!')
              
            }

          }
        })
        .catch((error) => console.error(error));
    }

    // gets all userhistory where the host has already talked
    const getAllHostReviews = () => {
      fetch('http://localhost:8000/webpages/history/host/author/', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token['token']
        },
      })
      .then((res) => res.json())
      .then((data) => {
        // console.log('tis is data for host', data)
        let all = []
        for(let i = 0; i < data.length; i++) {
          all.push(data[i].reservation)
        }
        // console.log('setting all host reviews to be ', all)
        setAllHostReviews(all)
      })
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
    


    const text = "Review Your Guest!"

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
        {FormDataCompleted.map((propertyInfo) => (
            <CardComponentHComp 
              value={propertyInfo} 
              button={{text}} 
              allHostReviews={ allHostReviews }
              getAllHostReviews={ getAllHostReviews }
            />
        ))}
    </div>
    
    </>
  )
}

export default Approved
