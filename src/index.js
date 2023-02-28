import Model from './model.js';

var sortOrder = "Newest";
var lastViewedQuestion;
var modle = new Model();

function resetTable(newQ) { /* Re-fetches the question table */
  var tbl = document.getElementById("questions");
  while (tbl.rows.length > 0) tbl.deleteRow(0);
  if (newQ == undefined) fetchQuestions();
  else fetchQuestions(newQ);
}
function setNewest() { sortOrder = "Newest"; resetTable(); } /* Sets sort options and regenerates table */
function setActive() { sortOrder = "Active"; resetTable(); }
function setUnanswered() { sortOrder = "Unanswered"; resetTable(); }
function compareActive(a, b) { /* Compares the most active questions by the date of their most recent answer */
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
  return bLatest - aLatest;
}

function fetchQuestions(qList = modle.getAllQstns()) {
  document.getElementById("questioncount").innerHTML = `${qList.length} questions`;
  var tbl = document.getElementById("questions");

  /* Sort Options */
  if (sortOrder == "Newest" || sortOrder == "Unanswered") qList.sort((a, b) => b.askDate - a.askDate);
  if (sortOrder == "Active") qList.sort(compareActive);

  /* This line is needed to have a dotted line on top */
  tbl.insertRow().setAttribute("class", "qRow");

  /* Question List */
  for (let i = 0; i < qList.length; i++) {
    var question = qList[i];
    if (sortOrder == "Unanswered" && question.ansIds.length != 0) continue;
    var newRow = tbl.insertRow();
    newRow.setAttribute("class", "qRow");

    /* Left Column */
    var leftCell = newRow.insertCell(0);
    leftCell.setAttribute("class","qTD");
    leftCell.innerHTML = `${question.ansIds.length} answers <br>${question.views} views`;

    /* Middle Column */
    var midCell = newRow.insertCell(1);
    midCell.setAttribute("class","qTD");
    var qtitle = document.createElement("a");
    qtitle.setAttribute("class", "qlink");
    qtitle.textContent = question.title;
    qtitle.onclick = showAnswers(question.qid);
    midCell.appendChild(qtitle);
    
    // Setup tags
    midCell.appendChild(document.createElement("br"));
    for (let j = 0; j < question.tagIds.length; j++) { /* Renders each tag as a button thing */
      var tag = document.createElement("button");
      tag.setAttribute("style", "color:white;background-color:grey;display:inline-block;");
      tag.textContent = modle.findTagName(question.tagIds[j]);
      midCell.appendChild(tag);
    }

    /* Right Column */ /* The date is manually set here for testing purposes */
    // var now = new Date('February 12, 2023 19:53:46');
    var askDate = question.askDate;
    var rightCell = newRow.insertCell(2);
    rightCell.setAttribute("class","qTD");
    rightCell.innerHTML = `${question.askedBy} asked `;
    
    rightCell.innerHTML += modle.formatDate(askDate/*, now*/);
  }
}

window.onload = function() {
  document.getElementById("newbutt").onclick = setNewest;
  document.getElementById("activebutt").onclick = setActive;
  document.getElementById("questiontab").onclick = questPage();
  document.getElementById("unbutt").onclick = setUnanswered;
  document.getElementById("postqbutt").onclick = submitQuestion;
  document.getElementById("postabutt").onclick = submitAnswer;
  document.getElementById("ap_answerbutton").onclick = showAnswerForm;
  Array.from(document.getElementsByClassName("askqbutt")).forEach(butt => {
    butt.onclick = showQuestionForm;
  });

  fetchQuestions();
  switchToQuestionPage();
};

function questPage() {
  return function() {
    switchToQuestionPage();
    resetTable();
  }
}

window.checkSearch = function checkSearch(event) { /* This needs to be window.checkSearch so its callable in index.html */
  if (event.keyCode == 13) { /* keyCode 13 = Enter key */
    var result = search(document.getElementById("search").value);
    document.getElementById("nosearchresults").style.display = result.length == 0 ? "block" : "none";
    resetTable(result);
  }
}

/* Callback function for swapping to the answer page of a given question */
function showAnswers(questionId) {
  return function() {
    /* Setup page information */
    lastViewedQuestion = questionId;
    var answers = modle.getAnswersByQID(questionId);
    document.getElementById("ap_questiontitle").innerHTML = `<b>${modle.getQuestionTitle(questionId)}</b>`;
    document.getElementById("ap_questiontext").innerHTML = `${modle.getQuestionText(questionId)}`;
    document.getElementById("ap_answercount").innerHTML = `${answers.length} answers`;
    document.getElementById("ap_views").innerHTML = `<b>${modle.getViews(questionId)} views</b>`;
    document.getElementById("ap_askedby").innerHTML = `<b>${modle.getWhoAsked(questionId)}</b> asked<br>${modle.formatDate(modle.getAskDate(questionId))}`
    var answertable = document.getElementById("ap_answers");
    while (answertable.rows.length > 0) answertable.deleteRow(0);
    /* Add empty row for dotted line above first question */
    var emptyrow = answertable.insertRow();
    emptyrow.setAttribute("class", "aRow");
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
        textcol.setAttribute("class", "aTD");
        creditcol.setAttribute("class", "aTD");
        textcol.textContent = answer.text;
        creditcol.innerHTML = "<b>" + answer.ansBy + "</b> answered " +  answer.ansDate.toLocaleDateString();
      });
    }
    switchToAnswerPage();
  }
}

function showQuestionForm() {
  document.getElementById("qtitle").value = "";
  document.getElementById("qtext").value = "";
  document.getElementById("qtags").value = "";
  document.getElementById("quser").value = "";
  switchToPostPage();
}

function showAnswerForm() {
  document.getElementById("auser").value = "";
  document.getElementById("atext").value = "";
  switchToPostAnswerPage();
}

function search(query) {
  var searchTerms = query.toLowerCase().split(" ");
  var searchWords = searchTerms.filter(word => !/^\[\S+\]$/.test(word)); //Words are those that are not surrounded in brackets
  var searchTags = searchTerms.filter(word => /^\[\S+\]$/.test(word)); /* Tests for [x] for tags */
  searchTags = searchTags.map(tag => tag.replace(/\[|\]/g,"")); /* Deletes the brackets from each tag */
  const q = modle.data.questions; const t = modle.data.tags; var out = [];
  for (let i = 0; i < q.length; i++) {
    if (((searchWords.some(term => q[i].title.toLowerCase().includes(term) || //Title includes a search term
        q[i].text.toLowerCase().includes(term))) || //Description includes the search term
        searchWords.length == 0) //Or there are no search words
        && /* AND */
        (q[i].tagIds.some(tag => searchTags.some(term => term == t.find(x => x.tid == tag).name)) || //Contains search tag.
        searchTags.length == 0)) { //Or there are no search tags
      out.push(q[i]);
    }
  }
  return out;
}

function submitQuestion() {
  if (checkQuestionForm()) {
    /* Generates the next question id */
    var newqid = parseInt(modle.data.questions[modle.data.questions.length-1].qid.substring(1)) + 1;
    var tags = document.getElementById("qtags").value.split(" ");
    var taglist = [];
    for (let i = 0; i < tags.length; i++) {
      var tagid = modle.tagExists(tags[i]);
      if (tagid) taglist.push(tagid); /* If the tag already exists, don't make a new one */
      else { /* Generates a new tag with the next id */
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
    //console.table(modle.data.questions);
    switchToQuestionPage();
    resetTable();
    return true;
  } else return false;
}

function submitAnswer() {
  if (checkAnswerForm()) {
    modle.addAnswer(lastViewedQuestion, document.getElementById("auser").value, document.getElementById("atext").value);
    console.table(modle.data.answers);
    showAnswers(lastViewedQuestion)();
    return true;
  } else return false;
}

function checkQuestionForm() { /* Validates the question form */
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