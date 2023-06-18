import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap'
import './style.css'

const SearchBar = (props) => {
  const {
    setLocation,
    setStart,
    setEnd,
    setNumGuest,
    onSearch,
    // setMax,
    // setMin,
    invalid
  } = props;


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

  function makeDay(day) {
    var today = new Date(day);
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

  // function checkDate() {
  //   var today = getToday();
  //   setMin(today)
  //   // document.getElementById("start").setAttribute("min", today);
  //   var start = document.getElementById('start');
  //   var end = document.getElementById('end');
    
  //   if(start) {
  //     var minDate = new Date(start);
  //     minDate.setDate(minDate.getDate() + 2);
  //     let strMinDate = new Date(minDate).toISOString().slice(0, 10);
  //     var mini = makeDay(strMinDate);
  //     setMin(mini)
  //     // document.getElementById('end').setAttribute('min', mini);
  //   }
  //   if(end) {
  //     var maxDate = new Date(end.value);
  //     maxDate.setDate(maxDate.getDate());
  //     let strMaxDate = new Date(maxDate).toISOString().slice(0, 10);
  //     var maxi = makeDay(strMaxDate)
  //     setMax(maxi)
  //     // document.getElementById('start').setAttribute('max', maxi)
  //   }
  // };

  return (
    <>
    <div className='line'>
    <InputGroup>
      <Form.Control 
        placeholder='Location'
        type='text'
        required
        name='location'
        onChange={ (e) => setLocation(e.target.value) }
      />
      <Form.Control 
        type='date'
        required
        id='start'
        name='start'
        min={ getToday() }
        onChange={ (e) => setStart(e.target.value) }
      />
      <Form.Control 
        type='date'
        required
        id='end'
        name='end'
        min={ getToday( )}
        onChange={ (e) => setEnd(e.target.value) }
      />

      <Form.Control 
        placeholder='# of Guests'
        type="number"
        min="0"
        required
        name='numGuests'
        onChange={ (e) => setNumGuest(e.target.value) }
      />
      <Button onClick={ () => onSearch() }>Search</Button>

      </InputGroup>
    </div>
      
      { invalid ? 
        <p className='invalid'>
          Missing required field
        </p>
        : null
      }
      
    </>
    
  )
}

export default SearchBar;