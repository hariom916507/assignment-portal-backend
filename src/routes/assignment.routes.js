const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');
const ac = require('../controllers/assignment.controller');

router.post('/', auth, allowRoles('teacher'), ac.createAssignment);
router.put('/:id', auth, allowRoles('teacher'), ac.updateAssignment);
router.delete('/:id', auth, allowRoles('teacher'), ac.deleteAssignment);
router.post('/:id/publish', auth, allowRoles('teacher'), ac.publish);
router.post('/:id/complete', auth, allowRoles('teacher'), ac.markCompleted);
router.get('/', auth, ac.list);
router.get('/:id', auth, ac.getById);

module.exports = router;
