import {React, useEffect, useState, useContext} from 'react'
// import '../../dashboard-Content/contentstyle.css';
// import '../../../dashboard-Content/contentstyle.css'
import CardComponentD from '../../../Card/CardDashboard/Card';
import AuthContext from '../../../../context';
import { Button } from 'react-bootstrap';
import '../../../dashboard-Content/contentstyle.css'
import { useNavigate } from 'react-router-dom';
import $ from 'jquery'

const Approved = () => {

    const [formDataApproved, setFormDataApproved] = useState([]);
    const { token } = useContext(AuthContext)
    const [refresh, setRefresh] = useState(0)
    const [nextURL, setNextUrl] =useState('')
    const [prevURL, setPrevURL] = useState('')
    const [pagination, setPagination] = useState(false)
    const [resoData, setResoData] = useState({
    
    });
    const navigate = useNavigate();

    useEffect(() => {
      fetchApprovals()
    }, []);

    const fetchApprovals = (url = "http://localhost:8000/webpages/reservations/approved/") => {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token['token'],
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data, 'this is the data before anytihng')
          if (Array.isArray(data)) {
            console.log('brother in hmm array', data);
            if (data.length > 0) {
              setFormDataApproved(data);
            }
            else {
                $('#notification').text('You currently have no approved reservations!')
            }

          }
          else {
            console.log('brother in hmm dict', data);
            if (data.results.length > 0) {
              setFormDataApproved(data.results);
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
    //           setFormDataApproved(data);

    //         }
    //         else {
    //           console.log(data.results, 'dict response');
    //           setFormDataApproved(data.results);

    //         }
    //       })
    //       .catch((error) => console.error(error));
        
        
    //     }, [refresh]);
    


    const handleC = (reservationId) => {
        fetch("http://localhost:8000/webpages/" + reservationId + "/terminate_request/", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization" : "Bearer " + token['token']
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data, 'this is the data i have to look at');
    
              setResoData(data)
              setFormDataApproved(dealWith(data.id));
              setRefresh(5)
              navigate('/dashboard/approved')

            })
            .catch((error) => console.error(error));


        }
    const text = "Request to Cancel"

    useEffect(() => {

      fetch("http://localhost:8000/webpages/notifications/" + resoData.id + "/" + resoData.user + "/create/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token['token']
      },
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data, 'this is the data bro');


      })
      .catch((error) => console.error(error));
      console.log('getting here')
      console.log(resoData, 'this is the reso data')


  }, [refresh]);

  const dealWith = (deleteID) => { 

    return formDataApproved.filter((item) => item.id !== deleteID)
      
    }
  // Fetch cancellations data for next page
  const handleNext = () => {
    fetchApprovals(nextURL);
    setPagination(false)
  };

  // Fetch cancellations data for previous page
  const handlePrev = () => {
    fetchApprovals(prevURL);
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
        {formDataApproved.map((propertyInfo) => (
            <CardComponentD value={propertyInfo} button={{handleC, text}}/>
        ))}
    </div>
    
    </>
  )
}

export default Approved
