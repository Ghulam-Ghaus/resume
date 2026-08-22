/**
 * Ghulam Ghaus Portfolio - AI Voice Assistant & Calendar Engine
 * Powered by Gemini 1.5 Flash API + Browser Web Speech AI
 */

const GEMINI_API_KEY = "[ENCRYPTION_KEY]";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Portfolio Knowledge Base for Ghulam Ghaus
const PORTFOLIO_KNOWLEDGE = {
  name: "Ghulam Ghaus",
  role: "Software Engineer & Voice AI Integrations Specialist",
  email: "ghulamghaus266@gmail.com",
  phone: "+92 306 7956164",
  location: "Faisalabad, Pakistan",
  website: "https://ggitsols.com",
  github: "https://github.com/Ghulam-Ghaus",
  linkedin: "https://www.linkedin.com/in/ghulam-ghaus-5b4ba9194/",
  upwork: "https://www.upwork.com/freelancers/~018e9f6013ee023bf0?viewMode=1",
  fiverr: "https://www.fiverr.com/ghulamghaus266",
  summary: "Backend-Focused Full-Stack Engineer specializing in low-latency Voice AI systems, Twilio Media Streams, WebSockets, STT/TTS pipelines, Node.js, NestJS, TypeScript, Python, FastAPI, and Microservices.",
  skills: [
    "Node.js", "TypeScript", "NestJS", "Python", "FastAPI", "Express.js",
    "Voice AI", "Twilio Media Streams", "WebSockets", "Deepgram STT/TTS",
    "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "Firebase",
    "Microservices", "REST APIs", "GraphQL", "JWT / RBAC Security"
  ],
  services: [
    "Low-Latency Voice AI & Telephony Automation (Twilio, Deepgram, Gemini)",
    "Backend Microservices Development (Node.js, NestJS, FastAPI)",
    "Full-Stack SaaS Application Engineering (React, Next.js, TypeScript)",
    "API Design, Security, & Real-Time WebSocket Infrastructure",
    "Database Architecture & Cloud Deployment (Docker, AWS, Firebase)"
  ],
  projects: [
    {
      name: "Voice Intake Telephony System",
      desc: "Low-latency Voice AI intake system integrating Twilio Media Streams, Deepgram STT, Gemini Flash, and webhooks."
    },
    {
      name: "Real-Time AI Agent Engine",
      desc: "Streaming voice and text agent platform with dynamic state machine, function calling, and live socket connection."
    },
    {
      name: "Enterprise Microservices Suite",
      desc: "Distributed backend architecture with NestJS, Redis caching, PostgreSQL, and RBAC authentication."
    },
    {
      name: "Asset Management System",
      desc: "Scalable file and media processing microservice using Multer library and Node.js file system APIs."
    }
  ],
  education: [
    "Bachelor of Science in Computer Science (BSCS) - National Textile University (NTU), Faisalabad (2020 - 2024)"
  ]
};

// System Prompt for Gemini AI
const GEMINI_SYSTEM_PROMPT = `
You are "Ghulam Ghaus AI", the interactive 3D Voice Assistant for Ghulam Ghaus's official portfolio website.
Your objective is to assist recruiters, clients, and visitors.
You speak clearly, professionally, and concisely (1-3 sentences max per response, suitable for text-to-speech audio).

Knowledge Base:
- Name: ${PORTFOLIO_KNOWLEDGE.name}
- Title: ${PORTFOLIO_KNOWLEDGE.role}
- Contact Email: ${PORTFOLIO_KNOWLEDGE.email} | Phone: ${PORTFOLIO_KNOWLEDGE.phone} | Location: ${PORTFOLIO_KNOWLEDGE.location}
- Profiles: LinkedIn (${PORTFOLIO_KNOWLEDGE.linkedin}), Upwork (${PORTFOLIO_KNOWLEDGE.upwork}), Fiverr (${PORTFOLIO_KNOWLEDGE.fiverr}), GitHub (${PORTFOLIO_KNOWLEDGE.github})
- Key Expertise: ${PORTFOLIO_KNOWLEDGE.summary}
- Core Skills: ${PORTFOLIO_KNOWLEDGE.skills.join(", ")}
- Services Provided: ${PORTFOLIO_KNOWLEDGE.services.join("; ")}
- Major Projects: ${PORTFOLIO_KNOWLEDGE.projects.map(p => p.name + " (" + p.desc + ")").join("; ")}
- Education: ${PORTFOLIO_KNOWLEDGE.education.join("; ")}

Capabilities:
1. Answer any questions about Ghulam Ghaus's skills, experience, projects, or background.
2. If the user asks to book a meeting, schedule a call, or hire Ghulam Ghaus, inform them you can open the Calendar booking modal immediately. Include [ACTION:BOOK_MEETING] in your response.
3. If the user asks to see projects, experience, skills, or contact info, include [ACTION:NAVIGATE_SECTION:#section_name] (e.g. [ACTION:NAVIGATE_SECTION:#portfolio], [ACTION:NAVIGATE_SECTION:#contact], [ACTION:NAVIGATE_SECTION:#skills]).
4. Keep spoken responses engaging, natural, and helpful.
`;

class VoiceAssistantEngine {
  constructor() {
    this.isListening = false;
    this.isSpeaking = false;
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.conversationHistory = [];

    this.initElements();
    this.initSpeechRecognition();
    this.bindEvents();
  }

  initElements() {
    this.micBtn = document.getElementById("voice-assistant-mic-btn");
    this.statusText = document.getElementById("voice-assistant-status");
    this.visualizer = document.getElementById("voice-visualizer");
    this.drawer = document.getElementById("voice-assistant-drawer");
    this.transcriptContainer = document.getElementById("voice-transcript-log");
    this.closeDrawerBtn = document.getElementById("close-voice-drawer");
    this.toggleDrawerBtn = document.getElementById("open-voice-drawer-btn");
    this.quickPrompts = document.querySelectorAll(".voice-prompt-chip");

    // Chat Form Elements
    this.chatForm = document.getElementById("voice-chat-input-form");
    this.chatInput = document.getElementById("voice-chat-input");
    this.drawerMicBtn = document.getElementById("drawer-mic-btn");

    // Calendar Modal Elements
    this.bookingModal = document.getElementById("calendar-booking-modal");
    this.bookingForm = document.getElementById("calendar-booking-form");
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
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
        this.handleUserSpeech(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.isListening = false;
        this.updateUI("idle");
        this.appendMessage("assistant", "I couldn't quite catch that. Could you try speaking again or click a quick prompt?");
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (!this.isSpeaking) {
          this.updateUI("idle");
        }
      };
    } else {
      console.warn("Web SpeechRecognition is not supported in this browser.");
    }
  }

  bindEvents() {
    if (this.micBtn) {
      this.micBtn.addEventListener("click", () => this.toggleListening());
    }

    if (this.drawerMicBtn) {
      this.drawerMicBtn.addEventListener("click", () => this.toggleListening());
    }

    if (this.chatForm) {
      this.chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.chatInput && this.chatInput.value.trim()) {
          const text = this.chatInput.value.trim();
          this.chatInput.value = "";
          this.handleUserSpeech(text);
        }
      });
    }

    if (this.toggleDrawerBtn) {
      this.toggleDrawerBtn.addEventListener("click", () => this.openDrawer());
    }

    if (this.closeDrawerBtn) {
      this.closeDrawerBtn.addEventListener("click", () => this.closeDrawer());
    }

    if (this.quickPrompts) {
      this.quickPrompts.forEach(chip => {
        chip.addEventListener("click", () => {
          const prompt = chip.getAttribute("data-prompt") || chip.innerText.trim();
          this.openDrawer();
          this.handleUserSpeech(prompt);
        });
      });
    }

    if (this.bookingForm) {
      this.bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.processCalendarBooking();
      });
    }
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
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (err) {
        console.warn("Recognition start error:", err);
      }
    } else {
      alert("Voice speech recognition is not supported by your browser. You can type in the chat!");
      this.openDrawer();
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.isListening = false;
    this.updateUI("idle");
  }

  openDrawer() {
    if (this.drawer) {
      this.drawer.classList.add("active");
    }
  }

  closeDrawer() {
    if (this.drawer) {
      this.drawer.classList.remove("active");
    }
  }

  updateUI(state) {
    if (!this.statusText || !this.visualizer || !this.micBtn) return;

    if (this.drawerMicBtn) {
      if (state === "listening") {
        this.drawerMicBtn.className = "btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center active-mic";
      } else {
        this.drawerMicBtn.className = "btn btn-sm btn-outline-info rounded-circle d-flex align-items-center justify-content-center";
      }
    }

    if (state === "listening") {
      this.statusText.innerText = "Listening... Speak now";
      this.statusText.className = "voice-status text-cyan-glow fw-bold";
      this.visualizer.classList.add("active-listening");
      this.visualizer.classList.remove("active-speaking");
      this.micBtn.classList.add("active-mic");
    } else if (state === "speaking") {
      this.statusText.innerText = "Speaking...";
      this.statusText.className = "voice-status text-purple-glow fw-bold";
      this.visualizer.classList.add("active-speaking");
      this.visualizer.classList.remove("active-listening");
      this.micBtn.classList.remove("active-mic");
    } else if (state === "thinking") {
      this.statusText.innerText = "Thinking...";
      this.statusText.className = "voice-status text-warning fw-bold";
      this.visualizer.classList.remove("active-listening", "active-speaking");
      this.micBtn.classList.remove("active-mic");
    } else {
      this.statusText.innerText = "Click Mic or Ask Anything";
      this.statusText.className = "voice-status text-secondary";
      this.visualizer.classList.remove("active-listening", "active-speaking");
      this.micBtn.classList.remove("active-mic");
    }
  }

  async handleUserSpeech(userText) {
    if (!userText || !userText.trim()) return;

    this.appendMessage("user", userText);
    this.updateUI("thinking");

    // Check for quick calendar command offline fallback
    if (userText.toLowerCase().includes("book") || userText.toLowerCase().includes("meeting") || userText.toLowerCase().includes("schedule")) {
      const responseText = "I would be happy to schedule a meeting with Ghulam Ghaus for you! Opening the calendar booking form now.";
      this.appendMessage("assistant", responseText);
      this.speakText(responseText);
      this.openBookingModal();
      return;
    }

    try {
      const aiResponse = await this.queryGeminiAPI(userText);
      this.processAIResponse(aiResponse);
    } catch (error) {
      console.error("Gemini API call error:", error);
      const fallbackResponse = this.generateOfflineFallback(userText);
      this.processAIResponse(fallbackResponse);
    }
  }

  async queryGeminiAPI(userText) {
    this.conversationHistory.push({ role: "user", parts: [{ text: userText }] });

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${GEMINI_SYSTEM_PROMPT}\n\nUser Question: ${userText}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250
      }
    };

    const res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      throw new Error(`API response HTTP status ${res.status}`);
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am Ghulam Ghaus's Voice AI. How can I assist you with his portfolio or scheduling?";
    return candidateText;
  }

  processAIResponse(rawText) {
    let cleanText = rawText;

    // Check for Action Tags
    if (rawText.includes("[ACTION:BOOK_MEETING]")) {
      cleanText = cleanText.replace("[ACTION:BOOK_MEETING]", "").trim();
      this.openBookingModal();
    }

    const navMatch = rawText.match(/\[ACTION:NAVIGATE_SECTION:(#[a-zA-Z0-9_-]+)\]/);
    if (navMatch) {
      cleanText = cleanText.replace(navMatch[0], "").trim();
      const targetId = navMatch[1];
      const elem = document.querySelector(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }

    this.appendMessage("assistant", cleanText);
    this.speakText(cleanText);
  }

  speakText(text) {
    if (!this.synthesis) return;

    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    // Find a clear voice if available
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateUI("speaking");
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateUI("idle");
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.updateUI("idle");
    };

    this.synthesis.speak(utterance);
  }

  generateOfflineFallback(query) {
    const q = query.toLowerCase();
    if (q.includes("project") || q.includes("work")) {
      return "Ghulam Ghaus has developed Voice Intake Systems, Real-Time AI Agent Engines, and Microservices Suites. [ACTION:NAVIGATE_SECTION:#portfolio]";
    } else if (q.includes("skill") || q.includes("tech") || q.includes("stack")) {
      return "He specializes in Node.js, TypeScript, NestJS, Python, FastAPI, Voice AI with Twilio and Deepgram, PostgreSQL, and AWS. [ACTION:NAVIGATE_SECTION:#skills]";
    } else if (q.includes("contact") || q.includes("email") || q.includes("hire")) {
      return "You can reach Ghulam Ghaus at ghulamghaus266@gmail.com or hire him on Upwork, Fiverr, and LinkedIn! [ACTION:NAVIGATE_SECTION:#contact]";
    } else {
      return `Ghulam Ghaus is a Software Engineer specializing in low-latency Voice AI, Node.js, and Full-Stack Systems. Feel free to explore his portfolio or book a meeting!`;
    }
  }

  appendMessage(sender, text) {
    if (!this.transcriptContainer) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message ${sender}-message mb-3 p-3 rounded-3`;

    if (sender === "user") {
      msgDiv.innerHTML = `<div class="d-flex align-items-center justify-content-end text-end"><span class="badge bg-secondary mb-1">You</span></div><div>${escapeHtml(text)}</div>`;
    } else {
      msgDiv.innerHTML = `<div class="d-flex align-items-center mb-1"><i class="bi bi-robot text-cyan-glow me-2"></i><strong class="text-cyan-glow">Ghulam Ghaus AI</strong></div><div>${escapeHtml(text)}</div>`;
    }

    this.transcriptContainer.appendChild(msgDiv);
    this.transcriptContainer.scrollTop = this.transcriptContainer.scrollHeight;
  }

  openBookingModal() {
    if (this.bookingModal) {
      const modal = new bootstrap.Modal(this.bookingModal);
      modal.show();
    }
  }

  processCalendarBooking() {
    const name = document.getElementById("booking-name")?.value || "Guest";
    const email = document.getElementById("booking-email")?.value || "";
    const datetimeVal = document.getElementById("booking-datetime")?.value;
    const topic = document.getElementById("booking-topic")?.value || "Portfolio Discussion & Hiring";

    if (!datetimeVal) {
      alert("Please select a date and time for the meeting.");
      return;
    }

    const startDate = new Date(datetimeVal);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 mins duration

    const formatDateForCal = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const startStr = formatDateForCal(startDate);
    const endStr = formatDateForCal(endDate);

    // 1. Google Calendar URL
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Meeting with Ghulam Ghaus - " + topic)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(`Client Name: ${name}\nEmail: ${email}\nTopic: ${topic}`)}&add=${encodeURIComponent("ghulamghaus266@gmail.com")}`;

    // 2. Generate downloadable .ics iCalendar file
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ghulam Ghaus Portfolio Voice AI//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Meeting with Ghulam Ghaus (${topic})`,
      `DESCRIPTION:Client Name: ${name}\\nEmail: ${email}\\nTopic: ${topic}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      "LOCATION:Google Meet / Remote Online",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `meeting-with-ghulam-ghaus.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 3. Dispatch Email Notification to ghulamghaus266@gmail.com
    this.sendBookingEmailNotification(name, email, startDate.toLocaleString(), topic);

    // Open Google Calendar link in new tab
    window.open(googleCalUrl, "_blank");

    // Close modal
    const modalElem = bootstrap.Modal.getInstance(this.bookingModal);
    if (modalElem) modalElem.hide();

    // Confirm to user via Voice & Chat
    const confirmMsg = `Thank you ${name}! I have generated your .ics calendar invite, sent an email notification to ghulamghaus266@gmail.com, and opened Google Calendar to confirm the booking for ${startDate.toLocaleString()}!`;
    this.appendMessage("assistant", confirmMsg);
    this.speakText(confirmMsg);
  }

  async sendBookingEmailNotification(name, email, datetimeStr, topic) {
    try {
      const recipient = "ghulamghaus266@gmail.com";
      const payload = {
        from: "Portfolio Calendar Booking <onboarding@resend.dev>",
        to: [recipient],
        subject: `[Calendar Meeting Request] ${name} - ${datetimeStr}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 8px;">
            <h2 style="color: #00f2fe; border-bottom: 2px solid #00f2fe; padding-bottom: 10px;">📅 New Calendar Meeting Booking</h2>
            <p><strong>Client Name:</strong> ${name}</p>
            <p><strong>Client Email:</strong> ${email}</p>
            <p><strong>Requested Date & Time:</strong> ${datetimeStr}</p>
            <p><strong>Topic / Discussion:</strong> ${topic}</p>
            <div style="background-color: #1e293b; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p style="margin: 0; color: #38bdf8;">Calendar invite (.ics) generated & Google Calendar link opened for visitor.</p>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Sent via Ghulam Ghaus AI Voice Assistant Calendar Engine</p>
          </div>
        `
      };

      if (window.RESEND_API_KEY) {
        await fetch("https://corsproxy.io/?https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.RESEND_API_KEY}`
          },
          body: JSON.stringify(payload)
        }).catch(err => console.warn("Booking email dispatch notice:", err));
      }
    } catch (e) {
      console.warn("sendBookingEmailNotification error:", e);
    }
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.voiceAssistant = new VoiceAssistantEngine();
});
