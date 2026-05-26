import * as db from "./db.js";
import express from "express";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/aircrafts", (req, res) => {
  const aircrafts = db.getAllAircrafts();
  res.status(200).json(aircrafts);
});

app.get("/aircrafts/:id", (req, res) => {
  const aircraft = db.getAircraftById(+req.params.id);

  if (!aircraft) {
    return res.status(404).json({ error: "Aircraft not found" });
  }

  res.status(200).json(aircraft);
});

app.post("/aircrafts", (req, res) => {
  const { name, factory, type, capacity, maxSpeed, range, imageUrl } = req.body;

  if (
    !name ||
    !factory ||
    !type ||
    !capacity ||
    !maxSpeed ||
    !range ||
    !imageUrl
  ) {
    return res.status(400).json({ error: "Missing aircraft data" });
  }

  const result = db.saveAircraft(
    name,
    factory,
    type,
    capacity,
    maxSpeed,
    range,
    imageUrl,
  );

  const aircraft = db.getAircraftById(result.lastInsertRowid);

  res.status(201).json(aircraft);
});

app.delete("/aircrafts/:id", (req, res) => {
  const aircraft = db.getAircraftById(+req.params.id);

  if (!aircraft) {
    return res.status(404).json({ error: "Aircraft not found" });
  }

  db.deleteAircraft(+req.params.id);

  res.status(204).send();
});

app.put("/aircrafts/:id", (req, res) => {
  const aircraft = db.getAircraftById(+req.params.id);

  if (!aircraft) {
    return res.status(404).json({ error: "Aircraft not found" });
  }

  const { name, factory, type, capacity, maxSpeed, range, imageUrl } = req.body;

  if (
    !name ||
    !factory ||
    !type ||
    !capacity ||
    !maxSpeed ||
    !range ||
    !imageUrl
  ) {
    return res.status(400).json({ error: "Missing aircraft data" });
  }

  db.updateAircraft(
    +req.params.id,
    name,
    factory,
    type,
    capacity,
    maxSpeed,
    range,
    imageUrl,
  );

  const updated = db.getAircraftById(+req.params.id);

  res.status(200).json(updated);
});

app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});
