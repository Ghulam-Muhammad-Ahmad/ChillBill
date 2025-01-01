import mongoose from 'mongoose';

// Define the expense schema
const expenseSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true, // Ensures expense is linked to a valid category
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Define the Expense model
const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

export default Expense;
