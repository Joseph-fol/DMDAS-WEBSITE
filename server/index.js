require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.route");
const studentRoute = require("./routes/student.route");
const repRoute = require("./routes/rep.route");
const generalRoute = require("./routes/general.route");
const { checkInternetConnection } = require("./middleware/network");

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb'}));

app.use(cors());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    exposedHeaders: ["RateLimit-Remaining", "RateLimit-Limit", "RateLimit-Reset", "Retry-After"]
}));

const URI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

const dns = require("node:dns");
dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '8.8.4.4'])

let mongoConnectionPromise;

const connectToMongo = () => {
  if (!URI) {
    return Promise.reject(new Error("MONGO_URI is not configured."));
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    }).catch((error) => {
      mongoConnectionPromise = undefined;
      throw error;
    });
  }

  return mongoConnectionPromise;
};

app.use(async (req, res, next) => {
  try {
    await connectToMongo();
    next();
  } catch (error) {
    console.error("Error connecting to mongoDB", error);
    if (error.code === 8000 || error.codeName === "AtlasError") {
      console.error(
        "MongoDB authentication failed. Verify the Atlas database user's username, " +
        "password, authentication database, and URL-encode special password characters."
      );
    }
    return res.status(503).json({
      success: false,
      message: "Database connection unavailable.",
    });
  }
});

app.get('/', (req, res) => {
    return res.status(200).json({ 
        status: "success", 
        message: "The backend server is alive and responding!" 
    });
});

app.use("/api", checkInternetConnection, authRoute);
app.use("/api", checkInternetConnection, studentRoute);
app.use("/api", checkInternetConnection, repRoute);
app.use("/api", checkInternetConnection, generalRoute);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON payload:', err.message);
    return res.status(400).json({ message: 'Bad Request: Invalid JSON in payload' });
  }
  next(); // Pass other errors to the next error handler
});

// Catch-all 404 handler for any request that doesn't match a route
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

module.exports = app;

if (!process.env.VERCEL) {
  connectToMongo()
    .then(() => {
      console.log("Connected to MONGODB");
      app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
      });
    })
    .catch((error) => {
      console.error("Error connecting to mongoDB", error);
      if (error.code === 8000 || error.codeName === "AtlasError") {
        console.error(
          "MongoDB authentication failed. Update MONGO_URI or the Atlas database user credentials."
        );
      }
      console.error("Server did not start due to MongoDB connection failure.");
      process.exitCode = 1;
    });
}
