import { Router, type IRouter } from "express";
import healthRouter from "./health";
import registrationsRouter from "./registrations";
import sponsorInquiriesRouter from "./sponsorInquiries";
import checkoutRouter from "./checkout";
import adminRouter from "./adminRoutes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(registrationsRouter);
router.use(sponsorInquiriesRouter);
router.use(checkoutRouter);
router.use(adminRouter);

export default router;
