"use strict";
/**
 * Grabs info from the correct JSON file, then reads it into the page. Defaults to home
 */

// Load from URL parameters, default to home if no target given
const urlParameters = new URLSearchParams(window.location.search);
const pageName = urlParameters.get("page") ?? "home";

// Import markdown for formatting
import markdownit from "https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm";
const md = markdownit({ html: false });

{
  function loadPageWithFallback(pageName, fallbackPage) {
    return fetch(pageName)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .catch(() =>
        fetch(fallbackPage).then((res) => {
          if (!res.ok) throw new Error("Fallback page failed to load");
          return res.json();
        })
      );
  }

  loadPageWithFallback(
    `Pages/${pageName}.json`,
    "Pages/unknown_page.json"
  ).then((json) => {
    // First, set the head title
    document.title = json.title + " | Karl Henriksson";

    // Make a new document fragment
    const fragment = new DocumentFragment();

    // Loop through all the pages
    for (const pageJson of json.pages) {
      const pageObj = document.createElement("div");
      pageObj.classList.add("page");

      // Loop through the page content
      for (const element of pageJson.content) {
        const obj = document.createElement("div");

        switch (element.type) {
          case "title":
            obj.classList.add("pageHeader");
            obj.innerHTML = parseRichText(element.text);
            break;

          case "text":
            obj.classList.add("pageText");
            obj.innerHTML = parseRichText(element.text);
            break;

          case "image":
            obj.classList.add("pageImage");
            const img = document.createElement("img");
            img.src = element.source;
            img.style.maxWidth = element.size + "cm";
            obj.appendChild(img);
            break;

          case "images":
            obj.classList.add("pageImage");
            for (const src of element.sources) {
              const img = document.createElement("img");
              img.src = src;
              img.style.maxWidth = element.size + "cm";
              obj.appendChild(img);
            }
            break;

          case "code":
            obj.classList.add("pageCode");
            obj.innerText = element.text;
            break;

          default:
            console.error(`Invalid page element type '${element.type}'!`);
        }

        pageObj.appendChild(obj);
      }

      fragment.appendChild(pageObj);
    }

    // Attach fragment, done!
    document.querySelector("div#content").appendChild(fragment);
  });

  // Parses the given text and returns an HTML node with the correct spans

  function parseRichText(text) {
    return md.render(text); // Using a library right now, might want to try making my own later?
  }
}
