import Model from './model.js';

var sortOrder = "Newest";
var modle = new Model();

function resetTable(newQ) {
  var tbl = document.getElementById("questions");
  while (tbl.rows.length > 0) { tbl.deleteRow(0); }
  if (newQ == undefined) fetchQuestions();
  else fetchQuestions(newQ);
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

function fetchQuestions(qList = modle.getAllQstns()) {
  //console.log(`Sorting by ${sortOrder}`);
  document.getElementById("questioncount").innerHTML = `${qList.length} questions`;
  var tbl = document.getElementById("questions");

  /* Sort Options */
  if (sortOrder == "Newest" || sortOrder == "Unanswered") qList.sort(compareNewest);
  if (sortOrder == "Active") qList.sort(compareActive);
  //console.table(qList);

  tbl.insertRow().innerHTML = '<td><hr style="width:100%;border-top:dotted 1px"></td><td><hr style="width:100%;border-top:dotted 1px"></td><td><hr style="width:100%;border-top:dotted 1px"></td>';
  /* Question List */
  for (let i = 0; i < qList.length; i++) {
    var question = qList[i];
    if (sortOrder == "Unanswered" && question.ansIds.length != 0) continue;
    var newRow = tbl.insertRow();
    tbl.insertRow().innerHTML = '<td><hr style="width:100%;border-top:dotted 1px"></td><td><hr style="width:100%;border-top:dotted 1px"></td><td><hr style="width:100%;border-top:dotted 1px"></td>';

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
  /* Add a dotted line between every question */
  var list = tbl.getElementsByTagName("tr");
  //console.log(list);
/*   for (let i = 0; i < list.length; i++) {
    //list[i].style.borderBottom = "1px solid #000000";
    list[i].className = "questionElement";
  } */
}

window.onload = function() {
  document.getElementById("newbutt").onclick = setNewest;
  document.getElementById("activebutt").onclick = setActive;
  document.getElementById("unbutt").onclick = setUnanswered;
  document.getElementById("askqbutt").onclick = switchToPostPage;
  document.getElementById("postqbutt").onclick = submitQuestion;
  document.getElementById("postabutt").onclick = submitAnswer;

  fetchQuestions();
  switchToQuestionPage();
};

window.checkSearch = function checkSearch(event) {
  //console.log("aivslaiuvl");
  if (event.keyCode == 13) {
    var result = search(document.getElementById("search").value);
    document.getElementById("nosearchresults").style.display = result.length == 0 ? "block" : "none";
    resetTable(result);
  }
}

function search(query) {
  var searchTerms = query.toLowerCase().split(" ");
  var searchWords = searchTerms.filter(word => !/^\[\S+\]$/.test(word)); //Words are those that are not surrounded in brackets
  var searchTags = searchTerms.filter(word => /^\[\S+\]$/.test(word));
  searchTags = searchTags.map(tag => tag.replace(/\[|\]/g,""));
  const q = modle.data.questions; const t = modle.data.tags;
  var out = [];
  for (let i = 0; i < q.length; i++) {
    if (((searchWords.some(term => q[i].title.toLowerCase().includes(term) || //If the title includes a search term
        q[i].text.toLowerCase().includes(term))) || //Or the description includes the search term or is empty
        searchWords.length == 0) && //Or there is no search word           AND
        (q[i].tagIds.some(tag => searchTags.some(term => term == t.find(x => x.tid == tag).name)) || //it has a tag from the list of tags.
        searchTags.length == 0)) { //Or there are no tags searched
      out.push(q[i]);
    }
  }
  return out;
}

function submitQuestion() {
  if (checkQuestionForm()) {
    var newqid = parseInt(modle.data.questions[modle.data.questions.length-1].qid.substring(1)) + 1;
    var tags = document.getElementById("qtags").value.split(" ");
    var taglist = [];
    for (let i = 0; i < tags.length; i++) {
      var tagid = modle.tagExists(tags[i]);
      if (tagid) taglist.push(tagid);
      else {
        var newtid = parseInt(modle.data.tags[modle.data.tags.length-1].tid.substring(1)) + 1;
        modle.data.tags.push({tid: 't' + newtid, name: tags[i]});
        taglist.push('t' + newtid);
      }
    }
    modle.data.questions.push({
      qid: 'q' + newqid,
      title: document.getElementById("qtitle").value,
      text: document.getElementById("qtext").value,
      tagIds: taglist,
      askedBy : document.getElementById("quser").value,
      askDate: new Date(),
      ansIds: [],
      views: 0,
    });
    console.table(modle.data.questions);
    switchToQuestionPage();
    resetTable();
  } else return false;
}

function submitAnswer() {
  if (checkAnswerForm()) {
    var newqid = parseInt(modle.data.answers[modle.data.answers.length-1].aid.substring(1)) + 1;
    /* No need for tags section */
    /* Push the new answer to the modle.data */
    console.table(modle.data.answers);
    /* switchToAnswerPage(); */
  } else return false;
}

function checkQuestionForm() {
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


  /* Validate Description */
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

function checkAnswerForm() {
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

function switchToPostPage() {
  document.getElementById("content").style.display='none';
  document.getElementById("askquestion").style.display='block';
  document.getElementById("answerpage").style.display='none';
  document.getElementById("newanswer").style.display='none';
  document.getElementById("alltags").style.display='none';
}

function switchToQuestionPage() {
  document.getElementById("content").style.display='block';
  document.getElementById("askquestion").style.display='none';
  document.getElementById("answerpage").style.display='none';
  document.getElementById("newanswer").style.display='none';
  document.getElementById("alltags").style.display='none';
}

function switchToAnswerPage() {
  document.getElementById("content").style.display='none';
  document.getElementById("askquestion").style.display='none';
  document.getElementById("answerpage").style.display='block';
  document.getElementById("newanswer").style.display='none';
  document.getElementById("alltags").style.display='none';
}

function switchToPostAnswerPage() {
  document.getElementById("content").style.display='none';
  document.getElementById("askquestion").style.display='none';
  document.getElementById("answerpage").style.display='none';
  document.getElementById("newanswer").style.display='block';
  document.getElementById("alltags").style.display='none';
}

function switchToAllTagsPage() {
  document.getElementById("content").style.display='none';
  document.getElementById("askquestion").style.display='none';
  document.getElementById("answerpage").style.display='none';
  document.getElementById("newanswer").style.display='none';
  document.getElementById("alltags").style.display='block';
}