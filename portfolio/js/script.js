// Highlight the current page in the top nav (multi-page site, so this is
// based on the URL rather than scroll position).
(function () {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".topnav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
})();

// Interview scheduling form: progressive enhancement.
// Submits to Formspree (or whatever backend endpoint is set as the form's
// "action") via fetch so we can show an inline confirmation instead of a
// full page reload. Falls back to a normal HTML form POST if fetch fails
// or JavaScript is unavailable.
(function () {
  const form = document.getElementById("interview-form");
  if (!form) return;

  const status = document.getElementById("form-status");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    status.textContent = "Sending…";
    status.classList.remove("form-status-error");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = "Request sent — I'll confirm by email shortly.";
        form.reset();
      } else {
        throw new Error("Form backend returned an error");
      }
    } catch (err) {
      status.textContent =
        "Couldn't send automatically. Please email dharanidharu592@gmail.com directly, or set up a form backend (see README).";
      status.classList.add("form-status-error");
    }
  });
})();
