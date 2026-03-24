const moment = require("moment-timezone");

function getCurrentTime(timezone) {
  if (!timezone || !moment.tz.zone(timezone)) {
    throw new Error("Invalid timezone");
  }
  return moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");
}

function getAllTimezones() {
  return moment.tz.names();
}

module.exports = {
  getCurrentTime,
  getAllTimezones,
};
