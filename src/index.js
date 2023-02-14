import Model from './model.js';

var sortOrder = "Newest";

function resetTable() {
  var tbl = document.getElementById("questions");
  while (tbl.rows.length > 0) { tbl.deleteRow(0); }
  fetchQuestions();
}
function setNewest() { sortOrder = "Newest"; resetTable(); }
function setActive() { sortOrder = "Active"; resetTable(); }
function setUnanswered() { sortOrder = "Unanswered"; resetTable(); }

function compareNewest(a, b) {
  if (a.askDate > b.askDate) return -1;
  if (a.askDate < b.askDate) return 1;
  return 0;
}
function compareActive(a, b) { //I'm pretty sure this is working correctly? Test more later
  var aLatest = 0, bLatest = 0;
  const modle = new Model();
  var ans = modle.getAllAnswers();
  for (let i = 0; i < a.ansIds.length; i++) { //Finds the latest answer
    var answe = ans.find(x => x.aid == a.ansIds[i]);
    if (aLatest == 0 || answe.ansDate > aLatest) {
      aLatest = answe.ansDate;
    }
  }
  for (let i = 0; i < b.ansIds.length; i++) { //Finds the latest answer
    var answe = ans.find(x => x.aid == b.ansIds[i]);
    if (bLatest == 0 || answe.ansDate > bLatest) {
      bLatest = answe.ansDate;
    }
  }
  if (aLatest > bLatest) return -1;
  if (aLatest < bLatest) return 1;
  return 0;
}

function fetchQuestions() {
  //console.log(`Sorting by ${sortOrder}`);
  const modle = new Model();
  document.getElementById("questioncount").innerHTML = `${modle.getQuestionCount()} questions`;
  var tbl = document.getElementById("questions");
  var qList = modle.getAllQstns();

  /* Sort Options */
  if (sortOrder == "Newest" || sortOrder == "Unanswered") qList.sort(compareNewest);
  if (sortOrder == "Active") qList.sort(compareActive);
  //console.table(qList);

  /* Question List */
  for (let i = 0; i < qList.length; i++) {
    var question = qList[i];
    if (sortOrder == "Unanswered" && question.ansIds.length != 0) continue;
    var newRow = tbl.insertRow();

    /* Left Column */
    newRow.insertCell(0).innerHTML = `${question.ansIds.length} answers <br>${question.views} views`;

    /* Middle Column */
    var midCell = newRow.insertCell(1);
    midCell.innerHTML = `${question.title} <br>`;
    for (let j = 0; j < question.tagIds.length; j++) {
      midCell.innerHTML += '<button style="color:white;background-color:grey;display:inline-block;">' 
      + `${modle.findTagName(question.tagIds[j])}</button>`;
    }

    /* Right Column */
    var now = new Date('February 12, 2023 19:53:46'); var askDate = question.askDate;
    var rightCell = newRow.insertCell(2);
    rightCell.innerHTML = `${question.askedBy} asked `;
    if (askDate.getFullYear() < now.getFullYear()) { //Last Year
      rightCell.innerHTML += `${askDate.toDateString().substring(4)} at 
      ${askDate.getHours() < 10 ? `0${askDate.getHours()}` : askDate.getHours()}` + //Formats to xx:xx
      `:${askDate.getMinutes() < 10 ? `0${askDate.getMinutes()}` : askDate.getMinutes()}`;
    } else if (askDate.getMonth() < now.getMonth() || askDate.getDate() != now.getDate()) { //Diff Day
      rightCell.innerHTML += `${askDate.toDateString().substring(4,askDate.toDateString().length-5)} at
      ${askDate.getHours() < 10 ? `0${askDate.getHours()}` : askDate.getHours()}` + //Formats to xx:xx
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
}

window.onload = function() {
  document.getElementById("newbutt").onclick = setNewest;
  document.getElementById("activebutt").onclick = setActive;
  document.getElementById("unbutt").onclick = setUnanswered;
  document.getElementById("askqbutt").onclick = switchToPostPage;
  document.getElementById("postqbutt").onclick = submitForm;
  fetchQuestions();
  switchToQuestionPage();
};

function submitForm() {
  if (checkForm()) {
    switchToQuestionPage();
  } else return false;
}

function checkForm() {
  var errFound = false;

  /* Validate Title */
  if (document.getElementById("qtitle").value.length > 100) {
    document.getElementById("qtitleerror").innerHTML = "Title must be 100 characters or less!";
    document.getElementById("qtitleerror").style.display = "block";
    errFound = true;
  } else if (document.getElementById("qtitle").value.length == 0) {
    document.getElementById("qtitleerror").innerHTML = "A title is required!";
    document.getElementById("qtitleerror").style.display = "block";
    errFound = true;
  } else document.getElementById("qtitleerror").style.display = "none";


  /* Vakudate Description */
  if (document.getElementById("qtext").value.length == 0) {
    document.getElementById("qtexterror").innerHTML = "A description is required!";
    document.getElementById("qtexterror").style.display = "block";
    errFound = true;
  } else document.getElementById("qtexterror").style.display = "none";


  /* Validate Tags */
  if (!/^\w+(\s\w+){0,4}$/.test(document.getElementById("qtags").value)) { /* regex auuuuuggghhhhhhh */
    document.getElementById("qtagserror").innerHTML = "Between 1-5 tags are required!";
    document.getElementById("qtagserror").style.display = "block";
    errFound = true;
  } else document.getElementById("qtagserror").style.display = "none";

  /* Validate Username */
  if (document.getElementById("quser").value.length == 0) {
    document.getElementById("qusererror").innerHTML = "A username is required!";
    document.getElementById("qusererror").style.display = "block";
    errFound = true;
  } else document.getElementById("qusererror").style.display = "none";

  return !errFound;
}

function switchToPostPage() {
  document.getElementById("content").style.display='none';
  document.getElementById("askquestion").style.display='block';
}

function switchToQuestionPage() {
  document.getElementById("content").style.display='block';
  document.getElementById("askquestion").style.display='none';
}