import mongoose, { Schema, type Document } from 'mongoose';

export interface IBooking extends Document {
  member: mongoose.Types.ObjectId;
  session: mongoose.Types.ObjectId;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session: {
    type: Schema.Types.ObjectId,
    ref: 'ClassSession',
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, { timestamps: true });

bookingSchema.index(
  { member: 1, session: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'confirmed' }
  }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);