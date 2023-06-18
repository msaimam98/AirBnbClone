import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { BsStarFill, BsFillFilePersonFill, BsArrowRight, BsArrowLeft } from 'react-icons/bs'
import AuthContext from '../../context'
import './style.css'

const CommentsModal = (props) => {
  const {
    allComments,
    username,
    hostUsername,
    getComments,
    getRatings,
    allRatings,
    propertyID
  } = props;

  const { token } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false)
  const [allReviews, setAllReviews] = useState([])
  const replyOrder = ['Original Property Comment', 'Host Property Reply', 'User Property Reply']
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(3)

  const [hostCanReply, setHostCanReply] = useState([])
  const [hostComment, setHostComment] = useState('')

  const [userCanReply, setUserCanReply] = useState([])
  const [userReply, setUserReply] = useState('')

  const [allCompleted, setAllCompleted] = useState([])
  const [allTerminated, setAllTerminated] = useState([])
  const [userCanComment, setUserCanComment] = useState([])

  const [userComment, setUserComment] = useState('')
  const [userCommentReso, setUserCommentReso] = useState()
  const [showAddError, setShowAddError] = useState('')
  const [userRating, setUserRating] = useState()


  // const totalPages = allReviews.length > 0 ? Math.ceil(allReviews.length / pagination) : 0
  // const start = (page - 1) * pagination;
  // const end = start + pagination;

  const handleShow = () => setShowModal(true)
  const handleHide = () => setShowModal(false)
  // const handleNextPage = () => { setPage(page + 1) }
  // const handlePrevPage = () => { setPage(page - 1) }


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
    if (Array.isArray(allReviews) && allReviews.length > 0) {
      setTotalPages(Math.ceil(allReviews.length / pagination));
        setPage(1);
    } else {
      setTotalPages(0);
    }
  }, [allReviews, pagination])



  useEffect(() => {
    if(allComments && Array.isArray(allComments)) {
      formatComments()
    }
  }, [allComments])

  useEffect(() => {
    if(allReviews) {
      console.log('calling stuff now bc allReviews is normal ', allReviews)
      findHostReplies()
      findUserReplies()
    }
  }, [allReviews])

  useEffect(() => {
    getTerminated()
    getCompleted()
  }, [])

  useEffect(() => {
    console.log('all reviews here is ', allReviews)
    if(allReviews.length > 0) {
      findUserAddComment()
    }
  }, [allTerminated, allCompleted, allReviews])

  const getTerminated = () => {
    fetch('http://localhost:8000/webpages/reservations/terminated2/', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, 'this is from getallterminated')
      let all = []
      for(let i = 0; i < data.length; i++) {
        all.push(data[i].id)
      }
      console.log('tis is data for terminated', all)

      setAllTerminated(all)
    })
  }

  const getCompleted = () => {
    fetch('http://localhost:8000/webpages/reservations/completed2/', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log('tis is data for completed', data.results)
      let all = []
      for(let i = 0; i < data.length; i++) {
        all.push(data[i].id)
      }
      console.log('tis is data for allCompleted', all)
      setAllCompleted(all)
    })
  }

  const createHostNotif = () => {
    // console.log('sending this to post new comment ', userCommentReso)
    fetch('http://localhost:8000/webpages/notifications/' + userCommentReso + '/new-comment/create/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
      // body: JSON.stringify({ "text_content": userComment })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('this is response data after adding host notif', data)
    })
    .catch((error) => {
      console.log('this is the error ', error)
      // setShowAddError(error)
    })
  }
  

  const onCommentAdd = () => {

    fetch('http://localhost:8000/webpages/reservations/' + userCommentReso + '/property-comments/add/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
      body: JSON.stringify({ "text_content": userComment })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('this is response data ', data)
      getComments()
      setUserComment('')
      findUserAddComment()
      setShowAddError('')
      handleHide()
      createHostNotif()
    })
    .catch((error) => {
      console.log('this is the error ', error)
      setShowAddError(error)
    })
  }

  const onRatingAdd = () => {
    fetch('http://localhost:8000/webpages/rating/' + propertyID + '/' + userCommentReso + '/add/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
      body: JSON.stringify({ "rating": userRating })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('this is response data ', data)
      getComments()
      setUserComment('')
      findUserAddComment()
      setShowAddError('')
      setUserRating()
    })
    .catch((error) => {
      console.log('this is the error ', error)
      setShowAddError(error)
    })
  }

  // useEffect(() => {
  //   console.log('changed to ', allCompleted, allTerminated)
  // }, [allCompleted, allTerminated])

  const findUserAddComment = () => {
    const noComments = []
    const resos = allReviews.map(item => {
      return item[0].reservation
    })
    console.log('resos is ', resos)
    console.log('alltermianted is ', allTerminated, allCompleted)
    
    allTerminated.forEach(item => {
      if(!resos.includes(item)){
        noComments.push(item)
      } 
    })

    allCompleted.forEach(item => {
      if(!resos.includes(item)){
        noComments.push(item)
      } 
    })
    console.log('no comments is ', noComments)
    setUserCanComment(noComments)
  }


  const findHostReplies = () => {
    const noHost = [];

    allReviews.forEach(commentArray => {
      const hasOGComment = commentArray.some(item => item.reply === "Original Property Comment");
      const hasHostReply = commentArray.some(item => item.reply === "Host Property Reply");
      // console.log('inside reservation ', commentArray[0].reservation, 'and do these exist? ', hasOGComment, hasHostReply)
      if (hasOGComment && !hasHostReply) {
        noHost.push(commentArray[0].reservation);
      }
    });
    // console.log('host replies is ', noHost)
    setHostCanReply(noHost)    
  }

  const onReply = (reservationID, host) => {

    // console.log('comment is ', comment)
    fetch('http://localhost:8000/webpages/reservations/' + reservationID + '/property-comments/add/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
      body: JSON.stringify({ "text_content": userReply })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('this is response data ', data)
      getComments()
      setHostComment('')
      setUserReply('')
      handleHide()
    })
    .catch((error) => console.log('this is the error ', error))
  }

  const onReplyHost = (reservationID) => {

    fetch('http://localhost:8000/webpages/reservations/' + reservationID + '/property-comments/add/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
      body: JSON.stringify({ "text_content": hostComment })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('this is response data ', data)
      getComments()
      setHostComment('')
      setUserReply('')
      handleHide()
    })
    .catch((error) => console.log('this is the error ', error))
  }

  const onAddComment = () => {
    if(!userCommentReso) {
      setShowAddError('Invalid reservation ID')
      return
    }
    if(!userRating || userComment === '') {
      setShowAddError('Required field missing')
      return
    }
    onCommentAdd()
    onRatingAdd()
  }

  const findUserReplies = () => {
    const noUser = []
    allReviews.forEach(commentArray => {
      const hasOGComment = commentArray.some(item => item.reply === "Original Property Comment");
      const hasHostReply = commentArray.some(item => item.reply === "Host Property Reply");
      const hasUserReply = commentArray.some(item => item.reply === "User Property Reply");
      
      if (hasOGComment && hasHostReply && !hasUserReply) {
        noUser.push({
          reservation: commentArray[0].reservation, 
          user: commentArray[0].author
        })
      }
    });
    // console.log('user can reply is now ', noUser)
    setUserCanReply(noUser)
  }

  const findUserReplyID = (reservationID) => {
    const found = userCanReply.find(element => element.reservation === reservationID)
    return found
  }

  const formatComments = () => {
    const sorted = allComments.reduce((acc, comment) => {
      const reservation = comment.reservation
      let reserveArr = acc.find((arr) => arr[0].reservation === reservation)
    
      if (!reserveArr) { // create new array if doesn't exist
        reserveArr = []
        acc.push(reserveArr)
      }
      reserveArr.push(comment)
    
      reserveArr.sort((a, b) => {
        return replyOrder.indexOf(a.reply) - replyOrder.indexOf(b.reply)
      });
      return acc;
    }, [])
    console.log('sorted to ', sorted)
    setAllReviews(sorted)
  }

  const renderAddComment = () => {
    if(userCanComment.length === 0) {
      return null
    }
    return (
      <>
        <div className='row'>
          <div className='col-md-6'>
            <Form.Select onChange={ (e) => setUserCommentReso(e.target.value) } className='pagination-bar'>
              <option value='-'>-</option>
              { userCanComment.map(val => {
                return (
                  <option value={ val } key={ val }>{ val }</option>
                )
              })}
            </Form.Select>
          </div>
          <div className='col-md-6'>
            <Form.Group className="mb-3">
              <Form.Control type="number" max="5" min="0" placeholder="Enter rating" onChange={ e => setUserRating(e.target.value) }/>
            </Form.Group>
          </div>
        </div>

        <Form.Group className='pb-4'>
          <Form.Control
            className="addComment"
            as="textarea"
            rows="3"
            placeholder="Add user comment"
            value={ userComment }
            onChange={ e => setUserComment(e.target.value) }
            type="text"
          />
          <div>
          <Button
            className="addCommentBtn"
            variant="outline-primary"
            size='sm'
            onClick={ () => onAddComment() }
          >
            Add new review
          </Button>
          </div>
        </Form.Group>
        { showAddError.length > 0 && (
          <p className='error'>{ showAddError }</p>
        )}
      </>
    )
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

  const getReservationRating = (reso) => {
    if(!allRatings) {
      return
    }
    console.log('rservation handed in is ', reso)
    const rating = allRatings.find((obj) => obj.reservation === reso);
    if(!rating) {
      console.log('returning')
      return
    }
    console.log('rating here is ', rating)
    return rating.rating
  }

  const renderAllComments = () => {
    if(!allReviews || !Array.isArray(allReviews) || allReviews.length === 0) {
      return
    }
    return allReviews.slice(start, end).map((reserveArr) => (
      <>
        <div className='col-12'>
          { replyOrder.map((reply) => {
            const replyObj = reserveArr.find((o) => o.reply === reply)
            const reservation = reserveArr[0].reservation

            if (replyObj && reply === replyOrder[0]) {
              return (
                <>
                  <p className="line-left-align">
                    <h4><BsFillFilePersonFill/> { replyObj.author }</h4>
                    <div className='line-right-align'>{ getActualDate(replyObj.posted_on) }</div>
                    <p className="mb-2 purple-color"><BsStarFill className='reacticon'/>{ getReservationRating(reservation) }</p>
                  </p>

                  <span>{ replyObj.text_content }</span>
                  { hostUsername === username && hostCanReply.includes(reservation) && (
                      <>
                        <Form.Group className="m-0">
                          <Form.Control
                            className="addComment"
                            as="textarea"
                            rows="3"
                            placeholder="Add host reply"
                            value={ hostComment }
                            onChange={ e => setHostComment(e.target.value) }
                            type="text"
                          />
                          <div>
                          <Button
                            className="addCommentBtn"
                            variant="outline-primary"
                            size='sm'
                            onClick={ () => onReplyHost(reservation) }
                          >
                            Add reply
                          </Button>
                          </div>
                          
                        </Form.Group>
                      </>
                    )}

  
                </>
              )
            } else if (replyObj && reply === replyOrder[1]) {
              return (
                <>
                  {/* <div className="comment-reply">
                    <h6><BsFillFilePersonFill/>{ replyObj.author }</h6>
                    <span>{ replyObj.text_content }</span>
                  </div> */}
                  <div className="comment-reply">
                    <div>
                      <h5><BsFillFilePersonFill className='reacticon'/>{ replyObj.author }</h5>
                      <div className='line-right-align'>{ getActualDate(replyObj.posted_on) }</div>
                    </div>
                    <span>{ replyObj.text_content }</span>
                  </div>
                  { findUserReplyID(reservation) !== undefined && findUserReplyID(reservation).reservation === reservation && findUserReplyID(reservation).user === username &&(
                    <>
                        <Form.Group className="m-0">
                          <Form.Control
                            className="addComment"
                            as="textarea"
                            rows="3"
                            placeholder="Add user reply"
                            value={ userReply }
                            onChange={ e => setUserReply(e.target.value) }
                            type="text"
                          />
                          <div>
                          <Button
                            className="addCommentBtn"
                            variant="outline-primary"
                            size='sm'
                            onClick={ () => onReply(reservation) }
                          >
                            Add reply
                          </Button>
                          </div>
                          
                        </Form.Group>
                      </>
                  )}
                </>
              )
            } else if (replyObj) {
              return (
                <>
                  <div className="comment-reply">
                    <div>
                      <h5><BsFillFilePersonFill className='reacticon'/>{ replyObj.author }</h5>
                      <div className='line-right-align'>{ getActualDate(replyObj.posted_on) }</div>
                    </div>
                    <span>{ replyObj.text_content }</span>
                  </div>
                </>
              )
            }
            else {
              return null
            }
          })}
        </div>
        <hr />
      </>
    ));
  };
    
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
      <Button className="filter-button" variant='outline-secondary' onClick={ handleShow }>
        All Reviews
      </Button>

      <Modal show={ showModal } onHide={ handleHide }>
        <Modal.Header closeButton>
          <Modal.Title>All Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { renderAddComment() }
          { renderAllComments() }
        </Modal.Body>
        <Modal.Footer className='middle'>
          { totalPages === 0 ? null : renderPagination() }
        </Modal.Footer>
      </Modal>


    </>
  )

}

export default CommentsModal