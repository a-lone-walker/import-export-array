const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
app = express();
app.use(express.json());

let dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

let connectingDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("listening to port 3000");
    });
  } catch (error) {
    console.log(`DB Error ${error.message}`);
    process.exit(1);
  }
};

connectingDbAndServer();

//API 1: Get all players
app.get("/players/", async (request, response) => {
  let query = `
    SELECT *
    FROM cricket_team`;
  let dbResponse = await db.all(query);
  response.send(dbResponse);
});

//API 2: Create new player
app.post("/players/", async (request, response) => {
  let playerDetails = request.body;
  let { playerName, jerseyNumber, role } = playerDetails;
  let query = `
    INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES(${playerName},${jerseyNumber},${role})`;
  let dbResponse = await db.run(query);
  let playerId = dbResponse.lastID;
  response.send(playerId);
});

//API 3: Player on id
app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let query = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${playerId}`;
  let dbResponse = await db.get(query);
  response.send(dbResponse);
});

//API 4: Updating a player
app.put("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let playerDetails = request.body;
  let { playerName, jerseyNumber, role } = playerDetails;
  let query = `
    UPDATE cricketTeam
    SET player_name = ${playerName},
    jersey_number = ${jerseyNumber},
    role = ${role}
    WHERE player_id = ${playerId}`;
  await db.run(query);
  response.send("Player Details Updated");
});

//API 5: Deleting a player
app.delete("/players/:playerId", async (request, response) => {
  let { playerId } = request.params;
  let query = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId}`;
  await db.run(query);
  response.send("Player Removed");
});

module.exports = app;
