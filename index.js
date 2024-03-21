const process = require('process');
const cron = require('node-cron');
const login = require("fca-unofficial");
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api', (req, res) => {
  const { email, password } = req.body;
  login({ email, password }, (err, api) => {
    if (err) {
      res.status(401).send({ error: "Authentication failed. Please check your email and password." });
    } else {
      let appstate = api.getAppState();
      res.type('json').send(JSON.stringify(appstate, null, 2) + '\n');
    }
  });
});

app.get('/api', (req, res) => {
  const { email, password } = req.query;
  login({ email, password }, (err, api) => {
    if (err) {
      res.status(401).send({ error: "Authentication failed. Please check your email and password." });
    } else {
      let appstate = api.getAppState();
      res.type('json').send(JSON.stringify(appstate, null, 2) + '\n');
    }
  });
});

app.get("*", (req, res) => {
  res.status(403).send({ error: "Access denied. This is a private API, and you are not authorized to access it." });
});

const port = 3000;
const server = app.listen(port, () => console.log(`App is listening on port ${port}`));

const exitJob = cron.schedule('*/10 * * * *', () => {
  console.log("Exiting the process.");
  server.close(() => {
    process.exit(0);
  });
}, {
  scheduled: false
});

exitJob.start();
//-----------------------------------------------------------------

/*const axios = require('axios');
// Assuming you have `moment` and `chalk` modules installed based on the comments

const pingWebsite = () => {
  const websiteUrl = 'https://chat-a.onrender.com';

  axios.get(websiteUrl)
    .then(() => {
      // Uncomment the following lines if you want to log the success with formatted time
       const formattedTime = moment.tz('Asia/Manila').format('MM/DD/YY hh:mm A');
       console.log(chalk.green(`[PING] Website pinged at: ${formattedTime}`));
    })
    .catch((error) => {
      console.error('Failed to ping website:', error);
    });
};

// Initial ping
pingWebsite();

// Schedule pinging every 60 seconds (60 * 1000 milliseconds)
setInterval(pingWebsite, 60 * 1000);*/

