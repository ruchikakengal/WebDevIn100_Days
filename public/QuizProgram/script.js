const questions = [
  {
    question: "What is the closest planet to the Sun?",
    answers : [
      {text: "Mercury", correct:"true"},
      {text: "Venus", correct:"false"},
      {text: "Mars", correct:"false"},
      {text: "Earth", correct:"false"}
    ]
  },
  {
    question: "How many moons does Mars have?",
    answers : [
      {text: "1", correct:"false"},
      {text: "2", correct:"true"},
      {text: "3", correct:"false"},
      {text: "4", correct:"false"}
    ]
  },
  {
    question: "What is absolute zero?",
    answers : [
      {text: "0K", correct:"true"},
      {text: "0C", correct:"false"},
      {text: "0F", correct:"false"},
      {text: "-100K", correct:"false"}
    ]
  },
  {
    question: "Sushi originated in which country?",
    answers : [
      {text: "China", correct:"false"},
      {text: "Korea", correct:"false"},
      {text: "Thailand", correct:"false"},
      {text: "Japan", correct:"true"}
    ]
  },
  {
    question: "Which Indian hill station in India is known as the 'Queen of the Hills'?",
    answers : [
      {text: "Shimla", correct:"false"},
      {text: "Musoorie", correct:"true"},
      {text: "Shillong", correct:"false"},
      {text: "Manali", correct:"false"}
    ]
  },
  {
    question: "Which Indian state is famous for boating activities on its backwaters?",
    answers : [
      {text: "Odisha", correct:"false"},
      {text: "Karnataka", correct:"false"},
      {text: "Kerela", correct:"true"},
      {text: "Jammu and Kashmir", correct:"false"}
    ]
  },
  {
    question: "What is the capital of France?",
    answers : [
      {text: "Venice", correct:"false"},
      {text: "London", correct:"false"},
      {text: "Madrid", correct:"false"},
      {text: "Paris", correct:"true"}
    ]
  },
    {
    question: "What is the base ingredient of gummy bears?",
    answers : [
      {text: "Sugar", correct:"false"},
      {text: "Artificial Flavorings", correct:"false"},
      {text: "Gelatin", correct:"true"},
      {text: "Color", correct:"false"}
    ]
  },
    {
    question: "In terms of area, what's the smallest Republic on the planet?",
    answers : [
      {text: "Monaco", correct:"false"},
      {text: "Vatican City", correct:"false"},
      {text: "Liechtenstein", correct:"false"},
      {text: "San Marino", correct:"true"}
    ]
  },
  {
    question: "Which woman has recently set the record for the longest space flight?",
    answers : [
      {text: "Alan L Bean", correct:"false"},
      {text: "Christina Koch", correct:"true"},
      {text: "William Anders", correct:"false"},
      {text: "Frank Bormon", correct:"false"}
    ]
  }
]

const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-button");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHtml = "Next";
  showQuestion();
}

function showQuestion(){
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach(answer=>{
    const button = document.createElement("button");
      button.innerHTML = answer.text;
      button.classList.add("btn");
      answerButton.appendChild(button);
      if(answer.correct){
        button.dataset.correct = answer.correct;
      }
      button.addEventListener("click", selectAnswer);
  });
}

function resetState(){
  nextButton.style.display = "none";
  while(answerButton.firstChild){
    answerButton.removeChild(answerButton.firstChild);
  }
}

function selectAnswer(e){
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if(isCorrect){
    selectedBtn.classList.add("correct");
    score++;
  }else{
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButton.children).forEach(button=>{
    if(button.dataset.correct === "true"){
      button.classList.add("correct");
    }button.disabled = true;
  });
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", ()=>{
  if(currentQuestionIndex < questions.length){
    handleNextButton();
  }else{
    startQuiz();
  }
});

function showScore(){
  resetState();
  questionElement.innerHTML = `You Scored ${score} out of ${questions.length}!`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
}

function handleNextButton(){
  currentQuestionIndex++;
  if(currentQuestionIndex < questions.length){
    showQuestion();
  } else{
    showScore();
  }
}

startQuiz();
