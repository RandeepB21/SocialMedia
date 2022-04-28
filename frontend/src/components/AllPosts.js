import { useState, useEffect } from "react";
import "../css/AllPosts.css";
import Post from "./Post";

export default function AllPosts({user}) {
    const [allPostsData, setAllPosts] = useState(null);

    useEffect(() => {
        if (!user) {
            fetch("/getAllPosts")
            .then((response) => response.json())
            .then((data) => setAllPosts(data)).catch((error) => console.error(error));
        } else {
            fetch("/getPostsOfFollowing?user=" + user)
            .then((response) => response.json())
            .then((data) => setAllPosts(data)).catch((error) => console.error(error));
        }
    }, [user]);


    return (<div className="center mt-3">
        {allPostsData ? allPostsData.map((post, index) => (
            <div className="center m-2" style={{min_width: "30%", maxWidth: "400px"}} key={index}>

                <Post user={user} post={post}></Post>

            </div>
        )): <p>No Posts to Show</p>}
    </div>);
}
