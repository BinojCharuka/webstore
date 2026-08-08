import mongoose, { Schema, Document } from "mongoose";

export interface IEducation {
  degree: string;
  institution: string;
  year: string;
  desc: string;
}

export interface IExperience {
  role: string;
  company: string;
  year: string;
  desc: string;
}

export interface IProfile extends Document {
  education: IEducation[];
  experience: IExperience[];
  skills: string[];
}

const EducationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
  desc: { type: String, required: true },
});

const ExperienceSchema = new Schema<IExperience>({
  role: { type: String, required: true },
  company: { type: String, required: true },
  year: { type: String, required: true },
  desc: { type: String, required: true },
});

const ProfileSchema = new Schema<IProfile>({
  education: [EducationSchema],
  experience: [ExperienceSchema],
  skills: [{ type: String }],
});

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
