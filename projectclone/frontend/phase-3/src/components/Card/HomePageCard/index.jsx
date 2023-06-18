import '../cardstyles.css'
import { React, useEffect, useState, useContext} from 'react';
// import Img from '../../../components/Display_one_pic'
import DisplayOne from '../../../components/Display_one_pic';
import { Card, Button } from 'react-bootstrap';
import AuthContext from '../../../context';
import { useNavigate } from 'react-router-dom';

export const CardComponentH = (props) => {

    const [property, setProperty] = useState({
        address: "", 
        number_of_guest: 0, 
        number_of_bed: 0,
        number_of_rooms: 0,
        baths: 0,
        description: "",
        essentials: "",
        features: "",
        safety_features: "", 
        location: "", 

    });
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();



    const onViewListing = (event) => {
        event.preventDefault()
        fetch('http://localhost:8000/webpages/property/' + props.property_id + '/detail/', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },

        })
        .then((res) => res.json())
        .then((data) => {
        console.log(data, 'this is right before the navigate')
        navigate('/property-info', {state: data});

        })
    }


    useEffect(() => {
        fetch('http://localhost:8000/webpages/property/' + props.property_id + '/detail/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
    
            })
            .then((res) => res.json())
            .then((data) => {
            setProperty(data);
    
            })
        
        
        }, []);


return (
    <div className='col-sm-12 col-md-6 col-lg-4 results-card'>
        <Card style={{ width: "28vw"}}>
                <div className='fixit w-100'>
                    <DisplayOne property_id={props.property_id} />
                </div>
            <Card.Body>
                <br />
                <Card.Title>{ property.address }</Card.Title>
                <p>description:</p>
                <Card.Text>{ property.description }</Card.Text>
                <Card.Text>
                    <p className='card-left-align'>
                        ${ props.price}/night

                    </p>
                </Card.Text>
                <Button onClick={onViewListing} className="btn btn-primary" size='sm'>View Listing</Button>
            </Card.Body>
        </Card>
    </div>
  


  )

}

export default CardComponentH;