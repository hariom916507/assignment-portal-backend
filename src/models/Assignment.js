const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Draft', 'Published', 'Completed'], default: 'Draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

assignmentSchema.index({ status: 1 });
assignmentSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
