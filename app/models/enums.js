module.exports = {
    kind: { type: String, enum: ["report", "suggestion", "complaint"] },
    category: { type: String, enum: ["lights", "road", "trash"] },
    state: { type: String, enum: ["active", "work_in_progress", "archived"] },
    user_level: { type: String, enum: ["not_logged", "citizen", "admin"] },
};
