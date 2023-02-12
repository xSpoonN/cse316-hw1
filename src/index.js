import Model from './model.js';

window.onload = function() {
  // fill me with relevant code
  const modle = new Model();
  document.getElementById("questioncount").innerHTML = modle.getQuestionCount() + " questions";
  const div = document.createElement("div");
  var tbl = document.getElementById("questions");
  for (let i = 0; i < modle.getQuestionCount(); i++) {
    //console.log(i);
    var question = modle.getAllQstns()[i];
    var newrow = tbl.insertRow();
    newrow.insertCell(0).innerHTML = question.ansIds.length + " answers \n" + question.views + " views";
    newrow.insertCell(1).innerHTML = question.title;
    newrow.insertCell(2).innerHTML = question.askedBy + " asked "

  }
};
