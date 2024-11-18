const app = require("../app/app.js");
const mongoose = require("mongoose");

const User = require("../app/models/user.js");
const Report = require("../app/models/report.js");

const PORT = process.env.PORT;
const DB = process.env.DB;

mongoose
    .connect(DB)
    .then(async () => {
        const test_users = [
            make_user("riccardo", "riccardo@gmail.com", "riccardo1", "admin"),
            make_user("marco", "marco@gmail.com", "marco1", "citizen"),
            make_user("tommaso", "tommaso@gmail.com", "tommaso1", "admin"),
        ];

        await User.deleteMany({}).then(async () => {
            test_users.forEach(async (u) => {
                var new_user = new User(u);
                console.log("New user:", new_user);
                await new_user.save();
            });
        });

        const test_reports = [
            await make_report(
                "report1",
                "contenuto1",
                "riccardo",
                "posizione1",
                "report",
                "lights",
                "active"
            ),
            await make_report(
                "report2",
                "contenuto2",
                "marco",
                "posizione2",
                "complaint",
                "road",
                "work_in_progress"
            ),
            await make_report(
                "report3",
                "contenuto3",
                "tommaso",
                "posizione3",
                "suggestion",
                "trash",
                "archived"
            ),
            await make_report(
                "report4",
                "contenuto4",
                "riccardo",
                "posizione4",
                "complaint",
                "lights",
                "work_in_progress"
            ),
            await make_report(
                "report5",
                "contenuto5",
                "marco",
                "posizione5",
                "complaint",
                "lights",
                "active"
            ),
            await make_report(
                "report6",
                "contenuto6",
                "tommaso",
                "posizione6",
                "suggestion",
                "road",
                "archived"
            ),
        ];

        await Report.deleteMany({}).then(async () => {
            test_reports.forEach(async (r) => {
                var new_reports = new Report(r);
                await new_reports.save();
            });
        });

        console.log("Setup completed!");
        return;
    }).catch(() => {
        console.error("Database connection error");
    });
    

function make_user(name, email, password, user_level) {
    return { name, email, password, user_level };
}

async function make_report(
    title,
    content,
    user,
    position,
    kind,
    category,
    state
) {
    let id = await nameToId(user);
    console.log("id:", id);
    return {
        title,
        content,
        user: id,
        position,
        kind,
        category,
        state,
    };
}

async function nameToId(name) {
    let user = await User.find({ name }).exec();
    console.log("name:", name, "user:", user);
    return user[0]._id;
}
