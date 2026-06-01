# quaid-scanner Report: /Users/karstenwade/Projects/AINative-Studio/src/smb-dash

**Score:** 🔴 1.3/10 — CRITICAL risk
**Maturity:** sandbox | **Depth:** standard | **Duration:** 0.1s
**Scanned:** 2026-06-01T21:46:21.509Z

## Pillar Scores

| Pillar | Score | Weight | Findings |
|--------|-------|--------|----------|
| Security | 0.0 | 25% | 0C 26W 1I |
| Governance | 0.5 | 20% | 0C 4W 7I |
| Community | 1.5 | 15% | 0C 3W 8I |
| AI Readiness | 2.5 | 15% | 0C 5W 0I |
| Inclusive Language | 0.0 | 15% | 0C 5W 15I |
| Technical Rigor | 6.0 | 10% | 0C 1W 5I |

## Warnings

- **[TIMEOUT-binary-artifacts]** Scanner "binary-artifacts" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-dep-pinning-docker]** Scanner "dep-pinning-docker" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[dep-pinning-packages-1]** Loosely pinned dependency "@ainative/ai-kit-core": "^0.2.0" uses ^ prefix in dependencies *(Consider pinning "@ainative/ai-kit-core" to an exact version for reproducible builds)*
- **[dep-pinning-packages-2]** Loosely pinned dependency "@ainative/ai-kit-nextjs": "^0.1.0-alpha.3" uses ^ prefix in dependencies *(Consider pinning "@ainative/ai-kit-nextjs" to an exact version for reproducible builds)*
- **[dep-pinning-packages-3]** Loosely pinned dependency "next-auth": "^5.0.0-beta.30" uses ^ prefix in dependencies *(Consider pinning "next-auth" to an exact version for reproducible builds)*
- **[dep-pinning-packages-4]** Loosely pinned dependency "recharts": "^3.8.1" uses ^ prefix in dependencies *(Consider pinning "recharts" to an exact version for reproducible builds)*
- **[dep-pinning-packages-5]** Loosely pinned dependency "@tailwindcss/postcss": "^4" uses ^ prefix in devDependencies *(Consider pinning "@tailwindcss/postcss" to an exact version for reproducible builds)*
- **[dep-pinning-packages-6]** Loosely pinned dependency "@testing-library/dom": "^10.4.1" uses ^ prefix in devDependencies *(Consider pinning "@testing-library/dom" to an exact version for reproducible builds)*
- **[dep-pinning-packages-7]** Loosely pinned dependency "@testing-library/jest-dom": "^6.9.1" uses ^ prefix in devDependencies *(Consider pinning "@testing-library/jest-dom" to an exact version for reproducible builds)*
- **[dep-pinning-packages-8]** Loosely pinned dependency "@testing-library/react": "^16.3.2" uses ^ prefix in devDependencies *(Consider pinning "@testing-library/react" to an exact version for reproducible builds)*
- **[dep-pinning-packages-9]** Loosely pinned dependency "@testing-library/user-event": "^14.6.1" uses ^ prefix in devDependencies *(Consider pinning "@testing-library/user-event" to an exact version for reproducible builds)*
- **[dep-pinning-packages-10]** Loosely pinned dependency "@types/jest": "^30.0.0" uses ^ prefix in devDependencies *(Consider pinning "@types/jest" to an exact version for reproducible builds)*
- **[dep-pinning-packages-11]** Loosely pinned dependency "@types/node": "^20" uses ^ prefix in devDependencies *(Consider pinning "@types/node" to an exact version for reproducible builds)*
- **[dep-pinning-packages-12]** Loosely pinned dependency "@types/react": "^19" uses ^ prefix in devDependencies *(Consider pinning "@types/react" to an exact version for reproducible builds)*
- **[dep-pinning-packages-13]** Loosely pinned dependency "@types/react-dom": "^19" uses ^ prefix in devDependencies *(Consider pinning "@types/react-dom" to an exact version for reproducible builds)*
- **[dep-pinning-packages-14]** Loosely pinned dependency "@vitejs/plugin-react": "^6.0.1" uses ^ prefix in devDependencies *(Consider pinning "@vitejs/plugin-react" to an exact version for reproducible builds)*
- **[dep-pinning-packages-15]** Loosely pinned dependency "@vitest/coverage-v8": "^4.1.2" uses ^ prefix in devDependencies *(Consider pinning "@vitest/coverage-v8" to an exact version for reproducible builds)*
- **[dep-pinning-packages-16]** Loosely pinned dependency "eslint": "^9" uses ^ prefix in devDependencies *(Consider pinning "eslint" to an exact version for reproducible builds)*
- **[dep-pinning-packages-17]** Loosely pinned dependency "jest": "^30.3.0" uses ^ prefix in devDependencies *(Consider pinning "jest" to an exact version for reproducible builds)*
- **[dep-pinning-packages-18]** Loosely pinned dependency "jsdom": "^29.0.1" uses ^ prefix in devDependencies *(Consider pinning "jsdom" to an exact version for reproducible builds)*
- **[dep-pinning-packages-19]** Loosely pinned dependency "tailwindcss": "^4" uses ^ prefix in devDependencies *(Consider pinning "tailwindcss" to an exact version for reproducible builds)*
- **[dep-pinning-packages-20]** Loosely pinned dependency "ts-jest": "^29.4.6" uses ^ prefix in devDependencies *(Consider pinning "ts-jest" to an exact version for reproducible builds)*
- **[dep-pinning-packages-21]** Loosely pinned dependency "typescript": "^5" uses ^ prefix in devDependencies *(Consider pinning "typescript" to an exact version for reproducible builds)*
- **[dep-pinning-packages-22]** Loosely pinned dependency "vitest": "^4.1.2" uses ^ prefix in devDependencies *(Consider pinning "vitest" to an exact version for reproducible builds)*
- **[TIMEOUT-openssf-local-checks]** Scanner "openssf-local-checks" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-openssf-scorecard]** Scanner "openssf-scorecard" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[bus-factor-1]** Bus factor: 2, Elephant factor: 49% (3 contributors, 43 commits in last 12 months) *(Encourage more contributors and distribute code ownership)*
- **[TIMEOUT-clearly-defined]** Scanner "clearly-defined" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[governance-classification-1]** Unclear governance model — best guess is "Foundation-backed" with low confidence (32%) *(Document the governance model explicitly in GOVERNANCE.md for clarity)*
- **[TIMEOUT-license-header-scanner]** Scanner "license-header-scanner" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[contributor-funnel-2]** Conversion rates: casual→regular 0%, regular→core 0% *(Low casual-to-regular conversion suggests contributor onboarding friction)*
- **[psych-safety-1]** No Code of Conduct found *(Add a CODE_OF_CONDUCT.md — see https://www.contributor-covenant.org/)*
- **[support-channels-1]** No SUPPORT.md or .github/SUPPORT.md found *(Add a SUPPORT.md documenting how users can get help)*
- **[agentic-rules-2]** CLAUDE.md lacks recognized structural sections *(Add sections like "Critical Rules", "Project Structure", "Common Tasks" to improve agent guidance.)*
- **[TIMEOUT-ai-repo-detection]** Scanner "ai-repo-detection" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-dataset-provenance]** Scanner "dataset-provenance" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-model-card-detection]** Scanner "model-card-detection" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-model-card-scoring]** Scanner "model-card-scoring" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[AK-PREREQ-MISSING-README.md]** README.md contains tool commands but no Prerequisites or Requirements section *(Consider adding a Prerequisites section listing required tools and versions)*
- **[TIMEOUT-diminishing-language-scanner]** Scanner "diminishing-language-scanner" timed out after undefinedms *(Increase scannerTimeout in configuration or check network connectivity)*
- **[TIMEOUT-inclusive-code-scanner]** Scanner "inclusive-code-scanner" failed: Cannot read properties of undefined (reading 'termListUrl') *(Check scanner implementation for errors)*
- **[TIMEOUT-inclusive-doc-scanner]** Scanner "inclusive-doc-scanner" failed: Cannot read properties of undefined (reading 'termListUrl') *(Check scanner implementation for errors)*
- **[TIMEOUT-inclusive-naming-scanner]** Scanner "inclusive-naming-scanner" failed: Cannot read properties of undefined (reading 'termListUrl') *(Check scanner implementation for errors)*
- **[interaction-templates-1]** No issue templates configured *(Add .github/ISSUE_TEMPLATE/ with bug report and feature request templates)*

## Info

- **[branch-protection-1]** GitHub token not provided. Cannot check branch protection settings.
- **[asset-protection-1]** No trademark policy found (optional)
- **[asset-protection-2]** No export control documentation found (optional)
- **[asset-protection-3]** No CLA or DCO requirement detected
- **[asset-protection-4]** Contributor friction level: Low
- **[governance-detection-1]** No governance documentation found
- **[vendor-neutrality-domain-count]** Found 3 unique email domain(s) across 43 commits
- **[vendor-neutrality-no-succession]** No succession planning documentation found
- **[burnout-detection-1]** Burnout detection requires a GitHub token
- **[contributor-data-2]** Contributor emails span 3 domains
- **[contributor-funnel-1]** Contributor funnel: 0 core, 3 regular, 0 casual (3 total)
- **[funding-1]** No funding infrastructure detected
- **[issue-closure-1]** Issue closure analysis requires a GitHub token
- **[response-classification-1]** Response classification requires a GitHub token
- **[response-time-1]** Response time analysis requires a GitHub token
- **[stale-bot-1]** No stale bot configured
- **[AK-GIT-CLONE-README.md:241]** Assumed knowledge: "clone" operation used without explanation
- **[AK-GIT-CLONE-README.md:244]** Assumed knowledge: "clone" operation used without explanation
- **[AK-GIT-FORK-README.md:401]** Assumed knowledge: "fork" operation used without explanation
- **[AK-TOOL-NPM-README.md:253]** Assumed knowledge: "npm" command used without Node.js listed as prerequisite
- **[AK-TOOL-NPM-README.md:282]** Assumed knowledge: "npm" command used without Node.js listed as prerequisite
- **[AK-TOOL-NPM-README.md:323]** Assumed knowledge: "npm" command used without Node.js listed as prerequisite
- **[AK-ACRONYM-KPI-README.md:1]** Undefined acronym "KPI" may confuse newcomers
- **[AK-ACRONYM-CFO-README.md:25]** Undefined acronym "CFO" may confuse newcomers
- **[AK-ACRONYM-ETL-README.md:65]** Undefined acronym "ETL" may confuse newcomers
- **[AK-ACRONYM-DSO-README.md:205]** Undefined acronym "DSO" may confuse newcomers
- **[AK-ACRONYM-DPO-README.md:205]** Undefined acronym "DPO" may confuse newcomers
- **[AK-ACRONYM-GET-README.md:215]** Undefined acronym "GET" may confuse newcomers
- **[AK-ACRONYM-POST-README.md:233]** Undefined acronym "POST" may confuse newcomers
- **[AK-ACRONYM-ONLY-README.md:305]** Undefined acronym "ONLY" may confuse newcomers
- **[AK-ACRONYM-MVP-README.md:328]** Undefined acronym "MVP" may confuse newcomers
- **[linter-config-2]** Linter config found but no lint step detected in CI workflows
- **[release-cadence-1]** No releases or version tags found
- **[test-coverage-2]** Coverage configuration found: jest.config.ts
- **[test-coverage-3]** No coverage badge found in README
- **[semver-validation-1]** No git tags found — cannot validate SemVer

## Recommendations

- **[MEDIUM impact / low effort]** Increase scannerTimeout in configuration or check network connectivity
- **[MEDIUM impact / low effort]** Consider pinning "@ainative/ai-kit-core" to an exact version for reproducible builds
- **[MEDIUM impact / low effort]** Encourage more contributors and distribute code ownership
- **[MEDIUM impact / low effort]** Increase scannerTimeout in configuration or check network connectivity
- **[MEDIUM impact / low effort]** Document the governance model explicitly in GOVERNANCE.md for clarity
- **[MEDIUM impact / low effort]** Low casual-to-regular conversion suggests contributor onboarding friction
- **[MEDIUM impact / low effort]** Add a CODE_OF_CONDUCT.md — see https://www.contributor-covenant.org/
- **[MEDIUM impact / low effort]** Add a SUPPORT.md documenting how users can get help
- **[MEDIUM impact / low effort]** Add sections like "Critical Rules", "Project Structure", "Common Tasks" to improve agent guidance.
- **[MEDIUM impact / low effort]** Increase scannerTimeout in configuration or check network connectivity
- **[MEDIUM impact / low effort]** Consider adding a Prerequisites section listing required tools and versions
- **[MEDIUM impact / low effort]** Increase scannerTimeout in configuration or check network connectivity
- **[MEDIUM impact / low effort]** Check scanner implementation for errors
- **[MEDIUM impact / low effort]** Add .github/ISSUE_TEMPLATE/ with bug report and feature request templates

## Score Rationale

Overall score is a weighted sum of six pillar scores (each scored 0–10).

| Pillar | Weight | Raw Score | Contribution |
|--------|--------|-----------|-------------|
| Security | 25% | 0.0 | 0.00 |
| Governance | 20% | 0.5 | 0.10 |
| Community | 15% | 1.5 | 0.22 |
| AI Readiness | 15% | 2.5 | 0.38 |
| Inclusive Language | 15% | 0.0 | 0.00 |
| Technical Rigor | 10% | 6.0 | 0.60 |
| **Overall** | **100%** | | **1.30** |

---
*quaid-scanner v0.1.2 | 2026-06-01T21:46:21.509Z*
*Commit: 541ccdf0f02da334376bfdf5018653b3956dd5eb*