import { Router, type IRouter } from "express";
import healthRouter from "./health";
import registrationsRouter from "./registrations";
import sponsorInquiriesRouter from "./sponsorInquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(registrationsRouter);
router.use(sponsorInquiriesRouter);

export default router;
