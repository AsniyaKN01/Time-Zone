const express = require('express');
const cors = require('cors');
const timezoneRoutes = require('./routes/timezoneRoutes');
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/timezones", timezoneRoutes);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});