# Circonomit Modeling Toolbox - Hiring Challenge

Welcome! This repository contains my solution to the Circonomit hiring challenge.

---

## Challenge Background

Circonomit is developing a **modeling toolbox** — a decision infrastructure combining a **computation layer** and a **knowledge layer** — initially targeted at mid-sized industrial companies. These companies face complex interdependencies within their business and need to connect **external influencing factors** (e.g., tariffs, CO₂ costs) to their **internal key performance indicators**.

Examples of dependencies include supply chains, production processes, cost structures, and political or regulatory frameworks.

The goal of this challenge is to help me deeply understand Circonomit's core principles and reflect on how well this topic aligns with my skills and passion.

---

## The Scenario: STK Produktion GmbH

The challenge is based on a fictional company, **STK Produktion GmbH**, which manufactures components from plastics and metals. The company is affected by factors such as fluctuating energy prices, supply constraints, tariffs, and a variety of product and material variants.

---

## Challenge Tasks

You are free to present your solutions in **code, text, or sketches**. The emphasis is on understanding your thinking and intuitive application of expertise.

### Task 1: Extend the Data Model for Simulations

- STK’s current data model consists of **Blocks** (containers grouping Attributes) and **Attributes** (input or calculated).
- Calculated Attributes can depend on other calculated Attributes, forming dependency chains.
- Extend this structure to:
  - Support **simulation runs**.
  - Enable **input overrides for specific scenarios**.
  - Manage how and where these overrides are stored.
  - Handle dependencies, including **feedback loops and cyclic dependencies** in the calculation graph.

### Task 2: Execution & Caching Strategy

- Consider simulations where many calculated attributes depend on each other.
- Describe your thoughts on:
  - Where computation should occur (model layer, database, external engine).
  - Efficient caching of intermediate results.
  - Opportunities for parallelizing calculations.
- Provide a description or sketch of your **computation orchestration** approach.

### Task 3: From Natural Language to Model

- Users typically communicate in natural language, not model-specific terms.
- Design an approach to extract knowledge from text or dialogue (documents, chats, spoken input) and translate it into the data model (**Blocks, Attributes, relationships**).
- Outline architecture, steps, and techniques you’d use (e.g., NLP, large language models, entity extraction, mapping strategies).

### Task 4: Product Thinking & Usability

- Imagine designing an interface for **non-technical users** to:
  - Set up models.
  - Run scenarios.
  - Interpret results.
- Sketch or describe key features and interactions focusing on:
  - Clarity.
  - Simplicity.
  - Guiding users through complex decisions.
- **Bonus:** Suggest ways to visualize dependencies, feedback loops, or sensitivity analyses meaningfully for business decision-makers.

---

## Running Code Example

To run Task 1 implementation:

```bash
node src/task1.js
