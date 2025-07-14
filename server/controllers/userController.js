import User from "../models/User.js";

export const getLeaveBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ leaveBalance: user.leaveBalance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave balance', error: error.message });
  }
};

export const resetLeaveBalance = async (req, res) => {
  try {
    const { userId, vacation = 12, sick = 8, other =5 } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.leaveBalance.vacation = vacation;
    user.leaveBalance.sick = sick;
    user.leaveBalance.other = other;

    await user.save();
    res.status(200).json({ message: 'Leave balance reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting leave', error: error.message });
  }
};
export const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('_id name');
    res.status(200).json(managers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch managers' });
  }
};
export const getManagedEmployees = async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const employees = await User.find({ manager: req.user.userId}).select(
      "name email leaveBalance"
    );

    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching employees" });
  }
};
export const resetEmployeeLeaveBalance = async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { employeeId } = req.params;
    const { vacation, sick, other } = req.body;

    const employee = await User.findOne({
      _id: employeeId,
      manager: req.user.userId
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.leaveBalance.vacation = vacation;
    employee.leaveBalance.sick = sick;
    employee.leaveBalance.other = other;

    await employee.save();

    res.json({ message: "Leave balance updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating balance" });
  }
};