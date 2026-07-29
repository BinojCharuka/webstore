import mongoose, { Schema, Document } from "mongoose";

export interface IPackage extends Document {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  popular: boolean;
}

const PackageSchema = new Schema<IPackage>({
  name: { type: String, required: true },
  price: { type: String, required: true },
  period: { type: String, required: true },
  desc: { type: String, required: true },
  features: [{ type: String }],
  popular: { type: Boolean, default: false },
});

export default mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);
