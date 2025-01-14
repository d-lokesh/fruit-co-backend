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


  // Endpoint: Get Site Analytics
exports.getSiteAnalytics = async (req, res) => {
    try {
        console.log("start amalysise");
        // Aggregate user visit data
        const userVisits = await UserVisit.aggregate([
            {
                $project: {
                    userId: 1,
                    visitCount: 1,
                    firstVisit: 1,
                    lastVisit: 1,
                    totalPagesVisited: { $size: '$pagesVisited' }, // Total pages visited
                },
            },
        ]);

        // Aggregate page visit data
        const pageVisits = await UserVisit.aggregate([
            { $unwind: '$pagesVisited' },
            {
                $group: {
                    _id: '$pagesVisited.page', // Group by page
                    totalVisits: { $sum: 1 }, // Count total visits
                },
            },
            { $sort: { totalVisits: -1 } }, // Sort by most visited
        ]);

        // Aggregate button click data
        const buttonClicks = await ButtonClick.aggregate([
            {
                $group: {
                    _id: '$action', // Group by action
                    count: { $sum: 1 }, // Count total clicks
                },
            },
            { $sort: { count: -1 } }, // Sort by most clicked
        ]);

        res.json({
            success: true,
            analytics: {
                userVisits,
                pageVisits,
                buttonClicks,
            },
        });
    } catch (error) {
        console.error("Error fetching site analytics:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
  