import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sponsorInquiriesRouter from "./sponsorInquiries";
import checkoutRouter from "./checkout";
import adminRouter from "./adminRoutes";
import webhooksRouter from "./webhooks";
import affiliateRouter from "./affiliateRoutes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sponsorInquiriesRouter);
router.use(checkoutRouter);
router.use(adminRouter);
router.use(webhooksRouter);
router.use(affiliateRouter);

export default router;
