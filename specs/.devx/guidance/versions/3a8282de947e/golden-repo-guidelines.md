# Golden Repository Implementation Guidelines

Generated for: ADOtoDEVx
Repository: mridul227/testingastra
Generated at: 2026-10-16T09:31:25.189Z
File selection mode: selected mapped files

## Warnings

- Golden Repo mapped file could not be auto-vectorized: brownfield/jira/ed001-a8f03c91/_source-manifest.json (Automatic Golden Repo chunking during generation currently supports ADO sources only.)
- Golden Repo mapped file could not be auto-vectorized: brownfield/jira/ed001-a8f03c91/functional-modules.md (Automatic Golden Repo chunking during generation currently supports ADO sources only.)
- Golden Repo mapped file could not be auto-vectorized: brownfield/jira/ed001-a8f03c91/PROJECT_SUMMARY.md (Automatic Golden Repo chunking during generation currently supports ADO sources only.)
- Golden Repo mapped file(s) are not vectorized or have no cached chunks: brownfield/jira/ed001-a8f03c91/_source-manifest.json, brownfield/jira/ed001-a8f03c91/functional-modules.md, brownfield/jira/ed001-a8f03c91/PROJECT_SUMMARY.md

## How To Use

- Read this file before implementation in the IDE.
- Use `golden-repo-sources.md` for exact source excerpts and file-path attribution.
- Use Golden Repo guidance for conventions, patterns, validation expectations, architecture style, testing expectations, and implementation constraints.
Golden Repo grounding rules:
- If a selected Golden Repo reference states a rule, constraint, term, or pattern that applies to this feature, the spec must reflect it and cite that file path in Source References.
- Do not force unrelated Golden Repo concepts into the specification. If a reference does not apply to this feature, leave it out.
- Do not invent implementation details that are absent from the Golden Repo or the requirement. Exact endpoints, hosts, schemas, tables, queue names, and infrastructure components that are not stated must be marked Validate or left as Open Questions.
- Also incorporate applicable UI design guidelines, architecture guidelines, policies, business rules, standards, and validation expectations when they apply to this feature.
- If a relevant Golden Repo rule applies but the feature source lacks a product decision, write the gap under Open Questions instead of inventing behavior.
- If a user story conflicts with a Golden Repo example, follow the user story for what to build and keep only the Golden Repo terminology and rules that still apply.
- Cite the Golden Repo file paths of the references you actually used in Source References.
- Existing code patterns in the target workspace override generic Golden Repo guidance when they conflict on stack mechanics.
- Do not require live Golden Repository access inside the implementation workspace.

## Extracted Guidance

No Golden Repo excerpts were available. Regenerate after vectorizing selected Golden Repo files.