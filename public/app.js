/* Shared front-end for every page: AI widget, nav state, reveal, forms. */

/* ---------- footer year ---------- */

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- mark the current page in the nav ---------- */

(() => {
  const here = location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll("nav .wrap ul a").forEach((a) => {
    const target = new URL(a.getAttribute("href"), location.origin).pathname;
    if (target === here || (target !== "/" && here.startsWith(target))) {
      a.setAttribute("aria-current", "page");
    }
  });
})();

/* ---------- avatar falls back to initials (home page only) ---------- */

const avatar = document.getElementById("avatar");
if (avatar) {
  avatar.addEventListener("error", () => {
    const fallback = document.createElement("div");
    fallback.className = "avatar avatar-fallback";
    fallback.textContent = "SD";
    fallback.setAttribute("aria-label", "Sohan Dogra");
    avatar.replaceWith(fallback);
  });
}

/* ---------- scroll reveal ---------- */

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: "0px 0px -60px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---------- mobile nav ---------- */

const navToggle = document.getElementById("nav-toggle");
const navList = document.getElementById("nav-list");
if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const open = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navList.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* ================= AI assistant widget =================
   Injected here rather than duplicated into every page's HTML. */

const BOT_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1.4"/>
  <path d="M9 13v1.5M15 13v1.5"/><path d="M1.5 13v3M22.5 13v3"/></svg>`;

const CLOSE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`;

const widget = document.createElement("div");
widget.className = "widget";
widget.innerHTML = `
  <div class="chat-panel" id="chat-panel" hidden>
    <div class="chat-head">
      <div class="chat-id">
        <span class="bot-avatar" aria-hidden="true">${BOT_SVG}</span>
        <div><b>Ask Sohan's AI</b><span>Answers only from documented experience</span></div>
      </div>
      <div class="chat-actions">
        <button type="button" id="mode-toggle" class="mode-btn" aria-pressed="false">Interview me</button>
        <button type="button" id="chat-close" class="icon-btn" aria-label="Close assistant">${CLOSE_SVG}</button>
      </div>
    </div>
    <div class="chat-log" id="chat-log" role="log" aria-live="polite" aria-label="Conversation">
      <div class="msg bot"><p>Ask me about Sohan's experience, the platforms he's run, or how he approaches infrastructure. Or hit Interview me and I'll ask you DevOps questions instead.</p></div>
    </div>
    <div class="quick" id="quick">
      <button type="button">30-second summary</button>
      <button type="button">AWS experience?</button>
      <button type="button">Kubernetes work?</button>
      <button type="button">CI/CD tools?</button>
      <button type="button">Why interview Sohan?</button>
    </div>
    <form class="chat-form" id="chat-form">
      <label for="chat-input" class="sr-only">Your question</label>
      <input id="chat-input" type="text" autocomplete="off" maxlength="600" placeholder="Ask anything…">
      <button type="submit" id="chat-send" aria-label="Send">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      </button>
    </form>
  </div>
  <button id="chat-launcher" class="launcher" aria-expanded="false" aria-controls="chat-panel">
    <span class="launcher-ico" aria-hidden="true">
      <span class="ico-bot">${BOT_SVG}</span><span class="ico-close">${CLOSE_SVG}</span>
    </span>
    <span class="launcher-label">Ask Sohan's AI</span>
  </button>`;
document.body.appendChild(widget);

const panel = document.getElementById("chat-panel");
const launcher = document.getElementById("chat-launcher");
const log = document.getElementById("chat-log");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const send = document.getElementById("chat-send");
const quick = document.getElementById("quick");
const modeBtn = document.getElementById("mode-toggle");

let mode = "assistant";
let history = [];
let busy = false;

function setOpen(open) {
  widget.classList.toggle("open", open);
  panel.hidden = !open;
  launcher.setAttribute("aria-expanded", String(open));
  if (open) input.focus();
  else launcher.focus();
}

launcher.addEventListener("click", () => setOpen(panel.hidden));
document.getElementById("chat-close").addEventListener("click", () => setOpen(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !panel.hidden) setOpen(false);
});
document.querySelectorAll("[data-open-chat]").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    setOpen(true);
  })
);

function addMessage(role, text) {
  const el = document.createElement("div");
  el.className = `msg ${role === "user" ? "user" : "bot"}`;
  const p = document.createElement("p");
  p.textContent = text; // textContent, never innerHTML — model output is untrusted
  el.appendChild(p);
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}

function addThinking() {
  const el = document.createElement("div");
  el.className = "msg bot thinking";
  el.innerHTML = "<p><span></span><span></span><span></span></p>";
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}

function setBusy(state) {
  busy = state;
  send.disabled = state;
  input.disabled = state; // no textContent here — the button holds an SVG
}

async function ask(question) {
  if (busy || !question.trim()) return;

  addMessage("user", question);
  input.value = "";
  setBusy(true);
  const thinking = addThinking();

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question, mode, history }),
    });
    const data = await res.json();
    thinking.remove();

    if (!res.ok) {
      addMessage("bot", data.error || "Something went wrong. Try again in a moment.");
      return;
    }

    addMessage("bot", data.answer);
    history.push({ role: "user", content: question });
    history.push({ role: "assistant", content: data.answer });
    history = history.slice(-12);
  } catch {
    thinking.remove();
    addMessage("bot", "Couldn't reach the assistant. Sohan's experience is all on the site.");
  } finally {
    setBusy(false);
    input.focus();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  ask(input.value);
});

quick.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) ask(btn.textContent.trim());
});

modeBtn.addEventListener("click", () => {
  mode = mode === "assistant" ? "interview" : "assistant";
  history = [];

  const interviewing = mode === "interview";
  modeBtn.textContent = interviewing ? "Back to Q&A" : "Interview me";
  modeBtn.setAttribute("aria-pressed", String(interviewing));
  quick.hidden = interviewing;

  log.innerHTML = "";
  addMessage(
    "bot",
    interviewing
      ? "Interview mode. I'll ask you one DevOps question at a time and give feedback on each answer. Say 'start' when ready, or name an area — AWS, Kubernetes, Terraform, CI/CD, observability, security."
      : "Back to Q&A. Ask me anything about Sohan's experience or how he approaches infrastructure."
  );
});

/* ================= project enquiry form (contact page) ================= */

const enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {
  const status = document.getElementById("enquiry-status");
  const submit = document.getElementById("enquiry-send");

  const clearErrors = () => {
    enquiryForm.querySelectorAll(".err").forEach((el) => (el.textContent = ""));
    enquiryForm.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  };

  const showFieldErrors = (fields) => {
    for (const [name, msg] of Object.entries(fields || {})) {
      const err = enquiryForm.querySelector(`[data-err="${name}"]`);
      const field = enquiryForm.querySelector(`[name="${name}"]`);
      if (err) err.textContent = msg;
      if (field) field.classList.add("invalid");
    }
    const first = enquiryForm.querySelector(".invalid");
    if (first) first.focus();
  };

  enquiryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    status.className = "form-status";
    status.textContent = "";

    const data = Object.fromEntries(new FormData(enquiryForm).entries());
    submit.disabled = true;
    submit.textContent = "Sending…";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const out = await res.json();

      if (!res.ok) {
        status.className = "form-status bad";
        status.textContent = out.error || "Something went wrong. Please try again.";
        if (out.fields) showFieldErrors(out.fields);
        return;
      }

      enquiryForm.classList.add("sent");
      status.className = "form-status ok";
      // Only promise a confirmation email when one actually went out.
      status.textContent = out.emailed
        ? "Thanks — your enquiry has been received. A confirmation is on its way to your inbox, and I'll reply personally within a couple of working days."
        : "Thanks — your enquiry has been received. I'll reply personally within a couple of working days.";
    } catch {
      status.className = "form-status bad";
      status.textContent = "Couldn't reach the server. Please email sohandogra703@gmail.com directly.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Send enquiry";
    }
  });
}

/* ============================ diagram decks ============================ */

/**
 * Architecture slide decks on the projects page.
 *
 * Slides are plain markup with `hidden` on all but the first, so if this never
 * runs the reader still sees one complete diagram rather than a broken widget.
 * Arrow keys work when the deck has focus; a horizontal swipe works on touch.
 */
document.querySelectorAll("[data-carousel]").forEach((deck) => {
  const slides = [...deck.querySelectorAll(".slide")];
  if (slides.length < 2) return;

  const dots = [...deck.querySelectorAll(".c-dot")];
  const count = deck.querySelector(".c-count b");
  let at = 0;

  function show(next) {
    at = (next + slides.length) % slides.length;
    slides.forEach((s, i) => (s.hidden = i !== at));
    dots.forEach((d, i) => d.classList.toggle("on", i === at));
    if (count) count.textContent = String(at + 1);
  }

  deck.querySelector(".c-prev").addEventListener("click", () => show(at - 1));
  deck.querySelector(".c-next").addEventListener("click", () => show(at + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => show(i)));

  deck.tabIndex = 0;
  deck.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { show(at - 1); e.preventDefault(); }
    if (e.key === "ArrowRight") { show(at + 1); e.preventDefault(); }
  });

  // Swipe. Wide diagrams scroll horizontally inside .slide-art, so only treat a
  // gesture as a swipe when it is clearly horizontal and started outside that
  // scroller — otherwise panning a diagram would flip the slide out from under
  // the reader's finger.
  let x0 = null;
  let y0 = null;
  let fromArt = false;

  deck.addEventListener(
    "touchstart",
    (e) => {
      const t = e.changedTouches[0];
      x0 = t.clientX;
      y0 = t.clientY;
      fromArt = !!e.target.closest(".slide-art");
    },
    { passive: true }
  );

  deck.addEventListener(
    "touchend",
    (e) => {
      if (x0 === null || fromArt) { x0 = null; return; }
      const t = e.changedTouches[0];
      const dx = t.clientX - x0;
      const dy = t.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) show(at + (dx < 0 ? 1 : -1));
    },
    { passive: true }
  );

  show(0);
});
