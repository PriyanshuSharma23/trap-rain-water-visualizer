let NUM_OF_BARS = 20;
let MAX_BOXES = 10;

function randomBoxHeight(maxBoxes) {
    return Math.floor(Math.random() * maxBoxes) + 1;
}

function createGrid(heightArr = []) {
    // Making a grid to track water levels
    let grid = [];
    NUM_OF_BARS = heightArr.length === 0 ? NUM_OF_BARS : heightArr.length;
    MAX_BOXES = heightArr.length === 0 ? MAX_BOXES : Math.max(...heightArr) + 1;
    for (let i = 0; i < MAX_BOXES; i++) {
        let arr = [];
        for (let j = 0; j < NUM_OF_BARS; j++) {
            arr.push(" ");
        }
        grid.push(arr);
    }

    function generateHeightArr() {
        let heightArr = [];
        for (let i = 0; i < NUM_OF_BARS; i++)
            heightArr.push(randomBoxHeight(MAX_BOXES));
        return heightArr;
    }

    if (heightArr.length === 0) 
      heightArr = generateHeightArr();


    let tempHeightArr = [...heightArr];
    // making walls in grid
    for (let i = MAX_BOXES - 1; i > 0; i--) {
        for (let j = 0; j < NUM_OF_BARS; j++) {
            if (tempHeightArr[j] > 0) {
                grid[i][j] = "x";
                tempHeightArr[j] = tempHeightArr[j] - 1;
            }
        }
    }

    return { grid, heightArr };
}

$("#myButton").click(handleClick);

function displayArray(arr) {
    $(".BarSection")
        .empty()
        .css("grid-template-columns", `repeat(${NUM_OF_BARS}, 1fr)`)
        .css("width", `${NUM_OF_BARS * 4}rem`);
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            if (arr[i][j] == "x") {
                let newDiv = $("<div></div>")
                    .addClass("wall")
                    .addClass("block");
                $(".BarSection").append(newDiv);
            } else if (arr[i][j] == "w") {
                let newDiv = $("<div></div>")
                    .addClass("water")
                    .addClass("block");
                $(".BarSection").append(newDiv);
            } else {
                let newDiv = $("<div></div>").addClass("air").addClass("block");
                $(".BarSection").append(newDiv);
            }
        }
    }
}

function handleClick() {
    let input = $("#input").val();
    let argArr =input ? input.split(" ").map(item => parseFloat(item)) : [];
    let { grid, heightArr } = createGrid(argArr);

    let waterPerColumn = waterHeightPerColumn(heightArr);

    let filledWaterGrid = fillWater(grid, waterPerColumn);
}

function waterHeightPerColumn(heightArr) {
    let heights = [];

    let leftArr = [];
    let maxLeft = heightArr[0];
    for (let i = 0; i < heightArr.length; i++) {
        maxLeft = Math.max(maxLeft, heightArr[i]);
        leftArr.push(maxLeft);
    }

    let rightArr = [];
    let maxRight = heightArr[heightArr.length - 1];
    for (let i = heightArr.length - 1; i >= 0; i--) {
        maxRight = Math.max(maxRight, heightArr[i]);
        rightArr.unshift(maxRight);
    }

    for (let i = 0; i < heightArr.length; i++) {
        heights.push(Math.min(leftArr[i], rightArr[i]) - heightArr[i]);
    }

    return heights;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function fillWater(grid, waterPerColumn) {
    for (let i = grid.length - 1; i > 0; i--) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == " ") {
                if (waterPerColumn[j] > 0) {
                    grid[i][j] = "w";
                    waterPerColumn[j] = waterPerColumn[j] - 1;
                }
            }
        }

        displayArray(grid);
        await sleep(500);
    }

    return grid;
}
