import { modle, showPage } from './index.js';

export function showTagsPage() {
    document.getElementById("questiontab").style.backgroundColor = "";
    document.getElementById("tagtab").style.backgroundColor = "rgb(189, 189, 189)";
    var tags = Array.from(modle.getAllTags());
    var parent = document.getElementById("alltags");
    var children = parent.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName === 'DIV' || children[i].tagName === 'BR') {
        parent.removeChild(children[i]);
        i--; // adjust the loop index because the child array is now shorter
      }
    }
    let i = 0;
    tags.forEach(tag => {
        i += 1;
        if (i == 3) {
            i = 0;
            parent.appendChild(document.createElement("br"));
        }
        var div = document.createElement("div");
        div.setAttribute("class", "tagbox");
        parent.appendChild(div);
        div.textContent = tag.name;
    });
    showPage("alltags");
}