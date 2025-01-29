document.addEventListener("DOMContentLoaded", function () {
  const questionForm = document.getElementById("question-form");
  const contentSection = document.getElementById("content");
  const questionList = document.querySelector(".questions-list");
  const newQuestionForm = document.querySelector(".new-question-form");
  const resolveButton = document.querySelector(".resolve-btn");
  const responseForm = document.querySelector(".response-form");
  const responseSection = document.querySelector(".response-section");
  const leftColumn = document.querySelector(".left-column");

  function createQuestion(q) {
    const questionItem = document.createElement("div");
    questionItem.classList.add("question-item");
    questionItem.id = q.id;
    questionItem.innerHTML = `<h3>${q.subject}</h3><p>${q.question}</p>`;
    return questionItem;
  }

  function createresponseCard(res) {
    const responseCard = document.createElement("div");
    responseCard.classList.add("response-card");
    responseCard.innerHTML = `
      <h4>${res.name}</h4>
      <p>${res.comment}</p>
      <button class="like-btn">👍 ${res.likes}</button>
      <button class="dislike-btn">👎 ${res.dislikes}</button>
    `;
    responseCard.dataset.id = res.id;
    return responseCard;
  }

  function renderQuestions() {
    questionList.innerHTML = "";
    questions.forEach((q) => {
      questionItem = createQuestion(q);
      questionList.appendChild(questionItem);
    });
  }

  let questions = JSON.parse(localStorage.getItem("questions")) || [];
  renderQuestions();

  leftColumn.addEventListener("click", function (e) {
    if (e.target.classList.contains("new-question-btn")) {
      contentSection.classList.add("hidden");
      questionForm.classList.remove("hidden");
    }

    const questionItem = e.target.closest(".question-item");
    if (questionItem) {
      const questionId = questionItem.id;
      const selectedQuestion = questions.find((q) => q.id == questionId);
      if (selectedQuestion) {
        displayQuestionDetails(selectedQuestion);
      }
    }
  });

  newQuestionForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const subject = document.querySelector(".subject-input").value.trim();
    const question = document.querySelector(".question-input").value.trim();
    if (subject && question) {
      const newQuestion = { id: Date.now(), subject, question, responses: [] };
      questions.push(newQuestion);
      localStorage.setItem("questions", JSON.stringify(questions));
      questionList.appendChild(createQuestion(newQuestion));
      newQuestionForm.reset();
    }
  });

  function displayQuestionDetails(question) {
    document.querySelector(".question-detail h3").textContent =
      question.subject;
    document.querySelector(".question-detail p").textContent =
      question.question;

    responseSection.innerHTML = `<h2>Response</h2>`;
    question.responses.forEach((res) => {
      responseCard = createresponseCard(res);
      responseSection.appendChild(responseCard);
    });
    questionForm.classList.add("hidden");
    contentSection.classList.remove("hidden");
  }

  responseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.querySelector(".name-input").value.trim();
    const comment = document.querySelector(".comment-input").value.trim();
    const currentQuestion = questions.find(
      (q) =>
        q.subject === document.querySelector(".question-detail h3").textContent
    );
    if (currentQuestion && name && comment) {
      currentQuestion.responses.push({
        id: Date.now(),
        name,
        comment,
        likes: 0,
        dislikes: 0,
      });
      localStorage.setItem("questions", JSON.stringify(questions));
      responseCard = createresponseCard(currentQuestion.responses.slice(-1)[0]);
      responseSection.appendChild(responseCard);
      document.querySelector(".response-form").reset();
    }
  });

  responseSection.addEventListener("click", function (e) {
    if (e.target.classList.contains("like-btn")) {
      const likenumber = e.target.textContent.split(" ")[1];
      console.log(likenumber);
      e.target.textContent = `👍 ${parseInt(likenumber) + 1}`;
      const responseId = e.target.closest(".response-card").dataset.id;
      const currentQuestion = questions.find(
        (q) =>
          q.subject ===
          document.querySelector(".question-detail h3").textContent
      );
      const response = currentQuestion.responses.find(
        (res) => res.id == responseId
      );
      response.likes++;
      localStorage.setItem("questions", JSON.stringify(questions));
      displayQuestionDetails(currentQuestion);
    } else if (e.target.classList.contains("dislike-btn")) {
      const dislikenumber = e.target.textContent.split(" ")[1];
      console.log(dislikenumber);
      e.target.textContent = `👍 ${parseInt(dislikenumber) + 1}`;
      const responseId = e.target.closest(".response-card").dataset.id;
      const currentQuestion = questions.find(
        (q) =>
          q.subject ===
          document.querySelector(".question-detail h3").textContent
      );
      const response = currentQuestion.responses.find(
        (res) => res.id == responseId
      );
      response.dislikes++;

      localStorage.setItem("questions", JSON.stringify(questions));
      displayQuestionDetails(currentQuestion);
    }
  });

  resolveButton.addEventListener("click", function () {
    const currentQuestion = questions.find(
      (q) =>
        q.subject === document.querySelector(".question-detail h3").textContent
    );
    const resolvedQuestion = questions.filter(
      (q) =>
        q.subject !== document.querySelector(".question-detail h3").textContent
    );
    questions = resolvedQuestion;
    localStorage.setItem("questions", JSON.stringify(questions));
    questionList.removeChild(
      document.getElementById(currentQuestion.id.toString())
    );

    questionForm.classList.remove("hidden");
    contentSection.classList.add("hidden");
  });


  leftColumn.addEventListener("input", function (e) {
    if (e.target.classList.contains("search-input")) {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll(".question-item").forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.backgroundColor = "yellow";
        } else {
          item.style.backgroundColor = "";
        }
      });
    }
  });
});
