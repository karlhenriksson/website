"use strict";
/**
 * Populates the header menu by reading from menu.json
 */

{
  const menu = document.querySelector("div#menu");
  const template = document.querySelector("div#menuItemTemplate");

  fetch("menu.json")
    .then((response) => response.json())
    .then((json) => {
      // Creates a document fragment to avoid unnecessary recalculation of CSS
      const fragment = new DocumentFragment();
      for (const j of json) fragment.appendChild(parseMenuItem(j));

      menu.appendChild(fragment);
    });

  /**
   * Takes in a menu object,
   * Returns a node containing the full parsed menu fragment
   */
  function parseMenuItem(json) {
    // Create a new item
    const item = template.cloneNode(true);
    item.removeAttribute("id");
    item.style.display = "block";

    const a = item.querySelector("a");
    a.innerText = json.name;
    a.href = json.link;

    // Check if this object has children
    if (json.children?.length) {
      // For every child, parse and append
      const children = item.querySelector("div.folderContent");
      for (const j of json.children ?? [])
        children.appendChild(parseMenuItem(j));
      item.querySelector("img.menuExpander").onclick = () => {
        children.classList.toggle("hidden");
      };
    } else {
      // If no children, hide the menu expander and folder contents
      item.querySelector("img.menuExpander").style.display = "none";
      item.querySelector("div.folderContent").style.display = "none";
    }

    return item;
  }
}
