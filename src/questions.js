import { modle, showPage } from './index.js';
import { showAnswers } from './answers.js';
import { addTagLink } from './alltags.js';

var sortOrder = "Newest";

export function resetTable(newQ) { /* Re-fetches the question table */
  var tbl = document.getElementById("questions");
  while (tbl.rows.length > 0) tbl.deleteRow(0);
  if (newQ == undefined) fetchQuestions();
  else fetchQuestions(newQ);
}

export function questPage() {
    resetTable();
    document.getElementById("questiontab").style.backgroundColor = "rgb(189, 189, 189)";
    document.getElementById("tagtab").style.backgroundColor = "";
    showPage("questions");
}

export function setNewest() { sortOrder = "Newest"; resetTable(); } /* Sets sort options and regenerates table */
export function setActive() { sortOrder = "Active"; resetTable(); }
export function setUnanswered() { sortOrder = "Unanswered"; resetTable(); }

export function search(query) {
    var searchTerms = query.toLowerCase().split(" ");
    var searchWords = searchTerms.filter(word => !/^\[\S+\]$/.test(word)); //Words are those that are not surrounded in brackets
    var searchTags = searchTerms.filter(word => /^\[\S+\]$/.test(word)); /* Tests for [x] for tags */
    searchTags = searchTags.map(tag => tag.replace(/\[|\]/g,"")); /* Deletes the brackets from each tag */
    //todo: modle.getQuestions()? modle.getAllTags()?
    const q = modle.getAllQstns(); const t = modle.getAllTags(); var out = [];
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

export function fetchQuestions(qList = modle.getAllQstns()) {
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
        qtitle.onclick = showAnswers(question.qid, true);
        midCell.appendChild(qtitle);
        
        // Setup tags
        midCell.appendChild(document.createElement("br"));
        for (let j = 0; j < question.tagIds.length; j++) { /* Renders each tag as a button thing */
          var tag = document.createElement("button");
          tag.setAttribute("class", "qtag");
          var tn = modle.findTagName(question.tagIds[j]);
          tag.textContent = tn;
          addTagLink(tag, tn);
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