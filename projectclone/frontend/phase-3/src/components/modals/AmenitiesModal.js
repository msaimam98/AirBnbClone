import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import './style.css'

const AmenitiesModal = (props) => {
  const {
    essentials,
    features,
    location,
    safety,
    address
  } = props;


  const [showModal, setShowModal] = useState(false)
  const [total, setTotal] = useState()

  const handleShow = () => setShowModal(true);
  const handleHide = () => setShowModal(false);

  useEffect(() => {
    setTotal(essentials.length + features.length + location.length + safety.length)
  }, [essentials, features, location, safety])

  const formattedStr = (amenity2) => {
    if (amenity2 === 'skiin_skiout') {
      return 'Ski-in/Ski-out'
    }
    return amenity2.replace(/_/g, ' ').replace(/\w\S*/g, function(eachWord) {
    return eachWord.charAt(0).toUpperCase() + eachWord.substr(1).toLowerCase();
  }
  )}

  const renderItem = (amenity, title) => {
    if (amenity.length > 0) {
      return (
        <>
          <div className="amenities-title">
            <strong>{ title }</strong>
          </div>
          { amenity.map((item, index) => {
            if(index % 2 === 0) {
              return (
                <div className="form-group row">
                  <div className="col-md-4">
                    <span>{ formattedStr(item) }</span>
                  </div>
                  { amenity[index + 1] ? (
                    <div className='col-md-4 offset-md-2'>
                      <span>{ formattedStr(amenity[index + 1]) }</span>
                    </div>
                  ) : (
                    <div></div>
                    
                  )}
                </div>
              )
            } else {
              return null;
            }
          })}
        </>
      )
    } else {
      return null;
    }
  }

  return (
    <>
      <Button className="filter-button" variant='outline-secondary' onClick={ handleShow }>
        View all { total } amenities
      </Button>

      <Modal show={ showModal } onHide={ handleHide }>
        <Modal.Header closeButton>
          <Modal.Title>Amenities at { address }</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          { renderItem(essentials, 'Essentials') }
          { renderItem(features, 'Features') }
          { renderItem(location, 'Location') }
          { renderItem(safety, 'Safety') }
          

        </Modal.Body>
      </Modal>
    </>

  )

}

export default AmenitiesModal;

