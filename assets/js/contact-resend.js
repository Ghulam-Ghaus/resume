/**
 * Static-Safe Contact Form Handler (CORS-Safe FormData + Native POST Fallback + mailto)
 */
(function () {
  "use strict";

  const RECIPIENT_EMAIL = "ghulamghaus266@gmail.com";
  const FORMSUBMIT_AJAX_ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;

  const contactForm = document.querySelector(".resend-contact-form");
  if (!contactForm) return;

  const loadingAlert = contactForm.querySelector(".loading");
  const errorAlert = contactForm.querySelector(".error-message");
  const successAlert = contactForm.querySelector(".sent-message");

  // Handle redirect confirmation (?sent=1#contact) after native POST fallback
  const params = new URLSearchParams(window.location.search);
  if (params.get("sent") === "1") {
    showSuccess("Your message has been sent successfully! Ghulam Ghaus will respond shortly.");
    const cleanUrl = `${window.location.pathname}${window.location.hash || "#contact"}`;
    window.history.replaceState(null, "", cleanUrl);
  }

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const nameEl = contactForm.querySelector("#name, [name='name']");
    const emailEl = contactForm.querySelector("#email, [name='email']");
    const subjectEl = contactForm.querySelector("#subject, [name='subject']");
    const messageEl = contactForm.querySelector("#message, [name='message']");
    const hiddenSubjectEl = contactForm.querySelector("#hidden-subject");

    const name = nameEl ? nameEl.value.trim() : "";
    const email = emailEl ? emailEl.value.trim() : "";
    const subject = subjectEl ? subjectEl.value.trim() : "Interview / Project Inquiry";
    const message = messageEl ? messageEl.value.trim() : "";

    if (!name || !email || !message) {
      showError("Please enter your name, email address, and message.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Please provide a valid email address.");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
    }
    if (loadingAlert) loadingAlert.classList.remove("d-none");
    if (errorAlert) errorAlert.style.display = "none";
    if (successAlert) successAlert.style.display = "none";

    const formattedSubject = `[Portfolio Inquiry] ${subject}`;
    if (hiddenSubjectEl) hiddenSubjectEl.value = formattedSubject;

    const mailtoHref = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(
      `[Portfolio] ${subject}`
    )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

    // Use FormData (no Content-Type header) to avoid CORS preflight failures
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("_replyto", email);
    formData.append("_subject", formattedSubject);
    formData.append("message", message);
    formData.append("_captcha", "false");
    formData.append("_template", "table");

    try {
      const response = await fetch(FORMSUBMIT_AJAX_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && (data.success === "true" || data.success === true)) {
        showSuccess("Message sent successfully! Ghulam Ghaus will respond shortly.");
        return;
      }

      const rawMsg = String(data.message || "");
      if (data.success === "false" || data.success === false || /activate|confirm/i.test(rawMsg)) {
        showErrorWithMailto(
          "FormSubmit activation pending — check ghulamghaus266@gmail.com to click Activate Form, or send immediately via email app:",
          mailtoHref
        );
      } else {
        showErrorWithMailto(
          rawMsg || "Could not submit via form relay right now.",
          mailtoHref
        );
      }
    } catch (_err) {
      // Transparent native HTML POST fallback when AJAX is blocked by an ad-blocker or CORS extension
      const isHttpOrigin =
        window.location.protocol === "http:" || window.location.protocol === "https:";
      if (isHttpOrigin && contactForm.getAttribute("action")) {
        HTMLFormElement.prototype.submit.call(contactForm);
        return;
      }

      showErrorWithMailto(
        "Local preview or blocked network — send directly via your email app or WhatsApp:",
        mailtoHref
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="bi bi-arrow-right ms-1"></i>';
      }
      if (loadingAlert) loadingAlert.classList.add("d-none");
    }
  });

  function showSuccess(msg) {
    if (successAlert) {
      successAlert.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>${escapeText(msg)}`;
      successAlert.style.display = "block";
    }
    if (errorAlert) errorAlert.style.display = "none";
    contactForm.reset();
  }

  function showError(msg) {
    if (errorAlert) {
      errorAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${escapeText(msg)}`;
      errorAlert.style.display = "block";
    }
  }

  function showErrorWithMailto(msg, href) {
    if (errorAlert) {
      errorAlert.innerHTML =
        `<i class="bi bi-exclamation-triangle-fill me-2"></i>${escapeText(msg)} ` +
        `<a href="${href}" class="text-info text-decoration-underline fw-bold ms-1">Send via Email App</a>` +
        ` <span class="mx-1">·</span> <a href="https://wa.me/923067956164" target="_blank" rel="noopener" class="text-info text-decoration-underline fw-bold">WhatsApp</a>`;
      errorAlert.style.display = "block";
    }
  }

  function escapeText(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
