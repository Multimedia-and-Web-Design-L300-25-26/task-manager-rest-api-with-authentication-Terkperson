import request from "supertest";
import app from "../src/app.js";
import mongoose from 'mongoose';

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Routes", () => {
  const uniqueEmail = `test_${Date.now()}@example.com`;
  const password = "password123";

  // Ensure DB is ready before any tests start
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    }
  }, 30000);

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: uniqueEmail,
        password: password
      });

    // If this fails with 500, check if your User Model is compatible with Atlas
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(uniqueEmail);
  }, 30000); 

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  }, 30000);
});