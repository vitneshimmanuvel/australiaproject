export const userRoles = [
  {
    id: 'admin',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@libtrak.gov.au',
    role: 'Library Staff Admin (Master Authority)',
    type: 'admin',
    avatar: 'SJ',
    badge: '👑 Master Admin',
  },
  {
    id: 'cba_user',
    bankId: 'cba',
    name: 'David Miller',
    email: 'david.miller@cba.com.au',
    role: 'CBA Principal Security Architect',
    type: 'bank',
    bankName: 'Commonwealth Bank (CBA)',
    avatar: 'DM',
    badge: '🏛️ CBA Tenant',
  },
  {
    id: 'nab_user',
    bankId: 'nab',
    name: 'Rachel Wong',
    email: 'rachel.wong@nab.com.au',
    role: 'NAB Head of Regulatory Compliance',
    type: 'bank',
    bankName: 'National Australia Bank (NAB)',
    avatar: 'RW',
    badge: '🏛️ NAB Tenant',
  },
  {
    id: 'wbc_user',
    bankId: 'wbc',
    name: 'Anthony Clarke',
    email: 'anthony.clarke@westpac.com.au',
    role: 'Westpac Enterprise Risk Lead',
    type: 'bank',
    bankName: 'Westpac Banking Corp (WBC)',
    avatar: 'AC',
    badge: '🏛️ Westpac Tenant',
  },
  {
    id: 'anz_user',
    bankId: 'anz',
    name: 'Elena Rossi',
    email: 'elena.rossi@anz.com.au',
    role: 'ANZ Head of Application Security',
    type: 'bank',
    bankName: 'ANZ Banking Group (ANZ)',
    avatar: 'ER',
    badge: '🏛️ ANZ Tenant',
  },
];

export const banksList = [
  {
    id: 'cba',
    name: 'Commonwealth Bank of Australia (CBA)',
    tier: 'Tier 1 Regulated Bank',
    subscriptionStatus: 'Active Enterprise',
    joinedDate: 'Jan 15, 2025',
    activeAddendaCount: 4,
    complianceStatus: 'APRA CPS 234 Verified',
    contactEmail: 'security-governance@cba.com.au',
    lastAuditDate: 'Sep 21, 2026',
    addendaSummary: 'Hardware token step-up for high-net-worth accounts & 15m session timeouts.',
  },
  {
    id: 'nab',
    name: 'National Australia Bank (NAB)',
    tier: 'Tier 1 Regulated Bank',
    subscriptionStatus: 'Active Enterprise',
    joinedDate: 'Mar 02, 2025',
    activeAddendaCount: 3,
    complianceStatus: 'APRA CPS 234 Verified',
    contactEmail: 'compliance-desk@nab.com.au',
    lastAuditDate: 'Sep 18, 2026',
    addendaSummary: 'Cross-border AML review > $2,500 AUD & blue-green test environment bypass.',
  },
  {
    id: 'wbc',
    name: 'Westpac Banking Corp (WBC)',
    tier: 'Tier 1 Regulated Bank',
    subscriptionStatus: 'Active Enterprise',
    joinedDate: 'Feb 10, 2025',
    activeAddendaCount: 5,
    complianceStatus: 'APRA CPS 234 Verified',
    contactEmail: 'risk-oversight@westpac.com.au',
    lastAuditDate: 'Sep 14, 2026',
    addendaSummary: 'Dual-authorization for automated treasury API key generations & limit adjustments.',
  },
  {
    id: 'anz',
    name: 'ANZ Banking Group (ANZ)',
    tier: 'Tier 1 Regulated Bank',
    subscriptionStatus: 'Active Enterprise',
    joinedDate: 'Apr 20, 2025',
    activeAddendaCount: 2,
    complianceStatus: 'APRA CPS 234 Verified',
    contactEmail: 'appsec-core@anz.com.au',
    lastAuditDate: 'Sep 22, 2026',
    addendaSummary: 'Passkey & biometric verification enforcement on iOS 18+ and Android 15.',
  },
];

// Real Banking Regulatory Hierarchy
export const bankingHierarchy = [
  {
    id: 'prudential-standards',
    label: 'APRA PRUDENTIAL STANDARDS',
    children: [
      {
        id: 'cps-234-group',
        label: 'CPS 234: Information Security',
        children: [
          { id: 'oauth-sso', label: 'OAuth 2.0 & SSO Access Security', version: 'v3.1.2' },
          { id: 'privileged-access', label: 'Privileged Access Management (PAM)', version: 'v2.4.0' },
          { id: 'mfa-enforcement', label: 'FIDO2 / MFA Mandatory Controls', version: 'v1.9.0' },
        ],
      },
      {
        id: 'cps-230-group',
        label: 'CPS 230: Operational Risk Management',
        children: [
          { id: 'business-continuity', label: 'Critical Service Continuity & SLAs', version: 'v2.1.0' },
          { id: 'third-party-risk', label: 'Third-Party Service Provider Controls', version: 'v1.6.0' },
        ],
      },
    ],
  },
  {
    id: 'privacy-data-governance',
    label: 'PRIVACY & CUSTOMER DATA GOVERNANCE',
    children: [
      {
        id: 'app-privacy-group',
        label: 'Australian Privacy Principles (APP 1-13)',
        children: [
          { id: 'data-retention-privacy', label: 'APP 11: Security & Destruction of PII', version: 'v4.0.1' },
          { id: 'open-banking-cdr', label: 'Open Banking CDR Consent Lifecycle', version: 'v3.2.0' },
        ],
      },
    ],
  },
  {
    id: 'financial-crime-aml',
    label: 'AML/CTF & FINANCIAL CRIME (AUSTRAC)',
    children: [
      {
        id: 'aml-transaction-monitoring',
        label: 'Transaction Monitoring & KYC Rules',
        children: [
          { id: 'aml-threshold-reporting', label: 'Threshold Transaction Reporting (TTR)', version: 'v3.0.0' },
          { id: 'sanctions-screening', label: 'Real-Time Sanctions Screening', version: 'v2.2.4' },
        ],
      },
    ],
  },
  {
    id: 'payment-rails-gateway',
    label: 'PAYMENT RAILS & API INFRASTRUCTURE',
    children: [
      {
        id: 'payment-gateways-group',
        label: 'Payment Gateways & Throttling',
        children: [
          { id: 'npp-payid-rules', label: 'New Payments Platform (NPP) Rails', version: 'v2.5.0' },
          { id: 'rate-limiting-api', label: 'Merchant API Rate Limiting & Throttling', version: 'v2.1.0' },
        ],
      },
    ],
  },
];

export const policiesDatabase = {
  'oauth-sso': {
    id: 'oauth-sso',
    title: 'OAuth 2.0 & Single Sign-On (SSO) Security',
    breadcrumb: 'APRA Prudential Standards / CPS 234 Information Security • Production',
    latestVersion: 'v3.1.2',
    lastUpdated: 'Sep 21, 2026',
    ownedBy: 'Identity & Access Squad',
    complianceLevel: 'APRA CPS 234 / SOC2 Type II / ISO27001',
    visionStatement:
      'Ensure seamless, secure multi-tenant identity verification across banking web and mobile surfaces without compromising token propagation speed or statutory security policies.',
    dependencies: [
      { name: 'Auth0 / Okta Enterprise API', status: 'Healthy' },
      { name: 'Hardware Security Module (HSM) Vault', status: '99.99% Uptime' },
      { name: 'Active Directory / Core LDAP Sync', status: 'Active' },
    ],
    coreFrameworkClauses: [
      {
        clauseId: 'CPS234-SEC-01',
        title: 'Mandatory PKCE & Asymmetric Cryptographic Signing',
        content:
          'All confidential and public banking clients authenticating via OAuth 2.0 must enforce Proof Key for Code Exchange (PKCE RFC 7636). Token validation microservices shall reject symmetric HS256 tokens and require RS256/ES256 asymmetric cryptographic keys refreshed every 30 days.',
      },
      {
        clauseId: 'CPS234-SEC-02',
        title: 'Maximum Refresh Token Inactivity Window',
        content:
          'In accordance with APRA Prudential Practice Guide CPG 234, token revocation shall occur within < 300ms of suspicious telemetry triggers. Absolute token lifetime cannot exceed statutory limits for tier-1 financial infrastructure.',
      },
      {
        clauseId: 'CPS234-SEC-03',
        title: 'Audit Logging & Non-Repudiation Trail',
        content:
          'Authentication events including grant exchanges, refresh operations, and role assignments must be streamed to an append-only immutable security ledger with cryptographic hashing.',
      },
    ],
    bankCustomAddenda: {
      cba: {
        sessionTimeout: '15 Minutes Inactivity / 8h Absolute',
        mfaRule: 'Transfers > $5,000 AUD or Novel Device Geolocation',
        customClause:
          'CBA Group Addendum 4.2: Enforce hardware token step-up for high-net-worth customer account impersonation and branch assist sessions.',
        lastModifiedBy: 'David Miller (CBA Principal Security Architect)',
      },
      nab: {
        sessionTimeout: '20 Minutes Inactivity / 10h Absolute',
        mfaRule: 'Cross-border payments > $2,500 AUD or Biometric Mismatch',
        customClause:
          'NAB Commercial Addendum 2.1: Internal corporate SSO bypass allowed solely for sandboxed test tenants during designated blue-green releases.',
        lastModifiedBy: 'Rachel Wong (NAB Compliance Manager)',
      },
      wbc: {
        sessionTimeout: '12 Minutes Inactivity / 6h Absolute',
        mfaRule: 'Any Payee Addition or Modification of Daily Limits',
        customClause:
          'Westpac Institutional Addendum 8.1: Dual-authorization required for automated treasury API key generations.',
        lastModifiedBy: 'Anthony Clarke (Westpac Enterprise Risk)',
      },
      anz: {
        sessionTimeout: '15 Minutes Inactivity / 8h Absolute',
        mfaRule: 'Transfers > $10,000 AUD or International Routing',
        customClause:
          'ANZ Private Addendum 1.4: Strict biometric passkey enforcement on iOS 18+ and Android 15 mobile banking apps.',
        lastModifiedBy: 'Elena Rossi (ANZ Head of AppSec)',
      },
    },
    artifacts: [
      {
        id: 'art-1',
        type: 'Training',
        tag: 'Training Note',
        location: 'Logged in Spec',
        title: 'Token Refresh Pattern Hands-on Walkthrough',
        content:
          'Engineers onboarding to this banking module must review the JWT refresh token rotation sequence before submitting PRs touching authentication middleware.',
      },
      {
        id: 'art-2',
        type: 'Issues',
        tag: 'Active Issue',
        location: 'Logged in Spec',
        title: 'Intermittent 401 on Mobile Safari WebViews',
        content:
          'WebKit third-party cookie restrictions cause auth state loss on cross-domain redirects. Workaround implementation currently in canary testing.',
      },
      {
        id: 'art-3',
        type: 'Minutes',
        tag: 'Architecture Minutes',
        location: 'Logged in Spec',
        title: 'Q3 Auth Review Sync (Sep 14)',
        content:
          'Agreed to migrate from HS256 to RS256 asymmetric signing for internal microservice service-to-service validation tokens.',
      },
    ],
    metricsTable: [
      { metric: 'Token Issue Latency', target: '< 20ms', actual: '14.2ms', status: 'Optimal' },
      { metric: 'Session Cache Hit Rate', target: '> 95%', actual: '98.4%', status: 'Optimal' },
      { metric: 'Auth Failures / min', target: '< 0.1%', actual: '0.04%', status: 'Normal' },
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Alex Rivera',
        avatar: 'AR',
        time: '2 hours ago',
        category: 'Issues',
        badge: 'Issue',
        content:
          'We noticed a spike in token invalidation errors during the 12:00 UTC maintenance window. Investigating if Redis connection pool was exhausted.',
      },
      {
        id: 'c-2',
        author: 'Sarah Chen',
        avatar: 'SC',
        time: '4 hours ago',
        category: 'Notes',
        badge: 'Training',
        content:
          'Updated onboarding guide in internal Wiki with the new PKCE authorization code flow diagram.',
      },
      {
        id: 'c-3',
        author: 'Marcus Vance',
        avatar: 'MV',
        time: '1 day ago',
        category: 'Minutes',
        badge: 'Minutes',
        content:
          'Security review complete. Approved migration from RS256 key rotation schedule (from 90 days to 30 days).',
      },
    ],
  },
  'data-retention-privacy': {
    id: 'data-retention-privacy',
    title: 'APP 11: Security & Destruction of Customer PII',
    breadcrumb: 'Privacy & Customer Data Governance / Australian Privacy Principles (APP 1-13) • Gov Approved',
    latestVersion: 'v4.0.1',
    lastUpdated: 'Sep 22, 2026',
    ownedBy: 'Data Governance & Regulatory Squad',
    complianceLevel: 'Privacy Act 1988 / APRA CPS 234 / CDR Reg 7.10',
    visionStatement:
      'Mandate strict de-identification, sovereign encryption, and cryptographic erasure of customer identifiable financial information once statutory retention periods expire.',
    dependencies: [
      { name: 'KMS Sovereign Vault (Sydney)', status: 'Healthy' },
      { name: 'Automated Purge Scheduler', status: 'Active (Daily)' },
      { name: 'Regulatory Audit Pipeline', status: 'Verified' },
    ],
    coreFrameworkClauses: [
      {
        clauseId: 'APP11-01',
        title: 'Master Statutory Retention Baseline (7 Years)',
        content:
          'Under Corporations Act 2001 & AML/CTF Rules, primary financial transaction ledgers and customer KYC identification records must be retained for exactly 7 years following account closure.',
      },
      {
        clauseId: 'APP11-02',
        title: 'Irrevocable De-identification on Expiry',
        content:
          'Upon reaching statutory expiry date + 30 days grace window, all direct identifiers (TFN, passport, residential address) must undergo cryptographic one-way salted hashing or DoD-standard erasure.',
      },
    ],
    bankCustomAddenda: {
      cba: {
        sessionTimeout: '7 Years + 60 Days Internal Audit Freeze',
        mfaRule: 'Tier-3 Compliance Officer Clearance for TFN Lookups',
        customClause: 'CBA Privacy Addendum 3.1: Retention of marketing clickstream data truncated to 90 days post-campaign termination.',
        lastModifiedBy: 'Claire Evans (CBA Data Protection Officer)',
      },
      nab: {
        sessionTimeout: '7 Years + 30 Days Standard Purge',
        mfaRule: 'Double Officer Approval for Customer Data Export',
        customClause: 'NAB Retention Addendum 1.8: Immediate sanitization of temporary customer upload files within 24h of document OCR verification.',
        lastModifiedBy: 'Jonathan Wu (NAB Legal Risk)',
      },
      wbc: {
        sessionTimeout: '7 Years + 45 Days Cold Archive Buffer',
        mfaRule: 'Executive Approval for Cross-Border Cloud Access',
        customClause: 'Westpac Privacy Clause 5: Redundant backups in secondary Sydney data center encrypted with isolated tenant keys.',
        lastModifiedBy: 'Samantha Kelly (Westpac InfoSec)',
      },
      anz: {
        sessionTimeout: '7 Years Exact',
        mfaRule: 'Zero-Trust Biometric Confirmation for PII Access',
        customClause: 'ANZ Customer Trust Addendum: Automated notification sent to customer 30 days prior to final account archive deletion.',
        lastModifiedBy: 'Michael Chang (ANZ Governance)',
      },
    },
    artifacts: [
      {
        id: 'art-p1',
        type: 'Training',
        tag: 'Training Note',
        location: 'Logged in Spec',
        title: 'Customer PII Sanitization Batch Pipeline',
        content: 'Handbook for batch sanitization workers operating against historical loan archival clusters.',
      },
    ],
    metricsTable: [
      { metric: 'Purge Success Rate', target: '100%', actual: '100.0%', status: 'Optimal' },
      { metric: 'Unencrypted PII Leaks', target: '0', actual: '0 (Zero)', status: 'Optimal' },
      { metric: 'Statutory Retention Drift', target: '< 0.01%', actual: '0.00%', status: 'Compliant' },
    ],
    comments: [
      {
        id: 'cp-1',
        author: 'Marcus Vance',
        avatar: 'MV',
        time: '3 hours ago',
        category: 'Minutes',
        badge: 'Minutes',
        content: 'Annual OAIC privacy audit readiness confirmed. Master locked clauses align with Australian Privacy Act 1988 amendments.',
      },
    ],
  },
};

export const auditHistoryLogs = [
  {
    id: 'log-1',
    timestamp: 'Today, 2:15 PM',
    actor: 'David Miller (CBA)',
    action: 'Updated Bank Policy Addendum 4.2',
    target: 'OAuth 2.0 & SSO Access Security',
    detail: 'Hardware token requirement added for HNW branch impersonation sessions.',
  },
  {
    id: 'log-2',
    timestamp: 'Yesterday, 4:30 PM',
    actor: 'Sarah Jenkins (Library Admin)',
    action: 'Published Master Specification v3.1.2',
    target: 'APRA CPS 234 Information Security',
    detail: 'Mandatory PKCE RFC 7636 asymmetric signing baseline updated.',
  },
  {
    id: 'log-3',
    timestamp: 'Sep 22, 2026',
    actor: 'Rachel Wong (NAB)',
    action: 'Updated Step-Up Trigger Condition',
    target: 'APP 11: Security & Destruction of PII',
    detail: 'Double officer approval threshold configured for customer archive downloads.',
  },
  {
    id: 'log-4',
    timestamp: 'Sep 20, 2026',
    actor: 'Anthony Clarke (Westpac)',
    action: 'Updated Inactivity Timeout (12 Minutes)',
    target: 'OAuth 2.0 & SSO Access Security',
    detail: 'Approved by Enterprise Risk for automated treasury sessions.',
  },
];
