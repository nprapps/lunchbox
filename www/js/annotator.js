var $ = (s, d = document) => Array.from(d.querySelectorAll(s));
$.one = (s, d = document) => d.querySelector(s);

var form = $.one(".form.controls");

// var canvas = $.one(".quotable-preview");
// var context = canvas.getContext("2d");

var state;

var updateBindings = function() {
  state = {};
  var bound = $("[data-bound]");
  bound.forEach(function(input) {
    if (
      (input.type == "radio" || input.type == "checkbox")
      && !input.checked
    ) return;
    var prop = input.getAttribute("data-bound");
    state[prop] = input.value;
  });
  render(state);
};

var preview = $.one(".poster-wrapper");
var render = function(state) {
  var quoteParagraphs = state.quote.trim().split(/\n+/).join("<p>");
  if (state.addQuotes) {
    quoteParagraphs = [
    `<span class="decorative-quote">&ldquo;</span>`,
    quoteParagraphs,
    `<span class="decorative-quote">&rdquo;</span>`].join("");
  }
  var annotationParagraphs = state.annotation.trim().split(/\n+/).join("<p>");
  var aspect = state.aspect == "2x1" ? "two-by-one" : "sixteen-by-nine";

  var html = `
  <div class="poster quote poster-news ${aspect}">
      <h2 class="kicker-wrapper"><span class="kicker">${state.kicker}</span></h2>
      <blockquote class="quote" style="font-size: ${state.quoteSize}px">
        <p>${quoteParagraphs}</p>
      </blockquote>
      <p class="show-credit">&mdash;&nbsp;${state.source}</p>
      <div class="annotation-wrapper">
          <div class="annotation" style="font-size: ${state.annotationSize}px">
              <p>${annotationParagraphs}</p>
          </div>
          <div class="annotation-author">
              <span class="author">${state.author}</span> <span class="title">${state.title}</span>
          </div>
          <div class="logo-wrapper"></div>
      </div>
  </div>`;
  preview.innerHTML = html;
};

["change", "keyup", "input"].forEach(e => form.addEventListener(e, updateBindings));
updateBindings();

$.one("#save").addEventListener("click", async function(e) {
  e.preventDefault();
  var poster = $.one(".poster");
  //check heights
  var annotation = $.one(".poster .annotation-wrapper");
  var annoBounds = annotation.getBoundingClientRect();
  var poster = $.one(".poster");
  var posterBounds = poster.getBoundingClientRect();
  if (annoBounds.bottom >= posterBounds.bottom) {
    return alert("Your text seems to be too large for the social image size. Reduce the font size or edit down the text.");
  }

  var image = await domtoimage.toPng(poster);
  var a = document.createElement("a");
  a.setAttribute("download", state.kicker.replace(/\s+/g, "-").toLowerCase() + ".png");
  a.setAttribute("href", image);
  a.click();
})
