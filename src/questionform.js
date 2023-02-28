import { modle, showPage } from './index.js';
import { resetTable } from './questions.js';

export function submitQuestion() {
    if (checkQuestionForm()) {
      /* Generates the next question id */
      // todo: move this into modle
      var newqid = parseInt(modle.data.questions[modle.data.questions.length-1].qid.substring(1)) + 1;
      console.log(newqid);
      var tags = document.getElementById("qtags").value.split(" ");
      var taglist = [];
      for (let i = 0; i < tags.length; i++) {
        var tagid = modle.tagExists(tags[i]);
        if (tagid) taglist.push(tagid); /* If the tag already exists, don't make a new one */
        else { /* Generates a new tag with the next id */
          var newtid = parseInt(modle.data.tags[modle.data.tags.length-1].tid.substring(1)) + 1;
          //todo: move this into model.js
          modle.data.tags.push({tid: 't' + newtid, name: tags[i]});
          taglist.push('t' + newtid);
        }
      }
      //todo: move this into model.js
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
      showPage("questions");
      resetTable();
      return true;
    } else return false;
}

export function showQuestionForm() {
    document.getElementById("qtitle").value = "";
    document.getElementById("qtext").value = "";
    document.getElementById("qtags").value = "";
    document.getElementById("quser").value = "";
    showPage("questionform");
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