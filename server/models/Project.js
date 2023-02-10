const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `A Project must have a name`],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'Project name must have less than or equal to 40 characters',
      ],
      minLength: [
        10,
        'Project name must have more than or equal to 40 characters',
      ],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: {
        values: ['Not Started', 'In Progress', 'Completed'],
        message:
          '{VALUE} is not supported. Accepted Values - Not Started, In Progress, Completed',
      },
    },
    clientId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Client',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Project', ProjectSchema);
