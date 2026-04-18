import request from "supertest";
import app from "../src/app.js";
import mongoose from 'mongoose';

afterAll(async () => {
  await mongoose.connection.close();
});

let token;
let taskId;

beforeAll(async () => {
  // Ensure DB is connected
  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
  }

  const uniqueEmail = `task_${Date.now()}@example.com`;
  const password = "password123";

  // Register
  await request(app)
    .post("/api/auth/register")
    .send({ name: "Task User", email: uniqueEmail, password: password });

  // Login to get the token
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: uniqueEmail, password: password });

  token = res.body.token;
  
  if (!token) {
    console.error("❌ SETUP ERROR: Could not get token. Login response:", res.body);
  }
}, 30000); 

describe("Task Routes", () => {
  it("should not allow access without token", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(401);
  }, 10000);
  
  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task", description: "Testing" });

    expect(res.statusCode).toBe(201);
    taskId = res.body._id;
  }, 15000);

  it("should delete the created task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  }, 15000);
});