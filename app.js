const express = require("express");
const { createClient } = require("redis");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

async function startServer() {
  await redisClient.connect();
  console.log("Connected to Redis");

  app.get("/", (req, res) => {
    res.send("Internship Application Tracker with Redis is running!");
  });

  app.post("/applications", async (req, res) => {
    try {
      const {
        app_id,
        student_id,
        job_id,
        company_name,
        job_title,
        submission_date,
        current_status,
      } = req.body;

      if (
        !app_id ||
        !student_id ||
        !job_id ||
        !company_name ||
        !job_title ||
        !submission_date ||
        !current_status
      ) {
        return res.status(400).json({
          error: "All fields are required.",
        });
      }

      const applicationKey = `application:${app_id}`;
      const studentApplicationsKey = `student:${student_id}:applications`;
      const studentStatusKey = `student:${student_id}:status:${current_status}`;

      const submissionTimestamp = Math.floor(
        new Date(submission_date).getTime() / 1000
      );

      await redisClient.hSet(applicationKey, {
        app_id: String(app_id),
        student_id: String(student_id),
        job_id: String(job_id),
        company_name,
        job_title,
        submission_date,
        current_status,
      });

      await redisClient.zAdd(studentApplicationsKey, [
        {
          score: submissionTimestamp,
          value: String(app_id),
        },
      ]);

      await redisClient.sAdd(studentStatusKey, String(app_id));

      res.status(201).json({
        message: "Application created successfully.",
        application: {
          app_id,
          student_id,
          job_id,
          company_name,
          job_title,
          submission_date,
          current_status,
        },
      });
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({
        error: "Failed to create application.",
      });
    }
  });

  
    app.get("/applications/:app_id", async (req, res) => {
    try {
      const { app_id } = req.params;
      const applicationKey = `application:${app_id}`;

      const application = await redisClient.hGetAll(applicationKey);

      if (!application || Object.keys(application).length === 0) {
        return res.status(404).json({
          error: "Application not found.",
        });
      }

      res.json(application);
    } catch (error) {
      console.error("Error retrieving application:", error);
      res.status(500).json({
        error: "Failed to retrieve application.",
      });
    }
  });

    app.get("/students/:student_id/applications", async (req, res) => {
    try {
      const { student_id } = req.params;
      const studentApplicationsKey = `student:${student_id}:applications`;

      const appIds = await redisClient.zRange(studentApplicationsKey, 0, -1, {
        REV: true,
      });

      const applications = [];

      for (const appId of appIds) {
        const application = await redisClient.hGetAll(`application:${appId}`);
        if (application && Object.keys(application).length > 0) {
          applications.push(application);
        }
      }

      res.json(applications);
    } catch (error) {
      console.error("Error retrieving student applications:", error);
      res.status(500).json({
        error: "Failed to retrieve student applications.",
      });
    }
  });

    app.put("/applications/:app_id/status", async (req, res) => {
    try {
      const { app_id } = req.params;
      const { new_status } = req.body;

      if (!new_status) {
        return res.status(400).json({
          error: "new_status is required.",
        });
      }

      const applicationKey = `application:${app_id}`;
      const application = await redisClient.hGetAll(applicationKey);

      if (!application || Object.keys(application).length === 0) {
        return res.status(404).json({
          error: "Application not found.",
        });
      }

      const student_id = application.student_id;
      const old_status = application.current_status;

      const oldStatusKey = `student:${student_id}:status:${old_status}`;
      const newStatusKey = `student:${student_id}:status:${new_status}`;

      await redisClient.sRem(oldStatusKey, app_id);
      await redisClient.sAdd(newStatusKey, app_id);
      await redisClient.hSet(applicationKey, "current_status", new_status);

      const updatedApplication = await redisClient.hGetAll(applicationKey);

      res.json({
        message: "Application status updated successfully.",
        application: updatedApplication,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({
        error: "Failed to update application status.",
      });
    }
  });

    app.delete("/applications/:app_id", async (req, res) => {
    try {
      const { app_id } = req.params;
      const applicationKey = `application:${app_id}`;

      const application = await redisClient.hGetAll(applicationKey);

      if (!application || Object.keys(application).length === 0) {
        return res.status(404).json({
          error: "Application not found.",
        });
      }

      const student_id = application.student_id;
      const current_status = application.current_status;

      const studentApplicationsKey = `student:${student_id}:applications`;
      const studentStatusKey = `student:${student_id}:status:${current_status}`;

      await redisClient.zRem(studentApplicationsKey, app_id);
      await redisClient.sRem(studentStatusKey, app_id);
      await redisClient.del(applicationKey);

      res.json({
        message: "Application deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({
        error: "Failed to delete application.",
      });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();