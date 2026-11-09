import { createServerFn } from "@tanstack/react-start";
import { getPortfolioFromDb, savePortfolioToDb, isDbConfigured } from "./db";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "./cloudinary";
import { isPortfolioContent, type PortfolioContent } from "../data/portfolio";

export const getPortfolioFn = createServerFn({ method: "GET" }).handler(async () => {
  const content = await getPortfolioFromDb();
  return {
    content,
    dbConfigured: isDbConfigured(),
  };
});

export const savePortfolioFn = createServerFn({ method: "POST" })
  .validator((data: unknown): PortfolioContent => {
    if (!isPortfolioContent(data)) {
      throw new Error("Invalid portfolio content structure");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const result = await savePortfolioToDb(data);
    return result;
  });

export const uploadImageFn = createServerFn({ method: "POST" })
  .validator((data: unknown): { image: string; folder?: string } => {
    if (
      !data ||
      typeof data !== "object" ||
      !("image" in data) ||
      typeof (data as { image: unknown }).image !== "string"
    ) {
      throw new Error("Image data (Base64 or Data URI) is required");
    }
    const folder =
      "folder" in data && typeof (data as { folder: unknown }).folder === "string"
        ? (data as { folder: string }).folder
        : undefined;
    return {
      image: (data as { image: string }).image,
      folder,
    };
  })
  .handler(async ({ data }) => {
    const result = await uploadImageToCloudinary(data.image, { folder: data.folder });
    return result;
  });

export const getStatusFn = createServerFn({ method: "GET" }).handler(async () => {
  return {
    dbConfigured: isDbConfigured(),
    cloudinaryConfigured: isCloudinaryConfigured(),
  };
});
