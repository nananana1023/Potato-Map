const elements = [
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'town',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false        
    },
    {
        time: 1,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'town',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'town',
        shape: [[1,1,0],
                [1,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'town',
        shape: [[1,1,1],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'farm',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'farm',
        shape: [[0,1,0],
                [1,1,1],
                [0,1,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [1,0,0],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,0,0],
                [1,1,1],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,1]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,0],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
]

const getImage = {
    'water': "./assets/tiles/water_tile.png",
    'town': "./assets/tiles/village_tile.png",
    'forest': "./assets/tiles/forest_tile.png",
    'farm' : "./assets/tiles/plains_tile.png",
}

const mountains = [[2, 2], [4, 9], [6, 4], [9, 10], [10, 6]];
let remainingTime = 28; 
const size = 11; 
const grid = document.getElementById('grid'); 

function makeGrid() {
    for (let i = 1; i <= size; i++) { 
        const row = document.createElement('div');
        row.classList.add('row');
        row.id = 'row_' + i;
        grid.appendChild(row); 

        for (let j = 1; j <= size; j++) { 
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell_${i}_${j}`; //unique id for every cell 
            row.appendChild(cell);

            if (mountains.some(mountain => mountain[0] === i && mountain[1] === j)) {
                cell.classList.add('mountain'); //mountain fields 
            }
        }
    }
}
//shuffle next element from array 
const randomElements = (function shuffle(array) {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
})(elements);

let index = 0;
let element = randomElements[index];

//highlight the cells on which the shape will be placed 
function highlight(r, c) {
    const shape = element.shape;
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            let row = r + i;
            let col = c + j;

            if (shape[i][j] === 1) {
                const cell = document.getElementById(`cell_${row}_${col}`);
                if (cell) { 
                    cell.classList.add('cell-highlight'); //highlight cells of the shape 
                } 
            }
        }
    }
}

//remove highlight css
function removeHighlight() {
    const outlineCells = document.querySelectorAll('.cell-highlight');
    outlineCells.forEach(cell => cell.classList.remove('cell-highlight'));
}

// Check if a cell is free or not
function isOccupied(row, col, shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                const newRow = row + r;
                const newCol = col + c;
                const cell = document.getElementById(`cell_${newRow}_${newCol}`);
                if (cell.classList.contains('cell-occupied')) { //occupied by shape 
                    return true;
                }
                for (let i = 0; i < mountains.length; i++) {
                    if (newRow === mountains[i][0] && newCol === mountains[i][1]) {
                        return true; // occupied by mountain
                    }
                }
            }
        }
    }
    return false; //free cell
}

function showNext() {
    const nextShape = randomElements[index]; 
    const nextDiv = document.getElementById('element');
    nextDiv.innerHTML = '';

    // html for the next element
    for (let i = 0; i < nextShape.shape.length; i++) {
        const row = document.createElement('div');
        row.classList.add('preview-row');
        for (let j = 0; j < nextShape.shape[i].length; j++) {
            const cell = document.createElement('div');
            cell.classList.add('preview-cell');
            if (nextShape.shape[i][j] === 1) {
                let path = getImage[nextShape.type];
                cell.style.backgroundImage = `url("${path}")`;
            }
            row.appendChild(cell);
        }
        nextDiv.appendChild(row);
    }

    // Time display
    const timeDisplay = document.createElement('div');
    timeDisplay.classList.add('time-display');
    const clockIcon = document.createElement('img');
    clockIcon.src = "./assets/images/clock-icon.png";
    timeDisplay.classList.add('preview-time-unit');
    timeDisplay.textContent = `${nextShape.time} `;
    timeDisplay.appendChild(clockIcon);
    nextDiv.appendChild(timeDisplay);
}


// Rotate
document.getElementById('rotate').addEventListener('click', rotate);

function rotate() {
    const oldShape = element.shape;
    const newShape = [];
    const rows = oldShape.length;
    const cols = oldShape[0].length;

    for (let c = 0; c < cols; c++) {
        const newRow = [];
        for (let r = rows - 1; r >= 0; r--) {
            newRow.push(oldShape[r][c]);
        }
        newShape.push(newRow);
    }

    element.shape = newShape; 
    removeHighlight();
    highlight(parseInt(element.shape.length), parseInt(element.shape[0].length)); 
    showNext(); 
}

// Flip
document.getElementById('flip').addEventListener('click', flip);

function flip() {
    const oldShape = element.shape;
    const newShape = [];
    const rows = oldShape.length;
    const cols = oldShape[0].length;

    for (let r = 0; r < rows; r++) {
        const newRow = [];
        for (let c = cols - 1; c >= 0; c--) {
            newRow.push(oldShape[r][c]);
        }
        newShape.push(newRow);
    }

    element.shape = newShape;
    removeHighlight();
    highlight(parseInt(element.shape.length), parseInt(element.shape[0].length)); 
    showNext(); 
}

// When mouse hovers on a cell, highlight
grid.addEventListener('mousemove', (event) => {
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;
    const [row, col] = cell.id.split('_').slice(1).map(Number);
    removeHighlight();
    highlight(row, col);
});

// When mouse clicks a cell, place
grid.addEventListener('click', (event) => {
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;
    const [row, col] = cell.id.split('_').slice(1).map(Number);
    placeShape(row, col);
});

function imgOnMap(row, col, shape, type) {
    const rows = shape.length;
    const cols = shape[0].length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let newRow = row + r;
            let newCol = col + c;
           
            if (shape[r][c] === 1) { //1 in shape matrix, place it on map 
                const cell = document.getElementById(`cell_${newRow}_${newCol}`);
                cell.classList.add('cell-occupied');
                cell.classList.add(`${type}`);
                let path = getImage[type];
                cell.style.backgroundImage = `url("${path}")`;
            }
        }
    }
}

function placeShape(row, col) {
    if (remainingTime > 0) {
        const time = element.time;
        const shape = element.shape;
        const type = element.type;

            if (!isOccupied(row, col, shape)) {
                imgOnMap(row, col, shape, type);
                index = (index + 1) % randomElements.length;
                element = randomElements[index];
                showNext();
                remainingTime -= time; //subtract current shape's time from remaining 
                document.getElementById('remaining-time').textContent = 28 - remainingTime;
            }
        
    } else {
        //can't place shape, over 
    }
    
    updateMissionPoints(); // Check all mission functions/ game is over

}

document.getElementById('remaining-time').textContent = 28-remainingTime;

//missions
function edgeOfForest() {
    let points = 0;
    const mapRows = document.getElementsByClassName('row');
    for (let i = 0; i < mapRows.length; i++) {
      const cells = mapRows[i].getElementsByClassName('cell');
      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        if (cell.classList.contains('forest')) {
          if (i === 0 || j === 0 || i === size - 1 || j === size - 1) {
            points++;
          }
        }
      }
    }
    return points;
  }

function sleepyValley() {
    let points = 0;
    const mapRows = document.getElementsByClassName('row');
    for (let i = 0; i < mapRows.length; i++) {
      const cells = mapRows[i].getElementsByClassName('forest');
      if (cells.length >= 3) {
        points += 4;
      }
    }
    return points;
  }
  
function wateringPotatoes() {
    let points = 0;
    const mapCells = document.getElementsByClassName('cell');
    for (let i = 0; i < mapCells.length; i++) {
      const cell = mapCells[i];
      if (cell.classList.contains('farm')) {
        const [row, col] = cell.id.split('_').slice(1).map(Number);
        const surroundingCells = [[row - 1, col],[row + 1, col],[row, col - 1],[row, col + 1]];
        surroundingCells.forEach(coords => {
          const [x, y] = coords;
          const adjacentCell = document.getElementById(`cell_${x}_${y}`);
          if (adjacentCell && adjacentCell.classList.contains('water')) {
            points += 2;
          }
        });
      }
    }
    return points;
  }
  
function borderlands() {
    let points = 0;
    const gridRows = document.getElementsByClassName('row');
    const mapCells = document.getElementsByClassName('cell');
    for (let i = 0; i < gridRows.length; i++) {
      let rowFullyOccupied = true;
      let columnFullyOccupied = true;
      const cells = gridRows[i].getElementsByClassName('cell');
      for (let j = 0; j < cells.length; j++) {
        if (!cells[j].classList.contains('cell-occupied')) {
            rowFullyOccupied = false;
        }
        const colCell = mapCells[j * size + i];
        if (!colCell.classList.contains('cell-occupied')) {
            columnFullyOccupied = false;
        }
      }
      if (rowFullyOccupied) {
        points += 6;
      }
      if (columnFullyOccupied) {
        points += 6;
      }
    }
    return points;
  }


const missionsArray = [edgeOfForest, sleepyValley, wateringPotatoes, borderlands]
const seasons=['spring', 'summer', 'autumn','winter'];
const letters=['A', 'B', 'C', 'D']
let season=seasons[0];
let totalScore=0;

function updateMissionPoints() {
     //checking all missions - works 
     let i=0;
     let totalScore=0;
    missionsArray.forEach(func => {
        const id='points'+letters[i] //A, func is A
        const pointsBox=document.getElementById(id);
        const pointForMission=func();
        pointsBox.textContent = `Points: ${pointForMission}`;
        i++;
        totalScore+=pointForMission;
    });

     //total points 
     const totalDiv=document.getElementById('total');
     totalDiv.textContent=`${totalScore} points`;
     if(remainingTime<=0)
     {
        const overDiv = document.getElementById('over');
        overDiv.textContent="Game is over!";
     }


    //season part doesn't work properly
    const misA=document.getElementById('A');
    const misB=document.getElementById('B');
    const misC=document.getElementById('C');
    const misD=document.getElementById('D');
    
    const current=document.getElementById('current');

    //check the current season and decide which missions to complete 
    if (season==='spring')
    {
        let points=0;
       const pointsDiv=document.getElementById('springPoints');
       pointsDiv.innerHTML = '';

        //highlight the active missions
       misA.classList.add('active-mission');
       misB.classList.add('active-mission');
        
        points+=edgeOfForest();
        points+=sleepyValley();
        
        pointsDiv.textContent=`${points} points`;
        if(remainingTime<=21)
        {
            season=seasons[1]; //next season 
            current.textContent='Summer (BC)'
            totalScore+=points;
        }
    }else if (season==='summer')
    {
        let points=0;
        const pointsDiv=document.getElementById('summerPoints');
        pointsDiv.innerHTML = '';

        //remove highlight from previous active missions 
       const activeMissions = document.querySelectorAll('.active-mission');
       activeMissions.forEach(mis => mis.classList.remove('active-mission'));
        //highlight current active 
       misC.classList.add('active-mission');
       misB.classList.add('active-mission');
        
        points+=sleepyValley();
        points+=wateringPotatoes();
       
        pointsDiv.textContent=`${points} points`;
        if(remainingTime<=14)
        {
            season=seasons[2];
            current.textContent='Autumn (CD)'
            totalScore+=points;
        }
    }
    else if(season==='autumn')
    {
        let points=0;
        const pointsDiv=document.getElementById('autumnPoints');
        pointsDiv.innerHTML = '';
        //remove highlight from previous active missions 
        const activeMissions = document.querySelectorAll('.active-mission');
        activeMissions.forEach(mis => mis.classList.remove('active-mission'));
         //highlight current active 
        misC.classList.add('active-mission');
        misD.classList.add('active-mission');
        
        points+=borderlands();
        points+=wateringPotatoes();
       
        pointsDiv.textContent=`${points} points`;
        if(remainingTime<=7)
        {
            season=seasons[3];
            current.textContent='Winter (AD)'
            totalScore+=points;
        }
    }
    else if(season==='winter')
    {
        let points=0;
        const pointsDiv=document.getElementById('winterPoints');
        pointsDiv.innerHTML = '';
        //remove highlight from previous active missions 
        const activeMissions = document.querySelectorAll('.active-mission');
        activeMissions.forEach(mis => mis.classList.remove('active-mission'));
         //highlight current active 
        misA.classList.add('active-mission');
        misD.classList.add('active-mission');
        
        points+=borderlands();
        points+=edgeOfForest();
        
        pointsDiv.textContent=`${points} points`;
        if(remainingTime<=0)
        {
            totalScore+=points;
            FinalScore();
        }
    }
}

makeGrid();
showNext();
document.getElementById('remaining-time').textContent = 28-remainingTime;