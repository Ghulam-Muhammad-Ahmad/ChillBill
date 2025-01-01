import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'both'], // Categories can be for income, expense, or both
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)
export default Category
