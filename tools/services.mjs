/**
 * Services offered.
 *
 * The four areas and their line items come from Sohan. The wording is written
 * fresh here rather than lifted from any employer's marketing site — this is a
 * personal portfolio, and copy that reads like an agency brochure (or that
 * belongs to a company he no longer works for) would misrepresent who a visitor
 * is actually hiring.
 *
 * Each card carries an inline SVG illustration for the same reason the
 * architecture diagrams are inline: theme-aware, crisp at any zoom, no extra
 * requests, and no stock photography pretending to be a workplace.
 */

const E = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const art = (body) =>
  `<svg class="svc-art" viewBox="0 0 320 112" aria-hidden="true" focusable="false">${body}</svg>`;

/* ---------------------------- illustrations ---------------------------- */

/** A guarded delivery pipeline: five stages under a shield. */
function artPipeline() {
  let s = "";

  // shield
  s += `<path class="a-fill" d="M160 8 l26 9 v17 c0 14 -11 24 -26 30 c-15 -6 -26 -16 -26 -30 v-17 z"/>`;
  s += `<path class="a-stroke2" d="M160 8 l26 9 v17 c0 14 -11 24 -26 30 c-15 -6 -26 -16 -26 -30 v-17 z"/>`;
  s += `<path class="a-tick" d="M151 34 l6 7 l13 -14"/>`;

  // stages
  const xs = [12, 74, 136, 198, 260];
  xs.forEach((x, i) => {
    s += `<rect class="a-box${i === 2 ? " on" : ""}" x="${x}" y="76" width="44" height="24" rx="6"/>`;
    if (i < xs.length - 1) s += `<path class="a-stroke" d="M${x + 44} 88 H${x + 58}"/>`;
  });

  // gates dropping from the shield onto the middle stages
  s += `<path class="a-dash" d="M144 64 V76 M176 64 V76"/>`;
  return art(s);
}

/** Workloads lifting into a cloud. */
function artCloud() {
  let s = "";
  s += `<g class="a-cloud"><circle cx="128" cy="38" r="18"/><circle cx="160" cy="28" r="24"/><circle cx="194" cy="40" r="18"/><rect x="110" y="40" width="102" height="20" rx="10"/></g>`;
  s += `<path class="a-stroke2" d="M110 60 h102"/>`;

  [86, 142, 198].forEach((x) => {
    s += `<rect class="a-box" x="${x}" y="84" width="40" height="22" rx="5"/>`;
    s += `<path class="a-stroke" d="M${x + 20} 84 V70"/>`;
    s += `<path class="a-head" d="M${x + 20} 66 l-4.5 7 h9 z"/>`;
  });
  return art(s);
}

/** Signals over time, with a threshold that fires. */
function artObservability() {
  let s = "";
  s += `<path class="a-axis" d="M18 92 H302 M18 16 V92"/>`;
  s += `<path class="a-dash" d="M18 44 H302"/>`;
  s += `<path class="a-line" d="M18 80 L58 68 L98 74 L138 50 L178 58 L218 30 L258 46 L298 40"/>`;
  [[138, 50], [218, 30]].forEach(([cx, cy]) => (s += `<circle class="a-dot" cx="${cx}" cy="${cy}" r="4"/>`));
  s += `<circle class="a-alert" cx="218" cy="30" r="10"/>`;
  s += `<rect class="a-box on" x="234" y="10" width="68" height="22" rx="6"/>`;
  s += `<text class="a-t" x="268" y="25" text-anchor="middle">alert</text>`;
  return art(s);
}

/** A shield gating a set of checks. */
function artSecurity() {
  let s = "";
  s += `<path class="a-fill" d="M64 12 l34 12 v22 c0 19 -14 32 -34 40 c-20 -8 -34 -21 -34 -40 v-22 z"/>`;
  s += `<path class="a-stroke2" d="M64 12 l34 12 v22 c0 19 -14 32 -34 40 c-20 -8 -34 -21 -34 -40 v-22 z"/>`;
  s += `<rect class="a-lock" x="55" y="46" width="18" height="14" rx="3"/>`;
  s += `<path class="a-stroke2" d="M58 46 v-5 a6 6 0 0 1 12 0 v5"/>`;

  [22, 50, 78].forEach((y, i) => {
    s += `<rect class="a-box" x="128" y="${y}" width="174" height="20" rx="5"/>`;
    s += `<path class="a-tick" d="M137 ${y + 10} l4 5 l8 -9"/>`;
    s += `<path class="a-stroke" d="M158 ${y + 10} H${290 - i * 34}"/>`;
  });
  return art(s);
}

/* ------------------------------- content ------------------------------- */

export const SERVICES = [
  {
    title: "DevSecOps Transformation &amp; Automation",
    blurb:
      "Modernising how software gets from a commit to production — automated, gated, and repeatable, so releases stop being events that need a person watching them.",
    items: [
      "Automated infrastructure and environments",
      "CI/CD automation",
      "DevSecOps and vulnerability detection automation",
      "GitOps / JIRAOps and test automation",
      "Deployment strategies",
    ],
    art: artPipeline(),
  },
  {
    title: "Cloud Engineering &amp; Modernisation",
    blurb:
      "Reshaping cloud estates that grew organically: a governed account structure, workloads containerised where it pays off, and spend that is attributable to the team that caused it.",
    items: [
      "Cloud design and architecture advisory",
      "Infrastructure modernisation and containerisation",
      "Cloud security posture management",
      "Cloud cost reduction",
    ],
    art: artCloud(),
  },
  {
    title: "Observability &amp; Production Engineering",
    blurb:
      "Making production legible before an incident forces the issue — metrics, logs and alerting that tell you what changed, not just that something is wrong.",
    items: ["Comprehensive observability setup", "Production engineering"],
    art: artObservability(),
  },
  {
    title: "Application &amp; Platform Security Management",
    blurb:
      "Security that runs on every commit in the shared pipeline stage teams already consume, and compliance evidence that is a by-product of the platform rather than a quarterly scramble.",
    items: ["DevSecOps implementation", "Compliance readiness"],
    art: artSecurity(),
  },
];

/* ------------------------------- render -------------------------------- */

export function servicesGrid(services = SERVICES) {
  const cards = services
    .map(
      (s) => `      <article class="svc">
        <div class="svc-head">
${s.art}
        </div>
        <h3>${s.title}</h3>
        <p>${s.blurb}</p>
        <ol class="svc-list">
${s.items.map((i) => `          <li>${E(i)}</li>`).join("\n")}
        </ol>
        <a class="svc-more" href="/contact/">Talk about this <span aria-hidden="true">&rarr;</span></a>
      </article>`
    )
    .join("\n");

  return `    <div class="services">
${cards}
    </div>`;
}
