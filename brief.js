const brief = document.querySelector(".brief-form");
const emailLink = document.querySelector(".contact-cta");
const status = brief.querySelector(".brief-status");

brief.addEventListener("submit", event => {
  event.preventDefault();
  const fields = new FormData(brief);
  const name = fields.get("name").trim();
  const email = fields.get("email").trim();
  const message = fields.get("message").trim();

  if (!name || !message) {
    status.textContent = "Enter your name and a few details about the project.";
    brief.elements.namedItem(name ? "message" : "name").focus();
    return;
  }

  const subject = encodeURIComponent("Portfolio project enquiry");
  const body = encodeURIComponent(`Name: ${name}\r\nEmail: ${email}\r\n\r\n${message}`);
  status.textContent = "If a draft doesn’t open, use the email link above.";
  window.location.href = `${emailLink.href}?subject=${subject}&body=${body}`;
});

brief.hidden = false;
