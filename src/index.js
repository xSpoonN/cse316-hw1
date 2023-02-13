import Model from './model.js';

var sortOrder = "Newest";

function compareNewest(a, b) {
  if (a.askDate > b.askDate) return -1;
  if (a.askDate < b.askDate) return 1;
  return 0;
}
function compareActive(a, b) { //I'm pretty sure this is working correctly? Test more later
  var aLatest = 0, bLatest = 0;
  const modle = new Model();
  var ans = modle.getAllAnswers();
  for (let i = 0; i < a.ansIds.length; i++) {
    var answe = ans.find(x => x.aid == a.ansIds[i]);
    if (aLatest == 0 || answe.ansDate > aLatest) {
      aLatest = answe.ansDate;
    }
  }
  for (let i = 0; i < b.ansIds.length; i++) {
    var answe = ans.find(x => x.aid == b.ansIds[i]);
    if (bLatest == 0 || answe.ansDate > bLatest) {
      bLatest = answe.ansDate;
    }
  }
  if (aLatest > bLatest) return -1;
  if (aLatest < bLatest) return 1;
  return 0;
}

window.onload = function() {
  const modle = new Model();
  document.getElementById("questioncount").innerHTML = `${modle.getQuestionCount()} questions`;
  var tbl = document.getElementById("questions");
  var qList = modle.getAllQstns();
  if (sortOrder == "Newest" || sortOrder == "Unanswered") qList.sort(compareNewest);
  if (sortOrder == "Active") qList.sort(compareActive);
  for (let i = 0; i < qList.length; i++) {
    var question = qList[i];
    if (sortOrder == "Unanswered" && question.ansIds.length != 0) continue;
    var newRow = tbl.insertRow();
    newRow.insertCell(0).innerHTML = `${question.ansIds.length} answers <br>${question.views} views`;
    var midCell = newRow.insertCell(1);
    midCell.innerHTML = `${question.title} <br>`;
    for (let j = 0; j < question.tagIds.length; j++) {
      midCell.innerHTML += '<button style="color:white;background-color:grey;display:inline-block;">' 
      + `${modle.findTagName(question.tagIds[j])}</button>`;
    }
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
