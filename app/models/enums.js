module.exports = {
    kind: { type: String, enum: ["report", "suggestion", "complaint"] },
    category: { type: String, enum: ["lights", "road", "trash", "green_areas"] },
    state: { type: String, enum: ["active", "work_in_progress", "archived"] },
    user_level: { type: String, enum: ["citizen", "admin"] },
};
