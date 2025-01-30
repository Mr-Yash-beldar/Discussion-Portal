document.addEventListener("DOMContentLoaded", function () {
  const questionForm = document.getElementById("question-form");
  const contentSection = document.getElementById("content");
  const questionList = document.querySelector(".questions-list");
  const newQuestionForm = document.querySelector(".new-question-form");
  const responseForm = document.querySelector(".response-form");
  const responseSection = document.querySelector(".response-section");
  const leftColumn = document.querySelector(".left-column");
  const rightColumn = document.querySelector(".right-container");
  const toggleBtn = document.getElementById("toggle-btn");

  toggleBtn.addEventListener("click", function () {
    leftColumn.classList.toggle("active");
  });

  let questions = JSON.parse(localStorage.getItem("questions")) || [];
  function saveToLocalStorage() {
    localStorage.setItem("questions", JSON.stringify(questions));
  }
  //create question card
  function createQuestion(que) {
    const questionItem = document.createElement("div");
    questionItem.classList.add("question-item");
    questionItem.id = que.id;
    questionItem.innerHTML = `<div class="question-header">
              <h3>${que.subject}</h3>
              <p>${que.question}</p>
            </div>
            <span class="star-icon"
              ><i class="fa ${
                que.stared ? "fa-star" : "fa-star-o"
              } fa-2x" aria-hidden="true"></i
            ></span>
          </div>`;
    return questionItem;
  }

  //get all and made card
  function renderQuestions() {
    questionList.innerHTML = "";
    questions.forEach((que) => {
      questionItem = createQuestion(que);
      questionList.appendChild(questionItem);
    });
  }

  //create responseCard
  function createResponseCard(res) {
    const responseCard = document.createElement("div");
    responseCard.classList.add("response-card");
    responseCard.innerHTML = `
        <h4>${res.name}</h4>
        <p>${res.comment}</p>

        <span>${res.votes}</span>
        <div class="reactionBtn">
        <i name="upvote" class="fa fa-arrow-up fa-2x" aria-hidden="true"></i>
        <i name="downvote"  class="fa fa-arrow-down fa-2x" aria-hidden="true"></i>
        <i name="delete" class="fa fa-trash fa-2x" aria-hidden="true"></i>

        </div>
      `;
    responseCard.dataset.id = res.id;
    return responseCard;
  }

  //display particular question
  function displayQuestionDetails(question) {
    document.querySelector(".question-detail h3").textContent =
      question.subject;
    document.querySelector(".question-detail p").textContent =
      question.question;

    responseSection.innerHTML = "";
    question.responses.forEach((res) => {
      responseCard = createResponseCard(res);
      responseSection.appendChild(responseCard);
    });
    questionForm.classList.add("hidden");
    contentSection.classList.remove("hidden");
  }

  //initial render
  renderQuestions();

  //leftSide
  leftColumn.addEventListener("click", function (e) {
    // console.log(e.target);
    if (e.target.classList.contains("new-question-btn")) {
      contentSection.classList.add("hidden");
      questionForm.classList.remove("hidden");
    }

    if (e.target.id === "stared-question") {
      starIcon = e.target.closest("i");
      starIcon.classList.toggle("fa-star");
      starIcon.classList.toggle("fa-star-o");
      if (starIcon.classList.contains("fa-star")) {
        const staredQuestions = questions.filter((que) => que.stared == true);
        console.log(staredQuestions);
        questionList.innerHTML = "";
        staredQuestions.forEach((que) => {
          const questionItem = createQuestion(que);
          questionList.appendChild(questionItem);
        });
      } else {
        renderQuestions();
      }
    }

    if (e.target.classList.contains("fa") && e.target.id != "stared-question") {
      const questionId = e.target.closest(".question-item").id;
      console.log(questionId);
      const selectedQuestion = questions.find((que) => que.id == questionId);
      //update the question to stared
      selectedQuestion.stared = !selectedQuestion.stared;
      saveToLocalStorage();
      //get that elament and update the class
      const starIcon = e.target.closest(".star-icon").querySelector("i");
      starIcon.classList.toggle("fa-star");
      starIcon.classList.toggle("fa-star-o");
      if (selectedQuestion) {
        displayQuestionDetails(selectedQuestion);
      }
    }

    const questionItem = e.target.closest(".question-item");
    if (questionItem) {
      const questionId = questionItem.id;
      const selectedQuestion = questions.find((que) => que.id == questionId);
      if (selectedQuestion) {
        displayQuestionDetails(selectedQuestion);
      }
    }
  });

 // Search functionality
 leftColumn.addEventListener("input", function (e) {
  const query = e.target.value.toLowerCase().trim();
  const items = document.querySelectorAll(".question-item");
  let matchFound = false;

  items.forEach((item) => {
      const h3 = item.querySelector("h3");
      const p = item.querySelector("p");

      if (!h3.dataset.originalText) h3.dataset.originalText = h3.textContent;
      if (!p.dataset.originalText) p.dataset.originalText = p.textContent;

      if (!query) {
          h3.innerHTML = h3.dataset.originalText;
          p.innerHTML = p.dataset.originalText;
          item.classList.remove("hidden");
          matchFound = true;
          return;
      }

      const h3Match = highlightMatches(h3, query);
      const pMatch = highlightMatches(p, query);

      if (h3Match || pMatch) {
          matchFound = true;
          item.classList.remove("hidden"); 
      } else {
          item.classList.add("hidden");
      }
  });

  let noMatchMessage = document.getElementById("no-match-message");
  if (!matchFound) {
      if (!noMatchMessage) {
          noMatchMessage = document.createElement("div");
          noMatchMessage.id = "no-match-message";
          noMatchMessage.textContent = "No match found";
          noMatchMessage.style.color = "red";
          document.querySelector(".questions-list").appendChild(noMatchMessage);
      }
  } else if (noMatchMessage) {
      noMatchMessage.remove();
  }
});

function highlightMatches(element, query) {
  const originalText = element.dataset.originalText;
  const regex = new RegExp(`(${query})`, "gi");

  if (originalText.toLowerCase().includes(query)) {
      element.innerHTML = originalText.replace(regex, `<marking>$1</marking>`);
      return true;
  } else {
      element.innerHTML = originalText; // Restore original text if no match
      return false;
  }
}


  //rightSide
  //store new question
  function storeNewQuestion(subject, question) {
    const newQuestion = { id: Date.now(), subject, question, responses: [] };
    questions.push(newQuestion);
    saveToLocalStorage();
    questionList.appendChild(createQuestion(newQuestion));
  }

  //add new response
  function addNewResponse(name, comment) {
    const currentQuestion = questions.find(
      (q) =>
        q.subject === document.querySelector(".question-detail h3").textContent
    );
    if (currentQuestion && name && comment) {
      currentQuestion.responses.push({
        id: Date.now(),
        name,
        comment,
        votes: 0,
      });
      saveToLocalStorage();
    }
    responseCard = createResponseCard(currentQuestion.responses.slice(-1)[0]);
    responseSection.appendChild(responseCard);
  }

  //delete response
  function deleteResponse(responseId) {
    const currentQuestion = questions.find(
      (q) =>
        q.subject === document.querySelector(".question-detail h3").textContent
    );
    const responseIndex = currentQuestion.responses.findIndex(
      (res) => res.id == responseId
    );
    currentQuestion.responses.splice(responseIndex, 1);
    saveToLocalStorage();
  }

  //righcontainer events submit
  rightColumn.addEventListener("click", function (e) {
    // console.log(e.target);
    // console.log(e.target.getAttribute("name"));
    const task = e.target.getAttribute("name");
    // console.log(task);
    if (task == "addNewQuestion") {
      e.preventDefault();
      const subject = document.querySelector(".subject-input").value.trim();
      const question = document.querySelector(".question-input").value.trim();
      if (subject && question) {
        storeNewQuestion(subject, question);
        newQuestionForm.reset();
      }
    } else if (task == "addResponse") {
      console.log("add response");
      e.preventDefault();
      const name = document.querySelector(".name-input").value.trim();
      const comment = document.querySelector(".comment-input").value.trim();
      if (name && comment) {
        addNewResponse(name, comment);
        responseForm.reset();
      }
    } else if (task == "delete") {
      const responseId = e.target.closest(".response-card").dataset.id;
      deleteResponse(responseId);
      e.target.closest(".response-card").remove();
    } else if (task == "upvote" || task == "downvote") {
      const VoteContainer =
        e.target.parentNode.parentNode.querySelector("span");
      let votes = parseInt(VoteContainer.textContent);

      // Increase or decrease votes based on the task
      votes = task === "upvote" ? votes + 1 : votes - 1;
      VoteContainer.textContent = votes;

      const responseCard = e.target.closest(".response-card");
      const responseId = responseCard.dataset.id;

      const currentQuestion = questions.find(
        (que) =>
          que.subject ===
          document.querySelector(".question-detail h3").textContent
      );

      const responses = currentQuestion.responses;
      console.log(responses);
      const responseIndex = responses.findIndex((res) => res.id == responseId);
      console.log(responseIndex);

      if (responseIndex !== -1) {
        // Update vote count in the array
        responses[responseIndex].votes = votes;

        // Shift the response dynamically
        let newIndex = responseIndex;

        while (newIndex > 0 && responses[newIndex - 1].votes < votes) {
          [responses[newIndex], responses[newIndex - 1]] = [
            responses[newIndex - 1],
            responses[newIndex],
          ];
          newIndex--;
        }

        while (
          newIndex < responses.length - 1 &&
          responses[newIndex + 1].votes > votes
        ) {
          [responses[newIndex], responses[newIndex + 1]] = [
            responses[newIndex + 1],
            responses[newIndex],
          ];
          newIndex++;
        }

        // const responsesContainer = document.querySelector(".responses-container");
        responseSection.removeChild(responseCard);

        if (newIndex === 0) {
          responseSection.prepend(responseCard); // Move to top
        } else {
          responseSection.insertBefore(
            responseCard,
            responseSection.children[newIndex]
          );
        }

        saveToLocalStorage();
      }
    } else if (task == "resolve") {
      const currentQuestion = questions.find(
        (q) =>
          q.subject ===
          document.querySelector(".question-detail h3").textContent
      );
      const resolvedQuestion = questions.filter(
        (q) =>
          q.subject !==
          document.querySelector(".question-detail h3").textContent
      );
      questions = resolvedQuestion;
      saveToLocalStorage();
      questionList.removeChild(
        document.getElementById(currentQuestion.id.toString())
      );

      questionForm.classList.remove("hidden");
      contentSection.classList.add("hidden");
    }
  });
});
