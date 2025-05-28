const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb+srv://affaraffu:LkkSO09DVxd6XFeH@todotest.0kbztty.mongodb.net/?retryWrites=true&w=majority&appName=todotest")
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
    });

// Schema and model
const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    priority: { type: String, enum: ['urgent', 'high', 'low'], required: true }
});

const Item = mongoose.model("Item", itemSchema);

// GET: Render todo list
app.get("/", async (req, res) => {
    try {
        const items = await Item.find({});
        res.render("list", { tasks: items });
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Internal Server Error");
    }
});

// POST: Add new item
app.post("/", async (req, res) => {
    const title = req.body.title?.trim();
    const priority = req.body.priority;

    if (title) {
        const newItem = new Item({ title, priority });
        await newItem.save();
    }
    res.redirect("/");
});

// POST: Delete item
app.post("/delete", async (req, res) => {
    const itemId = req.body.index;
    try {
        await Item.findByIdAndDelete(itemId);
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("Error deleting item");
    }
});

// POST: Edit item
app.post("/edit", async (req, res) => {
    const itemId = req.body.index;
    const updatedTitle = req.body.newText?.trim();
    const updatedPriority = req.body.newPriority;

    try {
        await Item.findByIdAndUpdate(itemId, {
            title: updatedTitle,
            priority: updatedPriority
        });
        res.redirect("/");
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).send("Error updating item");
    }
});

// Start server
app.listen(8000, () => {
    console.log("🚀 Server is running on http://localhost:8000");
});
