const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/PostModel");

const getPosts = async(req,res)=>{
    const { page } = req.query;
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await Post.countDocuments({});
        const posts = await Post.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        return res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const getPostsBySearch = async(req,res)=>{
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, "i");
        const posts = await Post.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});
        return res.json({ data: posts });
    } catch (error) {    
        return res.status(404).json({ message: error.message });
    }
}

const getPost = async(req,res)=>{
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        return res.status(200).json(post);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const createPost = async(req,res)=>{
    const post = req.body;
    const newPost = new Post({ ...post, creator: post.creator, createdAt: new Date().toISOString() })
    try {
        await newPost.save();
        return res.status(201).json(newPost);
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}

const updatePost = async(req,res)=>{
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
    await Post.findByIdAndUpdate(id, updatedPost, { new: true });
    return res.json(updatedPost);
}

const deletePost = async(req,res)=>{
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    await Post.findByIdAndRemove(id);
    return res.json({ message: "Post deleted successfully." });
}

const likePost = async(req,res)=>{
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    const post = await Post.findById(id);
    const index = post.likes.findIndex((id) => id ===String(req.userId));
    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    return res.status(200).json(updatedPost);
}

const commentPost = async(req,res)=>{
    const { id } = req.params;
    const { value } = req.body;

    const post = await Post.findById(id);

    post.comments.push(value);

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    return res.json(updatedPost);
}

module.exports = {getPost,getPosts,getPostsBySearch,createPost,updatePost,deletePost,likePost,commentPost};