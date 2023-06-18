import React, { useEffect, useState, useContext } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import AuthContext from '../../context';
import { BsStarFill, BsFillFilePersonFill, BsArrowRight, BsArrowLeft } from 'react-icons/bs'
import './style.css'

const GuestCommentsModal = (props) => {
  const {
    user,
    showModal,
    handleHide
  } = props;

  const { token } = useContext(AuthContext)

  // const [page, setPage] = useState(1)
  // const [pagination, setPagination] = useState(3)
  
  const [history, setHistory] = useState([])
  // const totalPages = history.length > 0 ? Math.ceil(history.length / pagination) : 0

  // const start = (page - 1) * pagination;
  // const end = start + pagination;


  // const handleNextPage = () => { setPage(page + 1) }
  // const handlePrevPage = () => { setPage(page - 1) }

  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(3)
  const [totalPages, setTotalPages] = useState(0)
  const start = (page - 1) * pagination
  const end = start + pagination

  const handleNextPage = () => {
    setPage(prevPage => (prevPage === totalPages ? prevPage : prevPage + 1));
  };
  
  const handlePrevPage = () => {
    setPage(prevPage => (prevPage === 1 ? prevPage : prevPage - 1));
  };

  useEffect(() => {
    if (Array.isArray(history) && history.length > 0) {
      setTotalPages(Math.ceil(history.length / pagination));
        setPage(1);
    } else {
      setTotalPages(0);
    }
  }, [history, pagination])


  useEffect(() => {
    // console.log('user info is ', user)
    if(!user) {
      return
    }
    getUserHistory()
  }, [user])

  const getUserHistory = () => {
    if(!user) {
      return
    }
    fetch('http://localhost:8000/webpages/' + user.id + '/history/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log('data from history is ', data)
      setHistory(data)
    })
  }

  const getAverage = () => {
    if (!history || !Array.isArray(history) || history.length === 0) {
      return
    }
    const ratings = history.map(rating => {
      return parseFloat(rating.rating)
    })
    if (ratings.length === 0) {
      return
    }
    var total = ratings.reduce((a, b) => a + b, 0)
    var ave = total/ratings.length
    return ave.toFixed(2)
  }

  const getActualDate = (dateStr) => {
    const dateObj = new Date(dateStr)
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    const formattedDate = dateObj.toLocaleString('en-US', options)
    return formattedDate
  }

  const renderReviews = () => {
    if(!history || !Array.isArray(history) || history.length === 0) {
      return
    }
    return (
      <div>
        { history.slice(start, end).map((item, index) => {
          return (
            <>
              <div className='comment-section'>
                <p className="line-left-align" key={ index }>
                  <h4><BsFillFilePersonFill/> { item.host }</h4>
                  <div className='line-right-align'>{ getActualDate(item.posted_on) }</div>
                  <p className="mb-2 purple-color"><BsStarFill className='reacticon'/>{ item.rating }</p>
                </p>
                <span>{ item.text_content }</span>
              </div>
              <hr/>
            </>
          )
        })}
      </div>
    )
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


  return (
    <>
      {/* <Button className="filter-button" variant='outline-secondary' onClick={ handleShow }>
        All Reviews
      </Button> */}

      <Modal show={ showModal } onHide={ handleHide }>
        <Modal.Header closeButton>
          <Modal.Title>
            { user && user.username ? `All Reviews for ${ user.username }` : "Loading..." }
            <p className="mb-2 purple-color"><BsStarFill/>{ getAverage() }</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { renderReviews() }
        </Modal.Body>
        <Modal.Footer className='middle'>
          { totalPages === 0 ? null : renderPagination() }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default GuestCommentsModal;