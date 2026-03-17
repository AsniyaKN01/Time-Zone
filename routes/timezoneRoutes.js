const moment = require("moment-timezone");

function getCurrentTime(timezone) {
    return moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");
}

function getAllTimezones() {
    return moment.tz.names();
}

module.exports = {
    getCurrentTime,
    getAllTimezones
};

const express = require("express");
const router = express.Router();

const timezoneService = require("../services/timezoneService");

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
            currentTime: time
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid timezone" });
    }
});

module.exports = router;
