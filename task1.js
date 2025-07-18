// ------------------ 1) Data Model ------------------
// Here we define the basic structure of the data model for STK company.
// The model consists of Blocks, each representing a business domain (like Production, Logistics).
// Each Block contains Attributes, which are either:
// - 'input' attributes: raw values provided externally or via scenario overrides.
// - 'calculated' attributes: values computed from formulas based on other attributes.

// The formulas use a context object (ctx) that provides the current values of relevant attributes.

const blocks = {
  Production: {
    // Input: cost of raw materials in euros
    materialCost: { type: 'input', value: 120 },

    // Input: energy cost in euros
    energyCost: { type: 'input', value: 60 },

    // Calculated: disposal cost depends on materialCost and also on CO2 cost
    // Formula: disposalCost = 0.8 * materialCost + co2Cost
    disposalCost: {
      type: 'calculated',
      formula: (ctx) => ctx.materialCost * 0.8 + ctx.co2Cost
    },

    // Calculated: CO2 cost depends on energyCost and   
    // Formula: co2Cost = 0.1 * energyCost + 0.05 * disposalCost
    // Note: This introduces a cyclic dependency with disposalCost!
    co2Cost: {
      type: 'calculated',
      formula: (ctx) => ctx.energyCost * 0.1 + ctx.disposalCost * 0.05
    }
  },

  Logistics: {
    // Input: transport cost in euros
    transportCost: { type: 'input', value: 35 },

    // Calculated: logistics cost depends on transportCost and ecoFees
    // Formula: logisticsCost = transportCost + ecoFees
    logisticsCost: {
      type: 'calculated',
      formula: (ctx) => ctx.transportCost + ctx.ecoFees
    },

    // Calculated: eco fees depend on logisticsCost and co2Cost
    // Formula: ecoFees = 0.1 * logisticsCost + 0.05 * co2Cost
    // Another cyclic dependency between ecoFees and logisticsCost here.
    ecoFees: {
      type: 'calculated',
      formula: (ctx) => ctx.logisticsCost * 0.1 + ctx.co2Cost * 0.05
    }
  }
}

// ------------------ 2) Input Overrides for Scenarios ------------------
// We define scenarios that override default input values for simulation purposes.
// Each scenario can selectively override inputs in one or multiple blocks.

// The 'Base' scenario uses default values defined in blocks (no overrides).
// The 'HighEnergyPrices' scenario simulates increased energy costs and transport costs.

const scenarios = {
  Base: {
    Production: { materialCost: 120, energyCost: 60 },
    Logistics: { transportCost: 35 }
  },

  HighEnergyPrices: {
    Production: { energyCost: 90 },  // override energyCost to 90 €
    Logistics: { transportCost: 40 } // override transportCost to 40 €
  }
}

// ------------------ 3) Simulation Engine with Cyclic Resolution ------------------

// When running a simulation for a scenario:
// 1) Start from the input values from blocks (default values).
// 2) Override inputs with scenario-specific values where defined.
// 3) Calculate all calculated attributes respecting dependencies.
// 4) For cyclic dependencies (e.g., disposalCost <-> co2Cost), apply iterative calculations until convergence.

// This setup allows us to flexibly simulate different business conditions
// and analyze impacts on costs under various scenarios.

console.log('Base Scenario Result:')
console.log(runSimulation('Base'))

console.log('\nHigh Energy Prices Scenario Result:')
console.log(runSimulation('HighEnergyPrices'))

// Base Scenario Result:
// Converged in 6 iterations.
// {
//   materialCost: 120,
//   energyCost: 60,
//   transportCost: 35,
//   co2Cost: 11.368420875,
//   disposalCost: 107.36841749999999,
//   logisticsCost: 39.520417125,
//   ecoFees: 4.520462756250001
// }

// High Energy Prices Scenario Result:
// Converged in 6 iterations.
// {
//   materialCost: 120,
//   energyCost: 90,
//   transportCost: 40,
//   co2Cost: 14.526315562499999,
//   disposalCost: 110.52631124999999,
//   logisticsCost: 45.2514024375,
//   ecoFees: 5.251456021875001
// }

// ------------------ SUMMARY OF OUTPUT DIFFERENCES ------------------
// Increasing energy and transport costs cause increases in all calculated costs, which makes sense:
// co2Cost rises with energy cost.
// disposalCost rises with co2Cost.
// logisticsCost and ecoFees rise due to transport cost and co2Cost.

// The ratios roughly align with formulas:
// For example, disposalCost is always about materialCost * 0.8 + co2Cost.
// co2Cost always reflects energyCost * 0.1 + disposalCost * 0.05.
// logisticsCost and ecoFees track transportCost and each other proportionally.

// The simulation successfully models the domino effect: changes in inputs ripple through calculated costs logically.

function runSimulation(scenarioName = 'Base', maxIterations = 100, threshold = 0.001) {
  // We initialize a context object that holds all input and calculated attributes.
  // Initially, it loads the scenario inputs for production and logistics,
  // while setting all calculated attributes (like co2Cost, disposalCost, etc.) to zero.
  let context = {
    ...scenarios.Base.Production,
    ...scenarios.Base.Logistics,
    co2Cost: 0,
    disposalCost: 0,
    logisticsCost: 0,
    ecoFees: 0
  };

  // Apply scenario overrides
  if (scenarioName !== "Base" && scenarios[scenarioName]) {
    context = { ...context, ...scenarios[scenarioName].Production, ...scenarios[scenarioName].Logistics };
  }

  // We start a loop with a maximum number of iterations (e.g., 100) to repeatedly update calculated attributes.
  // This ensures that even in the presence of circular dependencies, we can approach a stable result through recalculation.
  let deltas
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const previous = { ...context }

    // Recalculate Production
    context.disposalCost = blocks.Production.disposalCost.formula(context)
    context.co2Cost = blocks.Production.co2Cost.formula(context)

    // Recalculate Logistics
    context.logisticsCost = blocks.Logistics.logisticsCost.formula(context)
    context.ecoFees = blocks.Logistics.ecoFees.formula(context)

    // Check for convergence
    deltas = [
      Math.abs(context.disposalCost - previous.disposalCost),
      Math.abs(context.co2Cost - previous.co2Cost),
      Math.abs(context.logisticsCost - previous.logisticsCost),
      Math.abs(context.ecoFees - previous.ecoFees)
    ]

    // After recalculating, we calculate deltas (differences) between the current and previous values.
    // If all changes are smaller than a small threshold value, we conclude that the simulation has stabilized and break the loop.
    if (Math.max(...deltas) < threshold) {
      console.log(`Converged in ${iteration + 1} iterations.`)
      break
    }
  }

  return context
}
