import { useState, useEffect } from "react";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import "../css/CreatePost.css";

export default function CreatePost({user, setAlert}) {
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setAlert({variant: "danger", message: "Sign In To Make A Post"});
            navigate("/login");
        }
    }, [user]);

    function uploadFile(e) {
        setFile(e.target.files[0]);
    }

    function makePost() {
        const formData = new FormData();
        formData.append('user', user);
        formData.append('caption', caption);
        formData.append("file", file);
        const requestOptions = {
            method: "POST",
            body: formData,
        };
        fetch("/createPost", requestOptions).then((_response) => {
            setAlert({variant: "success", message: "Post Created"});
            navigate("/");
        }).catch((error) => setAlert({variant: "danger", message: error.message}));
    }

    return (<Form className="post-form">
            <div className="create-post">
                <Form.Group className="mb-3"> 
                    <img src={file ? URL.createObjectURL(file) : null} className="post-image"/>
                </Form.Group>

                <Form.Group className="mb-3"> 
                    <input type="file" accept="image/*" onChange={uploadFile}/>
                </Form.Group>

                <Form.Group className="mb-3"> 
                    <Form.Control type="text" placeholder="Enter Caption" onInput={(e) => setCaption(e.target.value)}></Form.Control>
                </Form.Group>

                <div className="post-button-wrapper">
                    <Button variant="primary" type="button" onClick={makePost} className="post-button">Post</Button>
                </div>
            </div>
        </Form>);
}
