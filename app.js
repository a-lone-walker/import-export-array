const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());

let dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/players/");
    });
  } catch (error) {
    console.log(`DB error ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//get
app.get("/players/", async (request, response) => {
  let getPlayersQuery = `
    SELECT *
    FROM cricket_team
    ORDER BY player_id`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//post
app.post("/players/", async (request, response) => {
  let playerDetails = request.body;
  const { playerName, jerseyNumber, role } = payerDetails;
  const postPlayerDetailsQuery = `INSERT INTO cricket_team(playerName, jerseyNumber, role)
  VALUES( "Vishal",17,"Bowler" );`;
  const dbResponse = await db.run(postPlayerDetailsQuery);
  const playerId = dbResponse.lastID;
  console.log(playerDetails);
  response.send("Player Added to Team");
});

//getPlayerDetails
app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let getPlayerDetailsQuery = `
    SELECT *
    FROM cricket_team
    WHERE player_Id  = ${playerId};`;
  let playerDetails = await db.get(getPlayerDetailsQuery);
  response.send(playerDetails);
});

//put
app.put("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = payerDetails;
  const updatePlayerDetailsQuery = `
  UPDATE cricket_team
  SET playerName = '${playerName}',
  jerseyNumber = '${jerseyNumber}',
  role = '${role}'
  WHERE player_id = ${playerId};`;
  await db.run(updatePlayerDetailsQuery);
  response.send("Player Details Updated");
});

//delete
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
