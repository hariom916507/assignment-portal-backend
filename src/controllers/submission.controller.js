const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

// Student submit answer
exports.submit = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { answer } = req.body;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (assignment.status !== 'Published') return res.status(400).json({ message: 'Assignment not published' });
    if (new Date() > new Date(assignment.dueDate)) return res.status(400).json({ message: 'Due date passed' });

    // One submission per student enforced by unique index; but check to return friendly error
    const existing = await Submission.findOne({ assignment: assignmentId, student: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already submitted' });

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      answer,
    });

    return res.status(201).json({ submission });
  } catch (err) {
    // handle unique index error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already submitted' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Teacher: list submissions for assignment
exports.listForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    // Ensure teacher owns the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (assignment.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not owner' });

    const submissions = await Submission.find({ assignment: assignmentId }).populate('student','name email').sort({submittedAt:-1});
    return res.json({ submissions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Teacher: mark a submission as reviewed
exports.markReviewed = async (req, res) => {
  try {
    const { id } = req.params; // submission id
    const submission = await Submission.findById(id).populate('assignment');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    // verify teacher owns assignment
    if (submission.assignment.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not owner of assignment' });

    submission.reviewed = true;
    submission.reviewedBy = req.user.id;
    submission.reviewedAt = new Date();
    await submission.save();
    return res.json({ submission });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
