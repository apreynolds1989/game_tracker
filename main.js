let xhr = new XMLHttpRequest();
let listOfTeams = [];
let skatersArr = [];
let goaliesArr = [];
let num;

xhr.open('GET', 'https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster', true);

xhr.onload = function() {
    teamsObj = JSON.parse(this.responseText);
    listOfTeams = teamsObj.teams;
    console.log(teamsObj);
    console.log(listOfTeams);
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
    getSkaterStats(skatersArr);
}

xhr.send();

console.log(goaliesArr);
console.log(skatersArr);


//Getting an individual player's stats
function getSkaterStats(Arr) {
    let output = [];

    for (let i = 0; i < Arr.length; i++) {
        let xhrFunc = new XMLHttpRequest();
        num = Arr[i][0].Id;

        xhrFunc.open('GET', 'https://statsapi.web.nhl.com/api/v1/people/' + num + '/stats?stats=statsSingleSeason&season=20212022', true);

        xhrFunc.onload = function() {
            let playerStats = JSON.parse(this.responseText);
            playerStats = playerStats.stats

            //NEED TO DEAL WITH UNDEFINED 'stat' ERROR

            let playerGoals = playerStats[0].splits[0].stat.goals;
            let playerAssists = playerStats[0].splits[0].stat.assists;
            let playerPoints = playerStats[0].splits[0].stat.points;

            output.push(`${Arr[i][0].name} has scored ${playerGoals} goals and ${playerAssists} assists for ${playerPoints} points on the year!`);

            //Print to HTML if Needed?
            //document.querySelector('#player').insertAdjacentHTML('beforeend', output);
        }

        xhrFunc.send();
    }
    console.log(output);
}

//Create Array for weekly games
let weeklyGames = [
    ["Player", "Weekly Games", "Off-Day Games", "Games Played", "Goals", "Assists", "Points", "Powerplay Points", "Hits", "Blocks"],
    ["Player 1", 4, 2, 55, 12, 32, 44, 13, 21, 7],
    ["Player 2", 3, 2, 53, 21, 44, 65, 11, 5, 5],
    ["Player 3", 3, 2, 56, 14, 22, 36, 15, 22, 15],
    ["Player 4", 3, 1, 33, 13, 13, 26, 8, 44, 15],
    ["Player 5", 2, 1, 49, 16, 33, 49, 24, 35, 22],
    ["Player 6", 2, 0, 51, 24, 25, 49, 20, 16, 9]
];

function populateWeeklyGamesTable(weeklyGames, tableId, isMobile) {
    //Reference the table
    const weeklyGamesTableBodyRef = document.getElementById(tableId);

    //Iterate through the rows
    for (let row_index = 0; row_index < weeklyGames.length; row_index++) {
        const weeklyGamesRowContent = weeklyGames[row_index];
        const weeklyGamesTempRow = document.createElement('tr'); //temporary row

        for (let column_index = 0; column_index < weeklyGamesRowContent.length; column_index++) {
            const weeklyGamesCellContent = weeklyGamesRowContent[column_index];

            if (isMobile == true && column_index > 6) {
                continue;
            }
            const weeklyGamesTempCell = document.createElement('td');
            weeklyGamesTempCell.innerHTML = weeklyGamesCellContent;
            weeklyGamesTempRow.append(weeklyGamesTempCell);

        }
        weeklyGamesTableBodyRef.append(weeklyGamesTempRow);
    }

    // weeklyGames.forEach(weeklyGamesRowContent => {
    //     const weeklyGamesTempRow = document.createElement('tr'); //temporary row
    //     //Iterate trhough the cells
    //     weeklyGamesRowContent.forEach(weeklyGamesCellContent => {
    //         const weeklyGamesTempCell = document.createElement('td'); 
    //         weeklyGamesTempCell.innerHTML = weeklyGamesCellContent;
    //         weeklyGamesTempRow.append(weeklyGamesTempCell);
    //     });
    //     weeklyGamesTableBodyRef.append(weeklyGamesTempRow);
    // });
}

populateWeeklyGamesTable(weeklyGames, 'weeklyGames', false)
populateWeeklyGamesTable(weeklyGames, 'weeklyGamesMobile', true)

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