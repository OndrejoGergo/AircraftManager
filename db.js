import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite");

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS aircrafts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        factory TEXT NOT NULL,
        type TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        maxSpeed INTEGER NOT NULL,
        range INTEGER NOT NULL,
        imageUrl TEXT NOT NULL
    )
`,
).run();

export const getAllAircrafts = () =>
  db.prepare(`SELECT * FROM aircrafts`).all();

export const getAircraftById = (id) =>
  db.prepare(`SELECT * FROM aircrafts WHERE id = ?`).get(id);

export const saveAircraft = (
  name,
  factory,
  type,
  capacity,
  maxSpeed,
  range,
  imageUrl,
) =>
  db
    .prepare(
      `
        INSERT INTO aircrafts
        (
            name,
            factory,
            type,
            capacity,
            maxSpeed,
            range,
            imageUrl
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(name, factory, type, capacity, maxSpeed, range, imageUrl);

export const updateAircraft = (
  id,
  name,
  factory,
  type,
  capacity,
  maxSpeed,
  range,
  imageUrl,
) =>
  db
    .prepare(
      `
        UPDATE aircrafts
        SET
            name = ?,
            factory = ?,
            type = ?,
            capacity = ?,
            maxSpeed = ?,
            range = ?,
            imageUrl = ?
        WHERE id = ?
    `,
    )
    .run(name, factory, type, capacity, maxSpeed, range, imageUrl, id);

export const deleteAircraft = (id) =>
  db
    .prepare(
      `
        DELETE FROM aircrafts
        WHERE id = ?
    `,
    )
    .run(id);

const { aircraftCount } = db
  .prepare(
    `
    SELECT COUNT(*) AS aircraftCount
    FROM aircrafts
`,
  )
  .get();

if (aircraftCount === 0) {
  saveAircraft(
    "Boeing 747",
    "Boeing",
    "Commercial",
    416,
    614,
    8000,
    "https://upload.wikimedia.org/wikipedia/commons/2/27/Lufthansa_Boeing_747-8_%2816093562187%29.jpg",
  );

  saveAircraft(
    "F-22 Raptor",
    "Lockheed Martin",
    "Military",
    1,
    1500,
    1200,
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/F-22_Raptor_edit1_%28cropped%29.jpg/1280px-F-22_Raptor_edit1_%28cropped%29.jpg",
  );

  saveAircraft(
    "Cessna 172",
    "Cessna",
    "General Aviation",
    4,
    120,
    800,
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/Cessna_172S_Skyhawk_SP%2C_Private_JP6817606.jpg",
  );
}
