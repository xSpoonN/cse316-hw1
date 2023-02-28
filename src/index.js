import Model from './model.js';
import { showTagsPage } from './alltags.js'
import { submitAnswer, showAnswerForm } from './answerform.js'
//import {} from './answers.js'
import { submitQuestion, showQuestionForm } from './questionform.js'
import { resetTable, questPage, setNewest, setActive, setUnanswered, search, fetchQuestions } from './questions.js'

export const modle = new Model();

window.onload = function() {
  document.getElementById("newbutt").onclick = setNewest;
  document.getElementById("activebutt").onclick = setActive;
  document.getElementById("unbutt").onclick = setUnanswered;
  document.getElementById("questiontab").onclick = questPage;
  document.getElementById("tagtab").onclick = showTagsPage;
  document.getElementById("postqbutt").onclick = submitQuestion;
  document.getElementById("postabutt").onclick = submitAnswer;
  document.getElementById("ap_answerbutton").onclick = showAnswerForm;
  Array.from(document.getElementsByClassName("askqbutt")).forEach(butt => {
    butt.onclick = showQuestionForm;
  });
  document.getElementById("questiontab").style.backgroundColor = "rgb(189, 189, 189)";
  document.getElementById("tagtab").style.backgroundColor = "";

  fetchQuestions();
  showPage("questions");
};

window.checkSearch = function checkSearch(event) { /* This needs to be window.checkSearch so its callable in index.html */
  if (event.keyCode == 13) { /* keyCode 13 = Enter key */
    var result = search(document.getElementById("search").value);
    document.getElementById("nosearchresults").style.display = (result.length == 0) ? 'block' : 'none';
    resetTable(result);
  }
}

export function showPage(page) {
  document.getElementById("content").style.display = (page === "questions") ? 'block' : 'none';
  document.getElementById("askquestion").style.display = (page === "questionform") ? 'block' : 'none';
  document.getElementById("answerpage").style.display = (page === "answers") ? 'block' : 'none';
  document.getElementById("newanswer").style.display = (page === "answerform") ? 'block' : 'none';
  document.getElementById("alltags").style.display = (page === "alltags") ? 'block' : 'none';
}
