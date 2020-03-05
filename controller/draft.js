const express = require('express');
const router = express.Router();
const blog = require('../service/blog');

const DRAFT = 0



// router.get('/search', (req, res, next) => {
//     search.global_search_blogs(req, res, next);
// });

router.post('/', (req, res, next) => {
    blog.add_blog(req, res, next);
});

router.put('/:uuid', (req, res, next) => {
    blog.update_blog_attr(req, res, next);
});

router.post('/getDraft', (req, res, next) => {
    blog.get_draft_by_uuid(req, res, next);
});

router.delete('/:uuid', (req, res, next) => {
    blog.delete_blog(req, res, next);
});

module.exports = router;
