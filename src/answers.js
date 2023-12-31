import { modle, showPage } from './index.js';

export var lastViewedQuestion;

/* Callback function for swapping to the answer page of a given question */
export function showAnswers(questionId, addView) {
    return function() {
      if (addView) modle.addViews(questionId);
      /* Setup page information */
      lastViewedQuestion = questionId;
      /* console.log(questionId); */
      var answers = modle.getAnswersByQID(questionId);
      document.getElementById("ap_questiontitle").innerHTML = `<b>${modle.getQuestionTitle(questionId)}</b>`;
      document.getElementById("ap_questiontext").innerHTML = `${modle.getQuestionText(questionId)}`;
      document.getElementById("ap_answercount").innerHTML = `<b>${answers.length} answers</b>`;
      document.getElementById("ap_views").innerHTML = `<b>${modle.getViews(questionId)} views</b>`;
      document.getElementById("ap_askedby").innerHTML = `<b>${modle.getWhoAsked(questionId)}</b> asked<br>${modle.formatDate(modle.getAskDate(questionId))}`
      var answertable = document.getElementById("ap_answers");
      while (answertable.rows.length > 0) answertable.deleteRow(0);
      /* Add empty row for dotted line above first question */
      var emptyrow = answertable.insertRow();
      emptyrow.setAttribute("class", "aRow");
      var cell = emptyrow.insertCell(0);
      cell.setAttribute("class", "aTD aAns");
      cell = emptyrow.insertCell(1);
      cell.setAttribute("class", "aTD aCred");
      emptyrow.insertCell(2);
      /* Add answers */
      if (answers.length === 0) {
        document.getElementById("ap_noanswers").style.display = 'block';
      } else {
        document.getElementById("ap_noanswers").style.display = 'none';
        /* Add each answer as a row in the table */
        answers.forEach((answer) => {
          var row = answertable.insertRow();
          row.setAttribute("class", "aRow");
          var textcol = row.insertCell(0);
          var creditcol = row.insertCell(1);
          textcol.setAttribute("class", "aTD aAns");
          creditcol.setAttribute("class", "aTD aCred");
          textcol.textContent = answer.text;
          creditcol.innerHTML = "<b>" + answer.ansBy + "</b> answered<br>" + modle.formatDate(answer.ansDate);
        });
      }
      showPage("answers");
    }
  }