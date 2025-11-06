import express from "express";
import cors from "cors";

const app = express();
app.use(cors());            // ✅ Разрешает внешние запросы (включая localhost)
app.use(express.json());


// временное хранилище комнат в памяти
const rooms = new Map();

// === GET / — просто проверка
app.get("/", (req, res) => {
  res.send("✅ Server is running! Use /rooms, /offer, /answer endpoints.");
});

// === GET /rooms — вернуть список всех комнат
app.get("/rooms", (req, res) => {
  const list = [...rooms.entries()].map(([id, data]) => ({ id, ...data }));
  res.json(list);
});

// === POST /offer — создать комнату
app.post("/offer", (req, res) => {
  const id = Math.random().toString(36).substr(2, 6);
  const { sdp } = req.body;
  if (!sdp) return res.status(400).json({ error: "No SDP provided" });
  rooms.set(id, { sdp });
  console.log("🟢 New room:", id);
  res.json({ id });
});

// === POST /answer — получить ответ и обновить комнату
app.post("/answer", (req, res) => {
  const { roomId, sdp } = req.body;
  if (!roomId || !rooms.has(roomId))
    return res.status(404).json({ error: "Room not found" });
  rooms.get(roomId).answer = sdp;
  console.log("🔵 Answer for room:", roomId);
  res.json({ ok: true });
});

// === запуск сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Relay running on port ${PORT}`));
