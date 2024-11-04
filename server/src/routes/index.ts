import { Router } from "express";

import urlRouter from "./urlRouter";

const router = Router();

router.use("/url", urlRouter);

export default router;
