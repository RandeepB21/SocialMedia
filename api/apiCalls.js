import sanityClient from "./client.js"
import { createReadStream } from "fs";
import { basename } from "path";
import { nanoid } from "nanoid";

const functions = {};

functions.createUser = (firstName, lastName, username, image) => {
    if (image) {
        return sanityClient.assets.upload("image", createReadStream(image.path), {
            filename: basename(image.path),
        })
        .then((data) => {
            return sanityClient.create({
                _type: "user",
                first_name: firstName,
                last_name: lastName,
                username: username,
                photo: {asset: { _ref: data._id }},
                created_at: new Date(),
            });
        });
    } else {
        return sanityClient.create({
            _type: "user",
            first_name: firstName,
            last_name: lastName,
            username: username,
            created_at: new Date(),
        });

    }
};

functions.getProfile = (username) => {
    return sanityClient.fetch(
        `*[_type == "user" && username == $username]{
        ..., 
        "following": count(following),
        "followers": *[_type == "user" && references(^._id)],
        photo{
            asset->{
                _id,
                url,
            }
        }
    }`, 
    {username: username});
};

functions.getUserId = (user) => {
    return sanityClient.fetch(`*[_type == "user" && username == $username]{
        _id
    }`, {username: user})
};

functions.createPost = (user, caption, image) => {
    return sanityClient.assets.upload("image", createReadStream(image.path), {
        filename: basename(image.path)
    }).then((data) => functions.getUserId(user).then((IDs) => {
        const userID = IDs[0]._id;
        return sanityClient.create({
            _type: "post",
            author: {_ref: userID},
            photo: {asset: {_ref: data._id}},
            description: caption,
            created_at: new Date(),
            likes: 0,
        })
    }));
};

functions.getAllPosts = () => {
    return sanityClient.fetch(`*[_type == "post"]{
        ...,
        "username": author->username,
        photo{
            asset->{
                _id,
                url,
            }
        }
    }`)
}

functions.getPostsOfFollowing = (username) => {
    return sanityClient.fetch(`*[_type == "user" && username == $username]{
        following[]->{
            "posts": *[_type == "post" && references(^._id)]{
                ...,
                "username": author->username,
                photo{
                    asset->{
                        _id,
                        url
                    }
                }
            }
        }
    }`, {username: username})
};

functions.searchForUsername = (text) => {
    return sanityClient.fetch(`*[_type == "user" && username match "${text}*"]{
        ...,
        "followers": count(*[_type == "user" && references(^._id)]),
        photo{
            asset->{
                _id,
                url,
            }
        }
    }`,{text});
};

functions.getPosts = (username) => {
    return sanityClient.fetch(`*[_type == "post" && author->username == $username]{
        ...,
        "username": author->username,
        photo{
            asset->{
                _id,
                url
            }
        }

    }`, {username})
}

functions.getPostData = (postID) => {
    return sanityClient.fetch(`*[_type == "post" && _id == $postID]{
        ...,
        "username": author->username,
        photo{
            asset->{
                _id,
                url
            }
        }

    }`, {postID})
}

functions.updateProfile = (user, first_name, last_name, bio, image) => {
    if (image) {
        
        return sanityClient.assets.upload("image", createReadStream(image.path), {
            filename: basename(image.path),
        })
        .then((data) => 
            functions.getUserId(user).then((IDs) => 
                sanityClient
                .patch(IDs[0]._id)
                .set({
                    first_name, 
                    last_name, 
                    bio, 
                    photo: {asset: { _ref: data._id }},
                })
                .commit()

            )
        );

    } else {
        return functions.getUserId(user).then((IDs) =>
            sanityClient
            .patch(IDs[0]._id)
            .set({
                first_name, 
                last_name, 
                bio,
            }).commit()
        );
    }

};

functions.addFollower = (user, followingID) => {
    return functions
        .getUserId(user)
        .then((IDs) => sanityClient.patch(IDs[0]._id)
        .setIfMissing({following: []})
        .insert("after", "following[-1]", [{_ref: followingID, _key: nanoid(), _type: "reference"}])
        .commit());
}

functions.removeFollower = (user, followingID) => {
    return functions
        .getUserId(user)
        .then((IDs) => sanityClient.patch(IDs[0]._id)
        .unset([`following[_ref == "${followingID}"]`])
        .commit());
}

functions.updateLikes = (postID, newLikes) => {
    return sanityClient
    .patch(postID)
    .set({ 
        likes: newLikes,
    })
    .commit()

};

export default functions;
