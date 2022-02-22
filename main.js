// Array for listing players in table
recommended_players = [
    ["Andrew", "Reynolds"], //row 1
    ["Ruben", "Chevez"] //row 2
]

//Reference the table
var tbodyRef = document.getElementById('recommended-players');


//Iterate through the rows
recommended_players.forEach(rowContent => {
    var tempRow = document.createElement('tr'); //temporary row

    //Iterate trhough the cells
    rowContent.forEach(cellContent => {
        var tempCell = document.createElement('td'); 
        tempCell.innerHTML = cellContent
        tempRow.append(tempCell)
    })

    tbodyRef.append(tempRow)
});


