import request from "supertest";
import { createApp } from "../../app";

describe("GET /api/health", () => {
  it("trả 200 hoặc 503 (tuỳ DB), nhưng response phải đúng shape cơ bản", async () => {
    const app = createApp({ enableCloudinary: false });

    const res = await request(app).get("/api/health").send();

    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("database");
    expect(res.body).toHaveProperty("memory");
  });
});

