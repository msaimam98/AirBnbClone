
import {React, useState, useEffect, useContext} from 'react'
import {Form, Container, Col, Row, Image, Button} from 'react-bootstrap';
import './profilestyle.css';
import $ from 'jquery';
import AuthContext from '../../../context';
const Profile = () => {
    const [formDataProfile, setFormDataProfile] = useState({});
    const { token } = useContext(AuthContext);
    const formData = new FormData();
    const [refresh, setRefresh] = useState(0);


    useEffect(() => {
        
    fetch("http://localhost:8000/webpages/profile/edit/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : "Bearer " + token['token']
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFormDataProfile(data);


      })
      .catch((error) => console.error(error));
    
    
    }, []);

    useEffect(() => {

    }, []);


    const handleChangeProfile = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormDataProfile(values => ({
            ...values,
            [name]: value 
        }))
    
      }

    const sendEditRequest = () => {
        fetch("http://localhost:8000/webpages/profile/edit/", {
            method: "PATCH",
            body: JSON.stringify(formDataProfile),
            headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + token['token']
            },
        })
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
            $('#notification').text('Profile edited succesfully!')
            setRefresh(5)
    
    
            })
            .catch((error) => console.error(error));

        }

    const putImageIn = (e) => {
        console.log(e.target.files, 'this is the image whole')
        console.log(e.target.files[0], 'this is the image')


        
        formData.append('avatar', e.target.files[0]);


        fetch("http://localhost:8000/webpages/profile/edit/", {
            method: "PATCH",
            body: formData,
            headers: {
            "Authorization" : "Bearer " + token['token']
            },
        })
            .then((response) => response.json())
            .then((data) => {
            console.log(data, 'bro bro');
            $('#notification').text('Profile edited succesfully!')
            setRefresh(3)
            setFormDataProfile(prevState => ({
                ...prevState,
                avatar: data.avatar
              }));

        
    
    
            })
            .catch((error) => console.error(error));


    }


  return (
    <Form className='form234'>
        <Container>
            <Row>
                <Col className='picture-col'>
                    <div className='picture-frame'>
                        <Image fluid roundedCircle src={formDataProfile.avatar} id="wizardPicturePreview" title="" />
                        <input onChange={putImageIn} name="avatar" type="file"/>
                        {/* <h6 className="">Choose Picture1</h6> */}
                    </div>
                </Col>
                <Col xs={12}>
                    <br />
                    <div className='textdat'>
                        <h6 className="">Choose Picture</h6>
                    </div>
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <Form.Label>First Name:</Form.Label>
                    <Form.Control onChange={handleChangeProfile} type='text' name="first_name"  value={formDataProfile.first_name}/>
                </Col>
                <Col>
                    <Form.Label>Last Name:</Form.Label>
                    <Form.Control onChange={handleChangeProfile} type='text' name="last_name"  value={formDataProfile.last_name}/>
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control onChange={handleChangeProfile} type='email' name="email"  value={formDataProfile.email}/>
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <Form.Label>Phone Number:</Form.Label>
                    <Form.Control onChange={handleChangeProfile} type='text' name="phone_number" value={formDataProfile.phone_number}/>
                </Col>
            </Row>
            <br />
            <br />
            <Row id="editbutton" className='aligner'>
                <Col>
                    <Button onClick={sendEditRequest}> Edit </Button>
                </Col>
            </Row>
            <p id='notification'></p>



        </Container>



    </Form>

  )
}

export default Profile
