import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export default function Login({setAlert, setUser}) {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    function handleLogin(e) {
        fetch("/getProfile?user=" + username).then((response) => response.json()).then((data) => {
            if (data.length > 0) {
                setAlert({variant: "success", message: "Logged In"});
                setUser(data[0].username);
                navigate("/");
            } else {
                setAlert({variant: "danger", message: "User Does Not Exist"});
            }
        }).catch((error) => setAlert({variant: "danger", messaged: error.message}));
    }
    return <Form className="center-form">
        <Form.Group className="mb-4">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" onInput= {(e) => {setUsername(e.target.value)}}/>

            <small className="form-text text-muted">New User? Sign Up <Link to="/sign-up">Here</Link></small>

        </Form.Group>

        <Button variant="primary" type="button" onClick={handleLogin}>Login</Button>

    </Form>;
}
