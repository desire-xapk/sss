import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const rooms = {};

app.post("/offer", (req, res) => {
  const id = Math.random().toString(36).substr(2, 6);
  rooms[id] = { offer: req.body, answer: null };
  res.json({ id });
});

app.get("/offer/:id", (req, res) => {
  const r = rooms[req.params.id];
  if (!r) return res.status(404).send("no room");
  res.json(r.offer);
});

app.post("/answer/:id", (req, res) => {
  if (!rooms[req.params.id]) return res.status(404).send("no room");
  rooms[req.params.id].answer = req.body;
  res.json({ ok: true });
});

app.get("/answer/:id", (req, res) => {
  const r = rooms[req.params.id];
  if (!r || !r.answer) return res.status(404).send("no answer");
  res.json(r.answer);
});

app.listen(10000, () => console.log("relay running on port 10000"));
