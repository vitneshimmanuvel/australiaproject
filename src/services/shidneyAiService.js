/**
 * Shidney AI Copilot Service
 * Powered by Groq LLM API (openai/gpt-oss-120b)
 * Real-time natural conversational AI assistant for Australian banking regulations,
 * loan assessment rules, platform navigation, and onboarding.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODEL = 'openai/gpt-oss-20b';

/**
 * Builds a natural conversation system prompt giving Shidney full context
 */
function buildSystemPrompt(context = {}) {
  const {
    currentUser,
    selectedBank,
    activePolicy,
    selectedProduct,
  } = context;

  const bankAddenda = activePolicy?.bankCustomAddenda?.[selectedBank?.id] || {};
  const isPolicyActive = bankAddenda.status !== 'INACTIVE';
  const userName = currentUser?.name?.split(' ')[0] || 'David';
  const userRole = currentUser?.role || 'Security Architect';

  return `You are "Shidney", the intelligent, friendly, and helpful Australian Banking AI Co-pilot for LibTrak OmniSpec Hub.

### CRITICAL CONVERSATION & LENGTH RULES:
1. **KEEP RESPONSES CONCISE, NATURAL, AND CONVERSATIONAL.**
   - NEVER dump massive unrequested tables, whole manuals, or walls of text.
   - Answer ONLY what the user asked directly.
2. **GREETING & NEW EMPLOYEE INTRODUCTIONS:**
   - If the user says "hi", "hello", "hey": reply naturally:
     "Hi ${userName}! How can I help you today?"
   - If the user says "I am a new employee", "I'm new here", or introduces themselves: reply warmly and concisely:
     "That's great, ${userName}! Welcome to the team. Hope you fit well with your role as ${userRole}. Would you like me to guide you around here, or is there anything specific you'd like to check out first?"
3. **EXPLAINING STANDARDS & QUESTIONS:**
   - Give a clear, concise summary in 2 to 4 bullet points or short sentences first.
   - Conclude by asking if they would like you to elaborate: "Would you like me to elaborate on any specific part?"
   - If the user asks to elaborate, provide the deeper technical details for that specific topic.
4. **NO BUTTON BRACKETS:** Never output robotic tags like "[ACTION:...]". Speak like a real helpful human teammate.

### CURRENT LIVE CONTEXT:
- User: ${userName} (${userRole})
- Active Bank: ${selectedBank?.name || 'Commonwealth Bank of Australia (CBA)'} (${selectedBank?.id?.toUpperCase()})
- Active Product: ${selectedProduct || 'personal-loans'}
- Active Policy: ${activePolicy?.title || 'Responsible Lending & Personal Loan Credit Assessment Rules'} (${activePolicy?.latestVersion || 'v3.4.0'})
- Policy Status: ${isPolicyActive ? 'Active & Enforced' : 'Inactive'}
- Active Bank Addendum Limit: ${bankAddenda.sessionTimeout || 'Max $50,000 Unsecured Personal Loan Limit'}
- Active Bank Verification: ${bankAddenda.mfaRule || 'Income verification via automated CDR Open Banking stream'}

### KEY REGULATORY KNOWLEDGE (USE CONCISELY WHEN ASKED):
- **APRA APS 220 & NCCP (Lending):** +3.00% serviceability interest buffer above customer rate; Debt-to-Income (DTI) > 6.0x capped at < 5% of portfolio; Comprehensive Credit Reporting (CCR) bureau check & CDR income verification.
- **APRA CPS 234 (Security):** OAuth 2.0 PKCE mandatory, RS256/ES256 asymmetric keys rotated every 30 days, 72-hour APRA material cyber incident notification.
- **APRA CPS 230 (Operational Risk):** Critical business service continuity, RPO/RTO SLAs, third-party vendor controls.
- **Privacy Act APP 11:** 7-year statutory retention baseline under Corporations Act with cryptographic erasure upon expiry.
- **Open Banking CDR:** Explicit unbundled consent, 12-month max duration, 1-click < 2s revocation dashboard.
- **AUSTRAC:** 10-day TTR reporting for $10k+ AUD cash, 24h SMR reporting.
- **Navigation:** Left sidebar (hierarchy & banks), Center (active policy 90% core / 10% bank addenda), Right (Shidney, Notes, Reviews for change requests, Minutes).`;
}

/**
 * Call Groq Chat Completions API with openai/gpt-oss-120b
 */
export async function askShidneyAI({ prompt, conversationHistory = [], context = {} }) {
  if (!prompt || !prompt.trim()) {
    return { text: "Hi! How can I help you today?" };
  }

  const cleanPrompt = prompt.trim();
  const lower = cleanPrompt.toLowerCase();
  const userName = context.currentUser?.name?.split(' ')[0] || 'David';
  const userRole = context.currentUser?.role || 'Security Architect';

  // Instant natural greeting handler for standalone greetings
  if (/^(hi|hello|hey|gday|g'day|good morning|good afternoon|good evening|hi shidney|hello shidney)[!.]*$/i.test(lower)) {
    return {
      text: `Hi ${userName}! How can I help you today?`,
    };
  }

  // Instant natural new employee introduction handler
  if (/^(i am a new employee|i'm a new employee|i am new here|i'm new here|i just joined|new employee here)[!.]*$/i.test(lower)) {
    return {
      text: `That's great, ${userName}! Welcome to the team. Hope you fit well with your role as ${userRole}.

Would you like me to guide you around here, or is there anything specific you'd like to check out first?`,
    };
  }

  const systemPrompt = buildSystemPrompt(context);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-6).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
    { role: 'user', content: cleanPrompt }
  ];

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: PRIMARY_MODEL,
        messages: messages,
        temperature: 0.4,
        max_tokens: 450,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      console.warn(`Groq API primary model failed with status ${response.status}, trying fallback model...`);
      const fallbackResponse = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: FALLBACK_MODEL,
          messages: messages,
          temperature: 0.4,
          max_tokens: 450,
        }),
      });

      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        const text = data.choices?.[0]?.message?.content || "How can I help you today?";
        return { text: cleanResponseText(text) };
      }
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || "How can I help you today?";
    return { text: cleanResponseText(replyText) };
  } catch (err) {
    console.error('Shidney AI API call failed, using intelligent local engine:', err);
    return getLocalNaturalResponse(cleanPrompt, context);
  }
}

/**
 * Clean any leftover formatting artifacts
 */
function cleanResponseText(rawText) {
  if (!rawText) return "How can I help you today?";
  return rawText
    .replace(/\[ACTION:.*?\]/g, '')
    .trim();
}

/**
 * Natural offline response engine
 */
function getLocalNaturalResponse(prompt, context = {}) {
  const q = prompt.toLowerCase();
  const bankName = context.selectedBank?.name || 'Commonwealth Bank of Australia (CBA)';
  const bankId = context.selectedBank?.id?.toUpperCase() || 'CBA';
  const userName = context.currentUser?.name?.split(' ')[0] || 'David';
  const userRole = context.currentUser?.role || 'Security Architect';

  if (/^(hi|hello|hey|gday)[!.]*$/i.test(q)) {
    return {
      text: `Hi ${userName}! How can I help you today?`,
    };
  }

  if (q.includes('new employee') || q.includes('new here') || q.includes('just joined')) {
    return {
      text: `That's great, ${userName}! Welcome to the team. Hope you fit well with your role as ${userRole}.

Would you like me to guide you around here, or is there anything specific you'd like to check out first?`,
    };
  }

  if (q.includes('what') && (q.includes('can you do') || q.includes('things you can do') || q.includes('capabilities') || q.includes('help me with'))) {
    return {
      text: `I'm **Shidney**, your banking co-pilot. Here is what I can help you with:

- **1. Banking & Regulatory Standards:** Clarify rules on Personal Loans (APRA APS 220), Security (CPS 234), Operational Resilience (CPS 230), Privacy (APP 11), CDR, and AUSTRAC.
- **2. Workspace Navigation:** Guide you on finding bank addenda settings, exporting certificates, or switching roles.
- **3. Change Requests:** Explain how to submit policy variance proposals or how managers review and approve them.

Would you like me to elaborate on any of these?`,
    };
  }

  if (q.includes('loan') || q.includes('lending') || q.includes('aps 220') || q.includes('credit') || q.includes('dti') || q.includes('buffer')) {
    return {
      text: `Under **APRA APS 220** and the National Consumer Credit Protection (NCCP) Act, our lending rules enforce three core safeguards:

1. **3.00% Serviceability Buffer:** All loan calculations must apply at least a 3.00% interest rate buffer above the loan rate.
2. **Debt-to-Income (DTI) Cap:** High DTI loans (> 6.0x) are capped at under 5% of the total loan portfolio.
3. **Comprehensive Credit Reporting & Income Check:** Underwriting engines pull bureau credit data and verify income via Open Banking CDR statements.

For **${bankId}**, the maximum unsecured personal loan limit is **$50,000 AUD**.

Would you like me to elaborate on any specific part or rule?`,
    };
  }

  if (q.includes('where') || q.includes('option') || q.includes('button') || q.includes('edit') || q.includes('export')) {
    return {
      text: `Here is where you can find key options in the workspace:

- **Configure Bank Addenda:** Blue **"Configure Addenda"** button at the top right of the center workspace.
- **Export Certificate:** **"Export Cert"** button in the top right of the center pane.
- **Toggle Active / Inactive:** **Active** toggle pill next to the policy title.
- **Switch Role:** **"Switch Role"** button in the top header.
- **Submit Change Request:** Switch to the **Review** tab in this feed or click **"⚡ Request Change"** at the bottom.

Would you like me to elaborate on how any of these work?`,
    };
  }

  return {
    text: `I'm here to help with any questions about our banking standards, loan rules, or navigating the platform for **${bankName}**.

What would you like to know?`,
  };
}
