fetch("../shared/header.html")
  .then((r) => r.text())
  .then((html) => {
    document.getElementById("header").innerHTML = html;
  });

fetch("../shared/footer.html")
  .then((r) => r.text())
  .then((html) => {
    document.getElementById("footer").innerHTML = html;
  });
