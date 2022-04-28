import express from "express";
import bodyParser from "body-parser";
import functions from "./apiCalls.js";
import multer from "multer";

const {
    createUser, 
    getProfile, 
    createPost, 
    getAllPosts, 
    getPostsOfFollowing, 
    searchForUsername, 
    getPosts,
    updateProfile,
    addFollower,
    removeFollower,
    updateLikes,
    getPostData,
}= functions;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,"public");
    },
    filename:function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

var upload = multer({storage: storage});

app.post("/createUser", upload.single("file"), (request, response) => {
    const body = request.body;
    createUser(body.firstName, body.lastName, body.username, request.file).then((data) => response.json(data))
});

app.get("/getProfile", (request, response) => {
    const user = request.query.user;
    getProfile(user).then((data) => response.json(data));
});

app.post("/createPost", upload.single("file"), (request, response) => {
    const body = request.body;
    createPost(body.user, body.caption, request.file).then((data) => response.json(data));
});

app.get("/getPostsOfFollowing", (request, response) => {
    const user = request.query.user;
    getPostsOfFollowing(user).then((data) => {
        var posts = data[0].following;
        console.log(data[0].following)
        posts = posts.map((post) => post.posts);
        posts = posts.flat(1);
        console.log(posts)
        response.json(posts);
    }).catch((error) => response.json([]));
});

app.get("/getAllPosts", (request, response) => {
    getAllPosts().then((data) => response.json(data));
});

app.get("/searchForUsername", (request, response) => {
    const text = request.query.text;
    searchForUsername(text).then((data) => response.json(data));
});

app.get("/getPosts", (request, response) => {
    const user = request.query.user;
    getPosts(user).then((data) => response.json(data));
});

app.get("/getPostData", (request, response) => {
    const postID = request.query.postID;
    getPostData(postID).then((data) => response.json(data[0]));
});

app.post("/updateProfile", upload.single("file"), (request, response) => {
    const body = request.body;
    updateProfile(body.user, body.first_name, body.last_name, body.bio, request.file)
    .then((data) => response.json(data));
});

app.post("/updateLikes", (request, response) => {
    const body = request.body;
    updateLikes(body.postID, body.newLikes)
    .then((data) => response.json(data));
});

app.post("/addFollower", (request, response) => {
    const body = request.body;
    addFollower(body.user, body.id).then((data) => response.json(data));
});

app.delete("/removeFollower", (request, response) => {
    const body = request.body;
    removeFollower(body.user, body.id).then((data) => response.json(data));
});

app.listen(3001, () => console.log("Started"));
