import mongoose, { Schema, Document } from "mongoose";

export interface IClassSession extends Document {
  title: string;
  trainer: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  capacity: number;
  bookedSeats: number;
}

const classSessionSchema = new Schema<IClassSession>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    bookedSeats: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ClassSession = mongoose.model<IClassSession>("ClassSession", classSessionSchema);