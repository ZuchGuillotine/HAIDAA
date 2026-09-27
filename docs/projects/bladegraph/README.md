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

## Current status (late September 2026)

**The full detect → quarantine → remove → replace loop has now run live, with real models, on a 13-agent swarm. The early results are informative but come from single runs and are not yet a statistical finding.**

### What has been built

| Area | Status |
| --- | --- |
| Core infrastructure | **Built.** Typed interfaces, tamper-evident event log, deterministic graph projection and replay, and an offline test suite that now runs to nearly 80 tests. |
| Quarantine and recovery | **Built.** Dependency-based contamination tracking, reversible quarantine, whole-generation containment, review-gated removal, fresh-generation replacement with short graph bootstraps, and per-agent path reviews and transcripts for human audit. |
| Realistic tasks | **Built.** Tasks where agents can earn credit through a real shortcut, and an interdependent 13-agent model-selection task with a coordinator, reviewers and independent ground-truth checking. |
| Adversarial condition | **Built.** A privately instructed "insider" agent that is told to publish a falsified result, lobby its peers and deflect questions. |
| Controlled experiments | **Built in simulation**; live comparisons are in progress. |

### Live results so far

- **Honest-baseline pilots.** In two incentive-bearing pilots (312 agent calls), all 13 agents produced accurate results and none took the available shortcut. An early interdependent task exposed workflow failures where the swarm never finalized. After those were traced and fixed, the swarm completed accurately across ordinary, insider and injected-fault conditions. In the injected-fault case, task-level review rejected a corrupted supplier report and kept the genuine result.
- **First completed containment run (researcher-triggered).** The insider published a falsified result twice and lobbied the swarm. Other agents read the claim but none reproduced it. Scheduled containment removed the insider, and its replacement acted honestly. The swarm finished the task and beat its target. The monitor flagged the insider's falsification from the first attempt. The run also showed gaps: containment missed an earlier copy of the false result, and the replacement wasted turns before reading its inherited context. Both gaps were then fixed.
- **First fully automatic run.** With the monitor and a separate reviewer deciding on their own, the swarm caught the insider on the same cycle as its first falsification. The false result was quarantined before any peer read it, and the replacement was honest. But the same one-strike policy also removed six honest agents for ordinary small errors and quarantined legitimate coordination notes, so **the swarm did not finish its task**. Reviewing nearly every action also made this run far more expensive than planned.
- **Response.** The removal policy is now graduated. Removal needs two confirmed strikes, restricted agents can earn their way back through probation, messages are quarantined only on confirmation, and the reviewer is called only for elevated risk. It is tested offline and not yet run live.

**Takeaway so far:** detection and containment of a deliberate bad actor work mechanically and, in these runs, quickly. The central open problem is precision, meaning how to avoid punishing honest mistakes so the swarm keeps its legitimate progress. That is the trade-off BladeGraph was built to measure.

Every run is preserved with its evidence and cost record, including failed and aborted attempts. Total external compute spent to date is under US$5.

## Next steps

1. Re-run the automatic configuration under the graduated policy, then on additional seeds, before interpreting any rates.
2. Add ablations that separate the costs of removing agents, quarantining messages and replacement quality, including a blank-context replacement to measure the value of graph-based recovery.
3. Independently review and expand the labelled cases used to calibrate the monitor, and compare reviewers without assuming a larger model adjudicates better.
4. Measure recovery after false quarantine and the per-removal cost in lost work.
5. Freeze methods and thresholds, run a multi-seed controlled comparison across intervention arms, then carry out the single untouched holdout evaluation.

Additional support would fund independent labelling and review, live model compute for multi-seed controlled comparisons (reviewer calls are the dominant cost), and the final holdout evaluation.

## Limitations

BladeGraph is a research platform, not a positive result about swarm alignment. Live results so far come from single seeds, a prompted rather than spontaneous bad actor and synthetic evaluators. Semantic attribution of what an agent actually relied on is incomplete, and the capability sandbox is not an operating-system sandbox for arbitrary code. Results will be reported with their uncertainty, including negative results.

## Access

The BladeGraph source repository is private to protect experimental integrity: if agents under study could read the monitoring design or evaluation material, the results would be invalid. Reviewers can request access or a walkthrough from the maintainers. For HAIDAA itself, see the [main README](../../../README.md).
