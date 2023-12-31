import { modle, showPage } from './index.js';
import { questPage, resetTable } from './questions.js';

export function showTagsPage() {
    document.getElementById("questiontab").style.backgroundColor = "";
    document.getElementById("tagtab").style.backgroundColor = "rgb(189, 189, 189)";
    var tags = Array.from(modle.getAllTags());
    var parent = document.getElementById("tagcontainer");
    if (!parent) { /* Create container div if it doesn't already exist */
      var parent = document.createElement("div");
      parent.id = "tagcontainer";
      var parnt = document.getElementById("alltags");
      parnt.appendChild(parent);
    }
    
    parent.replaceChildren(); /* No need to check if its a div/br anymore, just eliminate every child. */
    let col = -1; let row = 1;
    document.getElementById("t_tagcount").innerHTML = `${tags.length} Tags`;
    tags.forEach(tag => {
        if (++col == 3) {
            col = 0; ++row;
        }
        /* Create box */
        var div = document.createElement("div");
        div.setAttribute("class", "tagbox");
        parent.appendChild(div);
        div.style.gridColumn = col; div.style.gridRow = row;

        /* Create link to tag filter */
        var link = document.createElement("p");
        link.setAttribute("class", "taglink");
        addTagLink(link, tag.name); // Attach this to div or to link?
        link.textContent = tag.name;
        div.appendChild(link);

        /* Question count */
        var qcount = document.createElement("p");
        qcount.setAttribute("class", "tagqcount");
        var c = modle.getQuestionCountByTag(tag.name);
        qcount.textContent = c + " question" + ((c === 1) ? "" : "s");
        div.appendChild(qcount);
    });
    showPage("alltags");
}

export function addTagLink(element, tagname) {
  element.onclick = function() {
    questPage();
    resetTable(modle.getQuestionsByTagString(tagname));
  }
}