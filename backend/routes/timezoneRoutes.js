const express = require("express");
const router = express.Router();

const timezoneService = require("../services/timezoneService");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/all", (req, res) => {
  const zones = timezoneService.getAllTimezones();
  res.json(zones);
});

router.get("/time/:zone", (req, res) => {
  const zone = req.params.zone;

  try {
    const time = timezoneService.getCurrentTime(zone);
    res.json({
      timezone: zone,
      currentTime: time,
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid timezone" });
  }
});

module.exports = router;
