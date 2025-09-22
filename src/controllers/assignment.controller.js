const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// Create assignment (teacher)
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const assignment = await Assignment.create({
      title, description, dueDate, createdBy: req.user.id
    });
    return res.status(201).json({ assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update assignment (only if Draft and owner)
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    if (assignment.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not owner' });
    if (assignment.status !== 'Draft') return res.status(400).json({ message: 'Only Draft assignments are editable' });
    Object.assign(assignment, req.body);
    await assignment.save();
    return res.json({ assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete assignment (only if Draft & owner)
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    if (assignment.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not owner' });
    if (assignment.status !== 'Draft') return res.status(400).json({ message: 'Only Draft can be deleted' });
    await assignment.remove();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Publish assignment (Draft -> Published)
exports.publish = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    if (assignment.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not owner' });
    if (assignment.status !== 'Draft') return res.status(400).json({ message: 'Only Draft can be published' });
    assignment.status = 'Published';
    assignment.publishedAt = new Date();
    await assignment.save();
    return res.json({ assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark Completed (teacher after review)
exports.markCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    if (assignment.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not owner' });
    assignment.status = 'Completed';
    assignment.completedAt = new Date();
    await assignment.save();
    return res.json({ assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// List assignments (teacher: filter by status; student: only Published)
exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;
    const qStatus = req.query.status;
    const query = {};

    if (req.user.role === 'teacher') {
      query.createdBy = req.user.id;
      if (qStatus) query.status = qStatus;
    } else {
      // student
      query.status = 'Published';
    }

    const [items, total] = await Promise.all([
      Assignment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Assignment.countDocuments(query)
    ]);
    return res.json({ items, total, page, limit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get assignment by id (student only if Published)
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id).populate('createdBy','name email');
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'student' && assignment.status !== 'Published') {
      return res.status(403).json({ message: 'Students can only view Published assignments' });
    }
    return res.json({ assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
