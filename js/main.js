const getSharedPath = (fileName) => {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const depth = Math.max(0, parts.length - 1);
  const prefix = depth > 0 ? "../".repeat(depth) : "";
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
