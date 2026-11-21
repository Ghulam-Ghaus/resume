/**
 * Ghulam Ghaus Portfolio — Midnight Studio Interactive Controller
 */
(function () {
  "use strict";

  const PROJECT_CASE_STUDIES = {
    jobagent: {
      badge: "FLAGSHIP #1 · PUBLIC GITHUB",
      title: "JobAgent AI — Autonomous Career, RAG & VoIP Intelligence Platform",
      problem:
        "Generic AI job tools hallucinate candidate experience and blindly dispatch unreviewed messages. Built an auditable, zero-hallucination multi-agent system spanning real-time streaming, semantic RAG, VoIP telephony, and mandatory human sign-off.",
      arch: [
        "PostgreSQL 16 + pgvector (768-dim text-embedding-004) enforcing >= 0.55 cosine grounding threshold and strict 'Unknown' fallback.",
        "LangGraph State Graph orchestrating 7 user-scoped Zod LangChain tools with Express SSE token and tool-event streaming.",
        "FreeSWITCH 1.10 PBX bridged to a NestJS full-duplex TCP ESL server (port 8084) for sub-350ms conversational voice barge-in.",
        "Human-in-the-loop ApplyPack approval gates, BullMQ/Redis job queues, Chrome Extension Clipper, and LlmCall audit records."
      ],
      stack: [
        "NestJS 12",
        "Next.js 16",
        "React 19",
        "PostgreSQL + pgvector",
        "Prisma 7",
        "LangGraph",
        "FreeSWITCH VoIP",
        "BullMQ · Redis",
        "Docker"
      ],
      repo: "https://github.com/Ghulam-Ghaus/job-agent"
    },
    voice: {
      badge: "VOICE AI · PRODUCTION",
      title: "Real-Time Voice Intake Platform (Intakely AI)",
      problem:
        "Law firms miss high-intent callers outside business hours while rigid IVR trees introduce latency and caller drop-off.",
      arch: [
        "Engineered bidirectional audio streaming over Python WebSockets and Twilio Media Streams for sub-second conversational turns.",
        "Integrated Whisper STT and Cartesia TTS pipelines with real-time caller interruption handling and external appointment scheduling APIs.",
        "Delivered multi-tenant client workspace isolation backed by Supabase and containerized Docker deployments."
      ],
      stack: ["Python", "WebSockets", "Twilio Media Streams", "Whisper STT", "Cartesia TTS", "Supabase", "Docker"]
    },
    "haider-voice": {
      badge: "VOICE AI · TELEPHONY",
      title: "Haider Voice AI Agent",
      problem:
        "Needed a low-latency conversational voice agent capable of natural phone interactions, real-time transcription, and instant workflow triggers.",
      arch: [
        "Streamed live telephony audio via Twilio Media Streams into WebSocket handlers with Deepgram STT/TTS.",
        "Connected Gemini Flash reasoning for fast turn-taking, structured extraction, and automated action triggers.",
        "Designed resilient Node.js session orchestration handling call state and interruption recovery."
      ],
      stack: ["Twilio Media Streams", "Deepgram STT/TTS", "Gemini Flash", "WebSockets", "Node.js"]
    },
    "bakery-pos": {
      badge: "DESKTOP APP · ERP / POS",
      title: "Bakery POS & Retail Desktop ERP",
      problem:
        "Retail and bakery storefronts cannot halt checkout operations during internet outages and require fast local hardware peripheral support.",
      arch: [
        "Built an offline-first cross-platform desktop application using Electron.js and React 19 with NestJS service architecture.",
        "Used SQLite WAL mode for concurrent, zero-drop local transaction writes and reliable barcode/receipt printer integrations.",
        "Synchronized multi-shift sales, inventory, and accounting ledgers reliably across desktop sessions."
      ],
      stack: ["Electron.js", "React 19", "NestJS", "SQLite WAL", "TypeScript", "Node.js"]
    },
    "mobile-suite": {
      badge: "MOBILE APPS · iOS & ANDROID",
      title: "Cross-Platform Mobile Applications",
      problem:
        "Clients needed native-feeling iOS and Android applications delivered quickly from unified codebases with offline resilience and push alerts.",
      arch: [
        "Engineered cross-platform mobile apps with React Native, Flutter, and Expo targeting both iOS and Android.",
        "Integrated native device APIs, offline local caching, Firebase push notifications, and authenticated REST API sync.",
        "Managed end-to-end build signing and App Store / Google Play release pipelines."
      ],
      stack: ["React Native", "Flutter", "Expo", "Firebase", "REST APIs", "TypeScript"]
    },
    "rails-billing": {
      badge: "RUBY ON RAILS · SAAS API",
      title: "SaaS Subscription & Billing API Platform",
      problem:
        "Multi-tenant SaaS products require isolated workspace authorization, reliable recurring billing reconciliation, and resilient async webhooks.",
      arch: [
        "Architected a multi-tenant Ruby on Rails API managing organization workspaces, ActiveRecord scoping, and granular role permissions.",
        "Implemented idempotent Stripe recurring billing webhook ingestion processed asynchronously via Sidekiq + Redis queues.",
        "Backed critical billing state transitions with automated RSpec test suites and Docker containerization."
      ],
      stack: ["Ruby on Rails", "Ruby", "PostgreSQL", "Sidekiq", "Redis", "Stripe Webhooks", "RSpec", "Docker"]
    },
    hospital: {
      badge: "HEALTHCARE · SAUDI CLIENT",
      title: "Virtual Hospital System",
      problem:
        "Healthcare organization needed secure remote physician-patient consultations, electronic health records, and synchronized scheduling.",
      arch: [
        "Built modular Node.js & NestJS backend services backed by PostgreSQL for electronic records and appointment workflows.",
        "Enabled live virtual consultations via WebRTC paired with real-time clinical status notifications over WebSockets and Redis.",
        "Deployed on AWS with strict role-based separation for doctors, patients, and hospital administrators."
      ],
      stack: ["Node.js", "NestJS", "PostgreSQL", "WebSockets", "Redis", "WebRTC", "AWS"]
    },
    nutricare: {
      badge: "CLINICAL SAAS · AI DIET ENGINE",
      title: "NutriCare Clinical SaaS & AI Diet Engine",
      problem:
        "Nutrition clinics needed automated personalized dietary planning alongside high-concurrency patient tracking.",
      arch: [
        "Developed full-stack clinical SaaS with Next.js frontend and high-concurrency NestJS + PostgreSQL backend.",
        "Built an AI Diet Engine generating structured meal plans from patient clinical metrics and dietary constraints.",
        "Optimized API endpoints and database access for responsive concurrent clinic sessions."
      ],
      stack: ["Next.js", "NestJS", "PostgreSQL", "AI Diet Engine", "TypeScript"]
    },
    esports: {
      badge: "FULL-STACK · COMPETITIVE GAMING",
      title: "Arenyxa — Esports Event Management Platform",
      problem:
        "Competitive gaming organizers needed unified player registrations, squad rosters, payment processing, and live tournament brackets.",
      arch: [
        "Engineered Next.js and React UI styled with Tailwind CSS for real-time brackets across PUBG, Free Fire, and Call of Duty.",
        "Built Node.js and Express backend APIs with PostgreSQL modeling tournaments, squads, player profiles, and payment gateways.",
        "Delivered automated match progression and live event scoring views."
      ],
      stack: ["Next.js", "React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"]
    },
    sso: {
      badge: "SECURITY · SSO LEAD (HIVEWORX)",
      title: "Centralized Enterprise User Management & SSO Platform",
      problem:
        "Multiple enterprise products duplicated authentication and permission checks, increasing maintenance overhead and security drift.",
      arch: [
        "Led architecture and delivery of a centralized User Management & SSO platform shared across enterprise applications.",
        "Implemented OAuth2, JWT authentication, Devise/CanCanCan RBAC authorization, and real-time notifications via WebSockets and ActionCable.",
        "Formally recommended by HiveWorx in the official company experience letter."
      ],
      stack: ["Node.js", "Ruby on Rails", "OAuth2", "JWT", "Devise / CanCanCan", "RBAC", "ActionCable", "PostgreSQL"]
    },
    hero: {
      badge: "ENTERPRISE · RESOURCE & KPI OPTIMIZER",
      title: "Hive Enterprise Resource Optimizer (HERO)",
      problem:
        "Leadership needed unified visibility linking top-down organizational KPIs and bottom-up team capacity across monthly and yearly cycles.",
      arch: [
        "Built enterprise backend APIs using Node.js, NestJS, PostgreSQL, and TypeORM to track KPI hierarchies and team utilization.",
        "Powered real-time visual reporting dashboards enabling management to monitor resource allocation and target progress.",
        "Designed clean relational schemas supporting multi-level goal rollups."
      ],
      stack: ["Node.js", "NestJS", "React", "PostgreSQL", "TypeORM"]
    },
    "enterprise-suite": {
      badge: "MICROSERVICES · 4 SHIPPED SYSTEMS",
      title: "Hire Purchase (CSD) & Enterprise Microservices Suite",
      problem:
        "Enterprise operations required specialized microservices for asset storage, CSD hire-purchase agreements, maturity surveys, and regional payment/SMS gateways.",
      arch: [
        "Built CSD Hire Purchase Management System in NestJS & PostgreSQL for structured installment and agreement workflows.",
        "Engineered an Assets Management microservice using Multer and Node.js File System APIs serving multiple applications, plus an Organizational Maturity Assessment Tool (NestJS & Angular).",
        "Integrated Moyassar and Stripe payments, automated Puppeteer/Chromium PDF & Nodemailer workflows, and Yammama SMS notifications."
      ],
      stack: ["NestJS", "Node.js", "Angular", "PostgreSQL", "Moyassar", "Stripe", "Puppeteer", "Multer"]
    }
  };

  function showToast(msg) {
    const toast = document.getElementById("portfolio-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(window.__portfolioToastTimer);
    window.__portfolioToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }
  window.showPortfolioToast = showToast;

  // Sticky Header Scroll Elevation & Active Scrollspy
  const header = document.getElementById("header");
  const navLinks = [...document.querySelectorAll("#navbar .scrollto")];

  function handleScroll() {
    if (header) {
      header.classList.toggle("header-scrolled", window.scrollY > 36);
    }
    const pos = window.scrollY + 180;
    navLinks.forEach((link) => {
      if (!link.hash) return;
      const target = document.querySelector(link.hash);
      if (!target) return;
      const inView = pos >= target.offsetTop && pos <= target.offsetTop + target.offsetHeight;
      link.classList.toggle("active", inView);
    });
  }

  window.addEventListener("load", handleScroll);
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Mobile Nav Toggle + Backdrop & Escape Close
  const mobileToggle = document.querySelector(".mobile-nav-toggle");
  const mobileBackdrop = document.getElementById("mobile-nav-backdrop");

  function closeMobileNav() {
    document.body.classList.remove("mobile-nav-active");
    if (mobileToggle) {
      mobileToggle.classList.add("bi-list");
      mobileToggle.classList.remove("bi-x");
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      const willOpen = !document.body.classList.contains("mobile-nav-active");
      document.body.classList.toggle("mobile-nav-active", willOpen);
      this.classList.toggle("bi-list", !willOpen);
      this.classList.toggle("bi-x", willOpen);
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", closeMobileNav);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("mobile-nav-active")) {
      closeMobileNav();
    }
  });

  document.querySelectorAll(".mobile-nav-actions a").forEach((el) => {
    el.addEventListener("click", closeMobileNav);
  });

  // Smooth Anchor Navigation
  document.querySelectorAll(".scrollto").forEach((el) => {
    el.addEventListener("click", function (e) {
      if (!this.hash) return;
      const target = document.querySelector(this.hash);
      if (!target) return;
      e.preventDefault();

      if (document.body.classList.contains("mobile-nav-active")) {
        closeMobileNav();
      }

      const offset = header ? header.offsetHeight : 0;
      window.scrollTo({
        top: Math.max(0, target.offsetTop - offset),
        behavior: "smooth"
      });
    });
  });

  // 1-Click Copy Email Buttons
  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.getAttribute("data-copy-email") || "ghulamghaus266@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Copied ${email} to clipboard`);
      } catch (_err) {
        showToast(`Email: ${email}`);
      }
    });
  });

  // Project Category Filtering
  const filterButtons = document.querySelectorAll("#project-filters .filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectItems.forEach((item) => {
        const cats = (item.getAttribute("data-cat") || "").split(/\s+/);
        const visible = filter === "all" || cats.includes(filter);
        item.classList.toggle("d-none", !visible);
      });
    });
  });

  // Project Case Study Modal
  const caseModalEl = document.getElementById("project-case-modal");
  document.querySelectorAll("[data-project]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const key = trigger.getAttribute("data-project");
      const data = PROJECT_CASE_STUDIES[key];
      if (!data || !caseModalEl || typeof bootstrap === "undefined") return;

      document.getElementById("case-modal-badge").textContent = data.badge;
      document.getElementById("caseModalLabel").textContent = data.title;
      document.getElementById("case-modal-problem").textContent = data.problem;

      const archList = document.getElementById("case-modal-arch");
      archList.innerHTML = "";
      data.arch.forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        archList.appendChild(li);
      });

      const stackWrap = document.getElementById("case-modal-stack");
      stackWrap.innerHTML = "";
      data.stack.forEach((tech) => {
        const span = document.createElement("span");
        span.className = "tech-tag";
        span.textContent = tech;
        stackWrap.appendChild(span);
      });

      const repoLink = document.getElementById("case-modal-repo");
      if (data.repo) {
        repoLink.href = data.repo;
        repoLink.classList.remove("d-none");
      } else {
        repoLink.classList.add("d-none");
      }

      bootstrap.Modal.getOrCreateInstance(caseModalEl).show();
    });
  });
})();
