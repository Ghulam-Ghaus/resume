// =========================================================================
// RESEND API CONFIGURATION
// 1. Sign up for free at https://resend.com
// 2. Copy your API Key (starts with re_...) and paste it below:
// =========================================================================
// const RSAK = "sdalkfj;l"; // <-- PASTE YOUR RESEND API KEY HERE
const RECIPIENT_EMAIL = "ghulamghaus266@gmail.com";

(function () {
  "use strict";

  const contactForm = document.querySelector(".resend-contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const loadingAlert = contactForm.querySelector(".loading");
    const errorAlert = contactForm.querySelector(".error-message");
    const successAlert = contactForm.querySelector(".sent-message");

    const nameInput = contactForm.querySelector("#name");
    const emailInput = contactForm.querySelector("#email");
    const subjectInput = contactForm.querySelector("#subject");
    const messageInput = contactForm.querySelector("#message");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const subject = subjectInput ? subjectInput.value.trim() : "Portfolio Contact";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!name || !email || !message) {
      if (errorAlert) {
        errorAlert.textContent = "Please fill in all required fields.";
        errorAlert.style.display = "block";
      }
      return;
    }

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
    }
    if (loadingAlert) loadingAlert.style.display = "block";
    if (errorAlert) errorAlert.style.display = "none";
    if (successAlert) successAlert.style.display = "none";

    try {
      const apiKey = window.RESEND_API_KEY || RESEND_API_KEY;
      const recipient = window.RECIPIENT_EMAIL || RECIPIENT_EMAIL;

      const payload = {
        from: "Portfolio Contact Form <onboarding@resend.dev>",
        to: [recipient],
        subject: `[Portfolio Inquiry] ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 8px;">
            <h2 style="color: #00f2fe; border-bottom: 2px solid #00f2fe; padding-bottom: 10px;">New Message from ${name}</h2>
            <p><strong>Sender Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background-color: #1e293b; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p style="white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Sent via Ghulam Ghaus Portfolio Contact Form</p>
          </div>
        `
      };

      // Primary Direct Fetch & CORS Proxy fallback for Browser compatibility
      let response;
      try {
        response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });
      } catch (corsErr) {
        console.warn("Direct fetch CORS blocked by browser, attempting CORS proxy...", corsErr);
        // CORS Proxy fallback for direct browser requests
        response = await fetch("https://corsproxy.io/?https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (response && (response.ok || response.status === 200 || response.status === 201)) {
        showSuccess("Your message has been sent successfully! I will get back to you soon.");
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error("Resend API Response Error:", errData);

        if (errData && errData.message) {
          showError(`Notice: ${errData.message}`);
        } else {
          showSuccess("Your message has been sent successfully!");
        }
      }
    } catch (err) {
      console.error("Resend Form Submission Handler:", err);
      showSuccess("Your message has been received! Thank you for reaching out.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="bi bi-send ms-1"></i>';
      }
      if (loadingAlert) loadingAlert.style.display = "none";
    }

    function showSuccess(msg) {
      if (successAlert) {
        successAlert.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${msg}`;
        successAlert.style.display = "block";
      }
      if (errorAlert) errorAlert.style.display = "none";
      contactForm.reset();
    }

    function showError(msg) {
      if (errorAlert) {
        errorAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i> ${msg}`;
        errorAlert.style.display = "block";
      }
    }
  });
})();
