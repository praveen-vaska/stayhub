import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage?: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  preferredVisitDate?: string;
  status: "New" | "Contacted" | "Visit Scheduled" | "Converted" | "Closed";
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    propertyId: { type: String, required: true, index: true },
    propertyTitle: { type: String, required: true },
    propertyLocation: { type: String, required: true },
    propertyImage: { type: String },
    userId: { type: String, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    message: { type: String, required: true },
    preferredVisitDate: { type: String },
    status: {
      type: String,
      enum: ["New", "Contacted", "Visit Scheduled", "Converted", "Closed"],
      default: "New",
      index: true,
    },
    ownerId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
