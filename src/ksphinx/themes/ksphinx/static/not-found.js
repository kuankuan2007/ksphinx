window.onload = function () {
  const pageUrl = window.location.href;
  const pageUrlSpan = document.getElementById('not-found-page-url');
  if (pageUrlSpan) {
    pageUrlSpan.innerText = pageUrl;
  }
};
