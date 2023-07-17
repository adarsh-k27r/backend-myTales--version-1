const express = require('express');
const router = express.Router();
var fetchuser = require('./middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const User = require('../models/User');



//ROUTE 1.0: Get all the stories using: GET "/api/blog/fetchallstories". Login required.
router.get('/fetchallstories', fetchuser, async (req, res) => {

    try {
        const stories = await Blog.find({ user: req.userid });
        res.json(stories);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }

})

//ROUTE 1.1: Get all the stories using: GET "/api/blog/pubstories". No Login required.

router.get('/pubstories', async (req, res) => {

    try {
        const stories = await Blog.find();
        res.json(stories);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }

})


//ROUTE 1.2: Get master stories using: GET "/api/blog/masterstories". No Login required.

router.get('/masterstories', async (req, res) => {

    try {
        const stories = await Blog.find({ user: '6498d90e7e993fd86c3df11c' }).sort({ createdAt: -1 }).limit(3);
        res.json(stories);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }

})

//ROUTE 1.3: Get complete, full story using dynamic route for each story: GET "/api/blog/stories/:id". No Login required.

router.get('/stories/:id', async (req, res) => {

    try {
        // find the story using it's unique object id.
        let story = await Blog.findById(req.params.id);
        res.json(story);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }

})





//ROUTE 2: Add a story using: POST "/api/blog/addstory". Login required.
router.post('/addstory', fetchuser, [
    body('title', 'Title shall be at least 3 chars long').isLength({ min: 3 }),
    body('body', 'Story shall be at least 5 chars long').isLength({ min: 5 })
], async (req, res) => {


    try {
        const userId = req.userid;
        const user = await User.findById(userId).select("-password");
        const { title, body } = req.body;

        //returns any bad requests or error.
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.send({ errors: result.array() });
        }

        const story = new Blog({
            title,
            body,
            user: userId,
            author:user.name,
            date: new Date()

        })

        const savedStory = await story.save();
        res.json(savedStory);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }


})




//ROUTE 3: Delete an existing story using: DELETE "/api/blog/deletestory". Login required.

router.delete('/deletestory/:id', fetchuser, async (req, res) => {

    try {

        // find the story to be deleted and delete it.

        let story = await Blog.findById(req.params.id);
        if (!story) {
            return res.status(404).send("Not found");
        }

        // Allow deletion only if user owns this story.

        if (story.user.toString() !== req.userid) {
            return res.status(401).send("Not Allowed");
        }

        story = await Blog.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Story has been deleted successfully", story: story });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }

})


module.exports = router;