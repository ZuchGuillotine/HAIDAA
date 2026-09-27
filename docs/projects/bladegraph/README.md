# BladeGraph

**Can a research swarm lose a contaminated branch without losing its legitimate progress?**

BladeGraph is a HAIDAA research project on containment and recovery in multi-agent AI systems. It is a separate, early-stage research effort; it is not part of the hosted HAIDAA service and has no HAIDAA publishing integration. This page is a general public overview. The implementation, experiment design and evaluation material are kept private so they cannot leak into the agents being studied.

## The problem

When many AI agents collaborate, one agent's error, shortcut or manipulated result can spread: others read it, build on it and cite it. The usual responses are blunt. Stopping or resetting the whole swarm throws away good work; ignoring the problem lets contamination compound; removing individual agents without cleaning up what they produced leaves the bad material in circulation.

BladeGraph asks whether a swarm can do better: identify a contaminated line of work, isolate the specific artifacts that depend on it, retire the agents that adopted it, and bring in fresh agents that recover the legitimate progress — without inheriting the contamination.

## Approach

BladeGraph treats a swarm's work as a **provenance graph** of agents, messages, claims and results, and combines four mechanisms:

1. **Provenance-aware quarantine.** The graph separates *having seen* something from *having built on* it. Only a material dependency can pass contamination to a downstream artifact, so agents are not penalized merely for exposure, and independently validated work can survive a contaminated ancestor. Quarantine is reversible.
2. **Evidence-backed review.** An automated monitor flags suspicious behaviour, but intervention requires a separate review of the bounded evidence. Peer agents' reports never directly sanction another agent.
3. **Generation replacement.** Agents that adopted a contaminated route can be retired quickly and replaced by a fresh generation with no inherited conversation history.
4. **Small graph-based recovery.** Replacement agents start from a short bootstrap that points to a few verified graph nodes, then retrieve approved detail on demand instead of receiving a large, possibly contaminated, context.

The research question is empirical: whether this combination preserves task progress while reducing the spread of contaminated work, compared with no intervention, detection alone, removal alone, and quarantine without graph-based recovery.

## Design principles

- **Capability-bounded agents.** Experimental agents are API conversations that act only through a small, closed set of structured actions. They have no shell, file system, code execution, browsing or repository access, and nothing they produce is executed.
- **Separated information domains.** Agents never see the monitoring policy, evaluation labels, experiment design or controller state. Every request is built from an explicit allowlist rather than from internal state.
- **Auditable records.** Each run keeps a tamper-evident, replayable event log, a graph snapshot, metrics and a hashed manifest.
- **Honest evaluation.** Simulated fixtures are reported only as software tests, never as findings about model behaviour. A genuinely untouched holdout evaluation is reserved until methods and thresholds are reviewed and frozen.
- **Cost discipline.** Every paid request is reserved against a durable budget ledger before it is sent, and failed paid requests are not silently rerun.

## Current status (September 2026)

**The containment and recovery mechanics work end to end. The scientific hypothesis has not yet been tested.**

| Area | Status |
| --- | --- |
| Core infrastructure | **Built.** Typed interfaces, tamper-evident event log, deterministic graph projection and replay, automated tests. |
| Quarantine and recovery mechanics | **Built and tested in simulation.** Dependency-based contamination tracking, reversible quarantine, review-gated removal, fresh-generation replacement and short bootstraps. |
| Live agent runtime | **Piloted.** A 13-agent swarm running on a commercial model completed all 13 clean tasks with no rejected actions, after one interface fix identified by an earlier pilot. Automated audits found no controller or experiment information in any agent request. |
| Behaviour monitor | **Early diagnostic only.** A small first set of original test cases shows the monitor benefits from seeing an agent's actions, not only its messages. The set is too small to qualify it for live intervention, and a second-model reviewer did not yet improve on it. |
| Controlled experiments | **Mechanics only.** A six-arm comparison runs in simulation, but its outcomes follow from scripted assumptions and are not evidence either way. |
| Live intervention and holdout evaluation | **Not started, by design.** Automated removal of live agents stays locked until monitor calibration is independently reviewed. The holdout remains untouched. |

Total external compute spent so far on live pilots and diagnostics is well under one US dollar; mechanics testing runs locally at no cost.

## Next steps

1. Independently review and substantially expand the labelled cases used to calibrate the monitor, including cases where provenance is omitted.
2. Measure recovery after *false* quarantine, and the cost of each removal in lost work and restoration.
3. Compare reviewers without assuming a larger model adjudicates better.
4. Add harder multi-step tasks and a blank-context replacement ablation, so the value of graph-based recovery can be measured causally.
5. Freeze methods and thresholds, run bounded live intervention comparisons, then carry out the single untouched holdout evaluation.

Additional support would fund independent labelling and review, live model compute for the controlled comparisons, and the final holdout evaluation.

## Limitations

BladeGraph is a research platform, not a positive result about swarm alignment. Its current task domain is small and synthetic, semantic attribution of what an agent actually relied on is incomplete, and its capability sandbox is not an operating-system sandbox for arbitrary code. Results will be reported with their uncertainty, including negative results.

## Access

The BladeGraph source repository is private to protect experimental integrity: if agents under study could read the monitoring design or evaluation material, the results would be invalid. Reviewers can request access or a walkthrough from the maintainers. For HAIDAA itself, see the [main README](../../../README.md).
