# Task 3: From Natural Language to Model

## Goal
Translate user-provided text (like chat, documents, or voice input) into a structured data model:
- **Blocks**
- **Attributes**
- **Relationships between them**

## Approach

### 1. Preprocessing
- **Clean the text:** Remove irrelevant symbols, fix formatting.
- **Transcribe voice input:** Use Speech-to-Text if input is audio.

### 2. Natural Language Understanding
Use **LLMs (like GPT)** to:
  - Extract **business domains** → map to **Blocks**
  - Identify **key concepts and metrics** → map to **Attributes**
  - Understand **dependencies and formulas** → define **relationships**

### 3. Entity Extraction
Apply **Named Entity Recognition (NER)** to detect:
  - Costs, processes, measurements (→ Attributes)
  - Business areas (→ Blocks)
  - Dependencies (e.g., "depends on", "calculated from") → Relationships

### 4. Pattern Recognition & Mapping
Define templates or prompts that help the LLM map:
  - "Production costs depend on energy consumption" →  
    Block: Production  
    Attribute: productionCost (calculated)  
    Formula: depends on energyConsumption

### 5. Building the Data Model
Structure the extracted data:
- Create JSON or object representation of **Blocks**, **Attributes**, **Types (input/calculated)**, and **Formulas**

### 6. Human-in-the-loop
- Let users review the generated model for accuracy and provide feedback for corrections.