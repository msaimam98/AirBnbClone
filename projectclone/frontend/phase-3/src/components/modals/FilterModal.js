import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsFillFilterSquareFill, BsStar } from 'react-icons/bs'
import './style.css'

export const FilterModal = () => {

  const [showModal, setShowModal] = useState(false);
  const [minPrice, setMinPrice] = useState()
  const [maxPrice, setMaxPrice] = useState()
  const [numBed, setNumBed] = useState()
  const [numBedroom, setNumBedroom] = useState()
  const [numBath, setNumBath] = useState()
  const [activeBedroom, setActiveBedroom] = useState(Array(6).fill(false));
  const [activeBed, setActiveBed] = useState(Array(6).fill(false));
  const [activeBath, setActiveBath] = useState(Array(6).fill(false));
  const [checked, setChecked] = useState([]);
  const [rating, setRating] = useState()
  
  const handleShow = () => setShowModal(true);
  const handleHide = () => setShowModal(false);
  
  const handleApply = () => {
    console.log('checked is ', checked)
    console.log('num stuff is ', numBedroom, numBed, numBath)
    console.log('rating is ', rating)
    console.log('pricing is ', minPrice, maxPrice)
    setShowModal(false)
  }

  const handleCancel = () => {
    setChecked([])
    setNumBed('')
    setNumBedroom('')
    setNumBath('')
    setRating()
    setShowModal(false)
  }

  const handleBtnClick = (item, index) => {
    if(item === 'bedroom') {
      setNumBedroom(index+1)
      const newActive = [...activeBedroom];
      newActive.forEach((state, i) => {
        if (state && i !== index) {
          newActive[i] = false;
        }
      });
      newActive[index] = true;
      setActiveBedroom(newActive);
    } else if(item === 'bed') {
      setNumBed(index+1)
      const newActive = [...activeBed];
      newActive.forEach((state, i) => {
        if (state && i !== index) {
          newActive[i] = false;
        }
      });
      newActive[index] = true;
      setActiveBed(newActive);
    } else {
      setNumBath(index+1)
      const newActive = [...activeBath];
      newActive.forEach((state, i) => {
        if (state && i !== index) {
          newActive[i] = false;
        }
      });
      newActive[index] = true;
      setActiveBath(newActive);
    }
  }

  const getActiveArr = (item, index) => {
    if(item === 'bed') {
      return activeBed[index]
    } else if(item === 'bedroom') {
      return activeBedroom[index]
    } else {
      return activeBath[index]
    }
  }

  const buttonOptions = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6+'
  ]

  const ratingOptions = [
    1, 2, 3, 4, 5
  ]

  const checkboxEssentials = [
    { id: 'essential1', label: 'Wifi' },
    { id: 'essential2', label: 'TV' },
    { id: 'essential3', label: 'Kitchen' },
    { id: 'essential4', label: 'Workspace' },
    { id: 'essential5', label: 'Air Conditioning' },
    { id: 'essential6', label: 'Heating' },
    { id: 'essential7', label: 'Washer' },
    { id: 'essential8', label: 'Dryer' }
  ];

  const checkboxFeatures = [
    { id: 'feature1', label: 'Pool' },
    { id: 'feature2', label: 'Hot Tub' },
    { id: 'feature3', label: 'Patio' },
    { id: 'feature4', label: 'Grill' },
    { id: 'feature5', label: 'Gym' },
    { id: 'feature6', label: 'Piano' },
    { id: 'feature7', label: 'Fire Pit' },
    { id: 'feature8', label: 'Outdoor Shower' }
  ];

  const checkboxLocation = [
    { id: 'location1', label: 'Lake Access' },
    { id: 'location2', label: 'Beach Access' },
    { id: 'location3', label: 'Ski in/out' }
  ]

  const checkboxSafety = [
    { id: 'safety1', label: 'Smoke Detector' },
    { id: 'safety2', label: 'Fire Extinguisher' },
    { id: 'safety3', label: 'First Aid Kit' }
  ]


  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const value = event.target.value;

    if (isChecked) {
      setChecked([...checked, value]);
    } else {
      setChecked(checked.filter((item) => item !== value));
    }
  };

  const handleRating = (star) => {
    setRating(star)
  }

  const styleRating = (star) => {
    if(rating >= star) {
      return 'color-rating staricon'
    } else {
      return 'no-color-rating staricon'
    }
  }

  const renderRatings = () => (
    <div className='modal-category'>
      { ratingOptions.map(star => {
        return (
          <>
            <BsStar
              className={ styleRating(star) }
              onClick={() => handleRating(star) }
              key={ star }
            />
            <span className='rating-text'>{ star }</span>
          </>
        )
      })}
    </div>
  )
  

  const renderCheck = (checkType) => { return checkType.map((item, index) => {
    if (index % 2 === 0) {
      return (
        <div className="form-group row">
          <div className="col-md-4">
            <input
              type="checkbox"
              id={ item.id }
              value={ item.label }
              checked={ checked.includes(item.label) }
              onChange={ handleCheckboxChange }
              key={ item.id }
            />
            <label htmlFor={ item.id } className='idk'>{ item.label }</label>
          </div>
          
          { checkType[index + 1] && (
            <div className="col-md-4 offset-md-2">
              <input
                type="checkbox"
                id={ checkType[index + 1].id }
                value={ checkType[index + 1].label }
                checked={ checked.includes(checkType[index + 1].label) }
                onChange={ handleCheckboxChange }
                key={ checkType[index + 1].id }
              />
              <label htmlFor={ checkType[index + 1].id } className='idk'>
                { checkType[index + 1].label }
              </label>
            </div>
          )}
          
        </div>
      );
    } else { return null; }
  })}


  const renderButtonGroup = (item) => (
    <div className="col-sm-10 form-group-button d-flex justify-content-end">
      { buttonOptions.map((btn, index) => (
        <Button
          key={ index }
          id={ item+'-group-'+index }
          onClick={() => handleBtnClick(item, index) }
          active={ getActiveArr(item, index) }
          variant='outline-secondary'
          className='rounded-pill mx-1'
        >{ btn }
        </Button>
      ))}
    </div>
  )

  const renderPriceRange = () => (
    <>
      {/* <input type="range" min="0" max="1000"/> */}
      <form>
        <div className="row justify-content-around">
          <div className="col-sm-4 price-input">
            <input type="number" min={ 0 }className="form-control" placeholder="Min $/night" onChange={ (event) => setMinPrice(event.target.value) }/>
          </div> 
          <div className="col-sm-4 price-input">
            <input type="number" min={ 0 } className="form-control" placeholder="Max $/night" onChange={ (event) => setMaxPrice(event.target.value) }/>
          </div>
        </div>
      </form>
    </>
    
  )

  return (
    <>
      <Button className="filter-button" variant='outline-secondary' onClick={ handleShow }>
        <BsFillFilterSquareFill className='reacticon'/>Filters
      </Button>

      <Modal show={ showModal } onHide={ handleHide }>
      <Modal.Header closeButton>
        <Modal.Title>Filters</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <h6 className="modal-category">Price Range</h6>
        { renderPriceRange() }
        <hr/>

        <h6 className='modal-category'>Rooms</h6>
        <div className="rooms-sub"></div>
        <Form>
          <div className='form-group row'>
            <Form.Label className='col-sm-2 col-form-label'>Bedrooms</Form.Label>
            { renderButtonGroup('bedroom') }
          </div>
          <div className='form-group row'>
            <Form.Label className='col-sm-2 col-form-label'>Beds</Form.Label>
            { renderButtonGroup('bed') }
          </div>
          <div className='form-group row'>
            <Form.Label className='col-sm-2 col-form-label'>Baths</Form.Label>
            { renderButtonGroup('bath') }
          </div>
        </Form>
        <hr/>

        <h6 className="modal-category">Ratings</h6>
        { renderRatings() }
        <hr/>

        <h6 className="modal-category">Amenities</h6>
        <Form>
          <div className="amenities-title">
            <strong>Essentials</strong>
          </div>
          { renderCheck(checkboxEssentials) }
          <div className="amenities-title">
            <strong>Features</strong>
          </div>
          { renderCheck(checkboxFeatures) }
          <div className="amenities-title">
            <strong>Location</strong>
          </div>
          { renderCheck(checkboxLocation) }
          <div className="amenities-title">
            <strong>Safety</strong>
          </div>
          { renderCheck(checkboxSafety) }
        </Form>

          
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={ handleCancel }>
          Cancel
        </Button>
        <Button variant="primary" onClick={ handleApply }>
          Apply
        </Button>
      </Modal.Footer>
      </Modal>
    </>
    
  )
};

export default FilterModal;