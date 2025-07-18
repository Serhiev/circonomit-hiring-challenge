# Task 2: Execution & Caching Strategy

## 1. Where in the stack the computation should happen (e.g., in the model layer, database layer, or as an external engine)?

| Option           | Pros                                              | Cons                                                  | Summary                          |
|------------------|---------------------------------------------------|-------------------------------------------------------|---------------------------------------|
| **Model Layer**  | Simple to implement, close to business logic      | May not scale for complex cyclic dependencies         | Suitable for lightweight calculations |
| **Database Layer** | Can leverage stored procedures, data locality    | Limited flexibility, difficult with iterative cycles  | Use for simple aggregation only       |
| **External Engine** | Highly scalable, specialized for iterative solving | Additional complexity, requires integration            | Best for heavy or cyclic dependency scenarios |

> **Approach:**  
Use a **hybrid strategy** where simple, acyclic calculations run inside the model layer, while complex or cyclic dependency calculations are delegated to an **external computation engine** that can efficiently handle iterations and parallelism.

---

## 2. How to cache intermediate results efficiently?
**Per-iteration cache:**  
  Cache attribute values during each iteration to avoid recalculating within the same iteration.

**Scenario-level cache:**  
  Cache full results for each input scenario, so repeated runs with the same inputs return instantly.

**Dependency-aware cache invalidation:**  
  When an input or attribute changes, only invalidate and recalculate dependent attributes downstream in the graph.

### Implementation notes:

- Use a **memoization technique** keyed by attribute and current input state.
- Store intermediate results in an efficient in-memory cache or distributed cache for scalability.
- Consider time-to-live (TTL) and cache size limits to balance memory usage and performance.

---

## 3. How you would parallelize calculations where possible?
### Steps to parallelize:

1. Create a **graph of all attributes** showing which ones depend on others.
2. Use **topological sorting** to figure out the right order of calculations (from simplest to most complex).
3. At each step, look for attributes that don’t depend on each other — these can be **calculated in parallel**.
4. Use **threads, processes, or cloud workers** to compute these independent attributes simultaneously.

> Parallelism improves throughput and reduces latency, especially for large models with many independent attributes.

---

## 4. Describe or sketch your approach to efficient computation orchestration.

1. Start with input values — these are starting numbers.
2. Build a dependency graph — map out who depends on who.
3. Try to order calculations — figure out the right order to calculate things.
4. Check for cycles (loops):
 - If no loops, just calculate independent stuff in parallel (at the same time).
 - If loops exist, use a method that repeats calculations until numbers stop changing (converge).
5. Save results in a cache so we don’t redo work later.
6. Return all the final calculated values.

```mermaid
graph TD
  A[1. Start with input values] --> B[2. Build dependency graph]
  B --> C[3. Order calculations]
  C --> D{4. Cycles present?}
  D -- No --> E[Calculate independent attributes in parallel]
  D -- Yes --> F[Iterative solver for cycles]
  E --> G[5. Cache results]
  F --> G
  G --> H[6. Return final outputs]

