const request = require("supertest");
const app = require("./app");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const DB = process.env.DB;

describe('aaa', () => {
    beforeAll(async () => {
        // establish connection to db
        jest.setTimeout(20000);
        app.locals.db = await mongoose.connect(DB);
    });
    afterAll(() => {
        mongoose.connection.close(true);
    });
    
    test("app module should be defined", () => {
        expect(app).toBeDefined();
    });
    test("GET / should return 200", () => {
        // console.log(request(app).get("/reports"));
        return request(app).get("/api/reports").expect(200);
    });
});