const express = require("express");
const mongoose = require("mongoose");
const users = require("./models/user");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/24S", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/api/user", async (req, res) => {
    try {
        if (req.query.q) {
            const user = await users
                .find({
                    $or: [{ name: req.query.q }, { email: req.query.q }],
                })
                .skip(req.query.start - 1)
                .limit(req.query.limit);
            res.json(user);
        } else {
            const user = await users
                .find()
                .skip(req.query.start - 1)
                .limit(req.query.limit);
            res.json(user);
        }
    } catch (err) {
        res.json({ $or: [{ name: req.query.q }, { email: req.query.q }] });
    }
});

app.get("/api/user/:userId", async (req, res) => {
    try {
        const user = await users.find({ _id: req.params.userId });
        res.json(user);
    } catch (err) {
        res.json({ $or: [{ name: req.query.q }, { email: req.query.q }] });
    }
});

app.post("/api/user", async (req, res) => {
    try {
        const user = await users.create(req.body);
        res.json(user);
    } catch (err) {
        res.json(err);
    }
});

app.put("/api/user/:userId", async (req, res) => {
    try {
        await users.updateOne({ _id: req.params.userId }, req.body);
        const user = await users.findOne({ _id: req.params.userId });
        res.json(user);
    } catch (err) {
        res.json(err);
    }
});

app.delete("/api/user/:userId", async (req, res) => {
    try {
        const count = await users.countDocuments({ _id: req.params.userId });
        if (count > 0) {
            await users.deleteOne({ _id: req.params.userId });
            res.status(200).json({ message: "success" });
        }
        res.status(500).json({ message: "failed" });
        // res.json(test);
    } catch (err) {
        res.status(400).json({ message: "Bad request" });
    }
});

app.listen(process.env.PORT || 3000);
