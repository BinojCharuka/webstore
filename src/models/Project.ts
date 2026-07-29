import mongoose, { Schema, Document } from "mongoose";

export interface IFeature {
  title: string;
  desc: string;
  img: string;
}

export interface ICaseStudyDetails {
  timeline: string;
  users: string;
  completionRate: string;
  lighthouse: string;
  problem: string;
  approach: string;
  features: IFeature[];
}

export interface IProject extends Document {
  title: string;
  subtitle: string;
  desc: string;
  category: "portfolio" | "lms" | "frontend";
  tags: string[];
  img: string;
  year: string;
  techStack: string[];
  caseStudyDetails: ICaseStudyDetails;
}

const FeatureSchema = new Schema<IFeature>({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
});

const CaseStudyDetailsSchema = new Schema<ICaseStudyDetails>({
  timeline: { type: String, required: true },
  users: { type: String, required: true },
  completionRate: { type: String, required: true },
  lighthouse: { type: String, required: true },
  problem: { type: String, required: true },
  approach: { type: String, required: true },
  features: [FeatureSchema],
});

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  desc: { type: String, required: true },
  category: { type: String, enum: ["portfolio", "lms", "frontend"], required: true },
  tags: [{ type: String }],
  img: { type: String, required: true },
  year: { type: String, required: true },
  techStack: [{ type: String }],
  caseStudyDetails: { type: CaseStudyDetailsSchema, required: true },
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
