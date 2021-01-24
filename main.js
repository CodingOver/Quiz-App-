// Select Element
let countSpan = document.querySelector('.count span');
let bullets = document.querySelector('.bullets');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let quizzArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.getElementById('submit-button');
let answer = document.querySelector('.answer');
let resultsContainer = document.querySelector('.results');
let countdownElement = document.querySelector('.countdown');
// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
    
  myRequest.onload = function() {
      if(this.status === 200) {
        let questionObject = JSON.parse(this.responseText);
        let qCount = questionObject.length;

        // Create Bullets + Set Question Count
        createBullets(qCount);
        // Add Qestion Data
        addQuestionData(questionObject[currentIndex],qCount);

        // Start CountDown
        countdown(10, qCount);

         // Click On Submit
        submitButton.onclick = () => {
            // Get Right Answer 
            let theRightAnswer = questionObject[currentIndex].correct_answer;

            // Incrase Index
            currentIndex++;

            // check The Answer 
            checkAnswer(theRightAnswer, qCount);

            // Remove Preivous Question 
            quizzArea.innerHTML = '';
            answersArea.innerHTML = '' ;

            // Add Qestion Data
            addQuestionData(questionObject[currentIndex],qCount);

            // Handle Bullets class
            handleBullets();
            
            // Show Results
            showResults(qCount);

            // Start CountDown
            clearInterval(countdownInterval);
            countdown(10, qCount);
        };

      }
    };

  myRequest.open("GET", "html_question.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    // Create Spans
    for (let i = 0; i < num; i++) {
        // Create Span
        bulletsSpanContainer.innerHTML += `<span></span>`;
        // check if its first span
        if (i === 0 ) {
            bulletsSpanContainer.innerHTML = `<span class="on"></span>`;
        }
    }
}

function addQuestionData(obj, count) {
    if(currentIndex < count) {
        // Create H2 Question Title
        quizzArea.innerHTML = `<h2>${obj.question}</h2>`;

        // Create  Answers
        answersArea.innerHTML = `
            <div class="answer">
                <input data-answer="${obj.answer_1}" type="radio" id="answer_1" name="questions" checked>
                <label for="answer_1" >${obj.answer_1}</label>
            </div>
            <div class="answer">
                <input data-answer="${obj.answer_2}" type="radio" id="answer_2" name="questions">
                <label for="answer_2">${obj.answer_2}</label>
            </div>
            <div class="answer">
                <input data-answer="${obj.answer_3}" type="radio" id="answer_3" name="questions">
                <label for="answer_3">${obj.answer_3}</label>
            </div>
            <div class="answer">
                <input data-answer="${obj.answer_4}" type="radio" id="answer_4" name="questions">
                <label for="answer_4">${obj.answer_4}</label>
            </div>
    `;
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName('questions');
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++)  {

        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    console.log(`Right Answer is: ${rAnswer}`);
    console.log(`choosen Answer is: ${theChoosenAnswer}`);

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
        console.log('good');
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpans = Array.from(bulletsSpans);

    arrayOfSpans.forEach((span,index) => {
        
        if (currentIndex === index) {
            span.className = 'on';
        }

    });
}

function showResults(count) {
    let theResults; 
    if (currentIndex === count) {
        quizzArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count/2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} is Good`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Congratulation</span>, All Answers Is Correct`;
        } else {
            theResults = `<span class="bad">Failled!!</span>, ${rightAnswers} From ${count} is Bad`;
        }


        resultsContainer.innerHTML = theResults ;
        resultsContainer.style.padding = '10px';
        resultsContainer.style.backgroundColor = 'white';
        resultsContainer.style.margin = '10px'
    }
}

function countdown(duration, count) {
    if(currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click()
            }


        }, 1000);
    }
}