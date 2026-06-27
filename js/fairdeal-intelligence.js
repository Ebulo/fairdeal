(function () {
  "use strict";

  var CMA_APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxXJdaYieCi7psk7P0-WJKs9VYw_LsXxzj0RPP0Gzecj8yX7L9k_SwBMrGJK4EeP7SfGg/exec";
  var CMA_APPS_SCRIPT_SECRET = "77caef4b-eb8c-4942-a613-2d668a4f2926";

  var formSteps = [
    {
      eyebrow: "Step 1",
      title: "AI Valuation Engine",
      description: "Lock the corridor, land size, unit, and legal-use status."
    },
    {
      eyebrow: "Step 2",
      title: "Investment Thesis",
      description: "Choose the intent, budget, timeline, and buyer profile."
    },
    {
      eyebrow: "Step 3",
      title: "Delivery Details",
      description: "Add the lead and institutional email where the CMA PDF should be sent."
    }
  ];

  var growthCorridors = [
    {
      value: "bhubaneswar-patia",
      label: "Bhubaneswar - Infocity / Patia Tech Corridor",
      shortName: "Patia Tech Corridor",
      location: "Bhubaneswar",
      baseRate: 3850,
      baseGrowth: 15.2,
      cagrCap: 19.2,
      riskScore: 12,
      maturity: "High demand technology corridor with strong services-led absorption."
    },
    {
      value: "bhubaneswar-chandrasekharpur",
      label: "Bhubaneswar - Chandrasekharpur Financial District",
      shortName: "Chandrasekharpur Financial District",
      location: "Bhubaneswar",
      baseRate: 4400,
      baseGrowth: 13.8,
      cagrCap: 17.8,
      riskScore: 10,
      maturity: "Deep urban demand and lower corridor uncertainty."
    },
    {
      value: "bhubaneswar-mancheswar",
      label: "Bhubaneswar - Nalco Nagar / Mancheswar Industrial",
      shortName: "Mancheswar Industrial Belt",
      location: "Bhubaneswar",
      baseRate: 2750,
      baseGrowth: 11.6,
      cagrCap: 16.5,
      riskScore: 20,
      maturity: "Industrial catchment with clear utility demand but uneven frontage quality."
    },
    {
      value: "cuttack-commercial",
      label: "Cuttack - Badambadi / Chauliaganj Commercial",
      shortName: "Cuttack Commercial Belt",
      location: "Cuttack",
      baseRate: 3100,
      baseGrowth: 10.8,
      cagrCap: 15.8,
      riskScore: 22,
      maturity: "Mature commercial corridor with title-chain and access constraints."
    },
    {
      value: "puri-marine-drive",
      label: "Puri - Marine Drive / Beachfront Resort Zone",
      shortName: "Puri Marine Drive",
      location: "Puri",
      baseRate: 5200,
      baseGrowth: 12.6,
      cagrCap: 18.4,
      riskScore: 34,
      maturity: "Premium tourism corridor with coastal and approvals sensitivity."
    },
    {
      value: "rourkela-industrial",
      label: "Rourkela - Steel City Industrial Periphery",
      shortName: "Rourkela Industrial Periphery",
      location: "Rourkela",
      baseRate: 2100,
      baseGrowth: 9.4,
      cagrCap: 14.2,
      riskScore: 26,
      maturity: "Industrial-led demand with cyclical absorption."
    },
    {
      value: "berhampur-growth",
      label: "Berhampur - Tata-Honda Growth Corridor",
      shortName: "Berhampur Growth Corridor",
      location: "Berhampur",
      baseRate: 2400,
      baseGrowth: 10.4,
      cagrCap: 15.1,
      riskScore: 28,
      maturity: "Emerging south Odisha corridor with demand still forming."
    },
    {
      value: "sambalpur-hirakud",
      label: "Sambalpur - Hirakud Reservoir Periphery",
      shortName: "Hirakud Reservoir Periphery",
      location: "Sambalpur",
      baseRate: 1500,
      baseGrowth: 8.2,
      cagrCap: 12.8,
      riskScore: 32,
      maturity: "Lower entry basis with tourism and industrial optionality."
    },
    {
      value: "khurda-airport",
      label: "Khurda - Airport Catchment Zone",
      shortName: "Khurda Airport Catchment",
      location: "Khurda",
      baseRate: 3200,
      baseGrowth: 15.8,
      cagrCap: 19.7,
      riskScore: 14,
      maturity: "High infrastructure maturity with airport and NH-linked demand."
    },
    {
      value: "jajpur-kalinganagar",
      label: "Jajpur - Kalinganagar Industrial Cluster",
      shortName: "Kalinganagar Industrial Cluster",
      location: "Jajpur",
      baseRate: 2600,
      baseGrowth: 12.8,
      cagrCap: 17.6,
      riskScore: 24,
      maturity: "Industrial cluster with strong anchor demand and execution checks."
    }
  ];

  var units = [
    { value: "sqft", label: "Square Feet (sq.ft.)", factor: 1 },
    { value: "decimal", label: "Decimal", factor: 435.6 },
    { value: "acre", label: "Acres", factor: 43560 },
    { value: "guntha", label: "Guntha", factor: 1089 }
  ];

  var zoning = [
    {
      value: "agricultural-olr",
      label: "Agricultural / OLR conversion required",
      multiplier: 0.68,
      growthAdjustment: -2.5,
      riskScore: 56,
      interpretation: "Agricultural status prices in conversion uncertainty and buyer eligibility review."
    },
    {
      value: "na-pending",
      label: "NA conversion pending",
      multiplier: 0.82,
      growthAdjustment: -1.2,
      riskScore: 38,
      interpretation: "Conversion pathway exists, but timing and documentation remain diligence items."
    },
    {
      value: "na-converted-clear-title",
      label: "NA converted - clear title",
      multiplier: 1,
      growthAdjustment: 0,
      riskScore: 0,
      interpretation: "Converted title removes the primary land-use discount."
    },
    {
      value: "bda-approved-layout",
      label: "BDA-approved residential layout",
      multiplier: 1.08,
      growthAdjustment: 1.1,
      riskScore: 8,
      interpretation: "Planning approval creates liquidity premium with limited title friction."
    },
    {
      value: "orera-registered-project",
      label: "ORERA-registered plotted project",
      multiplier: 1.12,
      growthAdjustment: 0.8,
      riskScore: 6,
      interpretation: "Registration and disclosure discipline reduce marketing and delivery ambiguity."
    },
    {
      value: "industrial-idco-compatible",
      label: "Industrial / IDCO-compatible land",
      multiplier: 1.04,
      growthAdjustment: 1.5,
      riskScore: 10,
      interpretation: "Industrial compatibility supports logistics absorption when access is verified."
    },
    {
      value: "coastal-crz-sensitive",
      label: "Coastal / CRZ-sensitive title",
      multiplier: 0.74,
      growthAdjustment: -1.8,
      riskScore: 48,
      interpretation: "Coastal premium is offset by approval, setback, and environmental diligence."
    }
  ];

  var intents = [
    {
      value: "residential-villa-plot",
      label: "Residential - Individual Villa/Plot",
      cagrModifier: 1,
      riskScore: 16,
      interpretation: "Residential land has broad resale liquidity with moderate approval load."
    },
    {
      value: "commercial-retail-office",
      label: "Commercial - Retail or Office",
      cagrModifier: 2.1,
      riskScore: 24,
      interpretation: "Commercial frontage can outperform, but depends on access and parking viability."
    },
    {
      value: "infrastructure-logistics",
      label: "Infrastructure - Logistics/Warehouse",
      cagrModifier: 3.2,
      riskScore: 22,
      interpretation: "Logistics intent captures corridor deficit and warehousing demand."
    },
    {
      value: "csr-esg-social",
      label: "CSR / ESG - Social Impact Asset",
      cagrModifier: 0.8,
      riskScore: 18,
      interpretation: "Impact use has steadier demand but lower speculative premium."
    },
    {
      value: "agro-processing",
      label: "Agricultural - Agro-processing",
      cagrModifier: -0.8,
      riskScore: 38,
      interpretation: "Agro-processing requires stricter use, access, and conversion checks."
    },
    {
      value: "industrial-manufacturing",
      label: "Industrial - Manufacturing",
      cagrModifier: 2.6,
      riskScore: 28,
      interpretation: "Industrial end-use can justify premium if utilities and clearances are visible."
    }
  ];

  var budgets = [
    { value: "25-75-lakh", label: "Rs 25L - Rs 75L", min: 2500000, max: 7500000 },
    { value: "75-lakh-1-5-cr", label: "Rs 75L - Rs 1.5Cr", min: 7500000, max: 15000000 },
    { value: "1-5-3-cr", label: "Rs 1.5Cr - Rs 3Cr", min: 15000000, max: 30000000 },
    { value: "3-10-cr", label: "Rs 3Cr - Rs 10Cr", min: 30000000, max: 100000000 },
    { value: "10-cr-plus", label: "Rs 10Cr+", min: 100000000, max: null }
  ];

  var timelines = [
    {
      value: "immediate",
      label: "Immediate (0-30 days)",
      cagrModifier: 0.9,
      riskScore: 26,
      interpretation: "Urgent acquisition creates scarcity premium but compresses diligence windows."
    },
    {
      value: "short-term",
      label: "Short-term (1-3 months)",
      cagrModifier: 0.4,
      riskScore: 18,
      interpretation: "Enough time for title screening while keeping price discovery current."
    },
    {
      value: "medium-term",
      label: "Medium-term (3-6 months)",
      cagrModifier: 0,
      riskScore: 12,
      interpretation: "Balanced timeline with room for diligence and negotiation."
    },
    {
      value: "planning",
      label: "Planning phase (6-12 months)",
      cagrModifier: -0.2,
      riskScore: 8,
      interpretation: "Longer horizon improves diligence but softens urgency premium."
    }
  ];

  var profiles = [
    {
      value: "individual-investor",
      label: "Individual Investor",
      cagrModifier: 0,
      riskScore: 14,
      interpretation: "Standard buyer profile with ordinary title and funding review."
    },
    {
      value: "nri-overseas-indian",
      label: "NRI / Overseas Indian",
      cagrModifier: 0.5,
      riskScore: 32,
      interpretation: "Repatriation demand premium, offset by FEMA and banking-channel checks."
    },
    {
      value: "hni-family-office",
      label: "HNI / Family Office",
      cagrModifier: 1.2,
      riskScore: 8,
      interpretation: "Lowest scrutiny tier with high ability to complete diligence."
    },
    {
      value: "medical-legal-professional",
      label: "Medical / Legal Professional",
      cagrModifier: 0.3,
      riskScore: 10,
      interpretation: "Strong documentation behaviour and lower compliance friction."
    },
    {
      value: "government-officer",
      label: "Government Officer / IAS / IPS",
      cagrModifier: -0.4,
      riskScore: 34,
      interpretation: "Transaction scrutiny and documentation sensitivity increase review load."
    },
    {
      value: "corporate-sme",
      label: "Corporate / SME",
      cagrModifier: 0.8,
      riskScore: 18,
      interpretation: "Entity purchase improves capital readiness but adds board/KYC process."
    }
  ];

  var optionLists = {
    growthCorridors: growthCorridors,
    units: units,
    zoning: zoning,
    intents: intents,
    budgets: budgets,
    timelines: timelines,
    profiles: profiles
  };

  var optionFallbacks = {
    corridor: growthCorridors[0],
    unit: units[0],
    zoning: zoning[2],
    intent: intents[0],
    budget: budgets[1],
    timeline: timelines[1],
    profile: profiles[0]
  };

  function findOption(options, value, fallback) {
    for (var index = 0; index < options.length; index += 1) {
      if (options[index].value === value) return options[index];
    }

    return fallback;
  }

  function hasOption(options, value) {
    return options.some(function (option) {
      return option.value === value;
    });
  }

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }

  function roundTo(value, precision) {
    var multiplier = Math.pow(10, precision || 1);
    return Math.round(value * multiplier) / multiplier;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    var digits = String(value || "").replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function getRiskBand(score) {
    if (score <= 25) {
      return {
        label: "LOW",
        description: "Institutional grade"
      };
    }

    if (score <= 45) {
      return {
        label: "MEDIUM",
        description: "Advisory review recommended"
      };
    }

    return {
      label: "HIGH",
      description: "Mandatory diligence before commitment"
    };
  }

  function getBudgetFit(baseMarketValue, budget) {
    if (!budget.max) {
      return {
        label: "Strategic capacity",
        description: "Selected budget supports institutional-size land options."
      };
    }

    if (baseMarketValue <= budget.max) {
      return {
        label: "Inside selected budget",
        description: "Indicative base value fits the selected acquisition band."
      };
    }

    if (baseMarketValue <= budget.max * 1.18) {
      return {
        label: "Near selected budget",
        description: "Indicative value is close enough for negotiation or phased acquisition."
      };
    }

    return {
      label: "Above selected budget",
      description: "Selected land thesis may require smaller area, lower-basis corridor, or higher budget."
    };
  }

  function calculateCma(form) {
    var corridor = findOption(growthCorridors, form.growthCorridor, optionFallbacks.corridor);
    var unit = findOption(units, form.unitOfMeasurement, optionFallbacks.unit);
    var zoningOption = findOption(zoning, form.zoningStatus, optionFallbacks.zoning);
    var intent = findOption(intents, form.developmentIntent, optionFallbacks.intent);
    var budget = findOption(budgets, form.investmentBudgetRange, optionFallbacks.budget);
    var timeline = findOption(timelines, form.acquisitionTimeline, optionFallbacks.timeline);
    var profile = findOption(profiles, form.investorProfile, optionFallbacks.profile);
    var areaInput = Number.parseFloat(form.plotArea);
    var normalizedAreaInput = Number.isFinite(areaInput) && areaInput > 0 ? areaInput : 0;
    var areaSqft = normalizedAreaInput * unit.factor;
    var baseMarketValue = areaSqft * corridor.baseRate * zoningOption.multiplier;
    var rawCagr =
      corridor.baseGrowth +
      intent.cagrModifier +
      profile.cagrModifier +
      timeline.cagrModifier +
      zoningOption.growthAdjustment;
    var blendedCagr = clamp(Math.min(rawCagr, corridor.cagrCap), 1, 24);
    var projectedValue = baseMarketValue * Math.pow(1 + blendedCagr / 100, 3);
    var absoluteGain = projectedValue - baseMarketValue;
    var riskRows = [
      {
        dimension: "Corridor Maturity",
        rawScore: corridor.riskScore,
        weight: 0.3,
        weighted: corridor.riskScore * 0.3,
        interpretation: corridor.shortName + " - " + corridor.maturity
      },
      {
        dimension: "Development Intent",
        rawScore: intent.riskScore,
        weight: 0.25,
        weighted: intent.riskScore * 0.25,
        interpretation: intent.interpretation
      },
      {
        dimension: "Zoning / Title Legal",
        rawScore: zoningOption.riskScore,
        weight: 0.3,
        weighted: zoningOption.riskScore * 0.3,
        interpretation: zoningOption.interpretation
      },
      {
        dimension: "Investor Profile",
        rawScore: profile.riskScore,
        weight: 0.15,
        weighted: profile.riskScore * 0.15,
        interpretation: profile.interpretation
      }
    ];
    var riskIndex = Math.round(
      riskRows.reduce(function (sum, row) {
        return sum + row.weighted;
      }, 0)
    );

    return {
      generatedAt: new Date().toISOString(),
      corridor: corridor,
      unit: unit,
      zoning: zoningOption,
      intent: intent,
      budget: budget,
      timeline: timeline,
      profile: profile,
      areaInput: normalizedAreaInput,
      areaSqft: areaSqft,
      baseMarketValue: baseMarketValue,
      projectedValue: projectedValue,
      absoluteGain: absoluteGain,
      totalGainPercent: baseMarketValue > 0 ? (absoluteGain / baseMarketValue) * 100 : 0,
      rawCagr: rawCagr,
      blendedCagr: blendedCagr,
      riskIndex: riskIndex,
      riskBand: getRiskBand(riskIndex),
      budgetFit: getBudgetFit(baseMarketValue, budget),
      riskRows: riskRows.map(function (row) {
        return Object.assign({}, row, {
          weighted: roundTo(row.weighted, 1)
        });
      }),
      cagrRows: [
        { label: "Corridor Base Growth", value: corridor.baseGrowth },
        { label: "Intent Modifier", value: intent.cagrModifier },
        { label: "Profile Modifier", value: profile.cagrModifier },
        { label: "Timeline Modifier", value: timeline.cagrModifier },
        { label: "Zoning Adjustment", value: zoningOption.growthAdjustment }
      ]
    };
  }

  function formatCurrencyCompact(value) {
    if (!Number.isFinite(value) || value <= 0) return "Rs 0";

    if (value >= 10000000) {
      return "Rs " + (value / 10000000).toFixed(2) + " Cr";
    }

    if (value >= 100000) {
      return "Rs " + (value / 100000).toFixed(2) + " L";
    }

    return (
      "Rs " +
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0
      }).format(value)
    );
  }

  function formatNumber(value, maximumFractionDigits) {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: maximumFractionDigits || 0
    }).format(value);
  }

  function formatPercent(value, maximumFractionDigits) {
    return (value >= 0 ? "+" : "") + value.toFixed(maximumFractionDigits || 1) + "%";
  }

  function getFormState(form) {
    var formData = new FormData(form);
    return {
      growthCorridor: String(formData.get("growthCorridor") || ""),
      plotArea: String(formData.get("plotArea") || ""),
      unitOfMeasurement: String(formData.get("unitOfMeasurement") || ""),
      zoningStatus: String(formData.get("zoningStatus") || ""),
      developmentIntent: String(formData.get("developmentIntent") || ""),
      investmentBudgetRange: String(formData.get("investmentBudgetRange") || ""),
      acquisitionTimeline: String(formData.get("acquisitionTimeline") || ""),
      investorProfile: String(formData.get("investorProfile") || ""),
      fullLegalName: String(formData.get("fullLegalName") || ""),
      mobileNumber: String(formData.get("mobileNumber") || ""),
      emailAddress: String(formData.get("emailAddress") || ""),
      institutionalEmail: String(formData.get("institutionalEmail") || "")
    };
  }

  function validateStep(form, stepIndex) {
    var state = getFormState(form);
    var errors = [];

    if (stepIndex === 0) {
      if (!state.growthCorridor) errors.push("Select a growth corridor or locality.");
      if (!state.plotArea) errors.push("Add the plot area.");
      if (!state.unitOfMeasurement) errors.push("Select a unit of measurement.");
      if (!state.zoningStatus) errors.push("Select the zoning and title status.");
      if (state.plotArea) {
        var area = Number.parseFloat(state.plotArea);
        if (!Number.isFinite(area) || area <= 0) errors.push("Enter a plot area greater than zero.");
        if (area > 1000000) errors.push("Enter a realistic plot area for this report.");
      }
    }

    if (stepIndex === 1) {
      if (!state.developmentIntent) errors.push("Select a development intent.");
      if (!state.investmentBudgetRange) errors.push("Select an investment budget range.");
      if (!state.acquisitionTimeline) errors.push("Select a target acquisition timeline.");
      if (!state.investorProfile) errors.push("Select an investor profile.");
    }

    if (stepIndex === 2) {
      if (!state.fullLegalName.trim()) errors.push("Add the full legal name.");
      if (!isValidPhone(state.mobileNumber)) errors.push("Add a valid mobile number.");
      if (!isValidEmail(state.emailAddress)) errors.push("Add a valid email address.");
      if (!isValidEmail(state.institutionalEmail)) errors.push("Add a valid institutional email.");
    }

    return Array.from(new Set(errors));
  }

  function validateCmaForm(form) {
    var state = getFormState(form);
    var errors = validateStep(form, 0).concat(validateStep(form, 1), validateStep(form, 2));

    var invalidSelections = [
      state.growthCorridor && !hasOption(growthCorridors, state.growthCorridor),
      state.unitOfMeasurement && !hasOption(units, state.unitOfMeasurement),
      state.zoningStatus && !hasOption(zoning, state.zoningStatus),
      state.developmentIntent && !hasOption(intents, state.developmentIntent),
      state.investmentBudgetRange && !hasOption(budgets, state.investmentBudgetRange),
      state.acquisitionTimeline && !hasOption(timelines, state.acquisitionTimeline),
      state.investorProfile && !hasOption(profiles, state.investorProfile)
    ];

    if (invalidSelections.some(Boolean)) {
      errors.push("Choose valid options from the CMA form lists.");
    }

    return Array.from(new Set(errors));
  }

  function setText(root, selector, value) {
    var element = root.querySelector(selector);
    if (element) element.textContent = value;
  }

  function showMessage(root, message, type) {
    var messageElement = root.querySelector("[data-fd-cma-message]");
    if (!messageElement) return;

    messageElement.textContent = message || "";
    messageElement.classList.remove("is-error", "is-success");

    if (type) {
      messageElement.classList.add("is-" + type);
    }
  }

  function populateSelects(form) {
    Array.prototype.forEach.call(form.querySelectorAll("[data-fd-cma-options]"), function (select) {
      var listName = select.getAttribute("data-fd-cma-options");
      var list = optionLists[listName] || [];

      list.forEach(function (option) {
        var optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
      });
    });
  }

  function renderForm(state) {
    var form = state.form;
    var currentStep = formSteps[state.activeStep] || formSteps[0];
    var progress = state.hasResponse ? 100 : ((state.activeStep + 1) / formSteps.length) * 100;

    setText(form, "[data-fd-cma-kicker]", state.hasResponse ? "Response ready" : currentStep.eyebrow);
    setText(form, "[data-fd-cma-title]", state.hasResponse ? "Institutional CMA blueprint generated" : currentStep.title);
    setText(
      form,
      "[data-fd-cma-description]",
      state.hasResponse
        ? "A few headline details are shown below. The complete CMA PDF has been sent to the delivery workflow."
        : currentStep.description
    );
    setText(form, "[data-fd-cma-count]", state.hasResponse ? "Complete" : state.activeStep + 1 + " / " + formSteps.length);

    var progressBar = form.querySelector("[data-fd-cma-progress]");
    if (progressBar) progressBar.style.width = progress + "%";

    Array.prototype.forEach.call(form.querySelectorAll("[data-fd-cma-tab]"), function (tab) {
      var tabIndex = Number(tab.getAttribute("data-fd-cma-tab"));
      var isComplete = state.hasResponse || tabIndex < state.activeStep;
      var isActive = !state.hasResponse && tabIndex === state.activeStep;

      tab.classList.toggle("is-active", isActive);
      tab.classList.toggle("is-complete", isComplete);
      tab.disabled = !state.hasResponse && tabIndex > state.activeStep;
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-fd-cma-step]"), function (step) {
      var stepIndex = Number(step.getAttribute("data-fd-cma-step"));
      var isVisible = !state.hasResponse && stepIndex === state.activeStep;
      step.hidden = !isVisible;
      step.classList.toggle("is-active", isVisible);
    });

    var result = form.querySelector("[data-fd-cma-result]");
    if (result) result.hidden = !state.hasResponse;

    var backButton = form.querySelector("[data-fd-cma-back]");
    var nextButton = form.querySelector("[data-fd-cma-next]");
    var submitButton = form.querySelector("[data-fd-cma-submit]");
    var resetButton = form.querySelector("[data-fd-cma-reset]");

    if (backButton) {
      backButton.hidden = state.hasResponse ? false : state.activeStep === 0;
      backButton.textContent = state.hasResponse ? "Edit details" : "Back";
      backButton.disabled = state.isSubmitting;
    }

    if (nextButton) nextButton.hidden = state.hasResponse || state.activeStep >= formSteps.length - 1;

    if (submitButton) {
      submitButton.hidden = state.hasResponse || state.activeStep !== formSteps.length - 1;
      submitButton.disabled = state.isSubmitting;
      submitButton.textContent = state.isSubmitting ? "Generating..." : "Generate & email CMA PDF";
    }

    if (resetButton) {
      resetButton.hidden = !state.hasResponse;
      resetButton.disabled = state.isSubmitting;
    }
  }

  function renderResult(form, calculation, deliveryMessage) {
    var state = getFormState(form);

    setText(form, "[data-fd-cma-delivery]", deliveryMessage || "PDF queued for " + state.emailAddress);
    setText(form, "[data-fd-cma-base]", formatCurrencyCompact(calculation.baseMarketValue));
    setText(form, "[data-fd-cma-area]", formatNumber(calculation.areaSqft) + " sq.ft. analysed");
    setText(form, "[data-fd-cma-projected]", formatCurrencyCompact(calculation.projectedValue));
    setText(form, "[data-fd-cma-cagr]", "At " + formatPercent(calculation.blendedCagr) + " p.a. blended CAGR");
    setText(form, "[data-fd-cma-risk]", calculation.riskIndex + " / 100");
    setText(form, "[data-fd-cma-risk-band]", calculation.riskBand.label + " - " + calculation.riskBand.description);
  }

  async function submitToDeliveryWorkflow(form, calculation) {
    var formState = getFormState(form);
    var payload = {
      secret: CMA_APPS_SCRIPT_SECRET,
      source: "fairdeal-assets-static-web",
      submittedAt: new Date().toISOString(),
      form: formState,
      calculation: calculation
    };

    await fetch(CMA_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload),
      redirect: "follow"
    });
  }

  function initCmaForm() {
    var form = document.querySelector("[data-fd-cma-form]");
    if (!form) return;

    var state = {
      form: form,
      activeStep: 0,
      hasResponse: false,
      isSubmitting: false
    };

    populateSelects(form);
    renderForm(state);

    function focusForm() {
      window.setTimeout(function () {
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    }

    function moveToStep(stepIndex) {
      state.activeStep = Math.max(0, Math.min(stepIndex, formSteps.length - 1));
      state.hasResponse = false;
      showMessage(form, "");
      renderForm(state);
      focusForm();
    }

    Array.prototype.forEach.call(form.querySelectorAll("input, select"), function (field) {
      field.addEventListener("input", function () {
        showMessage(form, "");
      });
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-fd-cma-tab]"), function (tab) {
      tab.addEventListener("click", function () {
        var stepIndex = Number(tab.getAttribute("data-fd-cma-tab"));
        if (stepIndex <= state.activeStep || state.hasResponse) {
          moveToStep(stepIndex);
        }
      });
    });

    var nextButton = form.querySelector("[data-fd-cma-next]");
    if (nextButton) {
      nextButton.addEventListener("click", function () {
        var errors = validateStep(form, state.activeStep);
        if (errors.length) {
          showMessage(form, errors[0], "error");
          return;
        }

        moveToStep(state.activeStep + 1);
      });
    }

    var backButton = form.querySelector("[data-fd-cma-back]");
    if (backButton) {
      backButton.addEventListener("click", function () {
        if (state.hasResponse) {
          moveToStep(2);
          return;
        }

        moveToStep(state.activeStep - 1);
      });
    }

    var resetButton = form.querySelector("[data-fd-cma-reset]");
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        form.reset();
        state.activeStep = 0;
        state.hasResponse = false;
        state.isSubmitting = false;
        showMessage(form, "");
        renderForm(state);
        focusForm();
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (state.isSubmitting) return;

      if (!state.hasResponse && state.activeStep < formSteps.length - 1) {
        var stepErrors = validateStep(form, state.activeStep);
        if (stepErrors.length) {
          showMessage(form, stepErrors[0], "error");
          return;
        }

        moveToStep(state.activeStep + 1);
        return;
      }

      var errors = validateCmaForm(form);
      if (errors.length) {
        showMessage(form, errors[0], "error");
        return;
      }

      var calculation = calculateCma(getFormState(form));
      state.isSubmitting = true;
      showMessage(form, "Generating the CMA and sending it to the delivery workflow.");
      renderForm(state);

      submitToDeliveryWorkflow(form, calculation)
        .then(function () {
          state.hasResponse = true;
          state.isSubmitting = false;
          renderResult(form, calculation, "PDF delivery queued for " + getFormState(form).emailAddress);
          showMessage(form, "The CMA blueprint is ready and the delivery workflow has been triggered.", "success");
          renderForm(state);
          focusForm();
        })
        .catch(function () {
          state.hasResponse = true;
          state.isSubmitting = false;
          renderResult(form, calculation, "Local CMA generated for " + getFormState(form).emailAddress);
          showMessage(
            form,
            "The local CMA is ready, but email delivery could not be confirmed. Please try again or contact Fairdeal.",
            "error"
          );
          renderForm(state);
          focusForm();
        });
    });
  }

  function initRegulatoryCards() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-fd-regulatory-card]"), function (card) {
      function toggleCard() {
        var isFlipped = card.classList.toggle("is-flipped");
        card.setAttribute("aria-expanded", isFlipped ? "true" : "false");

        var label = card.getAttribute("aria-label") || "";
        if (label.indexOf("Expand") === 0 || label.indexOf("Collapse") === 0) {
          card.setAttribute("aria-label", label.replace(isFlipped ? "Expand" : "Collapse", isFlipped ? "Collapse" : "Expand"));
        }
      }

      card.addEventListener("click", toggleCard);
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleCard();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCmaForm();
    initRegulatoryCards();
  });
})();
