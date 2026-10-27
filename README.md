# REQUIEM — The Ghost Archive
> *"Every abandoned project leaves a ghost. Recover the intent. Trace the unfinished. Give forgotten code another life."*

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026%20Ghost%20in%20the%20Machine-956bff.svg)](https://hacktoberfest.com)
[![Open-Weight Model](https://img.shields.io/badge/Model-Gemma%202%209B%20%2F%2027B-75d8ff.svg)](https://ai.google.dev/gemma)
[![License](https://img.shields.io/badge/License-Apache%202.0-d7b878.svg)](LICENSE)

REQUIEM is an open-weight AI digital archaeology platform engineered to investigate abandoned, half-finished, and forgotten software repositories. It examines README files, build manifests, source code trees, and actual Git history when available. It reconstructs the project's original intent, isolates unfulfilled features, connects findings to exact source code lines, and produces an actionable revival roadmap.

---

## 🏛️ Archaeological Visual Identity

REQUIEM is designed with the atmospheric depth of a cinematic dark fantasy game archive during a violet thunderstorm:
- **Palette:** Midnight black (`#080712`), Deep violet (`#17102E`), Storm purple (`#30215B`), Electric violet (`#956BFF`), Ice blue (`#75D8FF`), and Antique gold (`#D7B878`).
- **Typography:** Refined display serifs paired with Plus Jakarta Sans body prose and JetBrains Mono for forensic code lines.
- **Atmosphere:** Dynamic dust/ember particle canvas, ambient violet lightning flashes, and subtle holographic codices.

---

## 📜 13-Section Forensic Journey

1. **Section 1 — Cinematic Hero:** Dominant hooded archivist artwork, stormy sky, ambient lightning, floating ember particles, and dual action CTAs.
2. **Section 2 — The Lost Archive:** The human story behind abandoned code (Intent buried, Evidence scattered, Next step uncertain).
3. **Section 3 — How Requiem Works:** Three-stage forensic sequence (*01. Discover*, *02. Reconstruct*, *03. Revive*).
4. **Section 4 — Enter The Archive:** Interactive entrance with dual branching paths: Custom Investigation vs Preloaded Sample Case.
5. **Section 5 — Project Autopsy:** Executive dossier, category filters, and clear separation into **Verified Evidence**, **AI Interpretation**, and **Unknowns**.
6. **Section 6 — The Ghost Timeline:** Chronological reconstruction strictly differentiating verified Git commits from AI inferred milestones.
7. **Section 7 — The Evidence Vault:** Searchable and filterable knowledge base with copy citation and the signature **"SHOW ME THE PROOF"** code inspector.
8. **Section 8 — The Unfinished Dreams Map:** Interactive SVG topological node graph mapping modules, panic stubs, and blocking mutexes with zoom/pan controls and an accessible list mode.
9. **Section 9 — The Revival Blueprint:** Prioritized P0–P2 roadmap with acceptance criteria, interactive task status changes, Markdown export, and draft GitHub issue templates.
10. **Section 10 — Why Open-Weight AI Matters:** Honest discussion on server independence, model inspectability, and real architectural flowcharts.
11. **Section 11 — Privacy, Copyright and Trust:** Zero-execution guarantee, copyright preservation, and automated secret scrubbing.
12. **Section 12 — Final Call to Action:** Atmospheric closing call to action leading to the footer.
13. **Section 13 — Extensive Footer:** Complete governance, legal notices, Gemma model attributions, and copyright notices.

---

## 🔬 Open-Weight AI Architecture

### 1. Model Details & Version
- **Model Name:** Gemma 2 (9B / 27B Parameter Instruct)
- **Developer:** Google DeepMind
- **Weights Source:** Available via [Hugging Face (`google/gemma-2-9b-it`)](https://huggingface.co/google/gemma-2-9b-it) and [Kaggle](https://www.kaggle.com/models/google/gemma-2).
- **Terms:** Governed by the official [Gemma Terms of Use](https://ai.google.dev/gemma/terms).

### 2. Modular Server Adapter
The backend (`server.ts`) implements an adapter pattern supporting:
- **Google AI Studio / Gemini SDK:** Server-side Gemma 2 or Gemini 3.8 Flash inference adapter.
- **Local Ollama / vLLM:** Run weights locally on hardware with 16GB+ VRAM (`http://localhost:11434/api/generate`).
- **HuggingFace Inference API:** Hosted endpoint integration.
- **Custom OpenAI-Compatible Endpoints:** Deployable to private Kubernetes/GPU clusters.

### 3. Truth Hierarchy & Anti-Hallucination Rules
- **Verified Evidence:** Strictly supported by specific filenames and real line numbers.
- **AI Interpretation:** Context-grounded deductions labeled with confidence percentages.
- **Unknown:** Explicit acknowledgment of absent data (e.g. missing target architectures or absent git history).
- **Zero-Execution Sandbox:** Uploaded code is strictly treated as read-only string tokens. Code is never compiled or executed.

---

## 🛠️ Local Development & Setup

### Requirements
- Node.js 18+ or Bun
- Optional: `GEMINI_API_KEY` or `GEMMA_API_ENDPOINT` in `.env`

### Quickstart
```bash
# Install dependencies
npm install

# Start the full-stack development server
npm run dev

# Open in browser
# Local dev runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

---

## ⚖️ Governance & Licensing
- **Application Code:** Licensed under the Apache-2.0 License.
- **Investigated Repositories:** All original source code copyrights belong exclusively to their respective open-source authors.
- **Built for:** Hacktoberfest 2026 *"Ghost in the Machine"* Challenge.
