const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');
const sc = require('../controllers/submission.controller');

router.post('/:assignmentId/submit', auth, allowRoles('student'), sc.submit);

// teacher views submissions for assignment
router.get('/:assignmentId', auth, allowRoles('teacher'), sc.listForAssignment);

// mark reviewed (teacher)
router.post('/review/:id', auth, allowRoles('teacher'), sc.markReviewed);

module.exports = router;
