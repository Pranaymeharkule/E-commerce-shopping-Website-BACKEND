import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce Backend API",
      version: "1.0.0",
      description: "Production Ready Admin Backend API",
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Product: {
          type: "object",
          required: ["name", "price", "description", "category"],
          properties: {
            name: { type: "string", example: "Black Hoodie" },
            price: { type: "number", example: 1499 },
            description: {
              type: "string",
              example: "Premium cotton hoodie for winter",
            },
            category: { type: "string", example: "Winter Wear" },
            stock: { type: "number", example: 25 },
          },
        },

        Auth: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@gmail.com" },
            password: { type: "string", example: "123456" },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

const specs = swaggerJSDoc(options);

export default specs;
