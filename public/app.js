/* Portfolio front-end: avatar fallback, scroll reveal, and the AI chat client. */

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- avatar falls back to initials ---------- */

const avatar = document.getElementById("avatar");
avatar.addEventListener("error", () => {
  const fallback = document.createElement("div");
  fallback.className = "avatar avatar-fallback";
  fallback.textContent = "SD";
  fallback.setAttribute("aria-label", "Sohan Dogra");
  avatar.replaceWith(fallback);
});

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

/* ---------- floating widget open / close ---------- */

const widget = document.querySelector(".widget");
const panel = document.getElementById("chat-panel");
const launcher = document.getElementById("chat-launcher");
const closeBtn = document.getElementById("chat-close");

function setOpen(open) {
  widget.classList.toggle("open", open);
  panel.hidden = !open;
  launcher.setAttribute("aria-expanded", String(open));
  if (open) {
    document.getElementById("chat-input").focus();
  } else {
    launcher.focus();
  }
}

launcher.addEventListener("click", () => setOpen(panel.hidden));
closeBtn.addEventListener("click", () => setOpen(false));

// "Ask Sohan's AI" in the hero and nav open the widget rather than jumping.
document.querySelectorAll("[data-open-chat]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    setOpen(true);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !panel.hidden) setOpen(false);
});

/* ---------- AI chat ---------- */

const log = document.getElementById("chat-log");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const send = document.getElementById("chat-send");
const quick = document.getElementById("quick");
const modeBtn = document.getElementById("mode-toggle");

let mode = "assistant";
let history = [];
let busy = false;

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
  input.disabled = state;
  // Don't touch textContent here — the send button holds an inline SVG icon.
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
    addMessage(
      "bot",
      "Couldn't reach the assistant. Sohan's experience and projects are all on the page below."
    );
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
  if (interviewing) {
    addMessage(
      "bot",
      "Interview mode. I'll ask you one DevOps question at a time and give you feedback on each answer. Say 'start' when you're ready, or name an area — AWS, Kubernetes, Terraform, CI/CD, observability, security."
    );
  } else {
    addMessage(
      "bot",
      "Back to Q&A. Ask me anything about Sohan's experience, the platforms he's run, or how he approaches infrastructure."
    );
  }
});

/* ---------- project enquiry form ---------- */

const enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {
  const status = document.getElementById("enquiry-status");
  const submit = document.getElementById("enquiry-send");

  function clearErrors() {
    enquiryForm.querySelectorAll(".err").forEach((el) => (el.textContent = ""));
    enquiryForm.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  }

  function showFieldErrors(fields) {
    for (const [name, msg] of Object.entries(fields || {})) {
      const err = enquiryForm.querySelector(`[data-err="${name}"]`);
      const input = enquiryForm.querySelector(`[name="${name}"]`);
      if (err) err.textContent = msg;
      if (input) input.classList.add("invalid");
    }
    const first = enquiryForm.querySelector(".invalid");
    if (first) first.focus();
  }

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
        : "Thanks — your enquiry has been received and I'll reply personally within a couple of working days.";
    } catch {
      status.className = "form-status bad";
      status.textContent =
        "Couldn't reach the server. Please email sohandogra703@gmail.com directly.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Send enquiry";
    }
  });
}
