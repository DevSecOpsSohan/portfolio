/**
 * Static page generator.
 *
 * The site is multi-page now, and the nav/head/footer shell must stay identical
 * across every page. Hand-syncing five copies invites drift, so the shell lives
 * here once and each page contributes only its own content.
 *
 * Run:  node tools/build-pages.mjs
 * Then: npx wrangler deploy
 *
 * Edit pages HERE, not in public/*.html — those are generated and overwritten.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://portfolio.sohandogra703.workers.dev";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/experience/", label: "Experience" },
  { href: "/blog/", label: "Writing" },
  { href: "/projects/", label: "Projects" },
  { href: "/contact/", label: "Contact" },
];

const FAVICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>" +
  "<rect width='100' height='100' rx='22' fill='%230a0b0d'/>" +
  "<text x='50' y='70' font-family='system-ui,sans-serif' font-size='54' font-weight='700' " +
  "fill='%234ade80' text-anchor='middle'>SD</text></svg>";

function layout({ path, title, description, body }) {
  const nav = NAV.map(
    (n) => `        <li><a href="${n.href}">${n.label}</a></li>`
  ).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="${path === "/" ? "profile" : "website"}">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${SITE}/avatar.jpg">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#0a0b0d">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body>

<a href="#main" class="skip">Skip to content</a>

<nav>
  <div class="wrap">
    <a href="/" class="brand">Sohan Dogra</a>
    <button id="nav-toggle" class="nav-toggle" aria-expanded="false" aria-controls="nav-list" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <ul id="nav-list">
${nav}
    </ul>
  </div>
</nav>

<div class="wrap">
<main id="main">
${body}
</main>

  <footer>
    <span>&copy; <span id="year">2026</span> Sohan Dogra · AWS · Kubernetes · Terraform · CI/CD</span>
    <span><a href="https://github.com/DevSecOpsSohan/portfolio">Source on GitHub</a></span>
  </footer>
</div>

<script src="/app.js" defer></script>
</body>
</html>
`;
}

/* ============================ shared fragments ============================ */

const SKILLS = [
  ["GitLab Platform", ["CI/CD architecture", "Runner fleet tuning", "Reusable templates", "Approval gates", "Secrets handling"]],
  ["Cloud &amp; Governance", ["AWS", "EKS", "GCP / GKE", "Control Tower", "SCPs", "IAM Identity Center"]],
  ["Infrastructure as Code", ["Terraform", "Ansible", "Helm", "Molecule"]],
  ["Kubernetes &amp; GitOps", ["Argo CD", "App-of-Apps", "Istio", "Canary delivery", "Docker"]],
  ["Security &amp; DevSecOps", ["SAST / DAST", "Trivy", "Gitleaks", "SonarQube", "OWASP ZAP", "MobSF"]],
  ["Observability &amp; Languages", ["Prometheus", "Grafana", "ELK", "Python", "Bash", "Linux"]],
];

const skillsGrid = `    <div class="skills">
${SKILLS.map(
  ([name, tags]) => `      <div class="sk">
        <h3>${name}</h3>
        <div class="tags">${tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>`
).join("\n")}
    </div>`;

const PRINCIPLES = [
  ["Infrastructure as Code", "If it was clicked in a console, it will drift. Terraform modules and Ansible roles with real test coverage, applied through pipelines rather than laptops."],
  ["Security by default", "Scanning belongs in the shared pipeline stage every team already consumes, not in a checklist someone remembers. It runs on every commit or it does not run."],
  ["GitOps", "Git is the desired state. Promotion between environments should be a declaration, not a runbook — which also makes rollback a revert."],
  ["Reversible rollouts", "Canary and progressive delivery exist so production changes have a middle state. An upgrade plan without a rollback plan is not a plan."],
  ["Observability before incidents", "Dashboards and alerting for pipeline and platform health, so failure trends are visible before someone escalates them."],
  ["Self-service over tickets", "The platform team should not sit in the path of every deployment. Reusable templates and App-of-Apps let product teams move without waiting."],
];

const principlesGrid = `    <div class="skills">
${PRINCIPLES.map(
  ([t, b]) => `      <div class="sk"><h3>${t}</h3><p>${b}</p></div>`
).join("\n")}
    </div>`;

/* ================================= pages ================================= */

const pages = [];

/* ---------------------------------- home --------------------------------- */

pages.push({
  path: "/",
  file: "public/index.html",
  title: "Sohan Dogra | Platform &amp; DevOps Engineer | AWS · Kubernetes · GitLab CI/CD",
  description:
    "Platform and DevOps engineer with 4+ years running production GitLab CI/CD, AWS, Kubernetes and Argo CD GitOps at Publicis Sapient, Deutsche Telekom Digital Labs and OpsTree. AWS SAA and CKA certified.",
  body: `  <header>
    <span class="badge"><span class="dot"></span> Open to remote · Immediate joiner</span>

    <div class="id-row">
      <img src="/avatar.jpg" alt="Sohan Dogra" class="avatar" id="avatar" width="116" height="116">
      <div>
        <h1>Sohan Dogra</h1>
        <p class="role">Platform &amp; DevOps Engineer</p>
        <p class="loc">Faridabad, India</p>
      </div>
    </div>

    <p class="summary">
      I build reliable cloud infrastructure, automate delivery, and run production
      Kubernetes platforms. Four years of GitLab CI/CD at scale — runner fleets tuned
      at the OS level, reusable pipeline templates other teams build on, and security
      gates that run on every commit. Hands-on with AWS, EKS, Terraform and Argo CD
      GitOps, including production cluster upgrades and multi-account governance.
    </p>

    <div class="badges" aria-label="Core technologies">
      <span class="tag">AWS</span><span class="tag">Kubernetes</span><span class="tag">EKS</span>
      <span class="tag">Terraform</span><span class="tag">GitLab CI/CD</span><span class="tag">Argo CD</span>
      <span class="tag">Istio</span><span class="tag">Helm</span><span class="tag">Prometheus</span>
    </div>

    <nav class="links" aria-label="Primary">
      <a href="/experience/" class="primary">Explore my engineering</a>
      <a href="/Sohan_Dogra_Resume.pdf">Download résumé</a>
      <a href="/contact/">Get in touch</a>
    </nav>

    <div class="stats">
      <div class="stat"><b>4+</b><span>Years in platform &amp; DevOps</span></div>
      <div class="stat"><b>30%</b><span>Cloud spend reduced</span></div>
      <div class="stat"><b>2</b><span>Active certifications</span></div>
      <div class="stat"><b>~25h</b><span>Audit hours saved monthly</span></div>
    </div>
  </header>

  <section class="reveal">
    <h2>Delivery pipeline I run</h2>
    <p class="lede">Commit to production, with the gates that run on the way.</p>
    <div class="flow-scroll">
      <ol class="flow">
        <li><b>Git</b><span>Desired state</span></li>
        <li><b>GitLab CI</b><span>Build · test</span></li>
        <li><b>Security gates</b><span>SAST · Gitleaks · Trivy</span></li>
        <li><b>Registry</b><span>Signed images</span></li>
        <li><b>Argo CD</b><span>App-of-Apps sync</span></li>
        <li><b>EKS</b><span>Istio canary</span></li>
        <li><b>Observability</b><span>Prometheus · Grafana</span></li>
      </ol>
    </div>
    <p class="note">Rollback is a git revert — the same path in reverse, not a separate runbook.</p>
  </section>

  <section class="reveal">
    <h2>How I engineer</h2>
${principlesGrid}
  </section>

  <section class="reveal">
    <h2>Explore</h2>
    <div class="cards">
      <a class="card" href="/experience/">
        <b>Experience &amp; case studies</b>
        <span>Three roles, four pieces of production work as problem → approach → outcome.</span>
      </a>
      <a class="card" href="/blog/">
        <b>Writing</b>
        <span>Published articles on Kubernetes scheduling, cert-manager, Argo CD and Prometheus.</span>
      </a>
      <a class="card" href="/projects/">
        <b>Projects</b>
        <span>Things built outside work, including the AI assistant on this site.</span>
      </a>
      <a class="card" href="/contact/">
        <b>Contact</b>
        <span>Start a project enquiry, or just say hello.</span>
      </a>
    </div>
  </section>`,
});

/* ------------------------------- experience ------------------------------ */

const JOBS = [
  {
    current: true,
    role: "Senior Associate — Infrastructure, Platform Engineering",
    co: "Publicis Sapient · Gurgaon",
    when: "Sep 2025 – Present",
    points: [
      "Own GitOps delivery for backend services on Argo CD, standardising promotion across environments and removing manual per-environment configuration for client-facing platforms.",
      "Authored reusable Helm charts and an App-of-Apps architecture so product teams onboard services self-service — cutting config drift and platform-team ticket load.",
      "Built a DevSecOps CI pipeline with SAST, Gitleaks and Trivy as shared reusable stages, shifting source, secret and container scanning left across every consuming repo.",
      "Escalation point and SME for deployment failures, Helm templating and Argo CD sync errors across application and platform teams.",
    ],
    tags: ["Argo CD", "Helm", "Kubernetes", "Trivy", "Gitleaks"],
  },
  {
    role: "DevOps Engineer — GitLab CI/CD &amp; Kubernetes Platform",
    co: "Deutsche Telekom Digital Labs · Gurgaon",
    when: "Dec 2024 – Sep 2025",
    points: [
      "Administered and tuned the GitLab Runner fleet at the Linux OS level, resolving contention and resource bottlenecks to materially improve pipeline throughput across shared CI capacity.",
      "Planned and executed production Amazon EKS upgrades with minimal downtime — owning workload validation, rollback readiness and service-availability verification end to end.",
      "Implemented Istio service mesh with Argo CD canary deployments for progressive delivery, traffic shaping and rapid rollback on production microservices.",
      "Led RabbitMQ and Apache NiFi production upgrades with zero-to-minimal downtime, protecting business-critical integration services.",
    ],
    tags: ["GitLab Runner", "Amazon EKS", "Istio", "Argo CD", "OWASP ZAP"],
  },
  {
    role: "DevOps Specialist — Cloud Platform, IaC &amp; Governance",
    co: "OpsTree Solutions · Noida",
    when: "Apr 2022 – Dec 2024",
    points: [
      "Established AWS Control Tower landing zones, Service Control Policies and IAM Identity Center SSO across a multi-account estate — owning access control and account structure, not just build automation.",
      "Built Terraform provisioning pipelines driven from GitLab CI/CD, automating repeatable infrastructure delivery across AWS and GCP.",
      "Delivered cloud optimisation work that cut spend by 30% while building secure AWS foundations for development and production.",
      "Developed reusable Ansible roles with dynamic inventory and Molecule test coverage; automated compliance checks saving ~25 audit hours per month.",
    ],
    tags: ["Control Tower", "SCPs", "Terraform", "Ansible", "GKE"],
  },
];

const CASES = [
  {
    name: "GitOps delivery with Argo CD and App-of-Apps",
    where: "Publicis Sapient",
    problem: "Backend services were promoted across environments manually, so every environment needed its own hand-maintained configuration. That produced drift between environments and a steady stream of tickets into the platform team.",
    approach: "Standardised promotion on Argo CD and authored reusable Helm charts behind an App-of-Apps structure, so a new service is onboarded by declaring it rather than by hand-configuring each environment.",
    outcome: "Product teams onboard services self-service. Configuration drift between environments is reduced and platform-team ticket load is lower.",
    tags: ["Argo CD", "Helm", "Kubernetes", "Git"],
  },
  {
    name: "GitLab Runner fleet tuning",
    where: "Deutsche Telekom Digital Labs",
    problem: "Shared CI capacity was contended. Developers waited on pipelines, and the bottleneck sat below the CI layer — in how runners were provisioned and how the host OS handled concurrent jobs.",
    approach: "Administered and tuned the GitLab Runner fleet at the Linux OS level, resolving resource contention and bottlenecks rather than simply adding more runners.",
    outcome: "Materially improved pipeline throughput and reduced developer wait time across shared CI capacity.",
    tags: ["GitLab Runner", "Linux", "GitLab CI/CD"],
  },
  {
    name: "Production EKS upgrades and progressive delivery",
    where: "Deutsche Telekom Digital Labs",
    problem: "Production Kubernetes clusters needed version upgrades without taking down business-critical microservices, and rollouts had no safe intermediate step between deployed and not deployed.",
    approach: "Planned and executed EKS upgrades end to end — workload and dependency validation, rollback readiness, service-availability verification. Introduced Istio with Argo CD canary deployments so traffic could be shifted gradually and rolled back quickly.",
    outcome: "Upgrades completed with minimal downtime. Progressive delivery gave production rollouts a safe, reversible path.",
    tags: ["Amazon EKS", "Istio", "Argo CD"],
  },
  {
    name: "Multi-account AWS governance",
    where: "OpsTree Solutions",
    problem: "A multi-account AWS estate needed consistent account structure, access control and guardrails — governance, not just build automation.",
    approach: "Established Control Tower landing zones, Service Control Policies and AWS SSO federation, and drove Terraform provisioning pipelines from GitLab CI/CD so infrastructure delivery was repeatable across AWS and GCP.",
    outcome: "Cloud spend reduced by 30%. Compliance automation saved approximately 25 manual audit hours per month.",
    tags: ["Control Tower", "SCPs", "AWS SSO", "Terraform"],
  },
];

pages.push({
  path: "/experience/",
  file: "public/experience/index.html",
  title: "Experience &amp; Case Studies | Sohan Dogra",
  description:
    "Platform and DevOps roles at Publicis Sapient, Deutsche Telekom Digital Labs and OpsTree Solutions, with four production case studies covering Argo CD GitOps, GitLab Runner tuning, EKS upgrades and AWS governance.",
  body: `  <header class="page-head">
    <h1>Experience</h1>
    <p class="summary">Four years across three organisations, moving from cloud governance and IaC into GitLab platform ownership and GitOps delivery.</p>
  </header>

  <section class="reveal">
    <h2>Roles</h2>
${JOBS.map(
  (j) => `    <div class="job${j.current ? " now" : ""}">
      <h3>${j.role}</h3>
      <div class="co">${j.co}</div>
      <div class="when">${j.when}</div>
      <ul>
${j.points.map((p) => `        <li>${p}</li>`).join("\n")}
      </ul>
      <div class="tags">${j.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    </div>`
).join("\n\n")}
  </section>

  <section class="reveal">
    <h2>Case studies</h2>
    <p class="lede">Problem → approach → outcome. All from documented production work, not side projects.</p>
${CASES.map(
  (c) => `    <details class="case">
      <summary>
        <span class="case-name">${c.name}</span>
        <span class="case-where">${c.where}</span>
      </summary>
      <div class="case-body">
        <h4>Problem</h4><p>${c.problem}</p>
        <h4>Approach</h4><p>${c.approach}</p>
        <h4>Outcome</h4><p>${c.outcome}</p>
        <div class="tags">${c.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    </details>`
).join("\n")}
  </section>

  <section class="reveal">
    <h2>Skills</h2>
${skillsGrid}
  </section>

  <section class="reveal">
    <h2>Certifications &amp; Education</h2>
    <div class="certs">
      <div class="cert"><div class="mark">AWS</div><div><b>Solutions Architect – Associate</b><span>Active</span></div></div>
      <div class="cert"><div class="mark">K8s</div><div><b>Certified Kubernetes Administrator</b><span>Active</span></div></div>
      <div class="cert"><div class="mark">BSc</div><div><b>Bachelor of Computer Science</b><span>Tilak Maharashtra Vidyapeeth, Pune · 2020–2023</span></div></div>
    </div>
  </section>

  <nav class="pager" aria-label="Pagination">
    <a class="prev" href="/">&larr; Home</a>
    <a class="next" href="/blog/">Writing &rarr;</a>
  </nav>`,
});

/* ---------------------------------- blog --------------------------------- */

const POSTS = [
  {
    title: "Pod Priority, Priority Class, and Preemption",
    url: "https://opstree.com/blog/pod-priority-priority-classamp-preemption/",
    where: "OpsTree",
    date: "22 November 2022",
    iso: "2022-11-22",
    summary:
      "How to make sure critical workloads get scheduled ahead of everything else. Covers defining priority classes, the integer priority range, and configuring preemption so higher-priority pods can evict lower-priority ones when a cluster is resource-constrained.",
    tags: ["Kubernetes", "Scheduling"],
  },
  {
    title: "Securing Kubernetes Traffic with Cert-Manager &amp; Let's Encrypt",
    url: "https://opstree.com/blog/securing-k8s-traffic-with-cert-manager-amp-lets-encrypt/",
    where: "OpsTree",
    date: "27 September 2022",
    iso: "2022-09-27",
    summary:
      "Automating TLS certificate issuance and renewal inside a cluster. Walks through installing cert-manager and the Kong ingress controller, then wiring up ClusterIssuers so domain traffic is served over HTTPS without manual certificate handling.",
    tags: ["Kubernetes", "Security", "TLS"],
  },
  {
    title: "Why Argo CD? Understanding GitOps Core Architecture",
    url: "https://medium.com/@Sohan_Dogra/why-argo-cd-understanding-gitops-core-architecture-71b2e144dee2",
    where: "Medium",
    summary: "On Argo CD and the architecture underneath GitOps delivery.",
    tags: ["Argo CD", "GitOps"],
  },
  {
    title: "Optimizing Prometheus: Dropping Unwanted Metrics for Better Memory Management",
    url: "https://medium.com/@Sohan_Dogra/optimizing-prometheus-dropping-unwanted-metrics-for-better-memory-management-075721f918c8",
    where: "Medium",
    summary: "Cutting Prometheus memory use by dropping metrics you never query.",
    tags: ["Prometheus", "Observability"],
  },
];

pages.push({
  path: "/blog/",
  file: "public/blog/index.html",
  title: "Writing | Sohan Dogra",
  description:
    "Published articles by Sohan Dogra on Kubernetes pod priority and preemption, cert-manager and Let's Encrypt, Argo CD and GitOps architecture, and optimising Prometheus memory usage.",
  body: `  <header class="page-head">
    <h1>Writing</h1>
    <p class="summary">Published articles on Kubernetes, GitOps and observability — on the OpsTree engineering blog and Medium.</p>
  </header>

  <section class="reveal">
    <h2>Articles</h2>
    <div class="posts">
${POSTS.map(
  (p) => `      <article class="post">
        <div class="post-meta">
          <span class="post-where">${p.where}</span>${
            p.date ? `<time datetime="${p.iso}">${p.date}</time>` : ""
          }
        </div>
        <h3><a href="${p.url}" rel="noopener">${p.title}</a></h3>
        <p>${p.summary}</p>
        <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </article>`
).join("\n")}
    </div>

    <p class="note">
      All posts on the OpsTree engineering blog:
      <a href="https://opstree.com/blog/author/sohandogra/" rel="noopener">opstree.com/blog/author/sohandogra</a>
      · On Medium: <a href="https://medium.com/@Sohan_Dogra" rel="noopener">@Sohan_Dogra</a>
    </p>
  </section>

  <nav class="pager" aria-label="Pagination">
    <a class="prev" href="/experience/">&larr; Experience</a>
    <a class="next" href="/projects/">Projects &rarr;</a>
  </nav>`,
});

/* -------------------------------- projects ------------------------------- */

pages.push({
  path: "/projects/",
  file: "public/projects/index.html",
  title: "Projects | Sohan Dogra",
  description:
    "Projects built by Sohan Dogra outside client work, including an AI content tool on Cloudflare Workers and the portfolio assistant running on Workers AI.",
  body: `  <header class="page-head">
    <h1>Projects</h1>
    <p class="summary">Built outside client work — mostly to try an idea end to end rather than to ship a product.</p>
  </header>

  <section class="reveal">
    <h2>Projects</h2>

    <article class="project">
      <h3><a href="https://github.com/DevSecOpsSohan/repurpose-ai" rel="noopener">repurpose-ai</a></h3>
      <p>Turns one long-form transcript into a week of platform-native posts — clip picks with hooks, per-network captions, thumbnail copy and a posting schedule. The Zod schema doubles as the model output contract, so the API returns typed data instead of prose to parse.</p>
      <div class="tags"><span class="tag">Next.js</span><span class="tag">TypeScript</span><span class="tag">Claude API</span><span class="tag">Cloudflare Workers</span></div>
    </article>

    <article class="project">
      <h3><a href="https://github.com/DevSecOpsSohan/portfolio" rel="noopener">This site</a></h3>
      <p>Static assets on Cloudflare Workers with an AI assistant running on Workers AI through an AI binding — no API key in the frontend, no separate AI server. The assistant is grounded in a structured knowledge base so it cannot invent experience, and project enquiries are persisted to D1 before any email is attempted.</p>
      <div class="tags"><span class="tag">Cloudflare Workers</span><span class="tag">Workers AI</span><span class="tag">D1</span><span class="tag">Vanilla JS</span></div>
    </article>
  </section>

  <nav class="pager" aria-label="Pagination">
    <a class="prev" href="/blog/">&larr; Writing</a>
    <a class="next" href="/contact/">Contact &rarr;</a>
  </nav>`,
});

/* -------------------------------- contact -------------------------------- */

pages.push({
  path: "/contact/",
  file: "public/contact/index.html",
  title: "Contact | Sohan Dogra",
  description:
    "Get in touch with Sohan Dogra about platform and DevOps roles, Kubernetes migrations, GitLab CI/CD work or GitOps consulting.",
  body: `  <header class="page-head">
    <h1>Contact</h1>
    <p class="summary">Open to remote platform and DevOps roles, available immediately. Also happy to talk about consulting on GitLab platform work, Kubernetes migrations or GitOps.</p>
  </header>

  <section class="reveal">
    <div class="contact-grid">
      <div class="contact-card">
        <h2 class="plain">Direct</h2>
        <dl class="contact-list">
          <dt>Email</dt>
          <dd><a href="mailto:sohandogra703@gmail.com">sohandogra703@gmail.com</a></dd>
          <dt>Phone</dt>
          <dd><a href="tel:+918287332760">+918287332760</a></dd>
          <dt>Location</dt>
          <dd>Faridabad, India · open to remote</dd>
          <dt>LinkedIn</dt>
          <dd><a href="https://www.linkedin.com/in/devopsspecialist/" rel="noopener">/in/devopsspecialist</a></dd>
          <dt>GitHub</dt>
          <dd><a href="https://github.com/DevSecOpsSohan" rel="noopener">DevSecOpsSohan</a></dd>
          <dt>Résumé</dt>
          <dd><a href="/Sohan_Dogra_Resume.pdf">Download PDF</a></dd>
        </dl>
      </div>

      <form class="enquiry" id="enquiry-form" novalidate>
        <h2 class="plain">Start a project enquiry</h2>
        <p class="form-lede">Tell me what you're working on. You'll get an acknowledgement straight away, and a personal reply within a couple of working days.</p>

        <div class="row">
          <div class="field">
            <label for="first_name">First name <span aria-hidden="true">*</span></label>
            <input id="first_name" name="first_name" type="text" maxlength="80" autocomplete="given-name" required>
            <small class="err" data-err="first_name"></small>
          </div>
          <div class="field">
            <label for="last_name">Last name <span aria-hidden="true">*</span></label>
            <input id="last_name" name="last_name" type="text" maxlength="80" autocomplete="family-name" required>
            <small class="err" data-err="last_name"></small>
          </div>
        </div>

        <div class="row">
          <div class="field">
            <label for="email">Email <span aria-hidden="true">*</span></label>
            <input id="email" name="email" type="email" maxlength="200" autocomplete="email" inputmode="email" required>
            <small class="err" data-err="email"></small>
          </div>
          <div class="field">
            <label for="phone">Phone <span class="opt">optional</span></label>
            <input id="phone" name="phone" type="tel" maxlength="40" autocomplete="tel" inputmode="tel">
            <small class="err" data-err="phone"></small>
          </div>
        </div>

        <div class="field">
          <label for="subject">Subject <span class="opt">optional</span></label>
          <input id="subject" name="subject" type="text" maxlength="140" placeholder="e.g. Kubernetes migration, CI/CD audit, contract role">
        </div>

        <div class="field">
          <label for="message">What would you like to discuss? <span aria-hidden="true">*</span></label>
          <textarea id="message" name="message" rows="5" maxlength="4000" required
                    placeholder="A sentence or two about the project, timeline and what you need help with."></textarea>
          <small class="err" data-err="message"></small>
        </div>

        <div class="hp" aria-hidden="true">
          <label for="website">Website</label>
          <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>

        <button type="submit" id="enquiry-send">Send enquiry</button>
        <p class="form-status" id="enquiry-status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>

  <nav class="pager" aria-label="Pagination">
    <a class="prev" href="/projects/">&larr; Projects</a>
    <a class="next" href="/">Home &rarr;</a>
  </nav>`,
});

/* ================================= write ================================= */

for (const page of pages) {
  const out = join(root, page.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, layout(page));
  console.log("wrote", page.file);
}
