// Global  Variables
var skatersArr = [];
var paginationStart = 0;
var paginationEnd = 20;
var listOfTeams = [];
var goaliesArr = [];

let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster', true);

//responseType removes the need for .parse
xhr.responseType = 'json';

xhr.send();

xhr.onload = function() {
    if (xhr.status != 200) { // analyze HTTP status of the response
        alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        return
    }

    let teamsObj = xhr.response;
    listOfTeams = teamsObj.teams;
    for (let i = 0; i < listOfTeams.length; i++) {
        let teamRoster = listOfTeams[i].roster.roster;
        for (let j = 0; j < teamRoster.length; j++) {
            let goalieNameAndId = [];
            let skaterNameAndId = [];
            if (teamRoster[j].position.code === 'G') {
                goalieNameAndId.push({ name: teamRoster[j].person.fullName, Id: teamRoster[j].person.id });
                goaliesArr.push(goalieNameAndId);
            } else {
                skaterNameAndId.push({ name: teamRoster[j].person.fullName, Id: teamRoster[j].person.id });
                skatersArr.push(skaterNameAndId);
            };
        }
    }

    //create pagination, using local pagination as the undocumented NHL API does not appear to have any
    let paginatedSkatersArr = skatersArr.slice(paginationStart, paginationEnd);
    getSkaterStats(paginatedSkatersArr, "skatersTableData", false);
    getSkaterStats(paginatedSkatersArr, "skatersTableDataMobile", true);
}

//Function to empty the table, to be called in pagination buttons allowing new table to be rendered
function emptyTable(tableId) {
    const skatersTableBodyRef = document.getElementById(tableId);
    skatersTableBodyRef.innerHTML = "";
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

        let paginatedSkatersArr = skatersArr.slice(paginationStart, paginationEnd);
        getSkaterStats(paginatedSkatersArr, "skatersTableData");
        getSkaterStats(paginatedSkatersArr, "skatersTableDataMobile");
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

        let paginatedSkatersArr = skatersArr.slice(paginationStart, paginationEnd);
        getSkaterStats(paginatedSkatersArr, "skatersTableData");
        getSkaterStats(paginatedSkatersArr, "skatersTableDataMobile");
    };
});

//Getting an individual player's stats
function getSkaterStats(ArrIn, tableId, isMobile) {
    for (let i = 0; i < ArrIn.length; i++) {
        let xhrFunc = new XMLHttpRequest();
        let num = ArrIn[i][0].Id;

        xhrFunc.open('GET', 'https://statsapi.web.nhl.com/api/v1/people/' + num + '/stats?stats=statsSingleSeason&season=20212022', true);

        xhrFunc.responseType = 'json';

        xhrFunc.send();

        xhrFunc.onload = function() {
            if (xhrFunc.status != 200) { // analyze HTTP status of the response
                alert(`Error ${xhrFunc.status}: ${xhrFunc.statusText}`); // e.g. 404: Not Found
                return
            }
            let playerStats = xhrFunc.response;
            playerStats = playerStats.stats[0].splits;

            if (playerStats.length > 0) {
                let gamesPlayed = playerStats[0].stat.games;
                let playerGoals = playerStats[0].stat.goals;
                let playerAssists = playerStats[0].stat.assists;
                let playerPoints = playerStats[0].stat.points;
                let playerGameWinningGoals = playerStats[0].stat.gameWinningGoals;
                let pointsPerGame = (playerPoints / gamesPlayed).toPrecision(2);
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
                let results = [ArrIn[i][0].name, gamesPlayed, playerGoals, playerAssists, playerPoints, playerGameWinningGoals, pointsPerGame, playerTOIperGame, playerPPGoals, playerPPP, playerPPTOIperGame, playerShortHandedGoals, playerShortHandedPoints, playerSHTOIperGame, playerHits, playerBlocks, playerShots, playerShootingPct, playerfaceoffPct, playerPim];

                renderSingleRow(results, tableId, isMobile)
            };
        };
    }
}

//Function to render a single row and append it to the referenced table. Allows logic to remain async
function renderSingleRow(skatersTableRowContent, tableId, isMobile) {
    const skatersTableBodyRef = document.getElementById(tableId);
    const skatersTableTempRow = document.createElement('tr');

    for (let col_index = 0; col_index < skatersTableRowContent.length; col_index++) {
        const skatersTableCellContent = skatersTableRowContent[col_index];
        const skatersTableTempCell = document.createElement('td');
        skatersTableTempCell.innerHTML = skatersTableCellContent;
        // if (isMobile == true) { // && col_index > 6
        //     continue;
        // };
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

/* JQuery table to be added later */

// $.get("https://statsapi.web.nhl.com/api/v1/teams", function(data) {
//     console.log(
//         data["teams"]
//     );
//     var team_list = data["teams"]
//     var trHTML = '';
//     for (let index = 0; index < team_list.length; index++) {
//         const single_team = team_list[index];
//         console.log(single_team);
//         trHTML += '<tr><td>' + single_team["name"] + '</td> <td>' + single_team["abbreviation"] + '</td> </tr>';
//     }
//     $('#jquery-table').html(trHTML);

// }); 

/* 
Ruben's Example 

var settings = {
    "url": "https://statsapi.web.nhl.com/api/v1/teams",
    "method": "GET",
    "timeout": 0,
};
$.ajax(settings).done(function(data) {
    console.log("Teams: ", data.teams);
    var team_list = data.teams.slice(0, 5)
    console.log("Filling div: ");
    // $('#teamsAPIexample').html(team_list[0].name);
    team_list.forEach(team => {
        $('#teamsAPIexample').append("<tr> <td>" + team.name + "</td><td><strong>" + team.abbreviation + "</strong> </td> </tr>")
    });
}); */