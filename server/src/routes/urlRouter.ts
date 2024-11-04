import express, { Router, Request, Response } from "express";
import Url from "../models/UrlModel";
import {
  createUrl,
  deleteUrlByUrlCode,
  getUrlByUrlCode,
  getUrlsForUser,
  updateUrlCode,
} from "../services/urlServices";
import { verifyAccessToken } from "../middlewares/authToken";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { originalLink } = req.body;

  if (!originalLink) {
    return res.status(400).json("Missing required parameters");
  }

   let userId;
  const user = await verifyAccessToken(req, res);
  if (user) {
    userId = user.id;
  }

  try {
    let urlData = await Url.findOne({ originalLink });
    if (urlData) {
      return res.status(200).json(urlData);
    }

    const data = await createUrl({ originalLink, userId });
    res.status(201).json(data);
  } catch (error) {
    console.error("Failed to create URL:", error);
    res.status(500).json("Internal server error");
  }
});

router.get("/:urlCode", async (req: Request, res: Response) => {
  const urlCode = req.params.urlCode;
  if (!urlCode) {
    return res.status(400).send("Bad request");
  }

  try {
    const data = await getUrlByUrlCode(urlCode);
    if (data) {
      res.status(301).redirect(data.originalLink);
    } else {
      res.status(404).json("URL not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
});

router.get("/user/:userId", verifyAccessToken, async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (userId !== req["user"].id) {
    return res.status(401).json("Access denied");
  }

  try {
    const data = await getUrlsForUser(userId);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
});

router.put("/:urlCode", verifyAccessToken, async (req: Request, res: Response) => {
  const urlCode = req.params.urlCode;
  if (!urlCode) {
    return res.status(400).send("Bad request");
  }
  
  try {
    const updatedData = await updateUrlCode(req.body);
    res.status(200).json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
});

router.delete("/:urlCode", verifyAccessToken, async (req: Request, res: Response) => {
  const urlCode = req.params.urlCode;
  if (!urlCode) {
    return res.status(400).send("Bad request");
  }

  try {
    const data = await deleteUrlByUrlCode(urlCode);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
});

export default router;
