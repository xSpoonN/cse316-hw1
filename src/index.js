import Model from './model.js';

window.onload = function() {
  // fill me with relevant code
  const modle = new Model();
  document.getElementById("questioncount").innerHTML = modle.getQuestionCount() + " questions";
  var tbl = document.getElementById("questions");
  var qList = modle.getAllQstns();
  /* Need to rework the way this loop works according to sort option */
  for (let i = 0; i < modle.getQuestionCount(); i++) {
    var question = qList[i];
    var newrow = tbl.insertRow();
    newrow.insertCell(0).innerHTML = question.ansIds.length + " answers \n" + question.views + " views";
    var midCell = newrow.insertCell(1);
    midCell.innerHTML = question.title + "<br>";
    for (let j = 0; j < question.tagIds.length; j++) {
      midCell.innerHTML += '<button style="color:white;background-color:grey;display:inline-block;">' 
      + modle.findTagName(question.tagIds[j]) + "</button>";
    }
    /* Need to reformat the date according to doc reqs */
    newrow.insertCell(2).innerHTML = question.askedBy + " asked " + question.askDate;
  }
};
