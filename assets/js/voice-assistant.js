/**
 * Ghulam Ghaus Portfolio — Grounded Recruiter Q&A & Optional Voice Assistant
 * 100% Synced to Verified CV, JobAgent AI & 15+ Shipped Projects
 */
(function () {
  "use strict";

  const PORTFOLIO_KNOWLEDGE = {
    name: "Ghulam Ghaus",
    role: "Software Engineer — Backend, Full-Stack & Real-Time AI Systems",
    email: "ghulamghaus266@gmail.com",
    whatsapp: "+92 306 7956164",
    github: "https://github.com/Ghulam-Ghaus",
    linkedin: "https://www.linkedin.com/in/ghulam-ghaus-5b4ba9194/",
    experienceYears: "4+ years",
    shippedCount: "15+ production systems (web, desktop, mobile, SaaS & AI)",
    education: "BS Information Technology (CGPA 3.28 / 4.00) from Government College University Faisalabad (2015–2019), plus Certificate in Block Chain Programming (Grade A) from NAVTTC / Air University, Islamabad (2022)."
  };

  class GroundedAssistantEngine {
    constructor() {
      this.isListening = false;
      this.audioEnabled = false;
      this.recognition = null;
      this.synthesis = window.speechSynthesis || null;

      this.initElements();
      this.initSpeechRecognition();
      this.bindEvents();
    }

    initElements() {
      this.micBtn = document.getElementById("voice-assistant-mic-btn");
      this.drawerMicBtn = document.getElementById("drawer-mic-btn");
      this.ttsToggleBtn = document.getElementById("voice-tts-toggle");
      this.statusText = document.getElementById("voice-assistant-status");
      this.visualizer = document.getElementById("voice-visualizer");
      this.drawer = document.getElementById("voice-assistant-drawer");
      this.transcriptContainer = document.getElementById("voice-transcript-log");
      this.closeDrawerBtn = document.getElementById("close-voice-drawer");
      this.toggleDrawerBtn = document.getElementById("open-voice-drawer-btn");
      this.quickPrompts = document.querySelectorAll(".voice-prompt-chip");
      this.chatForm = document.getElementById("voice-chat-input-form");
      this.chatInput = document.getElementById("voice-chat-input");
      this.bookingModal = document.getElementById("calendar-booking-modal");
      this.bookingForm = document.getElementById("calendar-booking-form");
    }

    initSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = "en-US";

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateUI("listening");
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.audioEnabled = true;
        this.syncAudioToggleUI();
        this.handleQuery(transcript);
      };

      this.recognition.onerror = () => {
        this.isListening = false;
        this.updateUI("idle");
        this.appendMessage("assistant", "Could not capture audio clearly. Feel free to type your question or tap a prompt chip below.");
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateUI("idle");
      };
    }

    bindEvents() {
      if (this.micBtn) {
        this.micBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openDrawer();
          this.toggleListening();
        });
      }

      if (this.drawerMicBtn) {
        this.drawerMicBtn.addEventListener("click", () => this.toggleListening());
      }

      if (this.ttsToggleBtn) {
        this.ttsToggleBtn.addEventListener("click", () => {
          this.audioEnabled = !this.audioEnabled;
          if (!this.audioEnabled && this.synthesis && this.synthesis.speaking) {
            this.synthesis.cancel();
          }
          this.syncAudioToggleUI();
        });
      }

      if (this.chatForm) {
        this.chatForm.addEventListener("submit", (e) => {
          e.preventDefault();
          if (this.chatInput && this.chatInput.value.trim()) {
            const text = this.chatInput.value.trim();
            this.chatInput.value = "";
            this.handleQuery(text);
          }
        });
      }

      if (this.toggleDrawerBtn) {
        this.toggleDrawerBtn.addEventListener("click", () => {
          if (this.drawer && this.drawer.classList.contains("active")) {
            this.closeDrawer();
          } else {
            this.openDrawer();
          }
        });
      }

      if (this.closeDrawerBtn) {
        this.closeDrawerBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.closeDrawer();
        });
      }

      this.quickPrompts.forEach((chip) => {
        chip.addEventListener("click", () => {
          const prompt = chip.getAttribute("data-prompt") || chip.textContent.trim();
          this.openDrawer();
          this.handleQuery(prompt);
        });
      });

      if (this.bookingForm) {
        this.bookingForm.addEventListener("submit", (e) => {
          e.preventDefault();
          this.processCalendarBooking();
        });
      }
    }

    syncAudioToggleUI() {
      if (!this.ttsToggleBtn) return;
      this.ttsToggleBtn.innerHTML = this.audioEnabled
        ? '<i class="bi bi-volume-up me-1"></i><span>Audio: On</span>'
        : '<i class="bi bi-volume-mute me-1"></i><span>Audio: Off</span>';
    }

    toggleListening() {
      if (this.isListening) {
        this.stopListening();
      } else {
        this.startListening();
      }
    }

    startListening() {
      if (this.synthesis && this.synthesis.speaking) {
        this.synthesis.cancel();
      }
      if (!this.recognition) {
        this.appendMessage("assistant", "Browser voice input is unavailable here — please type your question or click a prompt chip.");
        return;
      }
      try {
        this.recognition.start();
      } catch (_err) {
        this.updateUI("idle");
      }
    }

    stopListening() {
      if (this.recognition) this.recognition.stop();
      this.isListening = false;
      this.updateUI("idle");
    }

    openDrawer() {
      if (!this.drawer) return;
      this.drawer.classList.add("active");
      this.drawer.setAttribute("aria-hidden", "false");
    }

    closeDrawer() {
      if (!this.drawer) return;
      this.drawer.classList.remove("active");
      this.drawer.setAttribute("aria-hidden", "true");
    }

    updateUI(state) {
      if (!this.statusText || !this.visualizer || !this.micBtn) return;

      if (state === "listening") {
        this.statusText.textContent = "Listening... speak now";
        this.visualizer.classList.add("active-listening");
        this.micBtn.classList.add("active-mic");
      } else {
        this.statusText.textContent = "100% Grounded on Verified CV";
        this.visualizer.classList.remove("active-listening");
        this.micBtn.classList.remove("active-mic");
      }
    }

    handleQuery(userText) {
      if (!userText || !userText.trim()) return;
      this.appendMessage("user", userText);

      const { text, section, openCalendar } = this.answerGrounded(userText);
      this.appendMessage("assistant", text);

      if (section) {
        const elem = document.querySelector(section);
        if (elem) elem.scrollIntoView({ behavior: "smooth" });
      }
      if (openCalendar) {
        this.openBookingModal();
      }
      if (this.audioEnabled) {
        this.speakText(text);
      }
    }

    answerGrounded(query) {
      const q = query.toLowerCase();

      if (q.includes("book") || q.includes("meeting") || q.includes("schedule") || q.includes("call")) {
        return {
          text: "Opening the 15-minute call booking form now so you can generate an instant Google Calendar invite and .ics file.",
          openCalendar: true
        };
      }

      if (q.includes("rails") || q.includes("ruby") || q.includes("sidekiq") || q.includes("billing")) {
        return {
          text: "Yes — Ghulam has production Ruby on Rails experience at HiveWorx (Aug 2022–Aug 2024) and SOFTOO Technologies (Sep 2024–Jun 2025), building multi-tenant SaaS APIs, ActiveRecord models, Sidekiq/Redis background jobs, Devise/CanCanCan RBAC, ActionCable real-time events, Stripe recurring billing webhooks, and RSpec suites.",
          section: "#resume"
        };
      }

      if (q.includes("jobagent") || q.includes("job-agent") || q.includes("rag") || q.includes("langgraph") || q.includes("freeswitch")) {
        return {
          text: "JobAgent AI (github.com/Ghulam-Ghaus/job-agent) is his open-source flagship built with NestJS 12, Next.js 16, PostgreSQL + pgvector (768-dim cosine RAG >= 0.55 with 'Unknown' fallback), LangGraph (7 typed Zod tools + SSE streaming), FreeSWITCH SIP/ESL/RTP telephony (<350ms), BullMQ queues, a Chrome Clipper extension, and human-in-the-loop ApplyPack approval gates.",
          section: "#portfolio"
        };
      }

      if (q.includes("desktop") || q.includes("mobile") || q.includes("electron") || q.includes("flutter") || q.includes("react native") || q.includes("pos")) {
        return {
          text: "Beyond backend and web platforms, he has built offline-first desktop ERP/POS software (Bakery POS Desktop ERP using Electron.js, React 19, NestJS, and SQLite WAL) as well as cross-platform iOS & Android mobile apps using React Native, Flutter, Expo, and Firebase.",
          section: "#portfolio"
        };
      }

      if (q.includes("voice") || q.includes("twilio") || q.includes("whisper") || q.includes("cartesia") || q.includes("deepgram") || q.includes("intakely")) {
        return {
          text: "At Intakely AI (Jul 2025–Aug 2026) and in Haider Voice AI, he engineered sub-second real-time voice platforms using Python, Node.js, WebSockets, Twilio Media Streams, Whisper/Deepgram STT, Cartesia TTS, conversational barge-in handling, and Supabase/Docker.",
          section: "#portfolio"
        };
      }

      if (q.includes("relocat") || q.includes("visa") || q.includes("notice") || q.includes("remote") || q.includes("saudi") || q.includes("uae") || q.includes("available")) {
        return {
          text: "Ghulam is available immediately (0-day notice) for full-time remote roles worldwide (UTC+5 with EU/UK/US overlap) or on-site relocation (Saudi Arabia, UAE, Europe, UK, and global). Experience letters (including HiveWorx's formal recommendation), degree verifications, and Saudi/UAE attested documents are ready on request.",
          section: "#certifications"
        };
      }

      if (q.includes("educat") || q.includes("degree") || q.includes("cgpa") || q.includes("universit") || q.includes("blockchain")) {
        return {
          text: PORTFOLIO_KNOWLEDGE.education,
          section: "#certifications"
        };
      }

      if (q.includes("project") || q.includes("work") || q.includes("15") || q.includes("hospital") || q.includes("arenyxa") || q.includes("esports")) {
        return {
          text: "He has shipped 15+ systems spanning JobAgent AI, Real-Time Voice Intake, Haider Voice AI, Bakery POS Desktop ERP, React Native/Flutter Mobile Apps, Ruby on Rails SaaS Billing API, Virtual Hospital System (Saudi Client), NutriCare Clinical SaaS, Arenyxa Esports, Enterprise SSO, HERO, and CSD Hire Purchase.",
          section: "#portfolio"
        };
      }

      if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("aws") || q.includes("node") || q.includes("python")) {
        return {
          text: "Core stack: Node.js, Ruby on Rails, Express.js, NestJS, FastAPI, TypeScript, Python, React/Next.js, Electron, React Native, Flutter, PostgreSQL/pgvector, Redis, Sidekiq, BullMQ, AWS (Lambda, API Gateway, S3, Cognito), Docker, OAuth2/JWT/RBAC, LangGraph, and Voice AI.",
          section: "#skills"
        };
      }

      if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("whatsapp") || q.includes("hire")) {
        return {
          text: `Reach Ghulam directly at ${PORTFOLIO_KNOWLEDGE.email} or WhatsApp ${PORTFOLIO_KNOWLEDGE.whatsapp}. LinkedIn and GitHub links are in the Contact section.`,
          section: "#contact"
        };
      }

      return {
        text: "Ghulam Ghaus is a Software Engineer with 4+ years building 15+ production web, desktop, mobile, SaaS, and Voice/Agentic AI systems using Node.js, Ruby on Rails, Python, TypeScript, and React/Next.js. Ask about Rails, JobAgent AI, Desktop/Mobile, or Relocation!"
      };
    }

    speakText(text) {
      if (!this.synthesis) return;
      if (this.synthesis.speaking) this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      const voices = this.synthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google"))
      );
      if (preferred) utterance.voice = preferred;
      this.synthesis.speak(utterance);
    }

    appendMessage(sender, text) {
      if (!this.transcriptContainer) return;
      const msgDiv = document.createElement("div");
      msgDiv.className = `chat-message ${sender}-message`;
      if (sender === "user") {
        msgDiv.innerHTML = `<div class="chat-sender text-end">You</div><div>${escapeHtml(text)}</div>`;
      } else {
        msgDiv.innerHTML = `<div class="chat-sender"><i class="bi bi-shield-check me-1"></i> Grounded CV Assistant</div><div>${escapeHtml(text)}</div>`;
      }
      this.transcriptContainer.appendChild(msgDiv);
      this.transcriptContainer.scrollTop = this.transcriptContainer.scrollHeight;
    }

    openBookingModal() {
      if (this.bookingModal && typeof bootstrap !== "undefined") {
        bootstrap.Modal.getOrCreateInstance(this.bookingModal).show();
      }
    }

    processCalendarBooking() {
      const name = document.getElementById("booking-name")?.value.trim() || "Guest";
      const email = document.getElementById("booking-email")?.value.trim() || "";
      const datetimeVal = document.getElementById("booking-datetime")?.value;
      const topic = document.getElementById("booking-topic")?.value.trim() || "Software Engineering Interview";

      if (!datetimeVal) return;

      const startDate = new Date(datetimeVal);
      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
      const formatCal = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const startStr = formatCal(startDate);
      const endStr = formatCal(endDate);

      const googleCalUrl =
        `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(`Intro Call: ${name} x Ghulam Ghaus (${topic})`)}` +
        `&dates=${startStr}/${endStr}` +
        `&details=${encodeURIComponent(`Recruiter / Client: ${name}\nEmail: ${email}\nTopic: ${topic}`)}` +
        `&add=${encodeURIComponent(PORTFOLIO_KNOWLEDGE.email)}`;

      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Ghulam Ghaus Portfolio//EN",
        "BEGIN:VEVENT",
        `SUMMARY:Intro Call with Ghulam Ghaus (${topic})`,
        `DESCRIPTION:Name: ${name}\\nEmail: ${email}\\nTopic: ${topic}`,
        `DTSTART:${startStr}`,
        `DTEND:${endStr}`,
        "LOCATION:Online / Google Meet",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "call-with-ghulam-ghaus.ics");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      window.open(googleCalUrl, "_blank", "noopener");

      if (typeof bootstrap !== "undefined" && this.bookingModal) {
        bootstrap.Modal.getOrCreateInstance(this.bookingModal).hide();
      }

      this.openDrawer();
      this.appendMessage(
        "assistant",
        `Calendar invite (.ics) downloaded and Google Calendar opened for ${startDate.toLocaleString()} with ${PORTFOLIO_KNOWLEDGE.email}.`
      );
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.voiceAssistant = new GroundedAssistantEngine();
  });
})();
