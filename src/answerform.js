import { modle, showPage } from './index.js';
import { lastViewedQuestion, showAnswers } from './answers.js';

export function showAnswerForm() {
    document.getElementById("auser").value = "";
    document.getElementById("atext").value = "";
    showPage("answerform");
}

export function submitAnswer() {
    if (checkAnswerForm()) {
      modle.addAnswer(lastViewedQuestion, document.getElementById("auser").value, document.getElementById("atext").value);
      /* console.table(modle.data.answers); */
      showAnswers(lastViewedQuestion, false)();
      return true;
    } else return false;
  }

function checkAnswerForm() { /* Validates the answer form */
  var errFound = false;

  /* Validate Username */
  if (document.getElementById("auser").value.length == 0) {
    document.getElementById("ausererror").innerHTML = "A username is required!";
    document.getElementById("ausererror").style.display = "block";
    errFound = true;
  } else document.getElementById("ausererror").style.display = "none";

  /* Validate Description */
  if (document.getElementById("atext").value.length == 0) {
    document.getElementById("atexterror").innerHTML = "A description is required!";
    document.getElementById("atexterror").style.display = "block";
    errFound = true;
  } else document.getElementById("atexterror").style.display = "none";

  return !errFound;
}