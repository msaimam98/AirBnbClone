import Add_pic from '../../components/PhotoAdd'
import Display_pic from '../../components/PhotoDisplay'
import Add_Ava from '../../components/Add_available'
import Display_Ava from '../../components/Display_Available'
import DeleteProp from '../../components/PropertyDeleteButton'
import NavbarSO from '../../components/Navbar'
import ShowRate from '../../components/Show-rating'
import { Button, Modal, Container } from 'react-bootstrap';
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import PropertyUpdateFormfrom from '../../components/Property-update-form';


const PropertyUpdater = (props) => {
    const searchParams = new URLSearchParams(useLocation().search);
    const id = searchParams.get("property_id");



    return (

    
    <>
   
      <NavbarSO />
      <PropertyUpdateFormfrom property_id={id} />

      <div className='text-center'>
      {/* <DeleteProp property_id={id} /> */}
      </div>
      {/* <ShowRate property_id={id} /> */}
      {/* <Rate property_id={id} reservation_id={1}/> */}
      
   
    </>
    )
}

export default PropertyUpdater