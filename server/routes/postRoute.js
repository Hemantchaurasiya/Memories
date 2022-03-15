const express = require("express");
const postRouter = express.Router();
const auth = require("../middlewares/auth");
const {getPost,getPosts,getPostsBySearch,createPost,updatePost,deletePost,likePost,commentPost} = require("../controllers/postController");

// get a post by search
postRouter.get('/search',getPostsBySearch);

// create a post
postRouter.post('/',auth,createPost);

// get a post
postRouter.get('/:id',getPost);

// get all post
postRouter.get('/',getPosts);

// update a post
postRouter.patch('/:id',auth,updatePost);

// delete post
postRouter.delete('/:id',auth,deletePost);

// like the post
postRouter.patch('/:id/likePost',auth,likePost);

// comment in the post
postRouter.post('/:id/commentPost',auth,commentPost);

module.exports = postRouter;


