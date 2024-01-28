
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; // height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImage;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

//pipes
let pipeArray = [];
let pipeWidth = 64; // height ratio = 384/3072
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing on the board 

    // load image
    birdImage=new Image();
    birdImage.src="./flappybird.png";
    birdImage.onload = function(){
        context.drawImage(birdImage,bird.x,bird.y,bird.width,bird.height);
    }
    topPipeImg = new Image();
    topPipeImg.src="./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src="./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes,1500); // every 1.5 seconds 

    // when a down arrow is clicked then bird moves
    document.addEventListener('keydown',moveBird);
}

// To update frames of canvas aka main game loop
function update(){
    requestAnimationFrame(update);
    if(gameOver)
        return
    context.clearRect(0,0,board.width,board.height);

    //bird
    velocityY+=gravity;
    bird.y=Math.max(bird.y+velocityY,0); // apply gravity to current bird.y , limits the bird.y to the top of the canvas 
    context.drawImage(birdImage,bird.x,bird.y,bird.width,bird.height);

    // check if bird fell down
    if(bird.y > board.height)
        gameOver=true;

    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        pipe.x+=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score-=-0.5;
            pipe.passed=true;
        }   
        // checking game Over condition 
        if(detectCollision(bird, pipe))
            gameOver = true;
    }

    //clear pipes
    while(pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
        pipeArray.shift(); // removes the first element from the array 
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);

    // game over
    if(gameOver){
        context.fillText("Game Over !!",45,310);
        context.font = "30px sans-serif";
        context.fillText('Press space to continue',20,340,360)
    }
}

function placePipes(){

    if(gameOver)
        return;

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y:randomPipeY + pipeHeight + openingSpace,
        width:pipeWidth,
        height:pipeHeight,
        passed: false
    }

    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if (e.code == 'Space' || e.code == 'ArrowUp' || e.code == 'keyX'){
        velocityY = -6;
    }

    //resetting game
    if(gameOver){
        bird.y = birdY;
        pipeArray = [];
        score=0;
        gameOver=false;
    }
}

function detectCollision(a,b){
    return a.x<b.x + b.width && 
        a.x + a.width >b.x &&
        a.y < b.y + b.height && 
        a.y + a.height >b.y;
}