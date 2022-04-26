// Global  Variables
var skatersArr = [];
var paginationStart = 0;
var paginationEnd = 20;
var paginationStartGoalie = 0;
var paginationEndGoalie = 20;
var listOfTeams = [];
var goaliesArr = [];
var weeklyGames = [];

//Repeatable Ajax function to avoid repitition
function makeAjaxCall(methodType, url, isAsync, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(methodType, url, isAsync);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 200) { // analyze HTTP status of the response
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
            return
        }
        let resp = xhr.response;
        callback(resp);
    }
};

makeAjaxCall('GET', 'https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster', true, generatePlayerArrays)

// Call on all team rosters through NHL API
//Loop through each team
// Get each players name, id number, team abbreviation and team id number
//  Seperate Goalies and Skaters into two arrays
//   generate their weekly games and ge their stats
async function generatePlayerArrays(teamsObj) {
    listOfTeams = teamsObj.teams;
    let startOfWeek = moment().startOf('week').add(1, 'days').format("YYYY-MM-DD");
    let currentDay = moment().format('YYYY-MM-DD');
    console.log(currentDay);
    let endOfWeek = moment().endOf('week').add(1, 'days').format('YYYY-MM-DD');
    console.log('This is the start: ', startOfWeek);
    console.log('This is the end: ', endOfWeek);
    await makeAjaxCall('GET', 'https://statsapi.web.nhl.com/api/v1/schedule?startDate=' + currentDay + '&endDate=' + endOfWeek, true, generateWeeklyGames);
    for (let i = 0; i < listOfTeams.length; i++) {
        let teamAbrv = listOfTeams[i].abbreviation;
        let teamRoster = listOfTeams[i].roster.roster;
        let teamId = listOfTeams[i].id;
        for (let j = 0; j < teamRoster.length; j++) {
            let goalieNameAndId = [];
            let skaterNameAndId = [];
            if (teamRoster[j].position.code === 'G') {
                goalieNameAndId.push({ name: teamRoster[j].person.fullName, Id: teamRoster[j].person.id, team: teamAbrv, teamId: teamId });
                goaliesArr.push(goalieNameAndId);
            } else {
                skaterNameAndId.push({ name: teamRoster[j].person.fullName, Id: teamRoster[j].person.id, team: teamAbrv, teamId: teamId });
                skatersArr.push(skaterNameAndId);
            };
        }
    }
    let paginatedSkatersArr = skatersArr.slice(paginationStart, paginationEnd);
    let paginatedGoalieArr = goaliesArr.slice(paginationStartGoalie, paginationEndGoalie);
    getSkaterStats(paginatedSkatersArr, "skatersTableData", false);
    getSkaterStats(paginatedSkatersArr, "skatersTableDataMobile", true);
    getGoalieStats(paginatedGoalieArr, "goaliesTableData", false);
    getGoalieStats(paginatedGoalieArr, "goaliesTableDataMobile", true);
    //console.log(skatersArr);
}

//Getting an individual player's stats from the NHL API
// Use paginated Arrays generated earlier to loop through each players id
//  each id is then appended to the API link to call on each player individually
function getSkaterStats(Arr, tableId, isMobile) {
    for (let i = 0; i < Arr.length; i++) {
        let num = Arr[i][0].Id;
        let teamNum = Arr[i][0].teamId;
        makeAjaxCall('GET', 'https://statsapi.web.nhl.com/api/v1/people/' + num + '/stats?stats=statsSingleSeason&season=20212022', true, (playerStats) => {
            playerStats = playerStats.stats[0].splits;

            if (playerStats.length > 0) {
                let gamesPlayed = playerStats[0].stat.games;
                let playerGoals = playerStats[0].stat.goals;
                let playerAssists = playerStats[0].stat.assists;
                let playerPoints = playerStats[0].stat.points;
                let playerGameWinningGoals = playerStats[0].stat.gameWinningGoals;
                let pointsPerGame = roundPrecision((playerPoints / gamesPlayed), 2);
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

                //Generate the array to be appended to the table
                // weekly games and off day games are generated through function
                let results = [
                    Arr[i][0].name,
                    Arr[i][0].team,
                    gamesPlayed,
                    generateWeeklyGamesTally(weeklyGames, teamNum),
                    generateWeeklyOffDayGamesTally(weeklyGames, teamNum),
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
                ];
                renderSingleRow(results, tableId, isMobile)
            };
        })
    }
};

function getGoalieStats(Arr, tableId, isMobile) {
    for (let i = 0; i < Arr.length; i++) {
        let num = Arr[i][0].Id;
        let teamNum = Arr[i][0].teamId;
        makeAjaxCall('GET', 'https://statsapi.web.nhl.com/api/v1/people/' + num + '/stats?stats=statsSingleSeason&season=20212022', true, (goalieStats) => {
            goalieStats = goalieStats.stats[0].splits;
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

                //Generate the array to be appended to the table
                // weekly games and off day games are generated through function
                let results = [
                    Arr[i][0].name,
                    Arr[i][0].team,
                    generateWeeklyGamesTally(weeklyGames, teamNum),
                    generateWeeklyOffDayGamesTally(weeklyGames, teamNum),
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
                ];

                renderSingleRow(results, tableId, isMobile)
            };
        });
    }
};

//Generate the games for a given Week from NHL API
// For now these dates are static
function generateWeeklyGames(currentWeekGames) {
    let dates = currentWeekGames.dates;
    console.log(dates);
    //Loop through the dates given and push all games to an array to be
    // used in generateWeeklyGamesTally()
    for (i = 0; i < dates.length; i++) {
        weeklyGames.push(dates[i].games);
    };
};

//Take generated weekly games array, loop through games for each day
// then loop through each player and determine if their team id (variable) is listed
//  on either day, if it is, increment playerGamesTally
//   playerGamesTally will be appended to the table for each player
function generateWeeklyGamesTally(Arr, variable) {
    let playerGamesTally = 0;
    for (i = 0; i < Arr.length; i++) {
        let games = Arr[i];
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

function generateWeeklyOffDayGamesTally(Arr, variable) {
    let playerOffDayGamesTally = 0;
    for (i = 0; i < Arr.length; i++) {
        let games = Arr[i];
        if (i === 0 || i === 2 || i === 4 || i === 6) {
            for (j = 0; j < games.length; j++) {
                let awayTeam = games[j].teams.away.team.id;
                let homeTeam = games[j].teams.home.team.id;
                if (awayTeam === variable || homeTeam === variable) {
                    playerOffDayGamesTally++;
                };
            };
        };
    };
    return playerOffDayGamesTally;
};

//Function to empty the table, to be called in pagination buttons allowing new table to be rendered
function emptyTable(tableId) {
    const skatersTableBodyRef = document.getElementById(tableId);
    skatersTableBodyRef.innerHTML = "";
}

//Attempting to implement JSTables Library
function generateDataTables() {
    let skaterDataTable = new JSTable("#skatersTable");
    let skaterDataTableMobile = new JSTable("#skatersTableMobile");
    let goaliesDataTable = new JSTable("#goaliesTable");
    let goaliesDataTableMobile = new JSTable("#goaliesTableMobile");
}

// When 'Previous' or 'Next' button is clicked, decrease/increase pagination variables, 
//    empty the table and render new table
const previousBtn = document.getElementById('paginationPrevious');
previousBtn.addEventListener("click", function() {
    if (paginationStart === 0) {
        return;
    } else {
        paginationStart -= 20;
        paginationEnd -= 20;

        emptyTable("skatersTableData")
        emptyTable("skatersTableDataMobile")

        paginatedSkatersArr = skatersArr.slice(paginationStart, paginationEnd);
        getSkaterStats(paginatedSkatersArr, "skatersTableData", false);
        getSkaterStats(paginatedSkatersArr, "skatersTableDataMobile", true);
    };
});


const nextBtn = document.getElementById('paginationNext');
nextBtn.addEventListener("click", function() {
    if (paginationEnd >= skatersArr.length) {
        return;
    } else {
        paginationStart += 20;
        paginationEnd += 20;

        emptyTable("skatersTableData")
        emptyTable("skatersTableDataMobile")

        paginatedSkatersArr = skatersArr.slice(paginationStart, paginationEnd);
        getSkaterStats(paginatedSkatersArr, "skatersTableData", false);
        getSkaterStats(paginatedSkatersArr, "skatersTableDataMobile", true);
    };
});

const previousBtnGoalies = document.getElementById('paginationPreviousGoalies');
previousBtnGoalies.addEventListener("click", function() {
    if (paginationStartGoalie === 0) {
        return;
    } else {
        paginationStartGoalie -= 20;
        paginationEndGoalie -= 20;

        emptyTable("goaliesTableData")
        emptyTable("goaliesTableDataMobile")

        paginatedGoaliesArr = goaliesArr.slice(paginationStartGoalie, paginationEndGoalie);
        getGoalieStats(paginatedGoaliesArr, "goaliesTableData", false);
        getGoalieStats(paginatedGoaliesArr, "goaliesTableDataMobile", true);
    };
});


const nextBtnGoalies = document.getElementById('paginationNextGoalies');
nextBtnGoalies.addEventListener("click", function() {
    if (paginationEndGoalie >= goaliesArr.length) {
        return;
    } else {
        paginationStartGoalie += 20;
        paginationEndGoalie += 20;

        emptyTable("goaliesTableData")
        emptyTable("goaliesTableDataMobile")

        paginatedGoaliesArr = goaliesArr.slice(paginationStartGoalie, paginationEndGoalie);
        getGoalieStats(paginatedGoaliesArr, "goaliesTableData", false);
        getGoalieStats(paginatedGoaliesArr, "goaliesTableDataMobile", true);
    };
});

//Run toPercision() on a category and account for undefined values
// Make undefined values = 0
function roundPrecision(number, n_integers) {
    return number != null ? number.toPrecision(n_integers) : 0;
}

//Function to render a single row and append it to the referenced table. 
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
}

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