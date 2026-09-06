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
        <span>Two AWS delivery engagements — a PCI-DSS payments platform, and a multi-account landing zone re-architecture.</span>
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
  title: "Client Projects | Sohan Dogra",
  description:
    "Two AWS delivery engagements: a payments platform built to PCI DSS compliance on EKS and Istio, and a multi-account landing zone re-architecture with Control Tower, SCPs and IAM Identity Center.",
  body: `  <header class="page-head">
    <h1>Client projects</h1>
    <p class="summary">Two infrastructure engagements delivered end to end — discovery, architecture, build and handover. Diagrams below show the architecture pattern; client account identifiers, internal hostnames and network ranges are deliberately omitted.</p>
  </header>

  <!-- ===================== PROJECT 1 ===================== -->
  <section class="reveal">
    <div class="proj-head">
      <div>
        <h2 class="plain">Payments platform infrastructure, built to compliance</h2>
        <p class="proj-meta"><span class="client">Atmoon</span> · Greenfield build · Delivered in 3 months</p>
      </div>
    </div>

    <p class="lede">A payments platform needs its compliance posture designed in, not retrofitted. This engagement ran from a discovery pass over the existing estate through to running environments — account structure, network tiering, cluster security and patching, built against PCI DSS requirements.</p>

    <h3 class="sub">Architecture</h3>
    <p class="note">Two availability zones. Every tier is its own subnet with its own NACL and security group, so traffic between tiers is explicitly allowed rather than implicitly reachable.</p>

    <div class="flow-scroll">
      <div class="tiers">
        <div class="tier edge">
          <b>Public subnets — AZ-a · AZ-b</b>
          <div class="chips"><span>Internet Gateway</span><span>Network Load Balancer</span><span>NAT Gateway per AZ</span></div>
        </div>
        <div class="tier">
          <b>Application subnets</b>
          <div class="chips"><span>Amazon EKS worker nodes</span><span>Istio service mesh</span><span>Auto Scaling</span></div>
        </div>
        <div class="tier">
          <b>Middleware subnets</b>
          <div class="chips"><span>RabbitMQ</span><span>Redis</span></div>
        </div>
        <div class="tier db">
          <b>Database subnets</b>
          <div class="chips"><span>PostgreSQL</span><span>MongoDB</span></div>
        </div>
      </div>
    </div>

    <div class="side-note">
      <b>Management VPC — peered, not shared</b>
      <p>Jenkins, the application load balancer, OpenVPN access and the EKS control-plane endpoint live in a separate VPC peered to the workload VPCs. Operational entry points sit outside the application network, so administrative access is not a hole in the workload perimeter.</p>
    </div>

    <h3 class="sub">What was delivered</h3>
    <ul class="deliverables">
      <li><b>Pre-discovery before build.</b> Established what actually ran where, so the target design addressed real workloads rather than assumptions.</li>
      <li><b>Account structure and guardrails.</b> OUs per environment with Service Control Policies scoped per account, and a central tagging policy enforced across the estate for cost attribution and ownership.</li>
      <li><b>Everything in Terraform.</b> Infrastructure provisioned as code, so environments are reproducible and drift is visible rather than discovered during an incident.</li>
      <li><b>Patching that does not depend on people.</b> OS configuration through Ansible, patch cycles through AWS Systems Manager Patch Manager.</li>
      <li><b>Cluster security in depth.</b> Istio provides mTLS between services and the APM visibility the compliance requirement asked for; Kubernetes RBAC governs who and what can act inside the cluster.</li>
      <li><b>Observability from day one.</b> Prometheus and Grafana for metrics, EFK for logs — in place at handover, not added after the first incident.</li>
    </ul>

    <div class="tags">
      <span class="tag">AWS</span><span class="tag">Terraform</span><span class="tag">Ansible</span>
      <span class="tag">AWS SSM</span><span class="tag">Amazon EKS</span><span class="tag">Istio</span>
      <span class="tag">Kubernetes RBAC</span><span class="tag">SCPs</span><span class="tag">PCI DSS</span>
      <span class="tag">Prometheus</span><span class="tag">Grafana</span><span class="tag">EFK</span>
    </div>
  </section>

  <!-- ===================== PROJECT 2 ===================== -->
  <section class="reveal">
    <div class="proj-head">
      <div>
        <h2 class="plain">Multi-account landing zone and compliance re-architecture</h2>
        <p class="proj-meta"><span class="client">US education technology group</span> · Name withheld under NDA</p>
      </div>
    </div>

    <p class="lede">The client ran a flat AWS estate where environments and business verticals shared blast radius and access. This engagement moved them onto an Organizations-based landing zone so compliance and access boundaries follow the org chart instead of cutting across it.</p>

    <h3 class="sub">Organization structure</h3>
    <p class="note">Guardrails are attached at OU level and inherited downward, so a new account arrives governed rather than needing policy reapplied by hand.</p>

    <div class="flow-scroll">
      <svg class="ou-svg" viewBox="0 0 900 430" role="img" aria-label="AWS Organizations hierarchy: organization root with Core, Security, Infrastructure and workload OUs, each containing accounts">
        <!-- root -->
        <rect class="box root" x="250" y="8" width="400" height="58" rx="8"/>
        <text class="t-title" x="450" y="30" text-anchor="middle">Organization root</text>
        <text class="t-sub" x="450" y="50" text-anchor="middle">Control Tower · IAM Identity Center · Service Catalog · Billing</text>

        <!-- bus -->
        <path class="line" d="M450 66 V96 M110 96 H790 M110 96 V126 M337 96 V126 M563 96 V126 M790 96 V126"/>

        <!-- OU row -->
        <rect class="box ou" x="20" y="126" width="180" height="52" rx="8"/>
        <text class="t-ou" x="110" y="148" text-anchor="middle">Core OU</text>
        <text class="t-scp" x="110" y="167" text-anchor="middle">SCP</text>

        <rect class="box ou" x="247" y="126" width="180" height="52" rx="8"/>
        <text class="t-ou" x="337" y="148" text-anchor="middle">Security OU</text>
        <text class="t-scp" x="337" y="167" text-anchor="middle">SCP</text>

        <rect class="box ou" x="473" y="126" width="180" height="52" rx="8"/>
        <text class="t-ou" x="563" y="148" text-anchor="middle">Infrastructure OU</text>
        <text class="t-scp" x="563" y="167" text-anchor="middle">SCP</text>

        <rect class="box ou" x="700" y="126" width="180" height="52" rx="8"/>
        <text class="t-ou" x="790" y="148" text-anchor="middle">Workload OUs</text>
        <text class="t-scp" x="790" y="167" text-anchor="middle">SCP · per vertical</text>

        <!-- drops -->
        <path class="line" d="M110 178 V206 M337 178 V206 M563 178 V206 M790 178 V206"/>

        <!-- accounts -->
        <rect class="box acct" x="20" y="206" width="180" height="44" rx="6"/>
        <text class="t-acct" x="110" y="226" text-anchor="middle">Log Archive account</text>
        <text class="t-svc" x="110" y="242" text-anchor="middle">CloudTrail · CloudWatch · S3</text>

        <rect class="box acct" x="20" y="262" width="180" height="44" rx="6"/>
        <text class="t-acct" x="110" y="282" text-anchor="middle">Audit account</text>
        <text class="t-svc" x="110" y="298" text-anchor="middle">Read-only assurance</text>

        <rect class="box acct" x="247" y="206" width="180" height="44" rx="6"/>
        <text class="t-acct" x="337" y="226" text-anchor="middle">Security account</text>
        <text class="t-svc" x="337" y="242" text-anchor="middle">Security Hub · GuardDuty</text>

        <rect class="box acct" x="247" y="262" width="180" height="44" rx="6"/>
        <text class="t-acct" x="337" y="282" text-anchor="middle">AWS Config</text>
        <text class="t-svc" x="337" y="298" text-anchor="middle">Org-wide conformance</text>

        <rect class="box acct" x="473" y="206" width="180" height="44" rx="6"/>
        <text class="t-acct" x="563" y="226" text-anchor="middle">Shared services</text>
        <text class="t-svc" x="563" y="242" text-anchor="middle">Networking · tooling</text>

        <rect class="box acct" x="700" y="206" width="180" height="44" rx="6"/>
        <text class="t-acct" x="790" y="226" text-anchor="middle">QA account</text>

        <rect class="box acct" x="700" y="258" width="180" height="44" rx="6"/>
        <text class="t-acct" x="790" y="278" text-anchor="middle">Performance-test account</text>

        <rect class="box acct prod" x="700" y="310" width="180" height="44" rx="6"/>
        <text class="t-acct" x="790" y="330" text-anchor="middle">Production account</text>
        <text class="t-svc" x="790" y="346" text-anchor="middle">EKS · RDS · EC2</text>

        <!-- idp -->
        <rect class="box idp" x="250" y="368" width="400" height="50" rx="8"/>
        <text class="t-ou" x="450" y="390" text-anchor="middle">External identity provider &#8594; IAM Identity Center</text>
        <text class="t-svc" x="450" y="408" text-anchor="middle">SSO into every account · per-account permission sets · no long-lived IAM users</text>
      </svg>
    </div>

    <h3 class="sub">What was delivered</h3>
    <ul class="deliverables">
      <li><b>OU hierarchy designed around blast radius.</b> Core, Security and Infrastructure OUs alongside per-vertical workload OUs, each with QA, performance-test and production accounts underneath.</li>
      <li><b>SCPs at every level.</b> Guardrails inherited down the tree rather than reapplied per account — which is what stops policy drift as the estate grows.</li>
      <li><b>Control Tower and Service Catalog.</b> Landing zone provisioning plus standardised account vending, so a new account is a request rather than a project.</li>
      <li><b>Federated access.</b> IAM Identity Center wired to the client's existing identity provider — single sign-on into every account with per-account permission sets, and no long-lived IAM users to rotate or leak.</li>
      <li><b>Centralised audit trail.</b> A dedicated Log Archive account aggregating CloudTrail and CloudWatch into S3, separate from the Security account running Security Hub, GuardDuty and AWS Config across the organisation.</li>
      <li><b>Cost visibility per vertical.</b> Centralised billing at the root, with account boundaries that make spend attributable to the team that caused it.</li>
    </ul>

    <div class="tags">
      <span class="tag">AWS Organizations</span><span class="tag">Control Tower</span><span class="tag">SCPs</span>
      <span class="tag">IAM Identity Center</span><span class="tag">Service Catalog</span><span class="tag">Security Hub</span>
      <span class="tag">GuardDuty</span><span class="tag">AWS Config</span><span class="tag">CloudTrail</span>
      <span class="tag">Amazon EKS</span><span class="tag">RDS</span>
    </div>
  </section>

  <!-- ===================== TOOLCHAIN ===================== -->
  <section class="reveal">
    <h2>Delivery toolchain</h2>
    <p class="lede">The pipeline these platforms are delivered through — commit to production, with the gates that run on the way.</p>
    <div class="flow-scroll">
      <ol class="flow">
        <li><b>Git</b><span>Desired state</span></li>
        <li><b>GitLab CI</b><span>Build · test</span></li>
        <li><b>Security gates</b><span>SAST · Gitleaks · Trivy</span></li>
        <li><b>Terraform</b><span>Plan · apply</span></li>
        <li><b>Argo CD</b><span>App-of-Apps sync</span></li>
        <li><b>EKS</b><span>Istio canary</span></li>
        <li><b>Observability</b><span>Prometheus · Grafana</span></li>
      </ol>
    </div>
    <p class="note">Rollback is a git revert — the same path in reverse, not a separate runbook.</p>
  </section>

  <section class="reveal">
    <div class="contact-card">
      <h2 class="plain">Remapping your own infrastructure?</h2>
      <p>If you are looking at a flat AWS estate, an upcoming compliance audit, or a platform that needs to move onto Kubernetes without a rewrite — this is the work I do. Discovery first, then a target architecture you can actually operate.</p>
      <div class="links">
        <a href="/contact/" class="primary">Start a project enquiry</a>
        <a href="mailto:sohandogra703@gmail.com">Email directly</a>
      </div>
    </div>
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
