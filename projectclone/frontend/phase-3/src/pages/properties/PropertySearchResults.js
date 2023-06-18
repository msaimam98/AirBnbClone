import React, { useState } from 'react';
import NavbarSO from '../../components/Navbar/Navbar-signedOut';
import SearchBar from '../../components/Inputs/SearchBar';
import FilterModal from '../../components/modals/FilterModal';
import CardComponent from '../../components/Card/CardComponent';
import { Button } from 'react-bootstrap';
import { RenderStarRating } from '../../components/Card/RenderStarRating';


const PropertySearchResults = (props) => {
  const {
    results
  } = props
  const [start, setStart] = useState(getToday())
  const [end, setEnd] = useState(getToday())
  const [min, setMin] = useState()
  const [max, setMax] = useState()

  const [location, setLocation] = useState('')
  const [numGuest, setNumGuest] = useState(0)

  const [invalid, setInvalid] = useState(false)
  
  function getToday() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd
    } 
    if(mm<10){
      mm='0'+mm
    }
    return yyyy+'-'+mm+'-'+dd;
  }

  const onSearch = () => {
    if(!location || numGuest < 1) {
      setInvalid(true)
    } else {
      setInvalid(false)
      handleSearch()
    }
  }

  const handleSearch = (event) => {
    fetch('http://localhost:8000/webpages/property/search', {
      method: 'GET',
      body: JSON.stringify({
        start_date: start,
        end_date: end,
        location: location,
        number_of_guest: numGuest
      })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })

    const handleBtnClick = (id) => {
      fetch('http://localhost:8000/webpages/property/' + id + '/detail/', {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((data) => console.log(data))
    }

    const renderViewBtn = (id) => (
      <Button className='btnFormatting' onClick={ () => handleBtnClick(id) }>
        View Listing
      </Button>
    )

    const renderResults = () => {
      return Object.entries(results).map(item => {
        return (
          <CardComponent
            propertyID={ item.id }
            image={ item.img }
            title={ item.title }
            description={ item.description }
            price={ item.price }
            totalPrice={ item.totalPrice }
            viewBtn={ renderViewBtn(item.id) }
            topRightBtn={ <RenderStarRating rating={ item.rating }/> }
          />
        )
        
      })

    }

    return (
      <div>
        <NavbarSO />
        <div className='wrapper2'>
          <SearchBar
            setLocation={ setLocation }
            setStart={ setStart }
            setEnd={ setEnd }
            setNumGuest={ setNumGuest }
            onSearch={ onSearch }
            invalid={ invalid }
          />
        </div>
        <FilterModal/>
        <div className="results-row row">
          { renderResults() }
        </div>

      </div>
    )
  }






}

export default PropertySearchResults;