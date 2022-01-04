//insanely unoptimized for servers and just in general. using static webpage display method.

function init() {
    gridArr = [];
    iGrid();

    snake = new Snake();
    spawnApple();
    play = setInterval(update, 150); //play is an interval *handle*. I see this a lot in C

    display();
}
function iGrid() {
    for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
            gridArr.push(new Box(r, c));
        }
    }
}
document.onkeydown = (e) => {
    switch (e.key) {
        case "w": case "W": case "ArrowUp":
            if (snake.buffer[0]) { //if either [0] or [1] exists, check for 0's dir and update 1
                if (snake.buffer[0][0] != 1 && snake.buffer[0][1] != 0)
                    snake.buffer[1] = [-1, 0];
            }
            else {
                if (snake.body[0].dir[0] != 1 && snake.body[0].dir[1] != 0)
                    snake.buffer.push([-1, 0]);
            }
            break;
        case "a": case "A": case "ArrowLeft":
            if (snake.buffer[0]) {
                if (snake.buffer[0][0] != 0 && snake.buffer[0][1] != 1)
                    snake.buffer[1] = [0, -1];
            }
            else {
                if (snake.body[0].dir[0] != 0 && snake.body[0].dir[1] != 1)
                    snake.buffer.push([0, -1]);
            }
            break;
        case "s": case "S": case "ArrowDown":
            if (snake.buffer[0]) {
                if (snake.buffer[0][0] != -1 && snake.buffer[0][1] != 0)
                    snake.buffer[1] = [1, 0];
            }
            else {
                if (snake.body[0].dir[0] != -1 && snake.body[0].dir[1] != 0)
                    snake.buffer.push([1, 0]);
            }
            break;
        case "d": case "D": case "ArrowRight":
            if (snake.buffer[0]) {
                if (snake.buffer[0][0] != 0 && snake.buffer[0][1] != -1)
                    snake.buffer[1] = [0, 1];
            }
            else {
                if (snake.body[0].dir[0] != 0 && snake.body[0].dir[1] != -1)
                    snake.buffer.push([0, 1]);
            }
            break;
    }
}
document.oncontextmenu = (e) => {
    /* if (play) {
        clearInterval(play);
        play = null;
        console.log("pause");
    }
    else {
        play = setInterval(update, 150);
        console.log("play");
    } */
    return false;
}
function setDir() {
    if (snake.buffer[0]) {
        snake.body[0].box.dir = snake.body[0].dir = snake.buffer.shift();
    }
}
function getBox(xCon, yCon) {
    return gridArr.filter(box => box.x == xCon && box.y == yCon)[0];
}



function update() {
    setDir();
    //check bounds. end if bound
    if (snake.body[0].box.x == 0 && snake.body[0].dir[0] == -1 ||
        snake.body[0].box.x == 14 && snake.body[0].dir[0] == 1 ||
        snake.body[0].box.y == 0 && snake.body[0].dir[1] == -1 ||
        snake.body[0].box.y == 14 && snake.body[0].dir[1] == 1) {
        console.log("dead");
        return clearInterval(play);
    }

    //move & eat
    let eaten = false;
    let b = snake.body.length; //since the length may be modified
    let newBody;
    for (let i = 0; i < b; i++) {
        let body = snake.body[i];
        if (i == b - 1 && eaten) {
            newBody = new Body(snake.body[b - 1].box.x, snake.body[b - 1].box.y);
            newBody.dir = snake.body[b - 1].dir;
            snake.body.push(newBody);
        }
        body.box = getBox(body.box.x + body.dir[0], body.box.y + body.dir[1]);
        if (body.box.dir) //set box dir for other bodies that step on it
            body.dir = body.box.dir;
        //check if eat self.
        if (snake.body.filter((body) => body != snake.body[0] && body.box == snake.body[0].box)[0]) {
            console.log("suicide");
            return clearInterval(play);
        }
        if (i == 0 && body.box == apple.box) {
            eaten = true;
            spawnApple();
        }
    }
    snake.body[snake.body.length - 1].box.dir = null;
    console.log(snake);
    display();
}

function spawnApple() {
    let x = Math.floor(Math.random() * 15); //Math.random returns a random number from [0, 1). The grid is 15x15
    let y = Math.floor(Math.random() * 15);
    console.log(getBox(x, y).el.classList);
    if (getBox(x, y).el.classList.contains("occ"))
        return spawnApple();
    apple = new Apple(x, y);
    console.log(apple);
}


function display() {
    displayGrid();
}

//this needs to be optimized. don't append every element every update, just iterate through and update and stuff
function displayGrid() {
    let grid = document.getElementById("therealbody");
    gridArr.forEach(item => {
        //clears classlist - if snake occupies, will add. Note: there's probably a better way to do this. pls search
        if (item.el.classList.contains("occ")) item.el.classList.remove("occ");
        if (item.el.classList.contains("apple")) item.el.classList.remove("apple");

        //check snake coords
        for (let i = 0; i < snake.body.length; i++) {
            if (snake.body[i].box.x == item.x && snake.body[i].box.y == item.y) {
                //console.log(`${item.x}, ${item.y}`);
                item.el.classList.add("occ");
            }
        }
        //apple
        if (apple.box.x == item.x && apple.box.y == item.y) {
            item.el.classList.add("apple");
        }

        grid.appendChild(item.el);
    });
}



function Snake() {
    this.body = [new Body(7, 7), new Body(8, 7), new Body(9, 7)]; //first item are head coords. default center (7, 7)
    this.buffer = [];
}

function Apple(x, y) {
    this.box = getBox(x, y);
}

function Body(x, y) {
    this.box = getBox(x, y);
    this.dir = [-1, 0]; //default dir
}

function Box(x, y) {
    this.x = x;
    this.y = y;
    this.el = document.createElement("div");
    this.el.id = `${x}, ${y}`;
    this.el.className = "box";
    this.dir = null;
}