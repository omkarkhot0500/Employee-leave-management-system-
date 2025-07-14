import express from 'express';
import { protect, isManager } from '../middleware/authMiddleware.js';
import { getLeaveBalance, resetLeaveBalance, getAllManagers, getManagedEmployees, resetEmployeeLeaveBalance } from '../controllers/userController.js';

const router = express.Router();

router.get('/leave-balance', protect, getLeaveBalance);
router.patch('/reset-leave', protect, isManager, resetLeaveBalance);
router.get('/managers', getAllManagers);
router.get("/managed-employees", protect, isManager, getManagedEmployees);
router.put("/reset-balance/:employeeId", protect, isManager, resetEmployeeLeaveBalance);

export default router;
