/**
 * Portfolio knowledge base.
 *
 * This is the ONLY source of truth the AI assistant is allowed to answer from.
 * Every fact here comes from Sohan's CV. Nothing is inferred or embellished.
 *
 * To update the site's content and the assistant's knowledge at the same time,
 * edit this file — the system prompt is generated from it.
 */

export const profile = {
  name: "Sohan Dogra",
  title: "Platform & DevOps Engineer",
  location: "Faridabad, India",
  availability: "Open to remote roles, available immediately",
  experienceYears: "4+",
  email: "sohandogra703@gmail.com",
  phone: "+91 82873 32760",
  links: {
    github: "https://github.com/DevSecOpsSohan",
    linkedin: "https://www.linkedin.com/in/devopsspecialist/",
    resume: "/Sohan_Dogra_Resume.pdf",
  },

  summary:
    "Platform and DevOps engineer with 4+ years operating production GitLab CI/CD platforms end to end — runner fleet administration and OS-level tuning, reusable pipeline templates and shared components, security-gated delivery, and developer self-service enablement. Hands-on ownership of AWS, Kubernetes (EKS/GKE), Terraform, Helm, Istio and Argo CD GitOps, plus multi-account governance via AWS Control Tower, Service Control Policies and SSO/SAML federation.",

  experience: [
    {
      role: "Senior Associate — Infrastructure, Platform Engineering",
      company: "Publicis Sapient",
      location: "Gurgaon, India",
      period: "Sep 2025 – Present",
      current: true,
      highlights: [
        "Owns GitOps delivery for backend services on Argo CD, standardising how applications are promoted across environments and eliminating manual per-environment configuration for client-facing platforms.",
        "Authored reusable Helm charts and an App-of-Apps architecture so product teams onboard new services self-service, cutting configuration drift between environments and reducing platform-team ticket load.",
        "Built a scalable DevSecOps CI pipeline integrating SAST, Gitleaks credential scanning and Trivy image scanning as shared reusable stages, shifting source, secret and container vulnerability detection left across every consuming repository.",
        "Serves as escalation point and SME for deployment failures, Helm templating issues, Argo CD sync errors and environment-specific defects across application and platform teams.",
        "Drives AI-assisted infrastructure automation, developing reusable prompt patterns for server provisioning and Amazon RDS configuration workflows.",
      ],
      tech: ["Argo CD", "Helm", "Kubernetes", "SAST", "Gitleaks", "Trivy", "AWS RDS"],
    },
    {
      role: "DevOps Engineer — GitLab CI/CD & Kubernetes Platform",
      company: "Deutsche Telekom Digital Labs",
      location: "Gurgaon, India",
      period: "Dec 2024 – Sep 2025",
      highlights: [
        "Administered and tuned the GitLab Runner fleet at the Linux OS level, resolving contention and resource bottlenecks to materially improve pipeline throughput and reduce developer wait time across shared CI capacity.",
        "Planned and executed production Amazon EKS cluster upgrades with minimal downtime, owning workload and dependency validation, rollback readiness and service-availability verification end to end.",
        "Implemented Istio service mesh with Argo CD canary deployments to enable progressive delivery, traffic shaping, safer rollouts and rapid rollback for production microservices.",
        "Designed GitLab CI/CD security pipelines integrating MobSF for automated Android vulnerability scanning, and integrated OWASP ZAP DAST into lower-environment pipelines.",
        "Led RabbitMQ and Apache NiFi production upgrades with zero-to-minimal downtime, protecting business-critical integration services.",
        "Introduced operational dashboards and alerting for pipeline and platform health, giving teams visibility into build reliability, runner utilisation and failure trends.",
      ],
      tech: ["GitLab CI/CD", "GitLab Runner", "Amazon EKS", "Istio", "Argo CD", "MobSF", "OWASP ZAP", "RabbitMQ", "Apache NiFi"],
    },
    {
      role: "DevOps Specialist — Cloud Platform, IaC & Governance",
      company: "OpsTree Solutions",
      location: "Noida, India",
      period: "Apr 2022 – Dec 2024",
      highlights: [
        "Established AWS Control Tower landing zones, Service Control Policies, AWS SSO integration and governance guardrails across a multi-account environment — owning access control and account structure, not just build automation.",
        "Built Terraform provisioning pipelines driven from GitLab CI/CD, automating repeatable infrastructure delivery across AWS and GCP production and non-production estates.",
        "Delivered cloud resource optimisation initiatives that reduced spend by 30% while building secure AWS foundations for development and production environments.",
        "Developed reusable Ansible roles with dynamic inventory and Molecule test coverage, automating MongoDB cluster deployment and multi-OS configuration management.",
        "Provisioned and operated GKE Standard clusters supporting containerised production workloads.",
        "Automated Jenkins seed jobs to generate pipelines programmatically, enforcing consistent CI/CD standards and improving disaster-recovery readiness.",
        "Implemented VPN access patterns and compliance automation saving approximately 25 manual audit hours per month.",
      ],
      tech: ["AWS Control Tower", "Service Control Policies", "AWS SSO", "Terraform", "Ansible", "Molecule", "GKE", "Jenkins", "MongoDB"],
    },
  ],

  skills: {
    "GitLab Platform": [
      "GitLab CI/CD administration and pipeline architecture",
      "Runner fleet provisioning, scaling and OS-level performance tuning",
      "Reusable CI/CD templates and shared components (include / extends)",
      "Group and project structure, permissions and access management",
      "Protected branches and environments, approval gates",
      "CI/CD variables and secrets handling",
    ],
    "Cloud & Governance": [
      "AWS (EKS, RDS, IAM, VPC, EC2, S3)",
      "GCP (GKE)",
      "AWS Control Tower landing zones",
      "Service Control Policies and multi-account guardrails",
      "AWS IAM Identity Center (SSO) / SAML federation",
    ],
    "Infrastructure as Code": [
      "Terraform (reusable modules, remote state, CI-driven plan/apply pipelines)",
      "Ansible (reusable roles, dynamic inventory, Molecule testing)",
      "Helm charts",
    ],
    "Kubernetes & GitOps": [
      "Amazon EKS and GKE, including production upgrades with rollback readiness",
      "Argo CD and App-of-Apps",
      "Canary and progressive delivery",
      "Istio service mesh",
      "Docker, microservices at scale",
    ],
    "Security & DevSecOps": [
      "SAST and DAST",
      "OWASP ZAP",
      "SonarQube",
      "Trivy container image scanning",
      "Gitleaks credential scanning",
      "MobSF",
    ],
    "Observability & SRE": [
      "Prometheus",
      "Grafana",
      "ELK",
      "Platform and pipeline dashboards, alerting, incident response",
    ],
    "Languages & Other": ["Python", "Bash / Shell", "Git", "Linux administration", "Jenkins"],
  },

  /**
   * Engineering case studies. Each is drawn directly from documented work in the
   * experience entries above — these are real deliverables, not invented side projects.
   */
  caseStudies: [
    {
      name: "GitOps delivery with Argo CD and App-of-Apps",
      where: "Publicis Sapient",
      problem:
        "Backend services were promoted across environments manually, so every environment needed its own hand-maintained configuration. That produced drift between environments and a steady stream of tickets into the platform team.",
      approach:
        "Standardised promotion on Argo CD and authored reusable Helm charts behind an App-of-Apps structure, so a new service is onboarded by declaring it rather than by hand-configuring each environment.",
      stack: ["Argo CD", "Helm", "Kubernetes", "Git"],
      outcome:
        "Product teams onboard services self-service. Configuration drift between environments is reduced and platform-team ticket load is lower.",
    },
    {
      name: "GitLab Runner fleet tuning",
      where: "Deutsche Telekom Digital Labs",
      problem:
        "Shared CI capacity was contended. Developers waited on pipelines, and the bottleneck was below the CI layer — in how runners were provisioned and how the host OS handled concurrent jobs.",
      approach:
        "Administered and tuned the GitLab Runner fleet at the Linux OS level, resolving resource contention and bottlenecks rather than simply adding more runners.",
      stack: ["GitLab Runner", "Linux", "GitLab CI/CD"],
      outcome:
        "Materially improved pipeline throughput and reduced developer wait time across shared CI capacity.",
    },
    {
      name: "Production EKS upgrades and progressive delivery",
      where: "Deutsche Telekom Digital Labs",
      problem:
        "Production Kubernetes clusters needed version upgrades without taking down business-critical microservices, and rollouts had no safe intermediate step between deployed and not deployed.",
      approach:
        "Planned and executed EKS upgrades end to end — workload and dependency validation, rollback readiness, service-availability verification. Introduced Istio with Argo CD canary deployments so traffic could be shifted gradually and rolled back quickly.",
      stack: ["Amazon EKS", "Istio", "Argo CD", "Kubernetes"],
      outcome:
        "Upgrades completed with minimal downtime. Progressive delivery gave production rollouts a safe, reversible path.",
    },
    {
      name: "Multi-account AWS governance",
      where: "OpsTree Solutions",
      problem:
        "A multi-account AWS estate needed consistent account structure, access control and guardrails — governance, not just build automation.",
      approach:
        "Established Control Tower landing zones, Service Control Policies and AWS SSO federation, and drove Terraform provisioning pipelines from GitLab CI/CD so infrastructure delivery was repeatable across AWS and GCP.",
      stack: ["AWS Control Tower", "SCPs", "AWS SSO", "Terraform", "GitLab CI/CD"],
      outcome:
        "Cloud spend reduced by 30%. Compliance automation saved approximately 25 manual audit hours per month.",
    },
  ],

  /**
   * Client delivery engagements. Details come from Sohan's own account of the
   * work and the architecture diagrams he produced. Client account IDs,
   * internal hostnames and network CIDRs are deliberately excluded — the
   * architecture pattern is what demonstrates the work.
   */
  projects: [
    {
      name: "Atmoon — payments platform infrastructure, built to compliance",
      client: "Atmoon",
      duration: "Delivered from scratch in 3 months",
      description:
        "Greenfield AWS infrastructure for a payments platform, delivered end to end from discovery through to running environments. Started with a discovery pass over the existing estate to establish what actually ran where, then designed and built the target architecture against compliance requirements including PCI DSS.",
      highlights: [
        "Pre-discovery of the existing estate before any build, so the target design addressed real workloads rather than assumptions.",
        "Multi-account AWS Organization with OUs per environment and Service Control Policies scoped per account, plus a central tagging policy enforced across the estate.",
        "Tiered VPC design across two availability zones — public, application, middleware and database subnets, each with its own NACLs and security groups, and NAT gateways per AZ.",
        "Separate management VPC peered to the workload VPCs, carrying Jenkins, the load balancer and OpenVPN access so operational entry points sit outside the application network.",
        "All infrastructure provisioned with Terraform; OS configuration and patching handled through Ansible and AWS Systems Manager Patch Manager.",
        "Amazon EKS with Istio service mesh for APM visibility and mTLS between services, with Kubernetes RBAC enforced on top of the cluster.",
        "Observability across the platform with Prometheus, Grafana and an EFK logging stack.",
      ],
      stack: ["AWS", "Terraform", "Ansible", "AWS SSM", "Amazon EKS", "Istio", "Kubernetes RBAC", "Service Control Policies", "Prometheus", "Grafana", "EFK"],
    },
    {
      name: "Aerohub — multi-account landing zone and compliance re-architecture",
      client: "Aerohub, India",
      description:
        "Moved Aerohub from a flat AWS estate to an Organizations-based landing zone, segregating environments and business verticals into their own accounts under a governed OU structure so compliance and access boundaries follow the org chart rather than cutting across it.",
      highlights: [
        "Designed the OU hierarchy — Core, Security, Infrastructure and Platform OUs alongside per-vertical OUs, each with QA, performance-test and production accounts underneath.",
        "Service Control Policies attached at every OU level, so guardrails are inherited rather than reapplied per account.",
        "AWS Control Tower for landing zone provisioning, with Service Catalog for standardised account vending.",
        "IAM Identity Center federated to Aerohub's external identity provider, giving single sign-on into every account with per-account permission sets instead of long-lived IAM users.",
        "Dedicated Log Archive account aggregating CloudTrail and CloudWatch into S3, and a separate Security account running Security Hub, GuardDuty and AWS Config across the organisation.",
        "Centralised billing at the organisation root for cost visibility per account and per vertical.",
      ],
      stack: ["AWS Organizations", "AWS Control Tower", "Service Control Policies", "IAM Identity Center", "Service Catalog", "Security Hub", "GuardDuty", "AWS Config", "CloudTrail", "Amazon EKS", "RDS"],
    },
  ],

  principles: [
    {
      title: "Infrastructure as Code",
      body: "If it was clicked in a console, it will drift. Terraform modules and Ansible roles with real test coverage, applied through pipelines rather than laptops.",
    },
    {
      title: "Security by default",
      body: "Scanning belongs in the shared pipeline stage every team already consumes, not in a checklist someone remembers. SAST, secret scanning and image scanning run on every commit or they do not run.",
    },
    {
      title: "GitOps",
      body: "Git is the desired state. Promotion between environments should be a declaration, not a runbook — which also makes rollback a revert.",
    },
    {
      title: "Reversible rollouts",
      body: "Canary and progressive delivery exist so production changes have a middle state. An upgrade plan without a rollback plan is not a plan.",
    },
    {
      title: "Observability before incidents",
      body: "Dashboards and alerting for pipeline and platform health, so failure trends are visible before someone escalates them.",
    },
    {
      title: "Self-service over tickets",
      body: "The platform team should not be in the path of every deployment. Reusable templates and App-of-Apps let product teams move without waiting.",
    },
  ],

  writing: [
    {
      title: "Pod Priority, Priority Class, and Preemption",
      publisher: "OpsTree engineering blog",
      date: "22 November 2022",
      url: "https://opstree.com/blog/pod-priority-priority-classamp-preemption/",
      about:
        "Making sure critical Kubernetes workloads get scheduled ahead of others: defining priority classes, the integer priority range, and configuring preemption so higher-priority pods can evict lower-priority ones when a cluster is resource-constrained.",
    },
    {
      title: "Securing Kubernetes Traffic with Cert-Manager & Let's Encrypt",
      publisher: "OpsTree engineering blog",
      date: "27 September 2022",
      url: "https://opstree.com/blog/securing-k8s-traffic-with-cert-manager-amp-lets-encrypt/",
      about:
        "Automating TLS certificate issuance and renewal inside a cluster with cert-manager and the Kong ingress controller, wiring up ClusterIssuers so domain traffic is served over HTTPS without manual certificate handling.",
    },
    {
      title: "Why Argo CD? Understanding GitOps Core Architecture",
      publisher: "Medium",
      url: "https://medium.com/@Sohan_Dogra/why-argo-cd-understanding-gitops-core-architecture-71b2e144dee2",
      about: "Argo CD and the architecture underneath GitOps delivery.",
    },
    {
      title: "Optimizing Prometheus: Dropping Unwanted Metrics for Better Memory Management",
      publisher: "Medium",
      url: "https://medium.com/@Sohan_Dogra/optimizing-prometheus-dropping-unwanted-metrics-for-better-memory-management-075721f918c8",
      about: "Reducing Prometheus memory usage by dropping metrics that are never queried.",
    },
  ],

  certifications: [
    { name: "AWS Certified Solutions Architect – Associate", status: "Active" },
    { name: "Certified Kubernetes Administrator (CKA)", status: "Active" },
  ],

  education: {
    degree: "Bachelor of Computer Science",
    institution: "Tilak Maharashtra Vidyapeeth, Pune",
    years: "2020 – 2023",
  },
};

/** Render the knowledge base as plain text for the model's system prompt. */
export function knowledgeBaseText() {
  const p = profile;
  const lines = [];

  lines.push(`NAME: ${p.name}`);
  lines.push(`TITLE: ${p.title}`);
  lines.push(`LOCATION: ${p.location}`);
  lines.push(`AVAILABILITY: ${p.availability}`);
  lines.push(`YEARS OF EXPERIENCE: ${p.experienceYears}`);
  lines.push(`CONTACT: ${p.email} · ${p.phone}`);
  lines.push(`LINKS: GitHub ${p.links.github} · LinkedIn ${p.links.linkedin}`);
  lines.push("");
  lines.push(`SUMMARY: ${p.summary}`);

  lines.push("\nEXPERIENCE:");
  for (const job of p.experience) {
    lines.push(`- ${job.role} at ${job.company} (${job.location}), ${job.period}`);
    for (const h of job.highlights) lines.push(`    * ${h}`);
    lines.push(`    Technologies: ${job.tech.join(", ")}`);
  }

  lines.push("\nSKILLS:");
  for (const [group, items] of Object.entries(p.skills)) {
    lines.push(`- ${group}: ${items.join("; ")}`);
  }

  lines.push("\nENGINEERING CASE STUDIES:");
  for (const c of p.caseStudies) {
    lines.push(`- ${c.name} (at ${c.where})`);
    lines.push(`    Problem: ${c.problem}`);
    lines.push(`    Approach: ${c.approach}`);
    lines.push(`    Stack: ${c.stack.join(", ")}`);
    lines.push(`    Outcome: ${c.outcome}`);
  }

  lines.push("\nCLIENT DELIVERY PROJECTS:");
  for (const pr of p.projects) {
    lines.push(`- ${pr.name}`);
    lines.push(`    Client: ${pr.client}${pr.duration ? " — " + pr.duration : ""}`);
    lines.push(`    ${pr.description}`);
    for (const h of pr.highlights) lines.push(`      * ${h}`);
    lines.push(`    Stack: ${pr.stack.join(", ")}`);
  }

  lines.push("\nENGINEERING PRINCIPLES:");
  for (const pr of p.principles) lines.push(`- ${pr.title}: ${pr.body}`);

  lines.push("\nPUBLISHED WRITING:");
  for (const w of p.writing) {
    lines.push(`- "${w.title}" — ${w.publisher}${w.date ? ", " + w.date : ""} (${w.url})`);
    lines.push(`    ${w.about}`);
  }

  lines.push("\nCERTIFICATIONS:");
  for (const c of p.certifications) lines.push(`- ${c.name} (${c.status})`);

  lines.push(
    `\nEDUCATION: ${p.education.degree}, ${p.education.institution}, ${p.education.years}`
  );

  return lines.join("\n");
}
