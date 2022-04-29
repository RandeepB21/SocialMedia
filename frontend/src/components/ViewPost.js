import { useState, useEffect } from "react"
import {Link} from "react-router-dom";
import { Modal, Card } from "react-bootstrap";

export default function ViewPost({show, hideCallBack, post}) {
    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState("");
    const [date, setDate] = useState("");
    
    useEffect(() => {
        setUsername(post.username);
        setDescription(post.description);
        setPhoto(post.photo);
        setDate(post.created_at);
    }, [post]);

    return <Modal show={show} onHide={hideCallBack}>

        <Modal.Header closeButton></Modal.Header>

        <Modal.Body className="center m-2">
            <div className="center m-2" style={{min_width: "30%", maxWidth: "400px"}}>
                <Card>
                    <div className="d-flex align-items-center flex-column">
                        <Card.Img variant="top" src={photo ? photo.asset.url : null} style={{width: "100%"}}>

                        </Card.Img>
                    </div>
                    
                    <Card.Body>
                        <Link to={"/profile/" + username}>
                            <Card.Title>@{username}</Card.Title>
                        </Link>
                        <Card.Text>{description}</Card.Text>
                     </Card.Body>
                    <Card.Footer className="text-muted">{date}</Card.Footer>
                </Card>
            </div>
        </Modal.Body>
    </Modal>
}
