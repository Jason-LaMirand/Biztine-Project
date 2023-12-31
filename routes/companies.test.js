// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");


// app imports
const app = require("../app");
const db = require("../db");

let testCompanies;

beforeEach(async function () {
    let result = await db.query(`
      INSERT INTO
        companies (name) VALUES ('TestCompanies')
        RETURNING code, name, description`);
    testCompanies = result.rows[0];
});

describe("GET /companies", function () {
    test("Gets a list of companies", async function () {
        const response = await request(app).get(`/companies`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            companies: [testCompanies]
        });
    });
});

describe("POST /companies", function () {
    test("Creates a new company", async function () {
        const response = await request(app)
            .post(`/companies`)
            .send({
                code: "pc",
                name: "Dell",
                description: "Created out in Austin,Tx"
            });
        expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual({
            companies: { code: "pc", name: "Ezra", description: "Created out in Austin,Tx" }
        });
    });
});

describe("DELETE /companies/:code", function () {
    test("Deletes a single a company", async function () {
        const response = await request(app)
            .delete(`/cats/${testCompanies.code}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({ message: "Company deleted" });
    });
});

afterEach(async function () {
    // delete any data created by test
    await db.query("DELETE FROM companies");
});

afterAll(async function () {
    // close db connection
    await db.end();
});