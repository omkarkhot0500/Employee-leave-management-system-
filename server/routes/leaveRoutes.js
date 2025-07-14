import express from "express";
import { protect, isManager } from "../middleware/authMiddleware.js";
import {
  submitLeaveRequest,
  getMyLeaveRequests,
  getPendingLeaves,
  approveOrRejectLeave,
  getApprovedLeaves,
  getLeaveBalance,
  deleteLeaveRequest,
  updateLeaveRequest
} from "../controllers/leaveController.js";

const router = express.Router();

router.post("/request", protect, submitLeaveRequest);
router.get("/my-requests", protect, getMyLeaveRequests);
router.delete("/delete-leave/:id", protect, deleteLeaveRequest);
router.put("/update-leave/:id", protect, updateLeaveRequest);
router.get("/balance", protect, getLeaveBalance);
router.get("/pending", protect, isManager, getPendingLeaves);
router.patch("/:id/approve", protect, isManager, approveOrRejectLeave);
router.get("/calendar", protect, isManager, getApprovedLeaves);

export default router;
