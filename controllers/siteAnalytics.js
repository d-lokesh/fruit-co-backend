const mongoose = require('mongoose');

const UserVisit = require("../models/UserVisit");

const ButtonClick = require("../models/ButtonClick");





// Endpoint: Track User Visit

exports.UserVisitfn = async (req, res) => {
    const { userId, page } = req.body;
  
    try {
      let userVisit = await UserVisit.findOne({ userId });
  
      if (userVisit) {
        // Update visit count, last visit, and pages visited
        userVisit.visitCount += 1;
        userVisit.lastVisit = Date.now();
        userVisit.pagesVisited.push({ page, visitDate: new Date() });
      } else {
        // Create a new record for the user
        userVisit = new UserVisit({
          userId: userId || uuidv4(),
          pagesVisited: [{ page, visitDate: new Date() }],
        });
      }
  
      await userVisit.save();
      res.json({ success: true, userId: userVisit.userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  };
  


  // Endpoint: Track Button Click
exports.ButtonClickfn = async (req, res) => {
    const { userId, action, packageName, timestamp } = req.body;
  
    try {
      const log = {
        userId,
        action,
        packageName,
        timestamp,
      };
  
      // Save the log to MongoDB (you can create a separate collection for button clicks)
      await ButtonClick.create(log);
  
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking button click:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  };
  