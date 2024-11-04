import { generate as generateUrlcode } from "generate-password";
import { UrlPayloadType, UrlType } from "../types";
import Url from "../models/UrlModel";

export const createUrl = async (payload: UrlPayloadType) => {
  if (!payload.originalLink) throw Error("Missing required parameters");

  try {
    let url = new Url(payload);

    const urlCode = generateUrlcode({
      length: 6,
      uppercase: true,
    });

    url.urlCode = urlCode;

    url = await url.save();

    return url;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create URL");
  }
};

export const getUrlByUrlCode = async (urlCode: string) => {
  try {
    let data = await Url.findOne({ urlCode });
    if (data) {
      data.visitCount = data.visitCount + 1;
      await data.save();
    }
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve URL");
  }
};

export const updateUrlCode = async (payload: Partial<UrlType>) => {
  if (!payload.urlCode) throw Error("Invalid urlCode");

  try {
    let data = await Url.findOne({ urlCode: payload.urlCode });
    if (!data) throw new Error("URL not found");

    const editableColumn: Array<Partial<keyof UrlType>> = ["name", "originalLink"];
    Object.keys(payload).forEach((key: any) => {
      if (editableColumn.includes(key)) {
        data[key] = payload[key];
      }
    });

    return await data.save();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update URL");
  }
};

export const deleteUrlByUrlCode = async (urlCode: string) => {
  try {
    await Url.deleteOne({ urlCode });
    return "Deleted successfully";
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete URL");
  }
};

export const getUrlsForUser = async (userId: string) => {
  try {
    const urls = await Url.find({ userId }).exec();
    return urls;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve URLs for user");
  }
};
