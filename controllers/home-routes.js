const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attirbutes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // We added the .get to the data returned by the promise and added 'plain: true' to cut it down to only the data we need
        res.render('homepage', {posts});
    })
    .catch(err => {
        console.log(err => {
            console.log(err);
            res.status(500).json(err)
        })
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;