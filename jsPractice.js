// Global  Variables
/* var skatersArr = [];
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
        let teamAbrv = listOfTeams[i].abbreviation;
        let teamRoster = listOfTeams[i].roster.roster;
        for (let j = 0; j < teamRoster.length; j++) {
            let goalieNameAndId = [];
            let skaterNameAndId = [];
            if (teamRoster[j].position.code === 'G') {
                goalieNameAndId.push({ name: teamRoster[j].person.fullName, Id: teamRoster[j].person.id, Team: teamAbrv });
                goaliesArr.push(goalieNameAndId);
            } else {
                skaterNameAndId.push({ name: teamRoster[j].person.fullName, Id: teamRoster[j].person.id, Team: teamAbrv });
                skatersArr.push(skaterNameAndId);
            };
            console.log(skaterNameAndId);
        }
    }
} */

let currentDate = new Date();
console.log(currentDate);
let dayOfWeek = currentDate.getUTCDay();
let hour = currentDate.getUTCHours();
console.log(hour);
console.log(dayOfWeek);
let nextDay = new Date(currentDate);
nextDay.setDate(currentDate.getUTCDate() + 1);
console.log(nextDay);

for (let i = 0; i < 7; i++) {
    const element = array[i];

}

let xhr = new XMLHttpRequest();
let gamesTally = 0;

xhr.open('GET', 'https://statsapi.web.nhl.com/api/v1/schedule?teamId=30', true);

xhr.responseType = 'json';

xhr.send();

xhr.onload = function() {
    if (xhr.status != 200) {
        alert(`Error ${xhr.status}: ${xhr.statusText}`);
        return;
    };

    let currentDateGames = xhr.response;
    let totalGames = currentDateGames.totalGames;
    console.log(totalGames);
    if (totalGames === 1) {
        gamesTally++;
        console.log(gamesTally);
    }
}