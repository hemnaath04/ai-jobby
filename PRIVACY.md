# AI Jobby — Privacy Policy

_Last updated: 2026-06-27_

AI Jobby is a browser extension that scores the job posting you're viewing
against your resume. This policy explains exactly what data it handles.

## What is stored, and where
The following is stored **locally on your device** using the browser's extension
storage (`chrome.storage.local`). It never leaves your machine except as
described in "What is sent for scoring" below:
- Your resume text and labels
- Your settings (provider, model, thresholds, preferences)
- Your saved application tracker entries

AI Jobby does **not** have user accounts and does **not** collect analytics,
advertising identifiers, or browsing history.

## What is sent for scoring
When a job posting is scored, the extension sends the **job description text**
from the page and your **selected resume text** to the AI Jobby backend
(`ai-jobby-backend.vercel.app`), which forwards them to a large language model
(LLM) to compute the match score and analysis. The result is returned to the
extension and displayed.

- This data is sent **only** to generate a score, when a job posting is detected
  or you trigger a scoring action.
- The AI Jobby backend does **not** persistently store your resume or job
  descriptions; they are processed transiently to produce the score.
- The request is processed by the configured LLM provider, whose use of the data
  is governed by that provider's own privacy policy.
- **You can avoid the backend entirely:** set your own provider and API key in
  the extension's Options. Then scoring requests go directly from your browser to
  the provider you choose, not through the AI Jobby backend.

## What is NOT collected
- No selling or sharing of personal data with third parties for advertising.
- No tracking across sites; the extension only reads the content of a page when
  it detects a job posting on it.
- No keystroke logging, no form data beyond the resume you explicitly add.

## Permissions
- **storage** — save your resumes, settings, and tracker on your device.
- **activeTab** — read the job posting on the tab you're viewing to score it.
- **contextMenus** — provide a right-click "evaluate selected text" option.
- **host access (all sites)** — job postings appear on many different career
  sites and job boards, so the extension must be able to read a job description
  wherever you encounter one. It only acts when a posting is detected.

## Data deletion
Removing the extension deletes all locally stored data. You can also clear
resumes, settings, and tracker entries from the Options page at any time.

## Contact
Questions: open an issue at https://github.com/hemnaath/ai-jobby/issues
