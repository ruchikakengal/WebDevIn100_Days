let userScore=0;
let compScore=0;
const choices =document.querySelectorAll(".choice");/* basically all div wwith class as choice will be selected*/
const msg=document.querySelector("#msg");
const userScorePara=document.querySelector("#user-score");
const compScorePara=document.querySelector("#comp-score");

const showWinner=(userWin,userChoice,compChoice)=>{
    if (userWin){
        //to update ns display score
        userScore++;
        userScorePara.innerText=userScore;
        //to display in msg box
        msg.innerText=`You Win! Your ${userChoice} beats ${compChoice}`;
        msg.style.backgroundColor="green";
    }else{
        //to update ns display score
        compScore++;
        compScorePara.innerText=compScore;
         //to display in msg box
         msg.innerText=`You Lost! ${compChoice} beats your ${userChoice}`;
         msg.style.backgroundColor="crimson";
    }

}
const drawGame=()=>{
     //to display in msg box
     msg.innerText="Game Draw";
     msg.style.backgroundColor="hotpink";
}
const genCompChoice=()=>{
    const options=["rock","paper","scissors"];
    const randInx=Math.floor(Math.random()*3);
    return options[randInx];
}
const playGame=(userChoice)=>{
    //generate comp choice
    const compChoice=genCompChoice();
    if(userChoice==compChoice){
        //game draw
        drawGame(); 
    }else{
        let userWin=true;
        if(userChoice=="rock"){
            //choice with comp-scissor,paper
            userWin=compChoice=="paper"?false:true;
        }else if(userChoice=="paper"){
            //choice wwith comp-rock,scissor
            userWin=compChoice=="scissor"?false:true;
        }else{
            //user-sccissor
            //choice with comp-rock,paper
            userWin=compChoice=="rock"?false:true;
        }
        showWinner(userWin,userChoice,compChoice);

    }


};

/*to iterate over each element selected nd add event listener onclick*/
choices.forEach((choice)=>{
    choice.addEventListener("click",()=>{
        const userChoice=choice.getAttribute("id");
        playGame(userChoice)

    });
})