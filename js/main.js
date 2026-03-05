const getSharedPath = (fileName) => {
  const path = window.location.pathname;
  const inPages = path.includes("/pages/");
  const prefix = inPages ? "../" : "";
  return `${prefix}shared/${fileName}`;
};

fetch(getSharedPath("header.html"))
  .then((r) => r.text())
  .then((html) => {
    document.getElementById("header").innerHTML = html;
  });

fetch(getSharedPath("footer.html"))
  .then((r) => r.text())
  .then((html) => {
    document.getElementById("footer").innerHTML = html;
  });
