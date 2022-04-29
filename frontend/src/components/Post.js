import { useState } from "react"
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/Post.css";

export default function ViewPost({user, post}) {
    const [postData, setPostData] = useState(post);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes);

    function updatePostData(ID) {
        fetch("getPostData?postID=" + ID)
        .then((response) => response.json())
        .then((data) => setPostData(data))
        .catch((error) => console.error(error));
    }

    function likeClick(postID, likes) {
        setLiked(!liked)
        var newLikes = likes + 1

        if (liked) {
            newLikes = likes - 1;
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({postID: postID, newLikes: newLikes})
        }

        fetch("/updateLikes", requestOptions)
        .then((response) => response.json());
        updatePostData(postID);
        setLikes(newLikes)
    } 

    return (<Card>
            <div className="d-flex align-items-center flex-column">
                <Card.Img variant="top" src={post.photo.asset.url} style={{width: "100%"}}>
                </Card.Img>
            </div>
            
            <Card.Body>

                <Link to={"/profile/" + post.username}>
                    <Card.Title>@{post.username}</Card.Title>
                </Link>
                
                <Card.Text>{post.description}</Card.Text>

                <div className="horizontal-data">
                    {user ? (
                        <Button variant={liked ? "danger" : "success"} onClick={() => likeClick(post._id, likes)}>
                        {liked ? "Unlike" : "Like"}
                        </Button>
                    ) : null}
                    <Card.Text>{likes} Likes</Card.Text>
                </div>

            </Card.Body>

            <Card.Footer className="text-muted">{post.created_at}</Card.Footer>

        </Card>);
}
