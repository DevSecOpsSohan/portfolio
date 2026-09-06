/**
 * Architecture diagrams for the client project case studies.
 *
 * These are redrawn from Sohan's own drawio files. They deliberately show the
 * ARCHITECTURE PATTERN and omit everything that would identify a client's
 * estate: AWS account IDs, internal hostnames, exact VPC/subnet CIDRs, and any
 * third client's name that happened to share a file. A recruiter needs to see
 * the shape of the design; nobody needs the subnet ranges.
 *
 * Rendered as inline SVG rather than exported images so they inherit the site's
 * theme tokens, stay crisp at any zoom, and cost no extra requests.
 */

const E = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const svg = (w, h, label, body) =>
  `<svg class="arch" viewBox="0 0 ${w} ${h}" role="img" aria-label="${E(label)}">${body}</svg>`;

const box = (x, y, w, h, cls = "") =>
  `<rect class="d-box${cls ? " " + cls : ""}" x="${x}" y="${y}" width="${w}" height="${h}" rx="7"/>`;

const frame = (x, y, w, h, cls) =>
  `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/>`;

const tx = (x, y, s, cls = "d-t", a = "middle") =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}">${E(s)}</text>`;

const ln = (d) => `<path class="d-line" d="${d}"/>`;
const headR = (x, y) => `<path class="d-head" d="M${x} ${y} l-7 -4.5 v9 z"/>`;
const headD = (x, y) => `<path class="d-head" d="M${x} ${y} l-4.5 -7 h9 z"/>`;

/** A labelled box with optional sub-lines. Returns { s, h } so callers can stack. */
function node(x, y, w, title, subs = [], cls = "") {
  const h = 24 + (subs.length ? subs.length * 14 + 6 : 0);
  let s = box(x, y, w, h, cls) + tx(x + w / 2, y + 16, title);
  subs.forEach((v, i) => (s += tx(x + w / 2, y + 32 + i * 14, v, "d-s")));
  return { s, h };
}

/** Horizontal flow of equal-height nodes (one sub-line each) joined by arrows. */
function chain(items, x0, y, w, gap) {
  let s = "";
  let x = x0;
  items.forEach((it, i) => {
    s += node(x, y, w, it[0], it[1] ? [it[1]] : [""], it[2] || "").s;
    if (i < items.length - 1) {
      s += ln(`M${x + w} ${y + 22} H${x + w + gap - 9}`) + headR(x + w + gap - 1, y + 22);
    }
    x += w + gap;
  });
  return s;
}

/* ========================================================================== */
/*                                  ATMOON                                    */
/* ========================================================================== */

function atmoonRegion() {
  let s = frame(8, 8, 884, 452, "d-cloud") + tx(24, 30, "AWS Cloud · ap-south-1", "d-cap", "start");

  /* ---- workload VPC ---- */
  s += frame(24, 44, 376, 404, "d-vpc");
  s += tx(36, 64, "Payments workload VPC", "d-vpc-t", "start");

  for (const [ax, name] of [[34, "Availability Zone A"], [216, "Availability Zone B"]]) {
    s += frame(ax, 76, 172, 362, "d-az") + tx(ax + 86, 94, name, "d-s");
    const tiers = [
      ["Public", ["NLB · NAT gateway"], "edge"],
      ["Application", ["EKS worker nodes", "Istio sidecars"], ""],
      ["Middleware", ["RabbitMQ · Redis"], ""],
      ["Database", ["PostgreSQL", "MongoDB"], "db"],
    ];
    let y = 106;
    for (const [title, items, cls] of tiers) {
      const n = node(ax + 10, y, 152, title, items, cls);
      s += n.s;
      y += n.h + 13;
    }
    s += tx(ax + 86, y + 12, "own NACL + security group", "d-s");
  }

  /* ---- peering ---- */
  s += ln("M400 246 H406") + ln("M484 246 H490");
  s += box(406, 226, 78, 40, "hi") + tx(445, 243, "VPC", "d-t") + tx(445, 257, "peering", "d-s");

  /* ---- management VPC ---- */
  s += frame(490, 44, 386, 404, "d-vpc");
  s += tx(502, 64, "Management VPC", "d-vpc-t", "start");

  for (const [ax, w, name] of [[500, 180, "Availability Zone A"], [692, 176, "Availability Zone B"]]) {
    s += frame(ax, 76, w, 362, "d-az") + tx(ax + w / 2, 94, name, "d-s");
    let y = 106;
    for (const [title, items, cls] of [
      ["Public subnet", ["Internet gateway", "NAT gateway"], "edge"],
      ["Management subnet", ["Jenkins", "ALB · OpenVPN"], ""],
    ]) {
      const n = node(ax + 10, y, w - 20, title, items, cls);
      s += n.s;
      y += n.h + 16;
    }
    s += tx(ax + w / 2, y + 14, "EKS control-plane", "d-s");
    s += tx(ax + w / 2, y + 28, "endpoint reached", "d-s");
    s += tx(ax + w / 2, y + 42, "from here", "d-s");
  }

  return svg(900, 470, "Atmoon region overview: payments workload VPC peered to a separate management VPC across two availability zones", s);
}

function atmoonPath() {
  let s = tx(24, 26, "North-south traffic", "d-cap", "start");
  s += chain(
    [
      ["Internet", "public clients"],
      ["Route 53", "DNS"],
      ["Internet GW", "VPC edge", "edge"],
      ["Network LB", "public subnet", "edge"],
      ["EKS + Istio", "application tier"],
      ["Middleware", "queue · cache"],
      ["Database", "private tier", "db"],
    ],
    16,
    46,
    112,
    16
  );

  s += tx(24, 168, "East-west and egress", "d-cap", "start");

  s += box(16, 186, 412, 76, "");
  s += tx(222, 208, "Private tiers have no route to the internet gateway");
  s += tx(222, 228, "Outbound traffic leaves through a NAT gateway in each AZ,", "d-s");
  s += tx(222, 244, "so one AZ losing its NAT does not take the other down.", "d-s");

  s += box(444, 186, 440, 76, "");
  s += tx(664, 208, "Service-to-service traffic runs through Istio");
  s += tx(664, 228, "mTLS between workloads, and the request telemetry that", "d-s");
  s += tx(664, 244, "satisfied the client's APM requirement without an agent per pod.", "d-s");

  return svg(900, 280, "Atmoon traffic path from the internet through the load balancer to the database tier, with NAT gateway egress per availability zone", s);
}

function atmoonOps() {
  let s = tx(24, 26, "How operators and pipelines reach the platform", "d-cap", "start");

  s += chain(
    [
      ["Engineer", "laptop"],
      ["OpenVPN", "public subnet", "edge"],
      ["Management subnet", "Jenkins · ALB"],
      ["VPC peering", "private link", "hi"],
      ["Workload VPC", "EKS · data tiers"],
    ],
    22,
    50,
    152,
    22
  );

  s += tx(24, 158, "Configuration and patching", "d-cap", "start");

  let x = 22;
  for (const [t1, t2] of [
    ["Terraform", "provisions every resource"],
    ["Ansible", "OS + application config"],
    ["SSM Patch Manager", "scheduled patch windows"],
    ["Kubernetes RBAC", "who can act in-cluster"],
  ]) {
    s += node(x, 176, 205, t1, [t2]).s;
    x += 219;
  }

  s += box(22, 244, 856, 54);
  s += tx(450, 266, "No administrative entry point sits inside the application network.");
  s += tx(450, 286, "SSH is reachable only from the OpenVPN security group — never from a CIDR block open to the internet.", "d-s");

  return svg(900, 316, "Atmoon operational access path: engineer through OpenVPN into the management subnet, then over VPC peering into the workload VPC", s);
}

function atmoonEks() {
  let s = tx(24, 26, "Cluster and observability", "d-cap", "start");

  s += frame(16, 40, 560, 210, "d-vpc") + tx(28, 60, "Application subnets", "d-vpc-t", "start");
  s += node(30, 72, 160, "EKS worker nodes", ["managed node group", "auto scaling"]).s;
  s += node(206, 72, 160, "Istio service mesh", ["mTLS between pods", "traffic shaping"], "edge").s;
  s += node(382, 72, 178, "Kubernetes RBAC", ["roles per namespace", "no cluster-admin by default"]).s;

  s += node(30, 156, 160, "Prometheus", ["metrics"]).s;
  s += node(206, 156, 160, "Grafana", ["dashboards · alerts"]).s;
  s += node(382, 156, 178, "EFK stack", ["centralised logs"]).s;

  s += frame(596, 40, 288, 210, "d-vpc") + tx(608, 60, "AWS-managed", "d-vpc-t", "start");
  s += node(610, 72, 260, "EKS control plane", ["private endpoint", "reached from management VPC"], "hi").s;
  s += node(610, 156, 260, "kubectl / Argo CD", ["over the VPN, never public"]).s;

  s += ln("M576 122 H590") + headR(596, 122);

  s += box(16, 264, 868, 54);
  s += tx(450, 286, "Observability was in place at handover, not added after the first incident.");
  s += tx(450, 306, "Metrics, dashboards and logs shipped with the platform — which is what made the compliance evidence straightforward.", "d-s");

  return svg(900, 336, "Atmoon EKS cluster with Istio service mesh, Kubernetes RBAC, and Prometheus, Grafana and EFK observability", s);
}

const ATMOON_RULES = `  <div class="rules">
    <table>
      <thead>
        <tr><th>Tier</th><th>Inbound allowed from</th><th>Ports</th><th>Outbound</th></tr>
      </thead>
      <tbody>
        <tr><td><b>Public</b></td><td>Internet</td><td>80, 443</td><td>Application tier</td></tr>
        <tr><td><b>Application</b></td><td>Public tier security group</td><td>80, 443, ephemeral</td><td>Middleware · NAT gateway</td></tr>
        <tr><td><b>Middleware</b></td><td>Application tier security group</td><td>queue and cache ports</td><td>Database tier</td></tr>
        <tr><td><b>Database</b></td><td>Middleware tier security group</td><td>database ports only</td><td>None</td></tr>
        <tr><td><b>Management</b></td><td>OpenVPN security group</td><td>22, 443</td><td>All tiers (administrative)</td></tr>
      </tbody>
    </table>
  </div>
  <p class="rules-note">Rules reference <b>security groups</b>, not CIDR blocks. A rule that names a security group keeps working when subnets are resized or an instance is replaced, and it cannot be widened by accident the way a hand-typed range can.</p>`;

export const ATMOON = [
  {
    title: "Region overview",
    caption:
      "Payments workload VPC and a separate management VPC, peered rather than shared, across two availability zones. Every tier is its own subnet with its own NACL and security group.",
    art: atmoonRegion(),
  },
  {
    title: "Traffic path",
    caption:
      "North-south flow from the internet down to the database tier, and why the private tiers have no route to the internet gateway.",
    art: atmoonPath(),
  },
  {
    title: "Tier controls",
    caption:
      "The inbound and outbound rules that make the tiering real. Traffic between tiers is explicitly allowed rather than implicitly reachable.",
    art: ATMOON_RULES,
  },
  {
    title: "Operational access",
    caption:
      "How engineers and pipelines reach the platform without putting an administrative entry point inside the application network.",
    art: atmoonOps(),
  },
  {
    title: "Cluster and observability",
    caption:
      "EKS with Istio for mTLS and APM telemetry, Kubernetes RBAC on top, and the Prometheus, Grafana and EFK stack that shipped with the platform.",
    art: atmoonEks(),
  },
];

/* ========================================================================== */
/*                                  AEROHUB                                   */
/* ========================================================================== */

function aerohubOrg() {
  let s = box(250, 8, 400, 58, "hi");
  s += tx(450, 30, "Organization root", "d-cap");
  s += tx(450, 50, "Control Tower · IAM Identity Center · Service Catalog · Billing", "d-s");

  s += ln("M450 66 V96 M110 96 H790 M110 96 V126 M337 96 V126 M563 96 V126 M790 96 V126");

  const ous = [
    [20, "Core OU", "SCP"],
    [247, "Security OU", "SCP"],
    [473, "Infrastructure OU", "SCP"],
    [700, "Workload OUs", "SCP · per vertical"],
  ];
  for (const [x, name, scp] of ous) {
    s += box(x, 126, 180, 52);
    s += tx(x + 90, 148, name);
    s += tx(x + 90, 167, scp, "d-s");
  }

  s += ln("M110 178 V206 M337 178 V206 M563 178 V206 M790 178 V206");

  const accts = [
    [20, 206, "Log Archive account", "CloudTrail · CloudWatch · S3"],
    [20, 262, "Audit account", "read-only assurance"],
    [247, 206, "Security account", "Security Hub · GuardDuty"],
    [247, 262, "AWS Config", "org-wide conformance"],
    [473, 206, "Shared services", "networking · tooling"],
    [700, 206, "QA account", ""],
    [700, 258, "Performance-test account", ""],
  ];
  for (const [x, y, name, sub] of accts) {
    s += box(x, y, 180, 44);
    s += tx(x + 90, sub ? y + 20 : y + 27, name);
    if (sub) s += tx(x + 90, y + 36, sub, "d-s");
  }

  s += box(700, 310, 180, 44, "edge");
  s += tx(790, 330, "Production account");
  s += tx(790, 346, "EKS · RDS · EC2", "d-s");

  s += box(250, 368, 400, 50);
  s += tx(450, 390, "External identity provider → IAM Identity Center");
  s += tx(450, 408, "SSO into every account · per-account permission sets · no long-lived IAM users", "d-s");

  return svg(900, 430, "Aerohub AWS Organizations hierarchy: organization root with Core, Security, Infrastructure and workload OUs, each containing accounts", s);
}

function aerohubRoot() {
  let s = tx(24, 26, "What the management account owns", "d-cap", "start");

  s += frame(16, 38, 868, 106, "d-vpc");
  let x = 32;
  for (const [t1, t2] of [
    ["AWS Control Tower", "landing zone provisioning"],
    ["Service Catalog", "standardised account vending"],
    ["IAM Identity Center", "SSO into every account"],
    ["Centralised billing", "spend per account and vertical"],
  ]) {
    s += node(x, 60, 200, t1, [t2], "hi").s;
    x += 212;
  }

  s += tx(24, 178, "How a person gets access", "d-cap", "start");

  s += chain(
    [
      ["Person", "joins a group"],
      ["Google Workspace / Entra", "source of identity"],
      ["IAM Identity Center", "federated, SAML"],
      ["Permission set", "scoped per account"],
      ["Account", "time-bound session", "edge"],
    ],
    16,
    198,
    158,
    18,
  );

  s += box(16, 274, 868, 54);
  s += tx(450, 296, "No long-lived IAM users anywhere in the organization.");
  s += tx(450, 316, "Access follows group membership, so an offboarding in the directory removes AWS access everywhere at once.", "d-s");

  return svg(900, 346, "Aerohub management account services and the identity federation path from the corporate directory into each AWS account", s);
}

function aerohubVertical() {
  let s = tx(24, 26, "One business vertical, three environments", "d-cap", "start");

  s += box(360, 44, 180, 52, "hi");
  s += tx(450, 66, "Vertical OU");
  s += tx(450, 84, "SCP inherited from root", "d-s");

  s += ln("M450 96 V120 M150 120 H750 M150 120 V146 M450 120 V146 M750 120 V146");

  const envs = [
    [60, "QA OU", "relaxed guardrails"],
    [360, "Performance-test OU", "prod-shaped, isolated"],
    [660, "Production OU", "tightest guardrails"],
  ];
  for (const [x, name, sub] of envs) {
    s += box(x, 146, 180, 52, name === "Production OU" ? "edge" : "");
    s += tx(x + 90, 168, name);
    s += tx(x + 90, 186, sub, "d-s");
    s += ln(`M${x + 90} 198 V222`) + headD(x + 90, 228);
  }

  for (const [x, name] of [[60, "QA account"], [360, "PT account"], [660, "Prod account"]]) {
    s += frame(x - 14, 232, 208, 118, "d-az");
    s += tx(x + 90, 252, name, "d-t");
    let ix = x - 4;
    for (const svc of ["EC2", "EKS", "RDS"]) {
      s += box(ix, 264, 60, 32);
      s += tx(ix + 30, 284, svc, "d-s");
      ix += 64;
    }
    s += tx(x + 90, 320, "own SCP · own account boundary", "d-s");
    s += tx(x + 90, 338, "blast radius stops here", "d-s");
  }

  return svg(900, 366, "Aerohub vertical OU containing QA, performance-test and production OUs, each with its own account and inherited service control policies", s);
}

function aerohubSecurity() {
  let s = tx(24, 26, "Separated by design: who watches, and where the evidence lives", "d-cap", "start");

  s += frame(16, 44, 428, 214, "d-vpc") + tx(30, 64, "Security account", "d-vpc-t", "start");
  let x = 30;
  for (const [t1, t2] of [
    ["Security Hub", "findings, one pane"],
    ["GuardDuty", "threat detection"],
  ]) {
    s += node(x, 80, 194, t1, [t2]).s;
    x += 206;
  }
  s += node(30, 156, 400, "AWS Config", ["organization-wide conformance packs", "drift from the baseline is a finding, not a surprise"]).s;

  s += frame(464, 44, 420, 214, "d-vpc") + tx(478, 64, "Log Archive account", "d-vpc-t", "start");
  x = 478;
  for (const [t1, t2] of [
    ["CloudTrail", "every API call"],
    ["CloudWatch", "platform metrics"],
  ]) {
    s += node(x, 80, 190, t1, [t2]).s;
    x += 202;
  }
  s += node(478, 156, 392, "Amazon S3", ["write-once retention", "the account that generates a log cannot delete it"], "edge").s;

  s += box(16, 274, 868, 54);
  s += tx(450, 296, "The account that produces evidence is not the account that stores it.");
  s += tx(450, 316, "That separation is what makes the audit trail worth having: a compromised workload account cannot rewrite its own history.", "d-s");

  return svg(900, 346, "Aerohub Security account running Security Hub, GuardDuty and AWS Config, alongside a separate Log Archive account holding CloudTrail and CloudWatch data in S3", s);
}

const AEROHUB_RULES = `  <div class="rules">
    <table>
      <thead>
        <tr><th>Attached at</th><th>Guardrail</th><th>What it prevents</th></tr>
      </thead>
      <tbody>
        <tr><td><b>Root</b></td><td>Deny leaving the organization; deny disabling CloudTrail, Config or GuardDuty</td><td>An account quietly stepping outside governance</td></tr>
        <tr><td><b>Core OU</b></td><td>Deny changes to logging destinations and retention</td><td>Evidence being altered by the estate it covers</td></tr>
        <tr><td><b>Security OU</b></td><td>Deny anything but the security tooling's own roles</td><td>Workload teams reaching into the audit plane</td></tr>
        <tr><td><b>Workload OU</b></td><td>Region allow-list; deny public S3 and unencrypted volumes</td><td>Data landing outside approved regions or controls</td></tr>
        <tr><td><b>Production OU</b></td><td>Everything above, plus deny IAM user creation and manual console changes to network paths</td><td>Drift between what Terraform says and what production runs</td></tr>
      </tbody>
    </table>
  </div>
  <p class="rules-note">Policies are attached at OU level and <b>inherited downward</b>, so a newly vended account arrives governed. Reapplying policy per account is what lets guardrails drift as an estate grows.</p>`;

export const AEROHUB = [
  {
    title: "Organization structure",
    caption:
      "Core, Security and Infrastructure OUs alongside per-vertical workload OUs. Guardrails are attached at OU level and inherited, so a new account arrives governed.",
    art: aerohubOrg(),
  },
  {
    title: "Management account and identity",
    caption:
      "Control Tower, Service Catalog and centralised billing at the root — and the federated path a person takes from the corporate directory into an account.",
    art: aerohubRoot(),
  },
  {
    title: "Environments per vertical",
    caption:
      "Each business vertical gets QA, performance-test and production accounts under its own OU, so blast radius and access follow the org chart.",
    art: aerohubVertical(),
  },
  {
    title: "Security and audit plane",
    caption:
      "Security Hub, GuardDuty and Config in a dedicated Security account; CloudTrail and CloudWatch aggregated into a separate Log Archive account.",
    art: aerohubSecurity(),
  },
  {
    title: "Guardrails by OU level",
    caption:
      "What is denied where. Inheritance is the point — a guardrail written once at the right level covers every account beneath it, including ones that do not exist yet.",
    art: AEROHUB_RULES,
  },
];

/* ========================================================================== */

/**
 * Render a slide deck. Slides are inert markup until app.js wires them up; the
 * first is visible and the rest carry `hidden`, so the deck degrades to a
 * single readable diagram if JavaScript never runs.
 */
export function carousel(id, slides) {
  const figures = slides
    .map(
      (s, i) => `      <figure class="slide"${i ? " hidden" : ""} data-i="${i}">
        <div class="slide-art">
${s.art}
        </div>
        <figcaption><b>${s.title}</b><span>${s.caption}</span></figcaption>
      </figure>`
    )
    .join("\n");

  const dots = slides
    .map(
      (s, i) =>
        `<button class="c-dot${i ? "" : " on"}" data-i="${i}" aria-label="${E(s.title)}"></button>`
    )
    .join("");

  return `  <div class="carousel" data-carousel id="${id}">
    <div class="carousel-stage">
${figures}
    </div>
    <div class="carousel-bar">
      <button class="c-nav c-prev" aria-label="Previous diagram">&#8249;</button>
      <div class="c-dots">${dots}</div>
      <button class="c-nav c-next" aria-label="Next diagram">&#8250;</button>
      <span class="c-count"><b>1</b> / ${slides.length}</span>
    </div>
  </div>`;
}
