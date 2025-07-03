import mongoose from 'mongoose';

const colleagueSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  experienceInYears: {
    type: Number,
    required: true,
    min: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager', // ✅ case-sensitive match to model name
    required: true
  },
  billingStatus: {
    type: String,
    enum: ['FULLY_BILLED', 'UNBILLED', 'PARTIALLY_BILLED'],
    required: true
  },
  availability: {
    status: {
      type: String,
      enum: ['Available', 'Project delivery', 'On Leave', 'Reserved', 'Onboarding', 'Deactivated'],
      required: true
    },
    availableInDays: {
      type: Number,
      default: 0
    }
  },
  assignment: {
    type: {
      type: String,
      default: 'Unassigned'
    },
    name: {
      type: String,
      default: 'None'
    }
  }
}, { timestamps: true });

colleagueSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

colleagueSchema.set('toJSON', { virtuals: true });

const Colleague = mongoose.models.Colleague || mongoose.model("Colleague", colleagueSchema);
export default Colleague;