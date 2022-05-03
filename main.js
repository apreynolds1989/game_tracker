async function main() {

    generateTableBtns();

    // Show spinner
    try {
        let weeklyGames = await getCurrentWeek();
        generateSkaterTable(weeklyGames);
        generateGoalieTable(weeklyGames);
    } catch (err) {
        console.log(err);
    }
    // Hide spinner
}

//Select all Table name buttons, select all tables by specific classes
// add event listener to each button to await click
//  When respective buttons are clicked hide other tables by adding .tableHidden to classList
//    and remove .tableHidden from the clicked table type
const generateTableBtns = () => {
    const skatersBtn = document.querySelector('.skatersBtn');
    const goaliesBtn = document.querySelector('.goaliesBtn');
    const scheduleBtn = document.querySelector('.scheduleBtn');
    const skatersTbl = document.querySelector('.skatersTbl');
    const skatersTblMobile = document.querySelector('.skatersTblMobile');
    const goaliesTbl = document.querySelector('.goaliesTbl');
    const goaliesTblMobile = document.querySelector('.goaliesTblMobile');
    const scheduleTbl = document.querySelector('.scheduleTbl');
    const scheduleTblMobile = document.querySelector('.scheduleTblMobile');

    skatersBtn.addEventListener('click', () => {
        if (!goaliesTbl.classList.contains('tableHidden')) goaliesTbl.classList.add('tableHidden');
        if (!goaliesTblMobile.classList.contains('tableHidden')) goaliesTblMobile.classList.add('tableHidden');
        if (!scheduleTbl.classList.contains('tableHidden')) scheduleTbl.classList.add('tableHidden');
        if (!scheduleTblMobile.classList.contains('tableHidden')) scheduleTblMobile.classList.add('tableHidden');
        if (skatersTbl.classList.contains('tableHidden')) skatersTbl.classList.remove('tableHidden');
        if (skatersTblMobile.classList.contains('tableHidden')) skatersTblMobile.classList.remove('tableHidden');
    });

    goaliesBtn.addEventListener('click', () => {
        if (!skatersTbl.classList.contains('tableHidden')) skatersTbl.classList.add('tableHidden');
        if (!skatersTblMobile.classList.contains('tableHidden')) skatersTblMobile.classList.add('tableHidden');
        if (!scheduleTbl.classList.contains('tableHidden')) scheduleTbl.classList.add('tableHidden');
        if (!scheduleTblMobile.classList.contains('tableHidden')) scheduleTblMobile.classList.add('tableHidden');
        if (goaliesTbl.classList.contains('tableHidden')) goaliesTbl.classList.remove('tableHidden');
        if (goaliesTblMobile.classList.contains('tableHidden')) goaliesTblMobile.classList.remove('tableHidden');
    });

    scheduleBtn.addEventListener('click', () => {
        if (!skatersTbl.classList.contains('tableHidden')) skatersTbl.classList.add('tableHidden');
        if (!skatersTblMobile.classList.contains('tableHidden')) skatersTblMobile.classList.add('tableHidden');
        if (!goaliesTbl.classList.contains('tableHidden')) goaliesTbl.classList.add('tableHidden');
        if (!goaliesTblMobile.classList.contains('tableHidden')) goaliesTblMobile.classList.add('tableHidden');
        if (scheduleTbl.classList.contains('tableHidden')) scheduleTbl.classList.remove('tableHidden');
        if (scheduleTblMobile.classList.contains('tableHidden')) scheduleTblMobile.classList.remove('tableHidden');
    });
}

async function generateSkaterTable(arr) {
    try {
        let skaterTableContent = await getSkaterStats(arr);
        generateSkatersDataTables(skaterTableContent);
    } catch (err) {
        console.log(err);
    }
};

async function generateGoalieTable(arr) {
    try {
        let goalieTableContent = await getGoalieStats(arr);
        generateGoaliesDataTables(goalieTableContent);
    } catch (err) {
        console.log(err);
    }
};

//Implement JSTables Library
function generateSkatersDataTables(Arr) {
    populateTable(Arr, "skatersTableData", false);
    populateTable(Arr, "skatersTableDataMobile", true);
    let skaterDataTable = new JSTable("#skatersTable", {
        columns: [{
            select: 7,
            sortable: true,
            sort: "desc",
            searchable: true,
        }, ]
    });
    let skaterDataTableMobile = new JSTable("#skatersTableMobile", {
        columns: [{
            select: 7,
            sortable: true,
            sort: "desc",
            searchable: true,
        }, ]
    });
}

function generateGoaliesDataTables(Arr) {
    populateTable(Arr, "goaliesTableData", false);
    populateTable(Arr, "goaliesTableDataMobile", true);
    let goaliesDataTable = new JSTable("#goaliesTable", {
        columns: [{
            select: 6,
            sortable: true,
            sort: "desc",
            searchable: true,
        }, ]
    });
    let goaliesDataTableMobile = new JSTable("#goaliesTableMobile", {
        columns: [{
            select: 6,
            sortable: true,
            sort: "desc",
            searchable: true,
        }, ]
    });
}

//Function to call NHL API and return a list of all NHL teams
async function getTeams() {
    try {
        let url = 'https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster';
        let res = await fetch(url);
        res = await res.json();
        return listOfTeams = res.teams
    } catch (error) {
        console.log(error);
    }
}

//Function to get current week, from current day to Sunday
async function getCurrentWeek() {
    let weeklyGames = [];
    let dayOfWeek = moment().format('dddd');
    let currentDay = moment().format('YYYY-MM-DD');
    let endOfWeek = moment().endOf('week').add(1, 'days').format('YYYY-MM-DD');
    console.log(dayOfWeek);
    console.log('This is the current day: ', currentDay);
    console.log('This is the end of the week: ', endOfWeek);
    if (dayOfWeek === 'Sunday') {
        let url = `https://statsapi.web.nhl.com/api/v1/schedule?date=${currentDay}`;
        try {
            let res = await fetch(url);
            let dates = await res.json();
            dates = dates.dates;
            //Loop through the dates given and push all games to an array to be
            // used in generateWeeklyGamesTally()
            for (i = 0; i < dates.length; i++) {
                weeklyGames.push(dates[i].games);
            };
            return weeklyGames;
        } catch (error) {
            console.log(error);
        }
    } else {
        let url = `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${currentDay}&endDate=${endOfWeek}`;
        try {
            let res = await fetch(url);
            let dates = await res.json();
            dates = dates.dates;
            //Loop through the dates given and push all games to an array to be
            // used in generateWeeklyGamesTally()
            for (i = 0; i < dates.length; i++) {
                weeklyGames.push(dates[i].games);
            };
            console.log(weeklyGames);
            return weeklyGames;
        } catch (error) {
            console.log(error);
        }
    }
}

//Take generated weekly games array, loop through games for each day
// then loop through each player and determine if their team id (variable) is listed
//  on either day, if it is, increment playerGamesTally
//   playerGamesTally will be appended to the table for each player
function generateWeeklyGamesTally(gamesArr, variable) {
    let playerGamesTally = 0;
    for (i = 0; i < gamesArr.length; i++) {
        let games = gamesArr[i];
        for (j = 0; j < games.length; j++) {
            let awayTeam = games[j].teams.away.team.id;
            let homeTeam = games[j].teams.home.team.id;
            //console.log(`Looking for ${variable} - Away: ${awayTeam} Home: ${homeTeam}`);
            if (awayTeam === variable || homeTeam === variable) {
                playerGamesTally++;
            };
        };
    };
    return playerGamesTally;
};

function generateWeeklyOffDayGamesTally(gamesArr, variable) {
    let playerOffDayGamesTally = 0;
    for (i = 0; i < gamesArr.length; i++) {
        let games = gamesArr[i];
        if (gamesArr.length % 2) {
            if (i === 0 || i === 2 || i === 4 || i === 6) {
                for (j = 0; j < games.length; j++) {
                    let awayTeam = games[j].teams.away.team.id;
                    let homeTeam = games[j].teams.home.team.id;
                    if (awayTeam === variable || homeTeam === variable) {
                        playerOffDayGamesTally++;
                    };
                };
            };
        } else {
            if (i === 1 || i === 3 || i === 5) {
                for (j = 0; j < games.length; j++) {
                    let awayTeam = games[j].teams.away.team.id;
                    let homeTeam = games[j].teams.home.team.id;
                    if (awayTeam === variable || homeTeam === variable) {
                        playerOffDayGamesTally++;
                    };
                };
            };
        }
    };
    return playerOffDayGamesTally;
};

// Call on all team rosters through NHL API
//Loop through each team
// Get each players name, id number, team abbreviation and team id number
//  Seperate Goalies and Skaters into two arrays
//   generate their weekly games and ge their stats
async function generateSkaterArr() {
    try {
        let skatersArr = [];
        let listOfTeams = await getTeams();
        for (let i = 0; i < listOfTeams.length; i++) {
            let teamAbrv = listOfTeams[i].abbreviation;
            let teamRoster = listOfTeams[i].roster.roster;
            let teamId = listOfTeams[i].id;
            for (let j = 0; j < teamRoster.length; j++) {
                let skaterNameAndId = [];
                if (teamRoster[j].position.code !== 'G') {
                    skaterNameAndId.push({
                        name: teamRoster[j].person.fullName,
                        Id: teamRoster[j].person.id,
                        team: teamAbrv,
                        teamId: teamId
                    });
                    skatersArr.push(skaterNameAndId);
                };
            }
        }
        return skatersArr;
    } catch (err) {
        console.log(err);
    }
}
async function generateGoaliesArr() {
    try {
        let goaliesArr = [];
        let listOfTeams = await getTeams();
        for (let i = 0; i < listOfTeams.length; i++) {
            let teamAbrv = listOfTeams[i].abbreviation;
            let teamRoster = listOfTeams[i].roster.roster;
            let teamId = listOfTeams[i].id;
            for (let j = 0; j < teamRoster.length; j++) {
                let goalieNameAndId = [];
                if (teamRoster[j].position.code === 'G') {
                    goalieNameAndId.push({
                        name: teamRoster[j].person.fullName,
                        Id: teamRoster[j].person.id,
                        team: teamAbrv,
                        teamId: teamId
                    });
                    goaliesArr.push(goalieNameAndId);
                };
            }
        }
        return goaliesArr;
    } catch (err) {
        console.log(err);
    }
}

//Getting an individual player's stats from the NHL API
// Loop through each players stats using their ID generate from earlier API call
//  Use Promise.all to call each players API in parallel
//   return an object with required information 
async function getSkaterStats(gamesArr) {
    try {
        let skatersStatsArr = [];
        let Arr = await generateSkaterArr();
        const playerInfoPromises = await Promise.all(Arr.map(async(player) => {
            let num = player[0].Id;
            let thisPlayerName = player[0].name;
            let thisPlayerTeam = player[0].team;
            let thisPlayerTeamID = player[0].teamId;
            let url = `https://statsapi.web.nhl.com/api/v1/people/${num}/stats?stats=statsSingleSeason&season=20212022`;
            let thisPlayerStats = await fetch(url);
            let thisPlayerStatsJSON = await thisPlayerStats.json();
            return {
                stats: thisPlayerStatsJSON,
                name: thisPlayerName,
                team: thisPlayerTeam,
                teamId: thisPlayerTeamID
            };
        }))

        // Call the promise all to fetch all player Stats in parallel
        // Use .reduce to error catach any players that don't fit have the requried stats 
        const playerInfoResponses = await Promise.all(playerInfoPromises)
        skatersStatsArr = playerInfoResponses.reduce((playerArray, singlePlayerJSON, playerIndex) => {
            //console.log(singlePlayerJSON);
            let teamNum = singlePlayerJSON.teamId;
            let playerStats = singlePlayerJSON.stats.stats[0].splits;
            let results = [];
            if (playerStats.length > 0) {
                let gamesPlayed = playerStats[0].stat.games;
                if (gamesPlayed > 0) {
                    let playerGoals = playerStats[0].stat.goals;
                    let playerAssists = playerStats[0].stat.assists;
                    let playerPoints = playerStats[0].stat.points;
                    let playerGameWinningGoals = playerStats[0].stat.gameWinningGoals;
                    let pointsPerGame = roundPrecision((playerPoints / gamesPlayed), 3);
                    let playerTOIperGame = playerStats[0].stat.timeOnIcePerGame;
                    let playerPPGoals = playerStats[0].stat.powerPlayGoals;
                    let playerPPP = playerStats[0].stat.powerPlayPoints;
                    let playerPPTOIperGame = playerStats[0].stat.powerPlayTimeOnIcePerGame;
                    let playerShortHandedGoals = playerStats[0].stat.shortHandedGoals;
                    let playerShortHandedPoints = playerStats[0].stat.shortHandedPoints;
                    let playerSHTOIperGame = playerStats[0].stat.shortHandedTimeOnIcePerGame;
                    let playerHits = playerStats[0].stat.hits;
                    let playerBlocks = playerStats[0].stat.blocked;
                    let playerShots = playerStats[0].stat.shots;
                    let playerShootingPct = playerStats[0].stat.shotPct;
                    let playerfaceoffPct = playerStats[0].stat.faceOffPct;
                    let playerPim = playerStats[0].stat.pim;
                    let weeklyGamesTally = generateWeeklyGamesTally(gamesArr, teamNum);
                    let weeklyOffDayGamesTally = generateWeeklyOffDayGamesTally(gamesArr, teamNum);
                    //Generate the array to be appended to the table
                    // weekly games and off day games are generated through function
                    results.push(
                        singlePlayerJSON.name,
                        singlePlayerJSON.team,
                        gamesPlayed,
                        weeklyGamesTally,
                        weeklyOffDayGamesTally,
                        playerGoals,
                        playerAssists,
                        playerPoints,
                        playerGameWinningGoals,
                        pointsPerGame,
                        playerTOIperGame,
                        playerPPGoals,
                        playerPPP,
                        playerPPTOIperGame,
                        playerShortHandedGoals,
                        playerShortHandedPoints,
                        playerSHTOIperGame,
                        playerHits,
                        playerBlocks,
                        playerShots,
                        playerShootingPct,
                        playerfaceoffPct,
                        playerPim
                    );
                    playerArray.push(results);
                    return playerArray;
                }
                return playerArray;
            }
            return playerArray;
        }, []);
        return skatersStatsArr;
    } catch (err) {
        console.log(err);
    }
}

async function getGoalieStats(gamesArr) {
    try {
        let goalieStatsArr = [];
        let Arr = await generateGoaliesArr(gamesArr);
        const goalieInfoPromises = await Promise.all(Arr.map(async(goalie) => {
            let num = goalie[0].Id;
            let thisGoalieName = goalie[0].name;
            let thisGoalieTeam = goalie[0].team;
            let thisGoalieTeamID = goalie[0].teamId;
            let url = `https://statsapi.web.nhl.com/api/v1/people/${num}/stats?stats=statsSingleSeason&season=20212022`;
            let thisGoalieStats = await fetch(url);
            let thisGoalieStatsJSON = await thisGoalieStats.json();
            return {
                stats: thisGoalieStatsJSON,
                name: thisGoalieName,
                team: thisGoalieTeam,
                teamId: thisGoalieTeamID
            };
        }))

        // Call the promise all to fetch all Goalie Stats in parallel
        // Use .reduce to error catach any Goalies that don't fit have the requried stats 
        const goalieInfoResponses = await Promise.all(goalieInfoPromises)
        goalieStatsArr = goalieInfoResponses.reduce((goalieArray, singleGoalieJSON, goalieIndex) => {
            //console.log(singleGoalieJSON);
            let teamNum = singleGoalieJSON.teamId;
            let goalieStats = singleGoalieJSON.stats.stats[0].splits;
            let results = [];
            if (goalieStats.length > 0) {
                let gamesPlayed = goalieStats[0].stat.games;
                let gamesStarted = goalieStats[0].stat.gamesStarted;
                let goalieWins = goalieStats[0].stat.wins;
                let goalieLosses = goalieStats[0].stat.losses;
                let goalieShutouts = goalieStats[0].stat.shutouts;
                let goalieShotsAgainst = goalieStats[0].stat.shotsAgainst
                let goalieSaves = goalieStats[0].stat.saves;
                let goalieSavePercentage = roundPrecision(goalieStats[0].stat.savePercentage, 3);
                let goalieGoalsAgainst = goalieStats[0].stat.goalsAgainst;
                let goalieGoalAgainstAverage = roundPrecision((goalieStats[0].stat.goalAgainstAverage), 3);
                let weeklyGamestally = generateWeeklyGamesTally(gamesArr, teamNum);
                let weeklyOffDayGamesTally = generateWeeklyOffDayGamesTally(gamesArr, teamNum);

                //Generate the array to be appended to the table
                // weekly games and off day games are generated through function
                results.push(
                    singleGoalieJSON.name,
                    singleGoalieJSON.team,
                    weeklyGamestally,
                    weeklyOffDayGamesTally,
                    gamesPlayed,
                    gamesStarted,
                    goalieWins,
                    goalieLosses,
                    goalieShutouts,
                    goalieShotsAgainst,
                    goalieSaves,
                    goalieSavePercentage,
                    goalieGoalsAgainst,
                    goalieGoalAgainstAverage
                );
                goalieArray.push(results);
                return goalieArray;
            }
            return goalieArray;
        }, []);
        return goalieStatsArr;
    } catch (err) {
        console.log(err);
    }
};

//Run toPercision() on a category and account for undefined values
// Make undefined values = 0
function roundPrecision(number, n_integers) {
    return number != null ? number.toPrecision(n_integers) : 0;
}

//Function to empty the table, to be called in pagination buttons allowing new table to be rendered
/* function emptyTable(tableId) {
    const skatersTableBodyRef = document.getElementById(tableId);
    skatersTableBodyRef.innerHTML = "";
} */

/* //Function to render a single row and append it to the referenced table. 
// Allows logic to remain async
function renderSingleRow(skatersTableRowContent, tableId, isMobile) {
    const skatersTableBodyRef = document.getElementById(tableId);
    const skatersTableTempRow = document.createElement('tr');

    for (let col_index = 0; col_index < skatersTableRowContent.length; col_index++) {
        const skatersTableCellContent = skatersTableRowContent[col_index];
        const skatersTableTempCell = document.createElement('td');
        skatersTableTempCell.innerHTML = skatersTableCellContent;
        if (isMobile == true && col_index > 4) {
            continue;
        };
        skatersTableTempRow.append(skatersTableTempCell);
    };
    skatersTableBodyRef.append(skatersTableTempRow);
} */

function populateTable(Arr, tableId, isMobile) {
    //Reference Table
    const tableBodyRef = document.getElementById(tableId);

    //Iterate through the rows first
    for (let row_index = 0; row_index < Arr.length; row_index++) {
        const tableRowContent = Arr[row_index];
        const tableTempRow = document.createElement('tr'); //temporary row

        //Now iterate through columns
        for (let col_index = 0; col_index < tableRowContent.length; col_index++) {
            const tableCellContent = tableRowContent[col_index];

            if (isMobile == true && col_index > 7) {
                continue;
            };
            const tableTempCell = document.createElement('td'); //temporary cell
            tableTempCell.innerHTML = tableCellContent;
            tableTempRow.append(tableTempCell);
        };
        tableBodyRef.append(tableTempRow);
    };
};


// Array for listing players in table
recommendedPlayers = [
    ["Player 1"], //row 1
    ["Player 2"], //row 2
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

//Call main function to run page
main();