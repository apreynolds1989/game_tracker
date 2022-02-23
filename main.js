
//Create Array for weekly games
weeklyGames = [
    ["Player", "Weekly Games", "Off-Day Games", "Games Played", "Goals", "Assists", "Points", "Powerplay Points", "Hits", "Blocks"],
    ["Player 1", 4, 2, 55, 12, 32, 44, 13, 21, 7],
    ["Player 2", 3, 2, 53, 21, 44, 65, 11, 5, 5],
    ["Player 3", 3, 2, 56, 14, 22, 36, 15, 22, 15],
    ["Player 4", 3, 1, 33, 13, 13, 26, 8, 44, 15],
    ["Player 5", 2, 1, 49, 16, 33, 49, 24, 35, 22],
    ["Player 6", 2, 0, 51, 24, 25, 49, 20, 16, 9]
];

//Reference the table
const weeklyGamesTableBodyRef = document.getElementById('weeklyGames');

//Iterate through the rows
weeklyGames.forEach(weeklyGamesRowContent => {
   const weeklyGamesTempRow = document.createElement('tr'); //temporary row
   //Iterate trhough the cells
   weeklyGamesRowContent.forEach(weeklyGamesCellContent => {
       const weeklyGamesTempCell = document.createElement('td'); 
       weeklyGamesTempCell.innerHTML = weeklyGamesCellContent;
       weeklyGamesTempRow.append(weeklyGamesTempCell);
   });
   weeklyGamesTableBodyRef.append(weeklyGamesTempRow);
});


// Array for listing players in table
recommendedPlayers = [
    ["Top 5 Recommended Players"], //row 1
    ["Player 1"], //row 2
    ["Player 2"],
    ["Player 3"],
    ["Player 4"],
    ["Player 5"],
];

//Reference the table
const recommendedPlayersTableBodyRef = document.getElementById('recommendedPlayers');

//Iterate through the rows
recommendedPlayers.forEach(recommendedPlayersRowContent => {
   const recommendedPlayersTempRow = document.createElement('tr'); //temporary row
   //Iterate trhough the cells
   recommendedPlayersRowContent.forEach(recommendedPlayersCellContent => {
       const recommendedPlayersTempCell = document.createElement('td'); 
       recommendedPlayersTempCell.innerHTML = recommendedPlayersCellContent;
       recommendedPlayersTempRow.append(recommendedPlayersTempCell);
   });
   recommendedPlayersTableBodyRef.append(recommendedPlayersTempRow);
});
