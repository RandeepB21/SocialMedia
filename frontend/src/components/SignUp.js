import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SignUp({setAlert, setUser}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [file, setFile] = useState("");
    const navigate = useNavigate();

    function updateUsername(input) {
        setUsername(input.target.value)
    }

    function updateFirstName(input) {
        setFirstName(input.target.value)
    }

    function updateLastName(input) {
        setLastName(input.target.value)
    }
    
    function createUser(input) {
        const formData = new FormData();
        console.log('username is' ,username);
        formData.append("file", file);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("username", username);
        const requestOptions = {
            method: "POST",
            body: formData,
        };
        fetch("/createUser", requestOptions).then((response) => response.json())
        .then((data) => {
            console.log(data.username);
            setAlert({
                variant: "success", 
                message: "Account Created Successfully",
            });
            setUser(data.username);
            navigate("/");
        })
        .catch((error) => setAlert({variant: "danger", message: error.message}));
    }

    return <Form className="center-form">

        <Form.Group className="mb-3"> 
            <img src={file ? URL.createObjectURL(file) : null} className="post-image"/>
        </Form.Group>

        <Form.Group className="mb-3">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
        </Form.Group>
        
        <Form.Group className="mb-4">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" onInput={updateUsername}/>
        </Form.Group>

        <Form.Group className="mb-4">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="First Name" onInput={updateFirstName}/>
        </Form.Group>

        <Form.Group className="mb-4">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Last Name" onInput={updateLastName}/>
        </Form.Group>

        <Button variant="primary" type="button" onClick={createUser}>Sign Up</Button>

    </Form>;
}
