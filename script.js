let leftSide = document.querySelector(".left-column");
let questionform = document.getElementById("question-form");
let newQuestionButton = document.querySelector(".new-question-btn");
let content = document.getElementById("content");

leftSide.addEventListener("click", function (e) {

   console.log(e.target.classList);
  if (e.target.classList.contains("new-question-btn")) {
    questionform.classList.remove("hidden");
    content.classList.add("hidden");
  }

  if (e.target.classList.contains("questions-list")) {
    questionform.classList.add("hidden");
    content.classList.remove("hidden");
  }
});
