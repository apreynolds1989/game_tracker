










// Array for listing players in table
recommendedPlayers = [ //QUESTION : Why the double set of [] ?
    ["Top 5 Recommended Pick-ups"], //row 1
    ["Player 1"], //row 2
    ["Player 2"],
    ["Player 3"],
    ["Player 4"],
    ["Player 5"]
    ];

//Reference the table
const tbodyRef = document.getElementById('recommendedPlayers');


//Iterate through the rows
recommendedPlayers.forEach(rowContent => {
    const tempRow = document.createElement('tr'); //temporary row

    //Iterate trhough the cells
    rowContent.forEach(cellContent => {
        const tempCell = document.createElement('td'); 
        tempCell.innerHTML = cellContent
        tempRow.append(tempCell)
    })

    tbodyRef.append(tempRow)
});


