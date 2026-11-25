// Public configuration only. Rebuild after changing. Never add secrets here.
export const site = {
  name: 'Smart Exam',
  origin: 'https://smart-exam.net',
  description: 'Enterprise examination management, department-scoped operations and browser-based proctoring on customer-controlled infrastructure.',
  legalEntity: '',
  salesEmail: '',
  telephone: '',
  whatsapp: '',
  teamsBookingUrl: '',
};

export const navigation = [
  { label: 'Platform', href: '/platform/' },
  { label: 'Solutions', href: '/solutions/' },
  { label: 'Deployment', href: '/on-premises/' },
  { label: 'Resources', href: '/resources/' },
];

export interface PageSection { title: string; body: string; items?: string[]; }
export interface ProductPage {
  slug: string; eyebrow: string; title: string; description: string; purpose: string;
  visual: 'operations' | 'departments' | 'evidence' | 'architecture';
  sections: PageSection[]; note: string; related: string[];
}

export const productPages: ProductPage[] = [
  {
    slug: 'platform', eyebrow: 'The Smart Exam platform', title: 'A clear workflow. From question to result.',
    description: 'Connect the people, content and decisions behind your examinations in a platform designed for enterprise operations.',
    purpose: 'Explore your assessment workflow', visual: 'operations',
    sections: [
      { title: 'Prepare with structure', body: 'Organize reusable question banks, build examination sections and assign candidates in batches. Give authors and exam administrators a consistent starting point.', items: ['Question banks with subjects and topics', 'Structured examination setup', 'Candidate import and cohort assignment'] },
      { title: 'Deliver with context', body: 'Choose fixed starts or flexible examination windows. Coordinate candidate access, proctor assignments and permitted operational interventions.', items: ['Fixed and flexible scheduling', 'Role-based examination workflows', 'Browser-based candidate experience'] },
      { title: 'Review before you decide', body: 'Bring grading, captured evidence and controlled result publication into the operational process. Keep people responsible for assessment decisions.', items: ['Manual grading and result review', 'Proctoring evidence and incident context', 'Controlled publication of results'] },
    ], note: 'Your deployment scope, supported browsers, integrations and operating capacity are agreed during technical discovery and acceptance.', related: ['examination-management', 'departments', 'live-proctoring'],
  },
  {
    slug: 'examination-management', eyebrow: 'Examination management', title: 'Make the next exam easier to run.',
    description: 'Replace disconnected authoring, candidate lists and scheduling handoffs with a repeatable examination workflow.',
    purpose: 'Plan an examination workflow demo', visual: 'operations',
    sections: [
      { title: 'Build a reusable foundation', body: 'Manage questions, options, topics and attachments. Assemble sections and examination settings around the assessment you own.', items: ['Reusable question content', 'Section and topic organization', 'Configurable ordering and examination settings'] },
      { title: 'Bring the cohort together', body: 'Manage candidates and batches, import administrative records and assign examinations. Shared-link walk-in registration can support approved event workflows.', items: ['Candidate and batch administration', 'Administrative spreadsheet interchange', 'Walk-in registration through configured share links'] },
      { title: 'Keep delivery and publication deliberate', body: 'Set fixed or flexible schedules, coordinate permitted attempt controls, and review grading before publishing results.', items: ['Scheduled starts and permitted windows', 'Authorized additional time and attempt actions', 'Grading and result publication'] },
    ], note: 'Administrative Excel import is separate from assessment delivery. A graded Microsoft Excel skills examination and registration waiting lists are outside the current offer.', related: ['departments', 'solutions', 'integrations'],
  },
  {
    slug: 'departments', eyebrow: 'Department-scoped operations', title: 'Give each team a defined operating space.',
    description: 'Organize examination responsibilities by department while retaining central oversight of the platform.',
    purpose: 'Discuss your departmental model', visual: 'departments',
    sections: [
      { title: 'Give ownership a practical boundary', body: 'Department-aware access checks scope examination and candidate workflows. Staff work within their permitted responsibilities instead of relying on separate spreadsheets.', items: ['Department-scoped examination operations', 'Role and assignment-based access', 'Central organization-wide oversight'] },
      { title: 'Coordinate specialist roles', body: 'Authors, graders and proctors take part in different stages of delivery. Explicit assignments can support cross-department proctoring where authorized.', items: ['Distinct operational roles', 'Explicit examination and proctor assignments', 'Permission review during implementation'] },
      { title: 'Design governance before rollout', body: 'Map departments, central administrators and cross-team exceptions during discovery. Test both permitted actions and denied access before acceptance.', items: ['Agreed responsibility matrix', 'Synthetic cross-department acceptance scenarios', 'Documented central administration'] },
    ], note: 'Departments use logical application access controls in a shared application and database. Central SuperAdmin functions include user, role and department administration. This is not physical tenant or database isolation.', related: ['security', 'platform', 'on-premises'],
  },
  {
    slug: 'live-proctoring', eyebrow: 'Human-led live proctoring', title: 'Give proctors the context to act.',
    description: 'Support human supervision with live browser video, optional screen sharing and examination event context.',
    purpose: 'Explore a proctoring workflow', visual: 'evidence',
    sections: [
      { title: 'Observe the active session', body: 'Browser-based webcam video gives authorized proctors live candidate context. Optional live screen sharing provides another view when the candidate grants permission.', items: ['WebRTC webcam sessions', 'Separate permission-based screen sharing', 'Assigned proctor workflows'] },
      { title: 'Handle exceptions through a workflow', body: 'Use session context and authorized operational actions to respond to an interruption. Agree escalation and candidate support processes before examination day.', items: ['Session events and evidence context', 'Human warnings and operational review', 'Deployment-specific network diagnostics'] },
      { title: 'Rehearse the environment', body: 'Camera permissions, browser support, bandwidth, firewalls and relay configuration influence the experience. Test realistic candidate networks during the pilot.', items: ['Supported browser and device checks', 'STUN/TURN and restricted-network testing', 'Candidate preparation and support planning'] },
    ], note: 'Live screen sharing is distinct from archived screen video. Smart Exam does not promise whole-device visibility, OS lockdown, biometric identity assurance or automated proof of misconduct.', related: ['recording-evidence', 'intelligent-monitoring', 'on-premises'],
  },
  {
    slug: 'recording-evidence', eyebrow: 'Recording and evidence review', title: 'Review what happened. Make a considered decision.',
    description: 'Give authorized reviewers access to captured webcam recordings, snapshots and session events after an examination.',
    purpose: 'Plan your evidence review process', visual: 'evidence',
    sections: [
      { title: 'Connect events to context', body: 'Review captured webcam footage alongside session events and supporting images. Help reviewers understand an incident before reaching a decision.', items: ['Webcam recording when configured', 'Session event timeline', 'Captured supporting evidence'] },
      { title: 'Define who can review', body: 'Agree reviewer roles, permitted access and escalation responsibilities. Evidence should support a documented human decision and a fair candidate process.', items: ['Authorized review workflows', 'Incident and decision context', 'Customer-defined retention policy'] },
      { title: 'Plan the operating cost', body: 'Recording duration, storage, retention, network conditions and recovery requirements shape your deployment. Include interruption and playback tests in acceptance.', items: ['Storage and retention planning', 'Browser/codec playback testing', 'Recording interruption scenarios'] },
    ], note: 'Recording is dependent on browser, network and configuration. Completeness, immutable chain of custody and legal admissibility are not guaranteed. Screen video archiving is outside the current verified scope.', related: ['live-proctoring', 'security', 'intelligent-monitoring'],
  },
  {
    slug: 'intelligent-monitoring', eyebrow: 'Advisory monitoring', title: 'Useful signals. Human judgment.',
    description: 'Surface browser activity and configured camera-condition signals so proctors can decide what needs a closer look.',
    purpose: 'Discuss monitoring and review policy', visual: 'evidence',
    sections: [
      { title: 'Bring signals into the session', body: 'Browser focus, fullscreen and activity events can add context to an examination. Optional local face-landmark processing can flag camera conditions such as an absent face or multiple faces.', items: ['Browser activity events', 'Optional camera-condition signals', 'Event context for human reviewers'] },
      { title: 'Keep interpretation accountable', body: 'A signal can have an innocent explanation. Configure thresholds and review guidance, plan accommodations, and retain a human decision process.', items: ['Advisory event interpretation', 'Policy and accommodation review', 'Human-led escalation'] },
      { title: 'Validate optional AI separately', body: 'AI-assisted question drafting and review services can be discussed during discovery. Provider configuration, data handling and output quality require separate acceptance.', items: ['Optional reviewed authoring assistance', 'External provider data-flow review', 'Buyer-specific validation'] },
    ], note: 'Signals and risk scores are not verified probabilities of cheating. No biometric matching, liveness assurance or misconduct-detection accuracy claim is made. Optional external AI services can process data outside customer infrastructure.', related: ['security', 'live-proctoring', 'recording-evidence'],
  },
  {
    slug: 'on-premises', eyebrow: 'Customer-controlled deployment', title: 'Your environment. A defined operating model.',
    description: 'Plan Smart Exam around your infrastructure, identity and data-handling requirements, with implementation responsibilities agreed from the start.',
    purpose: 'Discuss a customer-hosted deployment', visual: 'architecture',
    sections: [
      { title: 'Keep infrastructure decisions with your team', body: 'The browser frontend, application API, database and evidence storage can be deployed within customer-controlled infrastructure.', items: ['Static browser frontend', 'Application API and SQL Server database', 'Configured evidence storage'] },
      { title: 'Make dependencies visible', body: 'Plan TLS, identity, email, WebSocket connectivity and optional media relays. External AI or identity services are separate data-flow decisions.', items: ['Network and storage planning', 'Optional provider and relay review', 'Identity integration discovery'] },
      { title: 'Agree the handover', body: 'Define installation, patching, backups, restore, monitoring, retention and support ownership. Acceptance should include failure and recovery scenarios.', items: ['Deployment responsibility matrix', 'Administrator training and runbooks', 'Agreed acceptance and support scope'] },
    ], note: 'Customer hosting is not a claim of air-gapped operation, automatic compliance or managed SaaS availability. Infrastructure licenses, support hours and tested capacity are scoped for each engagement.', related: ['security', 'integrations', 'licensing'],
  },
  {
    slug: 'security', eyebrow: 'Security and data control', title: 'Start the trust conversation with specifics.',
    description: 'Discuss access boundaries, evidence handling, deployment responsibilities and external data flows before committing to an examination program.',
    purpose: 'Arrange a technical discovery session', visual: 'architecture',
    sections: [
      { title: 'Map access to responsibilities', body: 'Role-based and resource-level access controls support examination workflows. Department scope, central administration and assignment exceptions are documented during implementation.', items: ['Role-based examination responsibilities', 'Department and resource access checks', 'Deployment-specific permission testing'] },
      { title: 'Define the evidence lifecycle', body: 'Agree what is collected, who reviews it and when it is removed. Customer-controlled infrastructure supports custody; contracts define ownership and processing responsibilities.', items: ['Recording and media access planning', 'Retention and deletion responsibilities', 'Backup, restore and incident processes'] },
      { title: 'Evaluate before acceptance', body: 'Review your requirements against the proposed release and configuration. Establish supported capacity, browser behavior and recovery procedures through a scoped pilot.', items: ['Release-specific technical review', 'Synthetic acceptance scenarios', 'Explicit external provider data flows'] },
    ], note: 'No SOC 2, ISO 27001, accessibility conformance, legal-compliance certification or uptime claim is made. Security and privacy requirements require technical and contractual evaluation.', related: ['departments', 'on-premises', 'integrations'],
  },
  {
    slug: 'integrations', eyebrow: 'Enterprise integration discovery', title: 'Fit the workflow to your organization.',
    description: 'Align identity, candidate data and operating processes through clearly scoped integration work.',
    purpose: 'Discuss integration requirements', visual: 'architecture',
    sections: [
      { title: 'Start with identity', body: 'The product contains provider-specific OIDC/SSO and UAE PASS integration paths. Confirm the identity provider, account-provisioning policy and approval process during discovery.', items: ['Provider-specific identity workflows', 'UAE PASS for relevant approved deployments', 'Account and role-mapping review'] },
      { title: 'Move administrative data deliberately', body: 'Candidate and batch spreadsheet interchange can support setup. Other interfaces and LMS or HR connections require a separate technical scope.', items: ['Candidate and batch import/export', 'Data mapping and migration planning', 'Custom interface discovery'] },
      { title: 'Scope the complete dependency', body: 'Agree provider credentials, licensing, security review, test accounts, acceptance scenarios and ongoing support. Integration effort is quoted after technical assessment.', items: ['Protocol and data-flow agreement', 'Non-production provider testing', 'Ownership and change-control plan'] },
    ], note: 'Provider code does not establish an off-the-shelf connector for every identity provider, LMS, SAML service or HR system. Provider approval and buyer-specific acceptance remain necessary.', related: ['on-premises', 'security', 'request-quote'],
  },
];

export const pageTitles: Record<string, string> = Object.fromEntries(productPages.map(p => [p.slug, p.eyebrow]));
Object.assign(pageTitles, { solutions: 'Industry solutions', licensing: 'Licensing', 'request-quote': 'Request a quote', resources: 'Resources' });

export const faqs = [
  ['Who is Smart Exam designed for?', 'Organizations running their own examinations: professional training providers, certification teams and corporate academies. Fit depends on your assessment process, governance, infrastructure and acceptance requirements.'],
  ['Can we deploy on our own infrastructure?', 'Customer-hosted deployment is supported by the architecture. We agree the application, database, storage, identity, network and operational responsibilities during technical discovery. This does not imply fully disconnected operation.'],
  ['How does department separation work?', 'Departments have logical application access scope in a shared application and database. Central administrators retain oversight. User and role administration remains central, and authorized assignments can allow cross-department proctor activity.'],
  ['What can a proctor see and review?', 'Configured browser webcam sessions, optional live screen sharing, session events and captured evidence. Webcam recording is available when configured and accepted. Screen video archiving and guaranteed complete recordings are outside the current verified scope.'],
  ['Does monitoring automatically decide whether someone cheated?', 'No. Browser and camera-condition signals are advisory and require human review. They do not establish misconduct, biometric identity, liveness or a verified probability of cheating.'],
  ['Are English and Arabic supported?', 'The product includes English, Arabic and right-to-left interface behavior. Translation, accessibility and the required candidate journeys are checked during acceptance. Other languages require assessment.'],
  ['Can Smart Exam connect to our identity provider?', 'Provider-specific SSO/OIDC and UAE PASS paths exist. Your provider, provisioning rules, approvals and integration tests are scoped separately. We do not claim a prebuilt connector for every system.'],
  ['Is this a public SaaS subscription?', 'The current commercial focus is a scoped customer-hosted enterprise deployment. Hosting, operating responsibilities, license terms and support are agreed in a proposal.'],
  ['How is pricing determined?', 'A proposal reflects examination workflows, deployment, required integrations, proctoring scope, implementation and support. Request a scoped quotation. No fixed price is published here.'],
  ['What happens in a demonstration?', 'We discuss your assessment process, walk through a synthetic scenario and identify what a deployment pilot must validate. The website walkthrough is an illustration, not a connection to a customer system.'],
];
