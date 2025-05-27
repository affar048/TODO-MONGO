const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB connection

mongoose.connect("mongodb+srv://affaraffu:LkkSO09DVxd6XFeH@todotest.0kbztty.mongodb.net/todotest?retryWrites=true&w=majority&appName=todotest")
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
    });


// Schema and model
const itemSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemSchema);

// GET: Render todo list
app.get("/", async (req, res) => {
    try {
        const items = await Item.find({});
        res.render("list", { ejes: items });
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Internal Server Error");
    }
});

// POST: Add new item
app.post("/", async (req, res) => {
    const itemName = req.body.ele1;
    if (itemName.trim() !== "") {
        const newItem = new Item({ name: itemName });
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
    const updatedText = req.body.newText;
    try {
        await Item.findByIdAndUpdate(itemId, { name: updatedText });
        res.redirect("/");
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).send("Error updating item");
    }
});

// Start server
app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
});
