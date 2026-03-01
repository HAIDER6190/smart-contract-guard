# Smart Contract Guard

**Smart Contract Guard** is an advanced API request and response validator for Node.js.  
It helps developers define a **contract** for their API routes and automatically validates incoming requests (`body`, `query`, `params`, `headers`) as well as optional response validation. It supports nested objects, arrays, enums, min/max rules, and required/optional fields, ensuring your APIs are **safe, consistent, and professional**.

---

## **What Problem Does It Solve**

Many developers rely solely on database validation (like Mongoose) and skip API-level validation. This causes issues:

- **Validation happens too late** Mongoose only validates before saving to DB, after business logic runs.  
- **API responses may leak sensitive data**  internal fields or passwords can accidentally be sent.  
- **Query params, route params, headers are never validated** – attackers can inject invalid or malicious data.  
- **Inconsistent error messages** Mongoose errors are technical, not user-friendly.  
- **No standard API documentation** contracts are only in code and often undocumented.

**Smart Contract Guard** solves all of these problems by providing **request validation, response validation, nested and complex structures validation**, and **clean, consistent error messages**.

---

## **What It Contains**

- Request validation for: `body`, `query`, `params`, `headers`  
- Type checks: `string`, `number`, `boolean`, `array`, `object`  
- Nested objects and arrays validation  
- Required and optional fields  
- Min/max validation for strings and numbers  
- Enum validation  
- Optional response validation  
- Clean JSON error messages  
- TypeScript definitions included  
- Easy integration with Express.js  
- Extendable to other frameworks like Fastify or NestJS  

---

## **Supported Languages**

- Node.js (JavaScript)  
- TypeScript (with type definitions included)  

---

## **Installation**
1. Import the package
const express = require("express");
const { contract, guard, validateResponse } = require("smart-contract-guard");

const app = express();
app.use(express.json());

2. Define a Contract
const CreateUserContract = contract({
  body: {
    email: { type: "string", required: true },
    password: { type: "string", required: true, min: 6 },
    age: { type: "number", required: false, min: 18 },
    roles: { type: "array", required: false, items: { type: "string" } },
    profile: {
      type: "object",
      required: false,
      properties: {
        firstName: { type: "string", required: true },
        lastName: { type: "string", required: true }
      }
    }
  },
  query: {
    page: { type: "number", required: false, min: 1 }
  }

3. Use Guard in Routes
app.post("/users", guard(CreateUserContract), (req, res) => {
  // Request is validated
  const user = req.body;

  // Optional: validate response
  return validateResponse(CreateUserContract)(res, user);
});

4. Example: Invalid Request

Request Body:

{
  "email": "abc@test.com",
  "password": "123",
  "age": 12
}

Response:

{
  "success": false,
  "error": "VALIDATION_ERROR",
  "messages": [
    "password must be at least 6 chars",
    "age must be >= 18"
  ]
}

```bash
npm install smart-contract-guard
