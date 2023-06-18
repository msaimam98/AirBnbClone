import React, { useState, useContext, useEffect, setState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { BsArrowRight, BsArrowLeft} from 'react-icons/bs'
import AuthContext from '../../../context';
import './style.css'
const Notifications = () => {

  const [user, setUser] = useState(null)
  const { token } = useContext(AuthContext);

  const [allNotifs, setAllNotifs] = useState([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(3)
  // const totalPages = Math.ceil(allNotifs.length / pagination)
  const [totalPages, setTotalPages] = useState(0)
  const start = (page - 1) * pagination
  const end = start + pagination

  // const handleNextPage = () => { setPage(page + 1) }
  // const handlePrevPage = () => { setPage(page - 1) }

  const handleNextPage = () => {
    setPage(prevPage => (prevPage === totalPages ? prevPage : prevPage + 1));
  };
  
  const handlePrevPage = () => {
    setPage(prevPage => (prevPage === 1 ? prevPage : prevPage - 1));
  };

  // useEffect(() => {
  //   if (Array.isArray(allNotifs) && allNotifs.length > 0) {
  //     setTotalPages(Math.ceil(allNotifs.length / pagination));
  //   } else {
  //     setTotalPages(0);
  //   }
  // }, [allNotifs, pagination])

  useEffect(() => {
    if (Array.isArray(allNotifs) && allNotifs.length > 0) {
      setTotalPages(Math.ceil(allNotifs.length / pagination));
        setPage(1);
    } else {
      setTotalPages(0);
    }
  }, [allNotifs, pagination])


  useEffect(() => {
    getLoggedInUser()
  }, [])

  useEffect(() => {
    listAllNotifs()
  }, [user])

  const getLoggedInUser = () => {
    fetch('http://localhost:8000/webpages/profile/view/', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
    })
    .then((res) => res.json())
    .then((data) => {
      if(!data.username) {
        setUser(null)
      } else {
        // console.log('i am a person')
        setUser(data.id)
      }
    })
  }

  const listAllNotifs = () => {
    console.log('called')
    fetch('http://localhost:8000/webpages/notifications/list/?page_size=100', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log('tis is notifcations data', data)
      setAllNotifs(data)
    })
  }

  const onClear = (notifID) => {
    fetch('http://localhost:8000/webpages/notifications/' + notifID + '/clear/', {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log('tis is notifcations data', data)
      listAllNotifs()
    })
  }

  const onView = (notifID) => {
    fetch('http://localhost:8000/webpages/notifications/' + notifID + '/view/', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log('tis is notifcations data', data)
      listAllNotifs()
    })
  }

  const renderPagination = () => (
    <div className='row'>
      <div className='col-auto'>
        <Button 
          variant='outline-secondary'
          size='sm'
          className='rounded-circle mx-3'
          onClick={ () => handlePrevPage() }
          disabled={ page === 1 ? true : false }
        >
          <BsArrowLeft/>
        </Button> 
      </div>

      <div className='col-auto'>
        <span>{ page } / { totalPages }</span>
      </div>
      <div className='col-auto'>
        <Form.Select onChange={ (e) => setPagination(e.target.value) } className='pagination-bar'>
          <option value='3'>3</option>
          <option value='5'>5</option>
          <option value='10'>10</option>
          <option value='15'>20</option>
        </Form.Select>
      </div>

      <div className='col-auto'>
        <Button 
          variant='outline-secondary'
          size='sm'
          className='rounded-circle'
          onClick={ () => handleNextPage() }
          disabled={ page === totalPages ? true : false }
        >
          <BsArrowRight/>
        </Button>
      </div>
      
    </div>
  )

  const renderViewBtn = (notifID) => (
    <Button size='sm' onClick={ () => onView(notifID) } className='notif-btn'>View Notification</Button>
  )

  const renderClearBtn = (notifID) => (
    <Button size='sm' onClick={ () => onClear(notifID) } className='notif-btn'>Clear Notification</Button>
  )
  
  const renderNewCircle = () => (
    <div className='circle'></div>
  )

  const renderAllNotifs = () => {
    if (!allNotifs || allNotifs.length === 0) {
      return <div></div>
    }
    return allNotifs.slice(start, end).map(notif => {
      return (
        <div className="container-fluid text-center">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-sm-offset-3">
              <div className="new-message-box">
                <div className="new-message-box-info">
                  <div className="info-tab tip-icon-info" title="error"><i></i></div>
                  <div className="tip-box-info">
                    <p>{ notif.read === false && renderNewCircle() }{ notif.user_type.toUpperCase() }: { notif.notification_message }</p>
                  </div>
                  <div className='row'>
                    <div className="col-12 col-md-6">
                      { notif.read === false && renderViewBtn(notif.id) }
                    </div>
                    <div className='col-12 col-md-6'>
                      { renderClearBtn(notif.id) }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  const noNotifs = () => (
    <h5>No Notifications</h5>
  )

  return (
    <div className='m-5'>
      { renderAllNotifs() }
      { allNotifs.length > 0 ? renderPagination() : noNotifs() }
    </div>
  )
}

export default Notifications
