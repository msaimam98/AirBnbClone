/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect, useContext } from 'react';
import ImageDisplay from '../../components/modals/ImageDisplay'
import AmenitiesModal from '../../components/modals/AmenitiesModal';
import ReservationCard from '../../components/Card/ReservationCard';
import CommentsModal from '../../components/modals/CommentsModal';
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom';
import NavbarSO from '../../components/Navbar';
import { BsStarFill, BsPersonFill } from 'react-icons/bs'
import AuthContext from '../../context';
import { Carousel } from 'react-bootstrap';


const PropertyInfo = (props) => {

  const {state} = useLocation();
  const host = state.property_owner
  const { token } = useContext(AuthContext);
  const { isloggedIn } = useContext(AuthContext);

  const [username, setUsername] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [allRatings, setAllRatings] = useState([]);
  const [images, setImages] = useState([]);


  useEffect(() => {
    // console.log('state is ', state)
    console.log(state, 'this is the state')
    getLoggedInUser()
    getComments()
    getRatings()
  }, [])

  useEffect(() => {
    console.log('all ratings i s', allRatings)
  }, [allRatings])

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
      // console.log('tis is login data', data)
      if(!data.username) {
        // console.log('no username')
        setUsername(null)
      } else {
        // console.log('i am logged in')
        setUsername(data.username)
      }
    })
  }

  const getComments = () => {
    fetch('http://localhost:8000/webpages/reservations/property/' + state.id + '/property-comments/view/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log('this is the comment data ', data)
      setAllComments(data)
    })
  }

  const getRatings = () => {
    fetch('http://localhost:8000/webpages/rating/' + state.id + '/list/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log('this is the ratings ', data)
      setAllRatings(data)
    })
  }

  const getAverage = () => {
    if (!allRatings || !Array.isArray(allRatings)) {
      return;
    }
    const ratings = allRatings.map(rating => {
      return parseFloat(rating.rating)
    })
    if (ratings.length === 0) {
      return 'No Ratings'
    }
    var total = ratings.reduce((a, b) => a + b, 0)
    var ave = total/ratings.length
    return ave.toFixed(2)
    // const ratings = allRatings.map(rating => {return parseFloat(rating.rating)})
    // var total = ratings.reduce((a, b) => a + b, 0)
    // var ave = parseFloat(total)/ratings.length
    // return (parseFloat(ave.toFixed(2)))
  }

  useEffect(() => {

    fetch('http://localhost:8000/webpages/picture/' + state.id +  '/list/', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token['token']
        },
      })
      .then((res) => res.json())
      .then((data) => { 
        console.log(data, 'this is the data for images')
        setImages(data)})

  }, []);

  const renderImagePreview = () => {

    
    return (
      <Carousel>
        {images.map((img) => (
          // <div className="col-sm-12 col-md-6 left-img">
            <Carousel.Item>
            <img className="img-fluid w-100 center-img" src={ img.image } alt="image1"/>
            </Carousel.Item>
            // <div className="img-container">
            //   <img className="img-fluid w-100 center-img" src={ img.image } alt="image1"/>
            // </div> 
          // </div>

        ))}

      </Carousel>

  )
}


  const renderPropertyDetails = () => (
    <>
      <div className="property-details">
        <h3>{ state.address }</h3>
        <p>{ state.number_of_rooms } bedrooms
          <span> &#8226; </span>
          { state.number_of_bed } beds
          <span> &#8226; </span>
          { state.baths } bathrooms</p>
        <p>Accomodates up to { state.number_of_guest } guests</p>
      </div>
      <hr/>
    </>
  )

  const renderDescription = () => {
    <>
    <h5>About the place:</h5>
      <p>{ state.description }</p>
    </>
  }

  const renderHost = () => (
    <>
      <h6 id="rating-link">Questions?</h6>
        <p>Contact { host.username } by 
          { host.email && host.phone_number && (
            <>
              <a href={`mailto:${host.email}`}> { host.email }</a>
              <span> or </span>
              <a href={`tel:${host.phone_number}`}>{ host.phone_number }</a>
            </>
          )}

          { host.email && !host.phone_number && (
            <a href={`mailto:${host.email}`}> { host.email }</a>
          )}

          { !host.email && host.phone_number && (
            <a href={`tel:${host.phone_number}`}> { host.phone_number }</a>
          )}
        </p>
    </>
  )

  const renderReservationCard = () => (
    <div className='col-md-5 col-sm-12'>
      <ReservationCard
        propertyInfo={ state }
      />
    </div>
  )

  const renderAmenities = () => (
    <>
      <div className='view-amenities-btn'>
        <AmenitiesModal 
          essentials={ state.essentials }
          features={ state.features }
          location={ state.location }
          safety={ state.safety_features }
          address={ state.address }
        />
      </div>
    </>
  )
  
  const formattedStr = (amenity2) => {
    if (amenity2 === 'skiin_skiout') {
      return 'Ski-in/Ski-out'
    }
    return amenity2.replace(/_/g, ' ').replace(/\w\S*/g, function(eachWord) {
    return eachWord.charAt(0).toUpperCase() + eachWord.substr(1).toLowerCase();
  }
  )}

  const renderAmenitiesPreview = () => {
    let allAmenities = [...state.essentials, ...state.features, ...state.location, ...state.safety_features]
    return (
      <>
        <h5>Amenities</h5>
        <div>
          { allAmenities.slice(0, 9).map((amenity, index) => {
        
            if(index % 2 === 0) {
              return (
                <div className='row'>
                  <div className="col-md-6 col-sm-12">
                    <span>&#8226; </span>{ formattedStr(amenity)}
                  </div>
                  { allAmenities[index + 1] && (
                    <div className="col-md-6 col-sm-12">
                      <span>&#8226; </span>{ formattedStr(allAmenities[index+1]) }
                    </div>
                  )}
                </div>
              )
            } else { return null }
          })}
        </div>
      </>
    )
  }



  const renderReviews = () => {
    // console.log('all comments is ', allComments)
    if(!allComments || !Array.isArray(allComments)) {
      return
    }
    return (
      <>
        <h4 className="line-left-align" id="all-property-reviews">
          Reviews
          <p className="mb-2 rating-right-align purple-color"><BsStarFill/>{ getAverage() }</p>
        </h4>
        <div className='comment-container row'>
        { allComments.filter(comment => comment.reply === 'Original Property Comment').map((comment, index) => {

          const twoSentences = comment.text_content.split('.').slice(0, 2).join('. ') + (comment.text_content.split('.').length > 2 ? 
        '... see more': '')
          return (
            <div className="col-sm-12 col-md-6 comment-card">
              <p className="line-left-align">
                <h5><BsPersonFill/>{ comment.author }</h5>
                {/* <p className="mb-2 line-right-align purple-color"><BsStarFill/>{ comment.rating }</p> */}
              </p>
              <span>{ twoSentences }</span>
            </div>
          );
          }).slice(0, 6)}


        </div>
      </>
    )
  }
  
  return (
    <>
      <NavbarSO />
      <div className="property-info-container">
        { renderImagePreview() }
        <br />
        <br />

        {/* <div className="property-details">
          <h3>{ state.address }</h3>
          <p>{ state.number_of_rooms } bedrooms
            <span> &#8226; </span>
            { state.number_of_bed } beds
            <span> &#8226; </span>
            { state.baths } bathrooms</p>
          <p>Accomodates up to { state.number_of_guest } guests</p>
        </div>
        <hr/> */}
        
        { renderPropertyDetails() }
        {/* <Button> yo there are things</Button> */}

        <div className='row'>
          <div className="col-md-7 col-sm-12">
            { renderAmenitiesPreview() }
            {/* <div className='view-amenities-btn'>
              <AmenitiesModal 
              essentials={ state.essentials }
              features={ state.features }
              location={ state.location }
              safety={ state.safety_features }
              address={ state.address }
              />
            </div> */}
            { renderAmenities() }
            {/* <h5>About the place:</h5>
            <p>{ state.description }</p> */}
            { renderDescription() }
            {/* <h6 id="rating-link">Questions?</h6>
            <p>Contact { host.username } by
              <span> or </span>
              <a href={ `tel:${ host.phone_number }` }>{ host.phone_number }</a>
            </p> */}
            { renderHost() }
          </div>

          {/* <div className='col-md-5 col-sm-12'>
            <ReservationCard propertyInfo={ state }/>
          </div> */}
          { renderReservationCard() }
        </div>
        <hr className="sticky-line"></hr>

        {/* Commented out reviews */}
        { renderReviews() }
        
        <CommentsModal 
          allComments={ allComments }
          username={ username }
          hostUsername={ host.username }
          getComments={ getComments }
          getRatings={ getRatings }
          allRatings={ allRatings }
          propertyID={ state.id }
        />
      </div>
    </>
  )
}

export default PropertyInfo;