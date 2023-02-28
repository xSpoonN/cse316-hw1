import { modle, showPage } from './index.js';

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
/*     var children = parent.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName === 'DIV' || children[i].tagName === 'BR') {
        parent.removeChild(children[i]);
        i--; // adjust the loop index because the child array is now shorter
      }
    } */
    let col = -1; let row = 0;
    document.getElementById("t_tagcount").innerHTML = `${tags.length} Tags`;
    tags.forEach(tag => {
        if (++col == 3) {
            col = 0; ++row;
            parent.appendChild(document.createElement("br"));
        }
        var div = document.createElement("div");
        div.setAttribute("class", "tagbox");
        parent.appendChild(div);
        div.style.gridColumn = col; div.style.gridRow = row;
        div.textContent = tag.name;
    });
    showPage("alltags");
}