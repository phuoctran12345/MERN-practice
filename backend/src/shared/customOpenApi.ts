const customOpenApi = {
  openapi: "3.0.0",
  info: {
    title: "Hotel Booking API",
    version: "1.0.0",
    description: "A comprehensive API for hotel booking and management system",
    contact: {
      name: "API Support",
      email: "support@mernholidays.com",
    },
  },
  servers: [
    {
      url: "http://localhost:7002",
      description: "Development server",
    },
    {
      url: "https://your-production-domain.com",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "jwt",
      },
    },
  },
  security: [
    {
      cookieAuth: [],
    },
  ],
  paths: {
    "/api/auth/login": {
      post: {
        summary: "User login",
        description: "Authenticate user with email and password",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    description: "User's email address",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    description: "User's password",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    userId: {
                      type: "string",
                      description: "User ID",
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Invalid credentials or validation error" },
          "500": { description: "Server error" },
        },
      },
    },
    "/api/auth/validate-token": {
      get: {
        summary: "Validate authentication token",
        description: "Validate the current user's authentication token",
        tags: ["Authentication"],
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Token is valid",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    userId: { type: "string", description: "User ID" },
                  },
                },
              },
            },
          },
          "401": { description: "Token is invalid or expired" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        summary: "User logout",
        description: "Logout user by clearing authentication cookie",
        tags: ["Authentication"],
        responses: {
          "200": { description: "Logout successful" },
        },
      },
    },
    "/api/business-insights/dashboard": {
      get: {
        summary: "Get business insights dashboard data",
        description:
          "Returns comprehensive business insights data for the dashboard including bookings, revenue, and performance metrics",
        tags: ["Business Insights"],
        responses: { "200": { description: "Business insights dashboard data" } },
      },
    },
    "/api/business-insights/forecast": {
      get: {
        summary: "Get booking and revenue forecasts",
        description:
          "Returns forecasting data for bookings and revenue based on historical trends",
        tags: ["Business Insights"],
        responses: { "200": { description: "Forecasting data" } },
      },
    },
    "/api/business-insights/performance": {
      get: {
        summary: "Get performance metrics",
        description: "Returns detailed performance metrics for the application",
        tags: ["Business Insights"],
        responses: { "200": { description: "Performance metrics" } },
      },
    },
    "/api/health": {
      get: {
        summary: "Get API health status",
        description:
          "Returns the current health status of the API including database connection, memory usage, and uptime",
        tags: ["Health"],
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "healthy" },
                    timestamp: { type: "string", format: "date-time" },
                    uptime: { type: "number", description: "Server uptime in seconds" },
                    database: {
                      type: "object",
                      properties: {
                        status: { type: "string", example: "connected" },
                        collections: { type: "number", description: "Number of collections in database" },
                      },
                    },
                    memory: {
                      type: "object",
                      properties: {
                        used: { type: "number", description: "Memory usage in MB" },
                        total: { type: "number", description: "Total memory in MB" },
                        percentage: { type: "number", description: "Memory usage percentage" },
                      },
                    },
                  },
                },
              },
            },
          },
          "503": { description: "API is unhealthy" },
        },
      },
    },
    "/api/health/detailed": {
      get: {
        summary: "Get detailed API health status",
        description: "Returns detailed health information including system metrics and performance data",
        tags: ["Health"],
        responses: { "200": { description: "Detailed health information" } },
      },
    },
  },
  tags: [],
};

export default customOpenApi;
