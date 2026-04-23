# DealSignal AI

DealSignal AI is an AI-assisted diligence application for first-pass CIM review. It helps an analyst quickly decide whether a deal deserves deeper work while keeping final investment judgment fully human.

At its core, the product does three things well: surfaces high-impact claims, grounds them in evidence, and returns a structured investment read with explicit uncertainty.

# Why I Built It

In real deal flow, analysts spend significant time on repetitive "is this directionally true?" checks. I built DealSignal AI to compress that first pass into a repeatable workflow that emphasizes traceability and skepticism rather than black-box scoring.

The goal is not decision replacement. The goal is faster triage with better-structured diligence.

# Product Workflow

1. **Deal intake**
   Upload one or more CIM/supporting files and set context.

2. **Claim extraction**
   Parse documents and extract high-impact, checkable claims across financial, market, and operating topics.

3. **Claim verification**
   Retrieve external evidence and classify each claim as:
   - verified
   - disputed
   - unverifiable

4. **Deal-level synthesis**
   Aggregate claim outcomes into:
   - verdict (Worth deeper look / Borderline / Pass)
   - reasoning
   - top risks
   - bull case
   - key diligence questions

5. **Analyst UI**
   Split-view workflow with source navigation and analysis tabs so users can audit every claim and source quickly.

# Technical Architecture

## Frontend

- React + TypeScript
- Axios for API calls
- Dropzone-based intake
- App-level state orchestration for documents, claims, tabs, and filters
- Structured review UI optimized for rapid analyst scanning

## Backend

- FastAPI orchestration service
- `pdfplumber` for text extraction
- Anthropic models for claim extraction/adjudication/synthesis
- Tavily/web search for external evidence retrieval

## Pipeline Design

I intentionally separated the pipeline into extraction -> adjudication -> synthesis, instead of one giant prompt. This made outputs easier to debug, improved response structure consistency, and allowed stage-specific prompt tuning.

# Design Principles

- **Human-in-the-loop:** AI supports, analyst decides.
- **Evidence-first:** every major judgment should tie back to sources.
- **Explicit uncertainty:** "unverifiable" is treated as informative, not failure.
- **Structured outputs:** JSON-oriented responses for stable rendering and workflow continuity.

# Challenges

- Balancing recall vs precision in claim extraction.
- Handling noisy public evidence for private-company claims.
- Keeping long-running multi-step analysis understandable in the UI.
- Managing latency/cost as claim count scales.

# Reflection

DealSignal AI is one of my strongest examples of end-to-end product engineering in a high-stakes domain: workflow design, full-stack implementation, multi-step AI orchestration, and explainability-aware UX.

It reinforced a key lesson for applied AI systems: usefulness comes from structure, transparency, and constraints, not just model capability.

