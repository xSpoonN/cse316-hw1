import Model from './model.js';

var sortOrder = "Newest";
window.onload = function() {
  const modle = new Model();
  document.getElementById("questioncount").innerHTML = `${modle.getQuestionCount()} questions`;
  var tbl = document.getElementById("questions");
  var qList = modle.getAllQstns();
  /* Need to rework the way this loop works according to sort option */
  
  for (let i = 0; i < modle.getQuestionCount(); i++) {
    var question = qList[i];
    var newRow = tbl.insertRow();
    newRow.insertCell(0).innerHTML = `${question.ansIds.length} answers <br>${question.views} views`;
    var midCell = newRow.insertCell(1);
    midCell.innerHTML = `${question.title} <br>`;
    for (let j = 0; j < question.tagIds.length; j++) {
      midCell.innerHTML += '<button style="color:white;background-color:grey;display:inline-block;">' 
      + `${modle.findTagName(question.tagIds[j])}</button>`;
    }
    /* Need to reformat the date according to doc reqs */
    var now = new Date('February 12, 2023 19:53:46');
    var rightCell = newRow.insertCell(2);
    rightCell.innerHTML = `${question.askedBy} asked `;
    var askDate = question.askDate;
    if (askDate.getFullYear() < now.getFullYear()) { //Last Year
      rightCell.innerHTML += `${askDate.toDateString().substring(4)} at 
      ${askDate.getHours() < 10 ? `0${askDate.getHours()}` : askDate.getHours()}` + 
      `:${askDate.getMinutes() < 10 ? `0${askDate.getMinutes()}` : askDate.getMinutes()}`;
    } else if (askDate.getMonth() < now.getMonth() || askDate.getDate() != now.getDate()) {
      rightCell.innerHTML += `${askDate.toDateString().substring(4,askDate.toDateString().length-5)} at
      ${askDate.getHours() < 10 ? `0${askDate.getHours()}` : askDate.getHours()}` + 
      `:${askDate.getMinutes() < 10 ? `0${askDate.getMinutes()}` : askDate.getMinutes()}`;
    } else {
      /* Reminder to fix this to be more accurate. Currently it just takes the day/hour/minute value 
       * instead of actually computing how many days/hours/minutes there are between the two dates */
      if (now.getHours() - askDate.getHours() == 1) { //Exactly 1 hour ago
        rightCell.innerHTML += `1 hour ago.`;
      } else if (now.getHours() - askDate.getHours() > 0) { //Same day
        rightCell.innerHTML += `${now.getHours() - askDate.getHours()} hours ago.`;
      } else if (now.getMinutes() - askDate.getMinutes() == 1) { //Exactly one minute ago
        rightCell.innerHTML += `1 minute ago.`;
      } else if (now.getMinutes() - askDate.getMinutes() > 0) { //Same hour
        rightCell.innerHTML += `${now.getMinutes() - askDate.getMinutes()} minutes ago.`;
      } else if (now.getSeconds() - askDate.getSeconds() == 1) { //Exactly one second ago
        rightCell.innerHTML += `1 second ago.`;
      } else { //Same minute
        rightCell.innerHTML += `${now.getSeconds() - askDate.getSeconds()} seconds ago.`;
      }
    }
  }
};
