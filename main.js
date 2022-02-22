recommended_players = [
    ["Andrew", "Reynolds"], //row 1
    ["Ruben", "Chevez"] //row 2
]


var tbodyRef = document.getElementById('recommended-players');


recommended_players.forEach(rowContent => {
    var tempRow = document.createElement('tr'); //temporary row

    rowContent.forEach(cellContent => {
        var tempCell = document.createElement('td'); 
        tempCell.innerHTML = cellContent
        tempRow.append(tempCell)
    })

    tbodyRef.append(tempRow)
});


