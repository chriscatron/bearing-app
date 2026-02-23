import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ReferenceLine, ComposedChart } from 'recharts';

console.log("✨ v3.7.14 - Per-account withdrawals in income chart, portfolio balance chart");
console.log("🔵 APP.JS LOADED - Y-AXIS FIX VERSION 999");
const BearingApp = () => {
  // Person 1 (primary) - Demo data defaults
  const [person1Dob, setPerson1Dob] = useState('1964-04-29'); // ISO format for input type="date"
  const [retirementAge, setRetirementAge] = useState(62);
  const [dob, setDob] = useState('04/29/1964'); // Keep for backward compatibility
  const [person1Sex, setPerson1Sex] = useState('male'); // For actuarial tables
  const [person1LifeExpectancy, setPerson1LifeExpectancy] = useState(82);
  const [isMonthly, setIsMonthly] = useState(true);
  
  // FERS Pension - Toggle between planning vs already retired
  const [alreadyRetired, setAlreadyRetired] = useState(false);
  
  // If NOT retired - calculate pension from High-3
  const [high3Salary, setHigh3Salary] = useState(120000);
  const [yearsOfService, setYearsOfService] = useState(30);
  
  // If ALREADY retired - enter from OPM statement
  const [monthlyGrossPension, setMonthlyGrossPension] = useState(6500);
  const [monthlyFEHB, setMonthlyFEHB] = useState(550);
  const [monthlyFEGLI, setMonthlyFEGLI] = useState(65);
  const [monthlyOtherDeductions, setMonthlyOtherDeductions] = useState(0);
  
  const [fersAmount, setFersAmount] = useState(6500);
  const [srsAmount, setSrsAmount] = useState(1360);
  const [ssAmount, setSsAmount] = useState(2795);
  const [ssStartAge, setSsStartAge] = useState(67); // Full retirement age
  const [fersCola, setFersCola] = useState(2.6);
  const [srsCola, setSrsCola] = useState(2.6);
  const [ssCola, setSsCola] = useState(2.6);
  const [projectionYears, setProjectionYears] = useState(40);
  
  // Person 2 (spouse) - Optional
  const [person2Enabled, setPerson2Enabled] = useState(false);
  const [person2Dob, setPerson2Dob] = useState('');
  const [person2Sex, setPerson2Sex] = useState('female');
  const [person2LifeExpectancy, setPerson2LifeExpectancy] = useState(85);
  const [person2FersAmount, setPerson2FersAmount] = useState(0);
  const [person2SrsAmount, setPerson2SrsAmount] = useState(0);
  const [person2SsAmount, setPerson2SsAmount] = useState(0);
  const [person2SsStartAge, setPerson2SsStartAge] = useState(67);
  const [fersSurvivorRate, setFersSurvivorRate] = useState(50); // Survivor gets 50% of FERS
  
  const [tspBalance, setTspBalance] = useState(1000000);
  const [tspGrowthRate, setTspGrowthRate] = useState(6.5);
  const [tspWithdrawalType, setTspWithdrawalType] = useState('amount');
  const [tspWithdrawalAmount, setTspWithdrawalAmount] = useState(3000);
  const [tspWithdrawalPercent, setTspWithdrawalPercent] = useState(4.0);
  const [tspWithdrawalCola, setTspWithdrawalCola] = useState(2.6);
  const [tspCoverTaxes, setTspCoverTaxes] = useState(true);

  // Other Investment Accounts (IRAs, Brokerage)
  const [otherAccounts, setOtherAccounts] = useState([]);

  // TSP Withdrawal Schedule — 3 phases with RMD floor
  const [tspScheduleEnabled, setTspScheduleEnabled] = useState(false);
  const [tspPhase1Age, setTspPhase1Age] = useState(62);
  const [tspPhase1Amount, setTspPhase1Amount] = useState(4.0); // now a % rate
  const [tspPhase2Age, setTspPhase2Age] = useState(70);
  const [tspPhase2Amount, setTspPhase2Amount] = useState(3.5); // % rate
  const [tspPhase3Age, setTspPhase3Age] = useState(80);
  const [tspPhase3Amount, setTspPhase3Amount] = useState(3.0); // % rate

  // eslint-disable-next-line no-unused-vars
  const addOtherAccount = (type) => {
    const defaults = {
      traditional_ira: { name: 'Traditional IRA', growthRate: 6.5, monthlyWithdrawal: 500, color: '#5bc0de' },
      roth_ira: { name: 'Roth IRA', growthRate: 7.0, monthlyWithdrawal: 500, color: '#5cb85c' },
      brokerage: { name: 'Brokerage Account', growthRate: 6.0, monthlyWithdrawal: 500, color: '#CC99CC' },
    };
    const d = defaults[type];
    setOtherAccounts(prev => [...prev, {
      id: Date.now(), name: d.name, type, balance: 0,
      growthRate: d.growthRate, monthlyWithdrawal: d.monthlyWithdrawal,
      withdrawalStartAge: 65, cola: 2.0, color: d.color,
    }]);
  };

  // eslint-disable-next-line no-unused-vars
  const updateOtherAccount = (id, field, value) => {
    setOtherAccounts(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  // eslint-disable-next-line no-unused-vars
  const removeOtherAccount = (id) => {
    setOtherAccounts(prev => prev.filter(a => a.id !== id));
  };

  // Pension Deductions (monthly amounts)
  const [healthInsurance, setHealthInsurance] = useState(550);
  const [lifeInsurance, setLifeInsurance] = useState(65);
  const [dentalInsurance, setDentalInsurance] = useState(53);
  
  // Budget Categories - can be simple (one value) or detailed (subcategories)
  const [budgetMode, setBudgetMode] = useState({
    housing: 'simple',
    food: 'simple',
    transportation: 'simple',
    healthcare: 'simple',
    entertainment: 'simple',
    other: 'simple'
  });
  
  const [budgetHousing, setBudgetHousing] = useState(2000);
  const [budgetHousingDetails, setBudgetHousingDetails] = useState([
    { id: 1, name: 'Mortgage/Rent', amount: 0 },
    { id: 2, name: 'Property Tax', amount: 0 },
    { id: 3, name: 'HOA Fees', amount: 0 },
    { id: 4, name: 'Utilities', amount: 0 },
    { id: 5, name: 'Home Insurance', amount: 0 },
    { id: 6, name: 'Maintenance/Repairs', amount: 0 }
  ]);
  
  const [budgetFood, setBudgetFood] = useState(500);
  const [budgetFoodDetails, setBudgetFoodDetails] = useState([
    { id: 1, name: 'Groceries', amount: 0 },
    { id: 2, name: 'Dining Out', amount: 0 },
    { id: 3, name: 'Coffee/Snacks', amount: 0 }
  ]);
  
  const [budgetTransportation, setBudgetTransportation] = useState(500);
  const [budgetTransportationDetails, setBudgetTransportationDetails] = useState([
    { id: 1, name: 'Car Payment', amount: 0 },
    { id: 2, name: 'Gas', amount: 0 },
    { id: 3, name: 'Auto Insurance', amount: 0 },
    { id: 4, name: 'Maintenance', amount: 0 },
    { id: 5, name: 'Public Transit', amount: 0 }
  ]);
  
  const [budgetHealthcare, setBudgetHealthcare] = useState(250);
  const [budgetHealthcareDetails, setBudgetHealthcareDetails] = useState([
    { id: 1, name: 'Insurance Premiums', amount: 0 },
    { id: 2, name: 'Prescriptions', amount: 0 },
    { id: 3, name: 'Co-pays', amount: 0 },
    { id: 4, name: 'Medical Supplies', amount: 0 }
  ]);
  
  const [budgetEntertainment, setBudgetEntertainment] = useState(500);
  const [budgetEntertainmentDetails, setBudgetEntertainmentDetails] = useState([
    { id: 1, name: 'Streaming Services', amount: 0 },
    { id: 2, name: 'Hobbies', amount: 0 },
    { id: 3, name: 'Activities', amount: 0 },
    { id: 4, name: 'Memberships', amount: 0 }
  ]);
  
  const [budgetOther, setBudgetOther] = useState(491);
  const [budgetOtherDetails, setBudgetOtherDetails] = useState([
    { id: 1, name: 'Miscellaneous', amount: 0 }
  ]);
  
  // Chart toggles
  const [showIncomeStreams, setShowIncomeStreams] = useState({
    fers: false,
    srs: false,
    ss: false,
    tspWithdrawal: false
  });
  const [showBalances, setShowBalances] = useState({ tsp: true });
  
  // Inflation rate for budget
  const [inflationRate, setInflationRate] = useState(2.6);
  
  const [expenses, setExpenses] = useState([]);
  const [additionalIncome, setAdditionalIncome] = useState([]);
  
  // Rental Property tracking
  const [rentalIncome2025, setRentalIncome2025] = useState(Array(12).fill(0)); // Jan-Dec 2025
  const [rentalIncome2026, setRentalIncome2026] = useState(Array(12).fill(0)); // Jan-Dec 2026
  const [rentalIncome2027, setRentalIncome2027] = useState(Array(12).fill(0)); // Jan-Dec 2027
  const [rentalMortgage, setRentalMortgage] = useState(0);
  const [rentalPropertyTax, setRentalPropertyTax] = useState(0);
  const [rentalInsurance, setRentalInsurance] = useState(0);
  const [rentalHOA, setRentalHOA] = useState(0);
  const [rentalUtilities2025, setRentalUtilities2025] = useState(Array(12).fill(0));
  const [rentalUtilities2026, setRentalUtilities2026] = useState(Array(12).fill(0));
  const [rentalUtilities2027, setRentalUtilities2027] = useState(Array(12).fill(0));
  const [rentalInternet, setRentalInternet] = useState(0);
  const [rentalMaintenance, setRentalMaintenance] = useState(0);
  const [rentalLandscaping, setRentalLandscaping] = useState(0);
  const [rentalPestControl, setRentalPestControl] = useState(0);
  const [rentalOther, setRentalOther] = useState(0);
  const [rentalView, setRentalView] = useState(false); // Toggle between retirement and rental view
  // Rental Big Picture fields
  const [rentalMonthlyNet, setRentalMonthlyNet] = useState(0);
  const [rentalPurchasePrice, setRentalPurchasePrice] = useState(0);
  const [rentalCurrentBalance, setRentalCurrentBalance] = useState(0); // remaining mortgage balance
  const [rentalSaleYear, setRentalSaleYear] = useState(0);
  const [rentalSalePrice, setRentalSalePrice] = useState(0);
  
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showWillIOkay, setShowWillIOkay] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [taxBracket, setTaxBracket] = useState(22);
  const [federalWithheld, setFederalWithheld] = useState(683);
  
  // Monte Carlo state
  const [monteCarloResults, setMonteCarloResults] = useState(null);
  const [monteCarloRunning, setMonteCarloRunning] = useState(false);
  const [mcStdDevOverride, setMcStdDevOverride] = useState(null); // null = auto from risk profile
  const [mcRiskProfile, setMcRiskProfile] = useState('moderate'); // conservative/moderate/aggressive
  
  // Starter Scenario state
  const [showScenarioPicker, setShowScenarioPicker] = useState(true);

  // ── Assessment Wizard ─────────────────────────────────────────────────────
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState({});
  const [wizardResults, setWizardResults] = useState(null);
  
  // Track expanded rows and cells
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  const [openSections, setOpenSections] = useState({
    aboutYou: false,
    income: false,
    accounts: false,
    additional: false,
    expenses: false,
    budget: false,
    taxes: false,
    settings: false,
    rental: false,
    withdrawalStrategy: false,
    fersPension: false,
    socialSecurity: false,
    tspWithdrawals: false,
    otherAccounts: false
  });

  const [openGroups, setOpenGroups] = useState({
    incomeAssets: true,
    spendingTaxes: false,
    settingsGroup: false
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const getActuarialLifeExpectancy = (birthYear, sex) => {
    // Simplified actuarial table based on SSA data
    // Returns { average, pct25, pct10 }
    const age = new Date().getFullYear() - birthYear;
    
    if (sex === 'male') {
      if (age < 65) return { average: 82, pct25: 90, pct10: 95 };
      if (age < 75) return { average: 84, pct25: 91, pct10: 95 };
      return { average: 86, pct25: 92, pct10: 96 };
    } else {
      if (age < 65) return { average: 85, pct25: 92, pct10: 96 };
      if (age < 75) return { average: 87, pct25: 93, pct10: 97 };
      return { average: 89, pct25: 94, pct10: 98 };
    }
  };

  const calculateSSBreakeven = (fullBenefitAmount, startAge1, startAge2) => {
    // Calculate breakeven age between two SS start ages
    // Full benefit is at age 67 for most people
    // Reduction factors (simplified)
    const getMonthlyBenefit = (startAge) => {
      if (startAge === 62) return fullBenefitAmount * 0.70; // 30% reduction
      if (startAge === 65) return fullBenefitAmount * 0.867; // 13.3% reduction
      if (startAge === 67) return fullBenefitAmount; // Full benefit
      if (startAge === 70) return fullBenefitAmount * 1.24; // 24% increase
      return fullBenefitAmount;
    };
    
    const monthly1 = getMonthlyBenefit(startAge1);
    const monthly2 = getMonthlyBenefit(startAge2);
    
    // Calculate total received by each strategy
    const yearsDiff = startAge2 - startAge1;
    const earlyTotal = monthly1 * 12 * yearsDiff; // What you get by starting early
    const monthlyDiff = monthly2 - monthly1; // Monthly advantage of waiting
    
    if (monthlyDiff <= 0) return null; // No breakeven if later start pays less
    
    const monthsToBreakeven = earlyTotal / monthlyDiff;
    const breakevenAge = startAge2 + (monthsToBreakeven / 12);
    
    return {
      monthly1,
      monthly2,
      breakevenAge: Math.round(breakevenAge * 10) / 10,
      monthlyDiff
    };
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const calculateRentalProperty = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const results = [];
    let runningTotal = 0;
    
    // Process all 36 months (2025, 2026, 2027)
    [2025, 2026, 2027].forEach((year, yearIndex) => {
      const incomeArray = yearIndex === 0 ? rentalIncome2025 : yearIndex === 1 ? rentalIncome2026 : rentalIncome2027;
      const utilitiesArray = yearIndex === 0 ? rentalUtilities2025 : yearIndex === 1 ? rentalUtilities2026 : rentalUtilities2027;
      
      incomeArray.forEach((income, monthIndex) => {
        const monthIncome = income || 0;
        const pmFee = monthIncome * 0.20; // 20% property management fee
        const utilities = utilitiesArray[monthIndex] || 0;
        
        const totalExpenses = rentalMortgage + rentalPropertyTax + rentalInsurance + rentalHOA + 
                             utilities + rentalInternet + rentalMaintenance + rentalLandscaping + 
                             rentalPestControl + rentalOther + pmFee;
        
        const netIncome = monthIncome - totalExpenses;
        runningTotal += netIncome;
        
        results.push({
          month: `${months[monthIndex]} ${year}`,
          year,
          monthIndex,
          income: monthIncome,
          pmFee,
          utilities,
          totalExpenses,
          netIncome,
          runningTotal
        });
      });
    });
    
    return results;
  };

  const calculateRentalTargets = () => {
    const fixedCosts = rentalMortgage + rentalPropertyTax + rentalInsurance + rentalHOA + 
                      rentalInternet + rentalMaintenance + rentalLandscaping + rentalPestControl + rentalOther;
    
    // Get current month (0-11 for Jan-Dec)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calculate running total through current month
    const rentalData = calculateRentalProperty();
    let currentRunningTotal = 0;
    let remainingMonths = 0;
    
    rentalData.forEach((row, idx) => {
      const rowDate = new Date(row.year, row.monthIndex);
      const nowDate = new Date(currentYear, currentMonth);
      
      if (rowDate <= nowDate) {
        currentRunningTotal = row.runningTotal;
      } else if (row.year <= 2027) {
        remainingMonths++;
      }
    });
    
    // Calculate target per remaining month to break even
    let targetPerMonth = 0;
    if (currentRunningTotal < 0 && remainingMonths > 0) {
      targetPerMonth = Math.abs(currentRunningTotal) / remainingMonths;
    }
    
    return {
      fixedCosts,
      currentRunningTotal,
      remainingMonths,
      targetPerMonth
    };
  };

  const resetToDemo = () => {
    if (window.confirm('Reset all fields to demo data? Your current data will be lost.')) {
      // Person 1
      setDob('04/29/1964');
      setPerson1Dob('1964-04-29');
      setPerson1Sex('male');
      setPerson1LifeExpectancy(82);
      setRetirementAge(62);
      setAlreadyRetired(true);
      setIsMonthly(true);
      setHigh3Salary(120000);
      setYearsOfService(30);
      setMonthlyGrossPension(6500);
      setMonthlyFEHB(550);
      setMonthlyFEGLI(65);
      setMonthlyOtherDeductions(0);
      setFersAmount(6500);
      setSrsAmount(1360);
      setSsAmount(2795);
      setSsStartAge(62);
      setFersCola(2.6);
      setSrsCola(2.6);
      setSsCola(2.6);
      setProjectionYears(40);
      // Person 2
      setPerson2Enabled(false);
      setPerson2Dob('');
      setPerson2Sex('female');
      setPerson2LifeExpectancy(85);
      setPerson2FersAmount(0);
      setPerson2SrsAmount(0);
      setPerson2SsAmount(0);
      setPerson2SsStartAge(67);
      setFersSurvivorRate(50);
      // TSP
      setTspBalance(1000000);
      setTspGrowthRate(6.5);
      setTspWithdrawalType('percent');
      setTspWithdrawalAmount(0);
      setTspWithdrawalPercent(4.0);
      setTspWithdrawalCola(2.6);
      setTspCoverTaxes(true);
      setTspScheduleEnabled(true);
      setTspPhase1Age(62);
      setTspPhase1Amount(4.0);
      setTspPhase2Age(70);
      setTspPhase2Amount(3.5);
      setTspPhase3Age(80);
      setTspPhase3Amount(3.0);
      // Other accounts
      setOtherAccounts([]);
      // Insurance & deductions
      setHealthInsurance(550);
      setLifeInsurance(65);
      setDentalInsurance(53);
      // Budget
      setBudgetHousing(2000);
      setBudgetFood(500);
      setBudgetTransportation(500);
      setBudgetHealthcare(250);
      setBudgetEntertainment(500);
      setBudgetOther(491);
      setInflationRate(2.6);
      setExpenses([]);
      setAdditionalIncome([]);
      setTaxBracket(22);
      setFederalWithheld(683);
      setBudgetMode({
        housing: 'simple', food: 'simple', transportation: 'simple',
        healthcare: 'simple', entertainment: 'simple', other: 'simple'
      });
      // Rental
      setRentalMonthlyNet(0);
      setRentalPurchasePrice(0);
      setRentalCurrentBalance(0);
      setRentalSaleYear(0);
      setRentalSalePrice(0);
      setRentalMortgage(0);
      setRentalPropertyTax(0);
      setRentalInsurance(0);
      setRentalHOA(0);
      setRentalInternet(0);
      setRentalMaintenance(0);
      setRentalLandscaping(0);
      setRentalPestControl(0);
      setRentalOther(0);
      setRentalIncome2025(Array(12).fill(0));
      setRentalIncome2026(Array(12).fill(0));
      setRentalIncome2027(Array(12).fill(0));
      setRentalUtilities2025(Array(12).fill(0));
      setRentalUtilities2026(Array(12).fill(0));
      setRentalUtilities2027(Array(12).fill(0));
      // Monte Carlo
      setMonteCarloResults(null);
      setExpandedRows(new Set());
      setHasCalculated(false);
      localStorage.setItem('bearingData', JSON.stringify({
        dob: '04/29/1964',
        isMonthly: true,
        fersAmount: 6500,
        srsAmount: 1360,
        ssAmount: 2795,
        fersCola: 2.6,
        srsCola: 2.6,
        ssCola: 2.6,
        projectionYears: 40,
        tspBalance: 1000000,
        tspGrowthRate: 6.5,
        tspWithdrawalType: 'percent',
        tspWithdrawalAmount: 0,
        tspWithdrawalPercent: 4.0,
        tspWithdrawalCola: 2.6,
        tspCoverTaxes: true,
        healthInsurance: 550,
        lifeInsurance: 65,
        dentalInsurance: 53,
        budgetHousing: 2000,
        budgetFood: 500,
        budgetTransportation: 500,
        budgetHealthcare: 250,
        budgetEntertainment: 500,
        budgetOther: 491,
        inflationRate: 2.6,
        expenses: [],
        taxBracket: 22,
        federalWithheld: 683
      }));
    }
  };

  const toggleBudgetMode = (category) => {
    setBudgetMode(prev => ({
      ...prev,
      [category]: prev[category] === 'simple' ? 'detailed' : 'simple'
    }));
  };

  const addBudgetSubcategory = (category, setDetails) => {
    setDetails(prev => [...prev, {
      id: Date.now(),
      name: '',
      amount: 0
    }]);
  };

  const updateBudgetSubcategory = (id, field, value, details, setDetails) => {
    setDetails(details.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const deleteBudgetSubcategory = (id, details, setDetails) => {
    setDetails(details.filter(item => item.id !== id));
  };

  const calculateCategoryTotal = (details) => {
    return details.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const toggleRowExpansion = (year) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(year)) {
        newSet.delete(year);
      } else {
        newSet.add(year);
      }
      return newSet;
    });
  };

  const addExpense = () => {
    setExpenses([...expenses, {
      id: Date.now(),
      name: '',
      year: new Date().getFullYear(),
      amount: 0,
      repeat: false,
      repeatYears: 1
    }]);
  };

  const addAdditionalIncome = () => {
    setAdditionalIncome([...additionalIncome, {
      id: Date.now(),
      name: '',
      amount: 0,
      frequency: 'monthly', // weekly, biweekly, semimonthly, monthly, yearly
      afterTax: false,
      startYear: new Date().getFullYear(),
      endYear: null
    }]);
  };

  const updateAdditionalIncome = (id, field, value) => {
    setAdditionalIncome(additionalIncome.map(income =>
      income.id === id ? { ...income, [field]: value } : income
    ));
  };

  const deleteAdditionalIncome = (id) => {
    setAdditionalIncome(additionalIncome.filter(income => income.id !== id));
  };

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleCalculate = () => {
    setHasCalculated(true);
  };

  // ── SINGLE SOURCE OF TRUTH: all saveable state ───────────────────────────
  const buildSaveData = () => ({
    _version: '3.7',
    // Identity
    dob, person1Dob, person1Sex, person1LifeExpectancy, retirementAge, isMonthly,
    // Person 2
    person2Enabled, person2Dob, person2Sex, person2LifeExpectancy,
    person2FersAmount, person2SrsAmount, person2SsAmount, person2SsStartAge, fersSurvivorRate,
    // FERS
    alreadyRetired, high3Salary, yearsOfService,
    monthlyGrossPension, monthlyFEHB, monthlyFEGLI, monthlyOtherDeductions,
    fersAmount, srsAmount, ssAmount, ssStartAge,
    fersCola, srsCola, ssCola, projectionYears,
    // TSP
    tspBalance, tspGrowthRate, tspWithdrawalType,
    tspWithdrawalAmount, tspWithdrawalPercent, tspWithdrawalCola, tspCoverTaxes,
    tspScheduleEnabled, tspPhase1Age, tspPhase1Amount, tspPhase2Age, tspPhase2Amount, tspPhase3Age, tspPhase3Amount,
    // Other accounts
    otherAccounts,
    // Deductions
    healthInsurance, lifeInsurance, dentalInsurance,
    // Budget
    budgetMode,
    budgetHousing, budgetHousingDetails,
    budgetFood, budgetFoodDetails,
    budgetTransportation, budgetTransportationDetails,
    budgetHealthcare, budgetHealthcareDetails,
    budgetEntertainment, budgetEntertainmentDetails,
    budgetOther, budgetOtherDetails,
    // Misc income / expenses
    inflationRate, expenses, additionalIncome,
    taxBracket, federalWithheld,
    // Rental
    rentalMonthlyNet, rentalPurchasePrice, rentalCurrentBalance, rentalSaleYear, rentalSalePrice,
    rentalIncome2025, rentalIncome2026, rentalIncome2027,
    rentalMortgage, rentalPropertyTax, rentalInsurance, rentalHOA,
    rentalUtilities2025, rentalUtilities2026, rentalUtilities2027,
    rentalInternet, rentalMaintenance, rentalLandscaping, rentalPestControl, rentalOther,
    // Monte Carlo
    mcRiskProfile,
  });

  const applyLoadedData = (data) => {
    if (!data) return;
    const s = (setter, key, def) => setter(data[key] !== undefined ? data[key] : def);
    s(setDob, 'dob', '04/29/1964');
    s(setPerson1Dob, 'person1Dob', '1964-04-29');
    s(setPerson1Sex, 'person1Sex', 'male');
    s(setPerson1LifeExpectancy, 'person1LifeExpectancy', 82);
    s(setRetirementAge, 'retirementAge', 62);
    s(setIsMonthly, 'isMonthly', true);
    s(setPerson2Enabled, 'person2Enabled', false);
    if (data.person2Dob) {
      let dob2 = data.person2Dob;
      // Convert MM/DD/YYYY to YYYY-MM-DD if needed
      if (dob2.includes('/')) {
        const parts = dob2.split('/');
        dob2 = `${parts[2]}-${parts[0].padStart(2,'0')}-${parts[1].padStart(2,'0')}`;
      }
      setPerson2Dob(dob2);
    } else {
      setPerson2Dob('');
    }
    s(setPerson2Sex, 'person2Sex', 'female');
    s(setPerson2LifeExpectancy, 'person2LifeExpectancy', 85);
    s(setPerson2FersAmount, 'person2FersAmount', 0);
    s(setPerson2SrsAmount, 'person2SrsAmount', 0);
    s(setPerson2SsAmount, 'person2SsAmount', 0);
    s(setPerson2SsStartAge, 'person2SsStartAge', 67);
    s(setFersSurvivorRate, 'fersSurvivorRate', 50);
    s(setAlreadyRetired, 'alreadyRetired', false);
    s(setHigh3Salary, 'high3Salary', 120000);
    s(setYearsOfService, 'yearsOfService', 30);
    s(setMonthlyGrossPension, 'monthlyGrossPension', 6500);
    s(setMonthlyFEHB, 'monthlyFEHB', 550);
    s(setMonthlyFEGLI, 'monthlyFEGLI', 65);
    s(setMonthlyOtherDeductions, 'monthlyOtherDeductions', 0);
    s(setFersAmount, 'fersAmount', 0);
    s(setSrsAmount, 'srsAmount', 0);
    s(setSsAmount, 'ssAmount', 0);
    s(setSsStartAge, 'ssStartAge', 67);
    s(setFersCola, 'fersCola', 2.6);
    s(setSrsCola, 'srsCola', 2.6);
    s(setSsCola, 'ssCola', 2.6);
    s(setProjectionYears, 'projectionYears', 40);
    s(setTspBalance, 'tspBalance', 0);
    s(setTspGrowthRate, 'tspGrowthRate', 6.5);
    s(setTspWithdrawalType, 'tspWithdrawalType', 'amount');
    s(setTspWithdrawalAmount, 'tspWithdrawalAmount', 0);
    s(setTspWithdrawalPercent, 'tspWithdrawalPercent', 4.0);
    s(setTspWithdrawalCola, 'tspWithdrawalCola', 2.6);
    s(setTspCoverTaxes, 'tspCoverTaxes', false);
    s(setTspScheduleEnabled, 'tspScheduleEnabled', true);
    s(setTspPhase1Age, 'tspPhase1Age', 62);
    s(setTspPhase1Amount, 'tspPhase1Amount', 4.0);
    s(setTspPhase2Age, 'tspPhase2Age', 70);
    s(setTspPhase2Amount, 'tspPhase2Amount', 3.5);
    s(setTspPhase3Age, 'tspPhase3Age', 80);
    s(setTspPhase3Amount, 'tspPhase3Amount', 3.0);
    s(setOtherAccounts, 'otherAccounts', []);
    s(setHealthInsurance, 'healthInsurance', 0);
    s(setLifeInsurance, 'lifeInsurance', 0);
    s(setDentalInsurance, 'dentalInsurance', 0);
    if (data.budgetMode) setBudgetMode(data.budgetMode);
    s(setBudgetHousing, 'budgetHousing', 0);
    if (data.budgetHousingDetails) setBudgetHousingDetails(data.budgetHousingDetails);
    s(setBudgetFood, 'budgetFood', 0);
    if (data.budgetFoodDetails) setBudgetFoodDetails(data.budgetFoodDetails);
    s(setBudgetTransportation, 'budgetTransportation', 0);
    if (data.budgetTransportationDetails) setBudgetTransportationDetails(data.budgetTransportationDetails);
    s(setBudgetHealthcare, 'budgetHealthcare', 0);
    if (data.budgetHealthcareDetails) setBudgetHealthcareDetails(data.budgetHealthcareDetails);
    s(setBudgetEntertainment, 'budgetEntertainment', 0);
    if (data.budgetEntertainmentDetails) setBudgetEntertainmentDetails(data.budgetEntertainmentDetails);
    s(setBudgetOther, 'budgetOther', 0);
    if (data.budgetOtherDetails) setBudgetOtherDetails(data.budgetOtherDetails);
    s(setInflationRate, 'inflationRate', 2.6);
    s(setExpenses, 'expenses', []);
    s(setAdditionalIncome, 'additionalIncome', []);
    s(setTaxBracket, 'taxBracket', 22);
    s(setFederalWithheld, 'federalWithheld', 0);
    s(setRentalMonthlyNet, 'rentalMonthlyNet', 0);
    s(setRentalPurchasePrice, 'rentalPurchasePrice', 0);
    s(setRentalCurrentBalance, 'rentalCurrentBalance', 0);
    s(setRentalSaleYear, 'rentalSaleYear', 0);
    s(setRentalSalePrice, 'rentalSalePrice', 0);
    if (data.rentalIncome2025) setRentalIncome2025(data.rentalIncome2025);
    if (data.rentalIncome2026) setRentalIncome2026(data.rentalIncome2026);
    if (data.rentalIncome2027) setRentalIncome2027(data.rentalIncome2027);
    s(setRentalMortgage, 'rentalMortgage', 0);
    s(setRentalPropertyTax, 'rentalPropertyTax', 0);
    s(setRentalInsurance, 'rentalInsurance', 0);
    s(setRentalHOA, 'rentalHOA', 0);
    if (data.rentalUtilities2025) setRentalUtilities2025(data.rentalUtilities2025);
    if (data.rentalUtilities2026) setRentalUtilities2026(data.rentalUtilities2026);
    if (data.rentalUtilities2027) setRentalUtilities2027(data.rentalUtilities2027);
    s(setRentalInternet, 'rentalInternet', 0);
    s(setRentalMaintenance, 'rentalMaintenance', 0);
    s(setRentalLandscaping, 'rentalLandscaping', 0);
    s(setRentalPestControl, 'rentalPestControl', 0);
    s(setRentalOther, 'rentalOther', 0);
    s(setMcRiskProfile, 'mcRiskProfile', 'moderate');
  };

  // Auto-save: single source of truth
  React.useEffect(() => {
    localStorage.setItem('bearingData', JSON.stringify(buildSaveData()));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dob, person1Dob, person1Sex, person1LifeExpectancy, retirementAge, isMonthly,
    person2Enabled, person2Dob, person2Sex, person2LifeExpectancy,
    person2FersAmount, person2SrsAmount, person2SsAmount, person2SsStartAge, fersSurvivorRate,
    alreadyRetired, high3Salary, yearsOfService,
    monthlyGrossPension, monthlyFEHB, monthlyFEGLI, monthlyOtherDeductions,
    fersAmount, srsAmount, ssAmount, ssStartAge, fersCola, srsCola, ssCola, projectionYears,
    tspBalance, tspGrowthRate, tspWithdrawalType, tspWithdrawalAmount,
    tspWithdrawalPercent, tspWithdrawalCola, tspCoverTaxes, otherAccounts,
    tspScheduleEnabled, tspPhase1Age, tspPhase1Amount, tspPhase2Age, tspPhase2Amount, tspPhase3Age, tspPhase3Amount,
    healthInsurance, lifeInsurance, dentalInsurance,
    budgetMode, budgetHousing, budgetHousingDetails,
    budgetFood, budgetFoodDetails, budgetTransportation, budgetTransportationDetails,
    budgetHealthcare, budgetHealthcareDetails, budgetEntertainment, budgetEntertainmentDetails,
    budgetOther, budgetOtherDetails,
    inflationRate, expenses, additionalIncome, taxBracket, federalWithheld,
    rentalIncome2025, rentalIncome2026, rentalIncome2027,
    rentalMortgage, rentalPropertyTax, rentalInsurance, rentalHOA,
    rentalUtilities2025, rentalUtilities2026, rentalUtilities2027,
    rentalInternet, rentalMaintenance, rentalLandscaping, rentalPestControl, rentalOther,
    mcRiskProfile,
  ]);

  // Load on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('bearingData');
    if (saved) {
      try { applyLoadedData(JSON.parse(saved)); }
      catch (e) { console.error('Error loading saved data:', e); }
    }
  }, []);

  const exportData = () => {
    const payload = { _version: '3.7', exportDate: new Date().toISOString(), data: buildSaveData() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bearing-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const [importSuccessMsg, setImportSuccessMsg] = React.useState('');
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        applyLoadedData(imported.data || imported);
        setImportSuccessMsg('✅ Data imported successfully!');
        setTimeout(() => setImportSuccessMsg(''), 4000);
      } catch (err) {
        setImportSuccessMsg('❌ Import failed — file may be invalid.');
        setTimeout(() => setImportSuccessMsg(''), 4000);
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const clearAllData = () => {
    setShowClearConfirm(true);
  };

  const confirmClearData = () => {
    localStorage.removeItem('bearingData');
    setShowClearConfirm(false);
    window.location.reload();
  };

  // IRS RMD life expectancy table (Uniform Lifetime, simplified)
  const calculateRMD = (balance, age) => {
    if (age < 73) return 0;
    const lifeExpectancyTable = {
      73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
      79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8,
      85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2,
      91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4,
      97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4,
    };
    const factor = lifeExpectancyTable[Math.min(age, 100)] || 6.4;
    return balance / factor;
  };

  const calculateTaxes = (fersIncome, ssIncome, tspWithdrawal) => {
    // Calculate taxes on FERS + SS (85% of SS is taxable)
    const taxableSS = ssIncome * 0.85;
    const taxableIncome = fersIncome + taxableSS;
    const estimatedTaxOnIncome = taxableIncome * (taxBracket / 100);
    
    // Subtract taxes already withheld from FERS (annual withholding)
    const annualWithholding = federalWithheld * 12;
    const netTaxLiability = estimatedTaxOnIncome - annualWithholding;
    
    // Calculate taxes on TSP withdrawals separately
    const estimatedTaxOnTSP = tspWithdrawal * (taxBracket / 100);
    
    return {
      incomeTax: netTaxLiability, // Net tax owed (or refund if negative)
      tspTax: estimatedTaxOnTSP
    };
  };

  const calculateProjections = () => {
    // Parse DOB - handle both MM/DD/YYYY format and YYYY-MM-DD format
    let birthYear, birthMonth;
    if (dob.includes('-')) {
      // Date input format: YYYY-MM-DD
      const parts = dob.split('-');
      birthYear = parseInt(parts[0]);
      birthMonth = parseInt(parts[1]);
    } else {
      // Text input format: MM/DD/YYYY
      const parts = dob.split('/');
      birthMonth = parseInt(parts[0]);
      birthYear = parseInt(parts[2]);
    }
    const currentYear = new Date().getFullYear();
    const startAge = currentYear - birthYear;
    
    const projections = [];
    let currentTspBalance = tspBalance;
    let currentWithdrawal = tspWithdrawalAmount * (isMonthly ? 12 : 1);
    // Initialize other account balances
    const accountBalances = otherAccounts.map(acc => acc.balance);
    
    for (let i = 0; i < projectionYears; i++) {
      const year = currentYear + i;
      const age = startAge + i;
      
      // Calculate income sources with month-accurate transitions
      let fers = fersAmount * (isMonthly ? 12 : 1) * Math.pow(1 + fersCola / 100, i);
      
      // SRS: pays until the month of turning 62 (so if born in April, pays through April)
      let srs = 0;
      if (age < 62) {
        // Full year of SRS
        srs = srsAmount * (isMonthly ? 12 : 1) * Math.pow(1 + srsCola / 100, i);
      } else if (age === 62) {
        // Partial year - pays through birth month
        const monthsOfSRS = birthMonth;
        srs = srsAmount * (isMonthly ? monthsOfSRS : (monthsOfSRS / 12)) * Math.pow(1 + srsCola / 100, i);
      }
      
      // Social Security: starts the month after turning 62 (so if born in April, starts in May)
      let ss = 0;
      const ssStartYear = 62 - startAge; // projection index when SS starts
      if (age > 62) {
        // Full year of SS - COLA compounds from year SS started
        const yearsOfSS = i - ssStartYear;
        ss = ssAmount * (isMonthly ? 12 : 1) * Math.pow(1 + ssCola / 100, yearsOfSS);
      } else if (age === 62) {
        // Partial year - starts month after birth month
        const monthsOfSS = 12 - birthMonth;
        ss = ssAmount * (isMonthly ? monthsOfSS : (monthsOfSS / 12)) * Math.pow(1 + ssCola / 100, 0);
      }
      
      // TSP calculations
      let tspWithdrawal = 0;
      let rmdAmount = 0;
      let rmdApplied = false;
      if (currentTspBalance > 0) {
        // Determine planned withdrawal for this age (phased schedule or simple)
        let plannedAnnual;
        if (tspScheduleEnabled) {
          let phasePct = tspPhase1Amount;
          if (age >= tspPhase3Age) phasePct = tspPhase3Amount;
          else if (age >= tspPhase2Age) phasePct = tspPhase2Amount;
          plannedAnnual = currentTspBalance * (phasePct / 100);
        } else if (tspWithdrawalType === 'amount') {
          plannedAnnual = currentWithdrawal;
        } else {
          plannedAnnual = currentTspBalance * (tspWithdrawalPercent / 100);
        }

        // Gross up if covering taxes (amount mode only)
        let baseWithdrawal = plannedAnnual;
        if (!tspScheduleEnabled && tspWithdrawalType === 'amount' && tspCoverTaxes) {
          baseWithdrawal = plannedAnnual / (1 - taxBracket / 100);
        }
        tspWithdrawal = Math.min(baseWithdrawal, currentTspBalance);

        // RMD override: if age >= 73 and RMD > planned withdrawal, use RMD
        rmdAmount = calculateRMD(currentTspBalance, age);
        if (rmdAmount > tspWithdrawal) {
          tspWithdrawal = Math.min(rmdAmount, currentTspBalance);
          rmdApplied = true;
        }

        // Update balance: growth then withdrawal
        currentTspBalance = currentTspBalance * (1 + tspGrowthRate / 100) - tspWithdrawal;
        currentTspBalance = Math.max(0, currentTspBalance);

        // COLA on withdrawal for next year (simple amount mode only, not schedule mode)
        if (!tspScheduleEnabled && tspWithdrawalType === 'amount' && !rmdApplied) {
          currentWithdrawal *= (1 + tspWithdrawalCola / 100);
        }
      }
      
      // Calculate expenses for this year
      let yearExpenses = 0;
      expenses.forEach(exp => {
        if (exp.repeat) {
          if (year >= exp.year && (year - exp.year) % exp.repeatYears === 0) {
            yearExpenses += exp.amount;
          }
        } else if (year === exp.year) {
          yearExpenses += exp.amount;
        }
      });
      
      // Calculate additional income for this year
      let yearAdditionalIncomeGross = 0;
      let yearAdditionalIncomeNet = 0;
      additionalIncome.forEach(income => {
        if (year >= income.startYear && (income.endYear === null || year <= income.endYear)) {
          // Convert to annual based on frequency
          let annualAmount = 0;
          switch(income.frequency) {
            case 'weekly':
              annualAmount = income.amount * 52;
              break;
            case 'biweekly':
              annualAmount = income.amount * 26;
              break;
            case 'semimonthly':
              annualAmount = income.amount * 24;
              break;
            case 'monthly':
              annualAmount = income.amount * 12;
              break;
            case 'yearly':
              annualAmount = income.amount;
              break;
            default:
              annualAmount = income.amount * 12;
          }
          
          if (income.afterTax) {
            // Already taxed, counts as net income
            yearAdditionalIncomeNet += annualAmount;
          } else {
            // Needs to be taxed
            yearAdditionalIncomeGross += annualAmount;
          }
        }
      });
      
      // Calculate pension deductions (monthly amounts * 12, with inflation)
      const inflationMultiplier = Math.pow(1 + inflationRate / 100, i);
      const yearHealthIns = healthInsurance * 12 * inflationMultiplier;
      const yearLifeIns = age < 65 ? lifeInsurance * 12 * inflationMultiplier : 0; // Stops at 65
      const yearDentalIns = dentalInsurance * 12 * inflationMultiplier;
      const totalDeductions = yearHealthIns + yearLifeIns + yearDentalIns;
      
      // Calculate budget expenses (monthly amounts * 12, with inflation)
      // Use detailed mode if available, otherwise use simple totals
      const housingTotal = budgetMode.housing === 'detailed' 
        ? calculateCategoryTotal(budgetHousingDetails) 
        : budgetHousing;
      const foodTotal = budgetMode.food === 'detailed'
        ? calculateCategoryTotal(budgetFoodDetails)
        : budgetFood;
      const transportationTotal = budgetMode.transportation === 'detailed'
        ? calculateCategoryTotal(budgetTransportationDetails)
        : budgetTransportation;
      const healthcareTotal = budgetMode.healthcare === 'detailed'
        ? calculateCategoryTotal(budgetHealthcareDetails)
        : budgetHealthcare;
      const entertainmentTotal = budgetMode.entertainment === 'detailed'
        ? calculateCategoryTotal(budgetEntertainmentDetails)
        : budgetEntertainment;
      const otherTotal = budgetMode.other === 'detailed'
        ? calculateCategoryTotal(budgetOtherDetails)
        : budgetOther;
      
      const yearBudgetHousing = housingTotal * 12 * inflationMultiplier;
      const yearBudgetFood = foodTotal * 12 * inflationMultiplier;
      const yearBudgetTransportation = transportationTotal * 12 * inflationMultiplier;
      const yearBudgetHealthcare = healthcareTotal * 12 * inflationMultiplier;
      const yearBudgetEntertainment = entertainmentTotal * 12 * inflationMultiplier;
      const yearBudgetOther = otherTotal * 12 * inflationMultiplier;
      const totalBudget = yearBudgetHousing + yearBudgetFood + yearBudgetTransportation + 
                         yearBudgetHealthcare + yearBudgetEntertainment + yearBudgetOther;
      
      // Calculate estimated taxes (separated into income tax and TSP tax)
      // Additional income that's not after-tax gets added to taxable income
      // Calculate other investment account withdrawals
      let otherAccountsIncome = 0;
      let otherAccountsTaxable = 0;
      const accountWithdrawals = otherAccounts.map(() => 0);
      otherAccounts.forEach((acc, idx) => {
        if (age >= acc.startAge && accountBalances[idx] > 0) {
          const yearsActive = age - acc.startAge;
          const annualWithdrawal = acc.monthlyWithdrawal * 12 * Math.pow(1 + acc.cola / 100, yearsActive);
          const wd = Math.min(annualWithdrawal, accountBalances[idx]);
          accountBalances[idx] = Math.max(0, accountBalances[idx] * (1 + acc.growthRate / 100) - wd);
          accountWithdrawals[idx] = wd;
          otherAccountsIncome += wd;
          if (acc.type === 'traditional_ira') otherAccountsTaxable += wd;
        } else if (accountBalances[idx] > 0) {
          accountBalances[idx] = accountBalances[idx] * (1 + acc.growthRate / 100);
        }
      });

      // Rental property net income / sale proceeds
      let rentalNet = 0;
      let rentalSaleProceeds = 0;
      if (rentalSaleYear === 0 || year < rentalSaleYear) {
        // Still holding - apply monthly net (can be negative)
        rentalNet = rentalMonthlyNet * 12;
      } else if (year === rentalSaleYear) {
        // Sale year - net proceeds = sale price minus remaining mortgage balance
        rentalSaleProceeds = Math.max(0, rentalSalePrice - rentalCurrentBalance);
        rentalNet = 0;
      }
      // After sale year: both stay 0

      const taxes = calculateTaxes(fers + yearAdditionalIncomeGross + otherAccountsTaxable, ss, tspWithdrawal);
      
      const totalIncome = fers + srs + ss + tspWithdrawal + yearAdditionalIncomeGross + yearAdditionalIncomeNet + otherAccountsIncome + rentalNet + rentalSaleProceeds;
      const netFers = fers - totalDeductions; // FERS after deductions
      
      projections.push({
        year,
        age,
        fersGross: Math.round(fers),
        fers: Math.round(netFers),
        deductions: Math.round(totalDeductions),
        deductionDetails: {
          health: Math.round(yearHealthIns),
          life: Math.round(yearLifeIns),
          dental: Math.round(yearDentalIns)
        },
        srs: Math.round(srs),
        ss: Math.round(ss),
        tspWithdrawal: Math.round(tspWithdrawal),
        additionalIncome: Math.round(yearAdditionalIncomeGross + yearAdditionalIncomeNet),
        estimatedTaxes: Math.round(taxes.incomeTax),
        estimatedTspTaxes: Math.round(taxes.tspTax),
        tspBalance: Math.round(currentTspBalance),
        otherAccountsIncome: Math.round(otherAccountsIncome),
        otherAccountsBalances: accountBalances.map(b => Math.round(b)),
        otherAccountsWithdrawals: accountWithdrawals.map(w => Math.round(w)),
        rentalNet: Math.round(rentalNet),
        rentalSaleProceeds: Math.round(rentalSaleProceeds),
        expenses: Math.round(yearExpenses),
        budget: Math.round(totalBudget),
        budgetDetails: {
          housing: Math.round(yearBudgetHousing),
          food: Math.round(yearBudgetFood),
          transportation: Math.round(yearBudgetTransportation),
          healthcare: Math.round(yearBudgetHealthcare),
          entertainment: Math.round(yearBudgetEntertainment),
          other: Math.round(yearBudgetOther)
        },
        totalIncome: Math.round(totalIncome),
        netIncome: Math.round(totalIncome - yearExpenses - totalBudget)
      });
    }
    
    return projections;
  };

  // ─── STARTER SCENARIOS ────────────────────────────────────────────────────
  const starterScenarios = {
    blank: {
      label: '📋 Blank Canvas',
      description: 'Start fresh with all zeros',
      icon: '📋',
      color: '#666',
      data: {
        dob: '', isMonthly: true, fersAmount: 0, srsAmount: 0, ssAmount: 0, ssStartAge: 67,
        fersCola: 2.6, srsCola: 2.6, ssCola: 2.6, projectionYears: 30,
        tspBalance: 0, tspGrowthRate: 6.5, tspWithdrawalType: 'amount',
        tspWithdrawalAmount: 0, tspWithdrawalPercent: 4.0, tspWithdrawalCola: 2.6, tspCoverTaxes: false,
        healthInsurance: 0, lifeInsurance: 0, dentalInsurance: 0,
        budgetHousing: 0, budgetFood: 0, budgetTransportation: 0, budgetHealthcare: 0,
        budgetEntertainment: 0, budgetOther: 0, inflationRate: 2.6, taxBracket: 22, federalWithheld: 0, expenses: []
      }
    },
    // Federal Employee Scenarios
    earlyCareerFed: {
      label: '🌱 Early Career Fed',
      description: 'Age 28 • Single • 5 yrs service • GS-9',
      icon: '🌱',
      color: '#5cb85c',
      category: 'federal',
      data: {
        dob: `01/15/${new Date().getFullYear() - 28}`, isMonthly: true,
        fersAmount: 1100, srsAmount: 420, ssAmount: 1400, ssStartAge: 67,
        fersCola: 2.6, srsCola: 2.6, ssCola: 2.6, projectionYears: 40,
        tspBalance: 45000, tspGrowthRate: 7.0, tspWithdrawalType: 'amount',
        tspWithdrawalAmount: 1500, tspWithdrawalPercent: 4.0, tspWithdrawalCola: 2.6, tspCoverTaxes: false,
        healthInsurance: 250, lifeInsurance: 30, dentalInsurance: 25,
        budgetHousing: 1400, budgetFood: 400, budgetTransportation: 350, budgetHealthcare: 100,
        budgetEntertainment: 300, budgetOther: 250, inflationRate: 2.6, taxBracket: 22, federalWithheld: 180, expenses: []
      }
    },
    midCareerCouple: {
      label: '👨‍👩‍👧‍👦 Mid-Career Couple',
      description: 'Age 42 • Married • 18 yrs service • GS-13',
      icon: '👨‍👩‍👧‍👦',
      color: '#5bc0de',
      category: 'federal',
      data: {
        dob: `06/10/${new Date().getFullYear() - 42}`, isMonthly: true,
        fersAmount: 3800, srsAmount: 980, ssAmount: 2200, ssStartAge: 67,
        fersCola: 2.6, srsCola: 2.6, ssCola: 2.6, projectionYears: 40,
        tspBalance: 320000, tspGrowthRate: 6.5, tspWithdrawalType: 'amount',
        tspWithdrawalAmount: 2500, tspWithdrawalPercent: 4.0, tspWithdrawalCola: 2.6, tspCoverTaxes: true,
        healthInsurance: 480, lifeInsurance: 55, dentalInsurance: 45,
        budgetHousing: 2200, budgetFood: 700, budgetTransportation: 600, budgetHealthcare: 200,
        budgetEntertainment: 450, budgetOther: 400, inflationRate: 2.6, taxBracket: 22, federalWithheld: 420, expenses: []
      }
    },
    preRetirementFed: {
      label: '🏁 Pre-Retirement Fed',
      description: 'Age 57 • Married • 30 yrs service • GS-15',
      icon: '🏁',
      color: '#FF9933',
      category: 'federal',
      data: {
        dob: `04/29/${new Date().getFullYear() - 57}`, isMonthly: true,
        fersAmount: 6500, srsAmount: 1360, ssAmount: 2795, ssStartAge: 67,
        fersCola: 2.6, srsCola: 2.6, ssCola: 2.6, projectionYears: 35,
        tspBalance: 1000000, tspGrowthRate: 6.5, tspWithdrawalType: 'amount',
        tspWithdrawalAmount: 3000, tspWithdrawalPercent: 4.0, tspWithdrawalCola: 2.6, tspCoverTaxes: true,
        healthInsurance: 550, lifeInsurance: 65, dentalInsurance: 53,
        budgetHousing: 2000, budgetFood: 500, budgetTransportation: 500, budgetHealthcare: 250,
        budgetEntertainment: 500, budgetOther: 491, inflationRate: 2.6, taxBracket: 22, federalWithheld: 683, expenses: []
      }
    },
    justRetiredFed: {
      label: '🎉 Just Retired Fed',
      description: 'Age 62 • SRS→SS transition year • Peak complexity',
      icon: '🎉',
      color: '#CC99CC',
      category: 'federal',
      data: {
        dob: `09/01/${new Date().getFullYear() - 62}`, isMonthly: true,
        fersAmount: 5200, srsAmount: 1100, ssAmount: 2400, ssStartAge: 67,
        fersCola: 2.6, srsCola: 2.6, ssCola: 2.6, projectionYears: 30,
        tspBalance: 750000, tspGrowthRate: 5.5, tspWithdrawalType: 'amount',
        tspWithdrawalAmount: 2800, tspWithdrawalPercent: 4.0, tspWithdrawalCola: 2.6, tspCoverTaxes: true,
        healthInsurance: 520, lifeInsurance: 60, dentalInsurance: 50,
        budgetHousing: 1800, budgetFood: 550, budgetTransportation: 450, budgetHealthcare: 350,
        budgetEntertainment: 400, budgetOther: 350, inflationRate: 2.6, taxBracket: 22, federalWithheld: 580, expenses: []
      }
    },
    // General Demographics
    young25: {
      label: '🚀 Average Age 25',
      description: 'Single • Entry level • Just starting out',
      icon: '🚀',
      color: '#28a745',
      category: 'general',
      data: {
        dob: `03/20/${new Date().getFullYear() - 25}`, isMonthly: true,
        fersAmount: 800, srsAmount: 300, ssAmount: 1100, ssStartAge: 67,
        fersCola: 2.6, srsCola: 2.6, ssCola: 2.6, projectionYears: 45,
        tspBalance: 15000, tspGrowthRate: 7.5, tspWithdrawalType: 'percent',
        tspWithdrawalAmount: 1000, tspWithdrawalPercent: 4.0, tspWithdrawalCola: 2.6, tspCoverTaxes: false,
        healthInsurance: 180, lifeInsurance: 20, dentalInsurance: 18,
        budgetHousing: 1200, budgetFood: 350, budgetTransportation: 300, budgetHealthcare: 80,
        budgetEntertainment: 250, budgetOther: 200, inflationRate: 2.6, taxBracket: 12, federalWithheld: 100, expenses: []
      }
    },
    married40: {
      label: '🏠 Average Age 40',
      description: 'Married • 2 kids • Mid-career homeowner',
      icon: '🏠',
      color: '#007bff',
      category: 'general',
      data: {
        dob: `07/04/${new Date().getFullYear() - 40}`, isMonthly: true,
        fersAmount: 3200, srsAmount: 850, ssAmount: 1900, ssStartAge: 67,
        fersCola: 2.6, srsCola: 2.6, ssCola: 2.6, projectionYears: 40,
        tspBalance: 180000, tspGrowthRate: 6.5, tspWithdrawalType: 'amount',
        tspWithdrawalAmount: 2000, tspWithdrawalPercent: 4.0, tspWithdrawalCola: 2.6, tspCoverTaxes: true,
        healthInsurance: 420, lifeInsurance: 50, dentalInsurance: 40,
        budgetHousing: 2400, budgetFood: 800, budgetTransportation: 700, budgetHealthcare: 200,
        budgetEntertainment: 400, budgetOther: 500, inflationRate: 2.6, taxBracket: 22, federalWithheld: 350, expenses: []
      }
    },
    emptyNest55: {
      label: '🌅 Average Age 55',
      description: 'Married • Empty nest • Nearing retirement',
      icon: '🌅',
      color: '#fd7e14',
      category: 'general',
      data: {
        dob: `11/11/${new Date().getFullYear() - 55}`, isMonthly: true,
        fersAmount: 5000, srsAmount: 1200, ssAmount: 2600, ssStartAge: 67,
        fersCola: 2.6, srsCola: 2.6, ssCola: 2.6, projectionYears: 35,
        tspBalance: 650000, tspGrowthRate: 6.0, tspWithdrawalType: 'amount',
        tspWithdrawalAmount: 2500, tspWithdrawalPercent: 4.0, tspWithdrawalCola: 2.6, tspCoverTaxes: true,
        healthInsurance: 500, lifeInsurance: 60, dentalInsurance: 48,
        budgetHousing: 1900, budgetFood: 600, budgetTransportation: 500, budgetHealthcare: 300,
        budgetEntertainment: 450, budgetOther: 380, inflationRate: 2.6, taxBracket: 22, federalWithheld: 550, expenses: []
      }
    }
  };

  const loadScenario = (key) => {
    const scenario = starterScenarios[key];
    if (!scenario) return;
    const d = scenario.data;
    setDob(d.dob); setIsMonthly(d.isMonthly);
    setFersAmount(d.fersAmount); setSrsAmount(d.srsAmount); setSsAmount(d.ssAmount);
    setSsStartAge(d.ssStartAge); setFersCola(d.fersCola); setSrsCola(d.srsCola); setSsCola(d.ssCola);
    setProjectionYears(d.projectionYears); setTspBalance(d.tspBalance); setTspGrowthRate(d.tspGrowthRate);
    setTspWithdrawalType(d.tspWithdrawalType); setTspWithdrawalAmount(d.tspWithdrawalAmount);
    setTspWithdrawalPercent(d.tspWithdrawalPercent); setTspWithdrawalCola(d.tspWithdrawalCola);
    setTspCoverTaxes(d.tspCoverTaxes); setHealthInsurance(d.healthInsurance);
    setLifeInsurance(d.lifeInsurance); setDentalInsurance(d.dentalInsurance);
    setBudgetHousing(d.budgetHousing); setBudgetFood(d.budgetFood);
    setBudgetTransportation(d.budgetTransportation); setBudgetHealthcare(d.budgetHealthcare);
    setBudgetEntertainment(d.budgetEntertainment); setBudgetOther(d.budgetOther);
    setInflationRate(d.inflationRate); setTaxBracket(d.taxBracket);
    setFederalWithheld(d.federalWithheld); setExpenses(d.expenses);
    setShowScenarioPicker(false);
    setMonteCarloResults(null);
    setHasCalculated(false);
  };

  // ─── MONTE CARLO ENGINE ───────────────────────────────────────────────────
  // Historical annual std devs by risk profile (based on S&P/bond blend data)
  const riskProfiles = {
    conservative: { label: 'Conservative (Bond-heavy)', stdDev: 8.0, color: '#5bc0de' },
    moderate:     { label: 'Moderate (60/40 blend)',    stdDev: 13.0, color: '#FF9933' },
    aggressive:   { label: 'Aggressive (Stock-heavy)',  stdDev: 18.0, color: '#dc3545' }
  };

  // Box-Muller transform for normally distributed random numbers
  const gaussianRandom = (mean, stdDev) => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  const runMonteCarlo = () => {
    setMonteCarloRunning(true);
    setTimeout(() => {
      const NUM_SIMS = 5000;
      const stdDev = mcStdDevOverride !== null ? mcStdDevOverride : riskProfiles[mcRiskProfile].stdDev;

      // Parse DOB - only need birth year for Monte Carlo
      let birthYear;
      if (dob.includes('-')) {
        const parts = dob.split('-');
        birthYear = parseInt(parts[0]);
      } else {
        const parts = dob.split('/');
        birthYear = parseInt(parts[2]);
      }
      const currentYear = new Date().getFullYear();
      const startAge = currentYear - birthYear;

      // Run each simulation
      const allRuns = [];
      let survivedCount = { toLifeExp: 0, toLifeExpPlus5: 0, toLifeExpPlus10: 0, toAge100: 0 };
      const lifeExpAge = person1LifeExpectancy;

      const otherAccountsTotal = otherAccounts.reduce((sum, acc) => sum + acc.balance, 0);
      const totalStartingBalance = tspBalance + otherAccountsTotal;

      for (let sim = 0; sim < NUM_SIMS; sim++) {
        let balance = totalStartingBalance;
        let withdrawal = tspWithdrawalAmount * (isMonthly ? 12 : 1);
        const runBalances = [];
        let ranOutAt = null;

        for (let i = 0; i < projectionYears; i++) {
          const age = startAge + i;
          // Random return for this year using log-normal distribution
          const annualReturn = gaussianRandom(tspGrowthRate / 100, stdDev / 100);
          
          if (balance > 0) {
            let wd = 0;
            if (tspScheduleEnabled) {
              let phasePct = tspPhase1Amount; // now a % rate
              if (age >= tspPhase3Age) phasePct = tspPhase3Amount;
              else if (age >= tspPhase2Age) phasePct = tspPhase2Amount;
              wd = Math.min(balance * (phasePct / 100), balance);
            } else if (tspWithdrawalType === 'amount') {
              let base = withdrawal;
              if (tspCoverTaxes) base = base / (1 - taxBracket / 100);
              wd = Math.min(base, balance);
            } else {
              wd = Math.min(balance * (tspWithdrawalPercent / 100), balance);
            }
            // RMD override
            const rmd = calculateRMD(balance, age);
            if (rmd > wd) wd = Math.min(rmd, balance);

            balance = balance * (1 + annualReturn) - wd;
            balance = Math.max(0, balance);
            if (!tspScheduleEnabled && tspWithdrawalType === 'amount' && rmd <= wd) withdrawal *= (1 + tspWithdrawalCola / 100);
            if (balance === 0 && ranOutAt === null) ranOutAt = age;
          }
          runBalances.push(Math.round(balance));
        }

        allRuns.push({ balances: runBalances, ranOutAt });

        // Count survivals
        const balAtLifeExp = runBalances[Math.min(lifeExpAge - startAge, projectionYears - 1)] ?? 0;
        const balAtLifeExpPlus5 = runBalances[Math.min(lifeExpAge - startAge + 5, projectionYears - 1)] ?? 0;
        const balAtLifeExpPlus10 = runBalances[Math.min(lifeExpAge - startAge + 10, projectionYears - 1)] ?? 0;
        const balAt100 = runBalances[Math.min(100 - startAge, projectionYears - 1)] ?? 0;
        if (balAtLifeExp > 0) survivedCount.toLifeExp++;
        if (balAtLifeExpPlus5 > 0) survivedCount.toLifeExpPlus5++;
        if (balAtLifeExpPlus10 > 0) survivedCount.toLifeExpPlus10++;
        if (balAt100 > 0) survivedCount.toAge100++;
      }

      // Build percentile bands for each year
      const chartData = [];
      for (let i = 0; i < projectionYears; i++) {
        const yearBalances = allRuns.map(r => r.balances[i]).sort((a, b) => a - b);
        const pct = (p) => yearBalances[Math.floor(p / 100 * NUM_SIMS)] ?? 0;
        chartData.push({
          year: currentYear + i,
          age: startAge + i,
          pct10: pct(10),
          pct25: pct(25),
          pct50: pct(50),
          pct75: pct(75),
          pct90: pct(90),
          median: pct(50),
          // Recharts area bands need [low, high] style — store as range pairs
          band_outer: [pct(10), pct(90)],
          band_inner: [pct(25), pct(75)],
        });
      }

      // Key age summary table
      const keyAges = [
        lifeExpAge - 5,
        lifeExpAge,
        lifeExpAge + 5,
        lifeExpAge + 10
      ].filter(a => a > startAge && a <= startAge + projectionYears - 1);

      const keyAgeSummary = keyAges.map(age => {
        const idx = age - startAge;
        const yearBalances = allRuns.map(r => r.balances[idx] ?? 0).sort((a, b) => a - b);
        const pct = (p) => yearBalances[Math.floor(p / 100 * NUM_SIMS)] ?? 0;
        const surviveCount = yearBalances.filter(b => b > 0).length;
        return {
          age,
          year: currentYear + idx,
          pct10: pct(10), pct25: pct(25), pct50: pct(50), pct75: pct(75), pct90: pct(90),
          survivalRate: Math.round(surviveCount / NUM_SIMS * 100)
        };
      });

      // Overall probability score (to life expectancy)
      const probabilityScore = Math.round(survivedCount.toLifeExp / NUM_SIMS * 100);
      const probabilityPlus5 = Math.round(survivedCount.toLifeExpPlus5 / NUM_SIMS * 100);
      const probabilityPlus10 = Math.round(survivedCount.toLifeExpPlus10 / NUM_SIMS * 100);
      const probabilityTo100 = Math.round(survivedCount.toAge100 / NUM_SIMS * 100);

      // Median depletion age
      const ranOutAges = allRuns.map(r => r.ranOutAt).filter(a => a !== null);
      const medianDepletionAge = ranOutAges.length > 0
        ? ranOutAges.sort((a, b) => a - b)[Math.floor(ranOutAges.length / 2)]
        : null;

      setMonteCarloResults({
        chartData,
        keyAgeSummary,
        probabilityScore,
        probabilityPlus5,
        probabilityPlus10,
        probabilityTo100,
        medianDepletionAge,
        numSims: NUM_SIMS,
        stdDev,
        riskProfile: mcRiskProfile,
        lifeExpAge,
        ranOutCount: ranOutAges.length
      });

      setMonteCarloRunning(false);
      setViewMode('monte');
    }, 50);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#28a745';
    if (score >= 70) return '#FF9933';
    return '#dc3545';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'STRONG';
    if (score >= 70) return 'MODERATE';
    if (score >= 60) return 'CAUTION';
    return 'AT RISK';
  };

  // ─── END MONTE CARLO ENGINE ───────────────────────────────────────────────

  const projections = hasCalculated ? calculateProjections() : [];

  // ── WILL I BE OKAY — Survivor Scenario Calculator ─────────────────────────
  const calculateSurvivorScenario = (yearsFromNow) => {
    if (!hasCalculated || projections.length === 0) return null;

    // Parse DOB to get current age
    let birthYear;
    const dobStr = dob;
    if (dobStr.includes('-')) {
      const parts = dobStr.split('-');
      birthYear = parseInt(parts[0]);
    } else {
      const parts = dobStr.split('/');
      birthYear = parseInt(parts[2]);
    }
    const currentYear = new Date().getFullYear();
    const startAge = currentYear - birthYear;
    const deathYear = currentYear + yearsFromNow;
    const deathAge = startAge + yearsFromNow;

    // Find projection row at death year and 10 years after
    const atDeath = projections.find(p => p.year === deathYear) || projections[yearsFromNow] || projections[projections.length - 1];
    const survivorRows = projections.filter(p => p.year > deathYear);
    const nearTerm = survivorRows[0]; // first year after death

    if (!nearTerm) return null;

    // Survivor income components
    // FERS: survivor gets fersSurvivorRate% of Person 1's pension
    const survivorFers = nearTerm.fersGross * (fersSurvivorRate / 100);
    
    // SS: survivor gets the higher of their own SS or Person 1's SS (simplified: max of the two)
    const person1SsAtDeath = nearTerm.ss; // already in projection
    const person2SsAnnual = person2SsAmount * (isMonthly ? 12 : 1);
    const survivorSs = Math.max(person1SsAtDeath, person2SsAnnual);

    // TSP + other investments at death
    const tspAtDeath = atDeath.tspBalance;
    const otherAtDeath = (atDeath.otherAccountsBalances || []).reduce((s, b) => s + b, 0);
    const totalInvestmentsAtDeath = tspAtDeath + otherAtDeath;

    // Rental at death
    const rentalAtDeath = atDeath.rentalNet || 0;

    // Survivor annual income (base, without investment draws)
    const survivorBaseIncome = survivorFers + survivorSs + rentalAtDeath;

    // Recalculate TSP withdrawal using correct phase % applied to balance at death
    let activePhasePct = tspPhase1Amount;
    const ageAtDeath = deathAge;
    if (ageAtDeath >= tspPhase3Age) activePhasePct = tspPhase3Amount;
    else if (ageAtDeath >= tspPhase2Age) activePhasePct = tspPhase2Amount;
    const survivorTspWithdrawal = tspScheduleEnabled
      ? tspAtDeath * (activePhasePct / 100)
      : (tspWithdrawalType === 'percent'
          ? tspAtDeath * (tspWithdrawalPercent / 100)
          : nearTerm.tspWithdrawal);
    const survivorOtherIncome = nearTerm.otherAccountsIncome || 0;

    const survivorTotalIncome = survivorBaseIncome + survivorTspWithdrawal + survivorOtherIncome;

    // Expenses at that point (from projection)
    const projectedExpenses = nearTerm.expenses + nearTerm.budget;

    // Coverage ratio
    const coverageRatio = projectedExpenses > 0 ? survivorTotalIncome / projectedExpenses : 1;
    const monthlyNet = Math.round((survivorTotalIncome - projectedExpenses) / 12);

    // Score
    let verdict, verdictColor, verdictBg;
    if (coverageRatio >= 1.1) {
      verdict = "✅ You're Covered";
      verdictColor = '#28a745';
      verdictBg = 'rgba(40,167,69,0.15)';
    } else if (coverageRatio >= 0.85) {
      verdict = '⚠️ Watch This';
      verdictColor = '#ffc107';
      verdictBg = 'rgba(255,193,7,0.15)';
    } else {
      verdict = '🚨 Needs Attention';
      verdictColor = '#dc3545';
      verdictBg = 'rgba(220,53,69,0.15)';
    }

    // Key concern
    let concern = null;
    if (tspAtDeath < 200000) concern = 'TSP balance is low at this point';
    else if (coverageRatio < 1) concern = 'Income may not cover expenses';
    else if (survivorSs < person1SsAtDeath * 0.5) concern = 'Significant SS reduction';
    else concern = 'Portfolio looks sustainable';

    return {
      yearsFromNow,
      deathAge,
      deathYear,
      survivorFers: Math.round(survivorFers),
      survivorSs: Math.round(survivorSs),
      survivorTspWithdrawal: Math.round(survivorTspWithdrawal),
      survivorOtherIncome: Math.round(survivorOtherIncome),
      rentalAtDeath: Math.round(rentalAtDeath),
      survivorTotalIncome: Math.round(survivorTotalIncome),
      projectedExpenses: Math.round(projectedExpenses),
      tspAtDeath: Math.round(tspAtDeath),
      otherAtDeath: Math.round(otherAtDeath),
      totalInvestmentsAtDeath: Math.round(totalInvestmentsAtDeath),
      monthlyNet,
      coverageRatio: Math.round(coverageRatio * 100),
      verdict,
      verdictColor,
      verdictBg,
      concern
    };
  };

  // ── ASSESSMENT WIZARD ────────────────────────────────────────────────────

  // ── WIZARD QUESTION BANK ─────────────────────────────────────────────────
  // Questions are conditional — shown only when relevant to the user's path.
  // Path is determined by: alreadyRetired (yes/no) asked at question 2.
  //
  //  SHARED (everyone):
  //    currentAge → alreadyRetired
  //
  //  RETIRED PATH (alreadyRetired = yes):
  //    monthlyPensionActual → tspBalance → currentTspWithdrawal → ssActual
  //    → otherIncome → monthlyExpenses → hasSpouse → spouseAge → topConcernRetired
  //
  //  PLANNING PATH (alreadyRetired = no):
  //    retireAge → yearsService → high3 → ssEstimate
  //    → tspBalance → otherSavings → monthlyExpenses → hasSpouse → spouseAge → topConcern

  const WIZARD_QUESTIONS = [
    // ── SHARED: asked of everyone ──────────────────────────────────────────
    {
      id: 'currentAge',
      label: "How old are you today?",
      type: 'number', placeholder: 'e.g. 62', min: 18, max: 85,
    },
    {
      id: 'alreadyRetired',
      label: "Are you already retired?",
      type: 'yesno',
    },

    // ── RETIRED PATH ───────────────────────────────────────────────────────
    {
      id: 'monthlyPensionActual',
      label: "What is your monthly pension (gross, from OPM)?",
      type: 'currency', placeholder: 'e.g. 4800',
      conditional: a => a.alreadyRetired === 'yes',
    },
    {
      id: 'tspBalance',
      label: "What is your current TSP or retirement account balance?",
      type: 'currency', placeholder: 'e.g. 650000',
      conditional: a => a.alreadyRetired === 'yes',
    },
    {
      id: 'currentTspWithdrawal',
      label: "What % of your TSP do you withdraw annually? (4% is the classic rule — enter 4 for 4%)",
      type: 'number', placeholder: 'e.g. 4', min: 0, max: 20,
      conditional: a => a.alreadyRetired === 'yes',
    },
    {
      id: 'ssActual',
      label: "Are you receiving Social Security? If so, how much per month? (Enter $0 if not yet)",
      type: 'currency', placeholder: 'e.g. 2200',
      conditional: a => a.alreadyRetired === 'yes',
    },
    {
      id: 'otherIncome',
      label: "Any other monthly income? (rental, part-time work, spouse income, etc.)",
      type: 'currency', placeholder: 'Enter $0 if none',
      conditional: a => a.alreadyRetired === 'yes',
    },
    {
      id: 'monthlyExpenses',
      label: "What are your actual monthly expenses?",
      type: 'currency', placeholder: 'e.g. 5500',
      conditional: a => a.alreadyRetired === 'yes',
    },
    {
      id: 'hasSpouse',
      label: "Do you have a spouse or partner to plan for?",
      type: 'yesno',
      conditional: a => a.alreadyRetired === 'yes',
    },
    {
      id: 'spouseAge',
      label: "How old is your spouse/partner?",
      type: 'number', placeholder: 'e.g. 58', min: 18, max: 85,
      conditional: a => a.alreadyRetired === 'yes' && a.hasSpouse === 'yes',
    },
    {
      id: 'topConcernRetired',
      label: "What's your biggest financial concern right now?",
      type: 'choice',
      choices: ['Running out of money', 'Healthcare costs', 'Market volatility', 'Survivor planning', 'Managing RMDs'],
      conditional: a => a.alreadyRetired === 'yes',
    },

    // ── PLANNING PATH ──────────────────────────────────────────────────────
    {
      id: 'retireAge',
      label: "What age do you plan to retire?",
      type: 'number', placeholder: 'e.g. 62', min: 50, max: 72,
      conditional: a => a.alreadyRetired === 'no',
    },
    {
      id: 'yearsService',
      label: "How many years of federal service will you have at retirement?",
      type: 'number', placeholder: 'e.g. 28', min: 0, max: 42,
      conditional: a => a.alreadyRetired === 'no',
    },
    {
      id: 'high3',
      label: "What is your estimated High-3 average salary?",
      type: 'currency', placeholder: 'e.g. 110000',
      conditional: a => a.alreadyRetired === 'no',
    },
    {
      id: 'ssEstimate',
      label: "What is your estimated monthly Social Security benefit at full retirement age?",
      type: 'currency', placeholder: 'e.g. 2200',
      conditional: a => a.alreadyRetired === 'no',
    },
    {
      id: 'tspBalancePlanning',
      label: "What is your current TSP balance?",
      type: 'currency', placeholder: 'e.g. 450000',
      conditional: a => a.alreadyRetired === 'no',
    },
    {
      id: 'otherSavings',
      label: "Any other retirement savings? (IRA, Roth IRA, brokerage — combined total)",
      type: 'currency', placeholder: 'Enter $0 if none',
      conditional: a => a.alreadyRetired === 'no',
    },
    {
      id: 'hasRental',
      label: "Do you have a rental property that generates income or costs?",
      type: 'yesno',
      conditional: a => a.alreadyRetired === 'no' || a.alreadyRetired === 'yes',
    },
    {
      id: 'rentalMonthlyNetWizard',
      label: "Roughly what is your rental's monthly net? (income minus all costs — use negative for a loss)",
      type: 'number', placeholder: 'e.g. -500 or 300',
      conditional: a => a.hasRental === 'yes',
    },
    {
      id: 'monthlyExpensesPlanning',
      label: "What do you estimate your monthly expenses will be in retirement?",
      type: 'currency', placeholder: 'e.g. 5500',
      conditional: a => a.alreadyRetired === 'no',
    },
    {
      id: 'hasSpousePlanning',
      label: "Do you have a spouse or partner to plan for?",
      type: 'yesno',
      conditional: a => a.alreadyRetired === 'no',
    },
    {
      id: 'spouseAgePlanning',
      label: "How old is your spouse/partner?",
      type: 'number', placeholder: 'e.g. 51', min: 18, max: 85,
      conditional: a => a.alreadyRetired === 'no' && a.hasSpousePlanning === 'yes',
    },
    {
      id: 'topConcern',
      label: "What's your biggest retirement concern?",
      type: 'choice',
      choices: ['Running out of money', 'Healthcare costs', 'Market volatility', 'Survivor planning', 'Timing my retirement right'],
      conditional: a => a.alreadyRetired === 'no',
    },
  ];

  const getVisibleQuestions = (answers) => WIZARD_QUESTIONS.filter(q => !q.conditional || q.conditional(answers));

  const runWizardAssessment = (answers) => {
    const isRetired = answers.alreadyRetired === 'yes';
    const age = parseInt(answers.currentAge) || 60;

    // Pull answers from the correct path
    const monthlyPension = isRetired
      ? (parseFloat(answers.monthlyPensionActual) || 0)
      : (() => {
          const yos = parseInt(answers.yearsService) || 25;
          const high3 = parseFloat(answers.high3) || 90000;
          const ra = parseInt(answers.retireAge) || 62;
          const mult = (ra >= 62 && yos >= 20) ? 0.011 : 0.01;
          return (high3 * mult * yos) / 12;
        })();

    const tsp = isRetired
      ? (parseFloat(answers.tspBalance) || 0)
      : (parseFloat(answers.tspBalancePlanning) || 0);

    const currentTspWithdrawal = isRetired ? (parseFloat(answers.currentTspWithdrawal) || 0) : 0;
    const ssMonthly = isRetired ? (parseFloat(answers.ssActual) || 0) : (parseFloat(answers.ssEstimate) || 0);
    const otherMonthly = parseFloat(answers.otherIncome) || 0;
    const expenses = isRetired
      ? (parseFloat(answers.monthlyExpenses) || 4000)
      : (parseFloat(answers.monthlyExpensesPlanning) || 4000);
    const hasSpouse = isRetired ? (answers.hasSpouse === 'yes') : (answers.hasSpousePlanning === 'yes');
    const otherSavings = parseFloat(answers.otherSavings) || 0;
    const totalSavings = tsp + otherSavings;
    const retireAge = parseInt(answers.retireAge) || age;
    const yos = parseInt(answers.yearsService) || 0;
    const high3 = parseFloat(answers.high3) || 0;
    const yearsToRetire = Math.max(0, retireAge - age);

    // Life stage
    let stage, stageLabel, stageColor;
    if (isRetired && age >= 68) {
      stage = 'inretirement'; stageLabel = 'In Retirement'; stageColor = '#CC99CC';
    } else if (isRetired) {
      stage = 'atretirement'; stageLabel = 'At Retirement'; stageColor = '#5cb85c';
    } else if (age < 57 && yearsToRetire > 5) {
      stage = 'accumulation'; stageLabel = 'Accumulation'; stageColor = '#5bc0de';
    } else {
      stage = 'preretirement'; stageLabel = 'Pre-Retirement'; stageColor = '#FF9933';
    }

    // Benchmarks
    const tspBenchmarks = { accumulation: 280000, preretirement: 480000, atretirement: 550000, inretirement: 520000 };
    const tspBenchmark = tspBenchmarks[stage];
    const tspPct = tspBenchmark > 0 ? Math.round((tsp / tspBenchmark) * 100) : 0;

    // Income
    const totalMonthlyIncome = monthlyPension + ssMonthly + otherMonthly;
    const tspContribution = isRetired ? currentTspWithdrawal : (totalSavings * 0.04 / 12);
    const totalWithTSP = totalMonthlyIncome + tspContribution;
    const preRetirementMonthly = high3 > 0 ? high3 / 12 : Math.max(totalWithTSP, 1);
    const replacementRate = Math.round((totalWithTSP / preRetirementMonthly) * 100);
    const coverageRatio = expenses > 0 ? totalWithTSP / expenses : 0;
    const savingsNeeded = Math.max(0, expenses - totalMonthlyIncome) * 12;
    const yearsRunway = (savingsNeeded > 0 && totalSavings > 0) ? Math.round(totalSavings / savingsNeeded) : 99;

    // Scores
    const scores = {
      pension: Math.min(100, Math.round((monthlyPension / Math.max(expenses * 0.4, 1)) * 100)),
      tsp: Math.min(100, tspPct),
      replacement: Math.min(100, isRetired ? Math.round(coverageRatio * 100) : replacementRate),
      coverage: Math.min(100, Math.round(coverageRatio * 100)),
      runway: Math.min(100, Math.round((Math.min(yearsRunway, 30) / 30) * 100)),
    };
    const overallScore = Math.round(Object.values(scores).reduce((a,b) => a+b, 0) / Object.values(scores).length);

    // Recommendations
    const recommendations = [];
    const topConcern = answers.topConcernRetired || answers.topConcern;

    if (isRetired) {
      if (coverageRatio < 1.0) recommendations.push({ priority: 'HIGH', section: 'TSP & Withdrawals', icon: '⚠️', text: `Your income covers ~${Math.round(coverageRatio * 100)}% of expenses. Verify your $${currentTspWithdrawal.toLocaleString()}/mo TSP withdrawal is sustainable long-term.` });
      if (age >= 70 && age < 73) recommendations.push({ priority: 'HIGH', section: 'TSP & Withdrawals', icon: '📋', text: 'RMDs begin at 73. Plan your withdrawal strategy around that now — missing RMDs triggers a 25% IRS penalty.' });
      if (age >= 73) recommendations.push({ priority: 'HIGH', section: 'TSP & Withdrawals', icon: '📋', text: 'You are in RMD territory. Use Bearing to verify your required minimum distributions each year.' });
      if (ssMonthly === 0) recommendations.push({ priority: 'HIGH', section: 'Social Security', icon: '⏳', text: 'You have not started Social Security yet. Waiting to age 70 can mean 76% more per month than starting at 62.' });
      if (hasSpouse) recommendations.push({ priority: 'MED', section: 'About You', icon: '👫', text: 'Configure Person 2 to model survivor income — what does your household look like if one of you passes first?' });
      recommendations.push({ priority: 'MED', section: 'TSP & Withdrawals', icon: '📊', text: 'Run the Monte Carlo simulation to see your probability of not outliving your savings across 5,000 market scenarios.' });
    } else {
      if (stage === 'accumulation') {
        if (tsp < tspBenchmark * 0.8) recommendations.push({ priority: 'HIGH', section: 'TSP & Withdrawals', icon: '📈', text: 'Your TSP is below average for your age. Max contributions are $23,000/year + $7,500 catch-up if you are 50+.' });
        if (yos < 20) recommendations.push({ priority: 'MED', section: 'FERS Pension', icon: '🏛️', text: `You have ${yos} years of service. Reaching 20 unlocks the 1.1% multiplier at 62 — worth modeling the difference.` });
        recommendations.push({ priority: 'MED', section: 'About You', icon: '📅', text: `You have ~${yearsToRetire} years to retirement. Use Bearing to model what working 1-2 extra years would mean.` });
      }
      if (stage === 'preretirement') {
        if (retireAge < 62) recommendations.push({ priority: 'HIGH', section: 'FERS Pension', icon: '🌉', text: 'Retiring before 62 means the SRS bridge applies. Configure it in Bearing — it can add $1,000+/mo until age 62.' });
        if (ssMonthly > 0) recommendations.push({ priority: 'HIGH', section: 'Social Security', icon: '⏱️', text: 'You are in the SS timing window. Waiting from 62 to 67 increases your benefit ~40%. Breakeven is typically age 78-80.' });
        if (hasSpouse) recommendations.push({ priority: 'HIGH', section: 'FERS Pension', icon: '👫', text: 'The survivor benefit election at retirement is one of the most consequential decisions you will make. Model both 25% and 50% options.' });
      }
    }

    const concernMap = {
      'Running out of money': { section: 'TSP & Withdrawals', text: 'Run the Monte Carlo simulation — 5,000 scenarios, instant probability score.' },
      'Healthcare costs': { section: 'Budget', text: 'Add a dedicated healthcare line to your budget. Federal retirees average $6,000+/year out of pocket.' },
      'Market volatility': { section: 'TSP & Withdrawals', text: 'The phased withdrawal schedule lets you plan for reduced withdrawals in down years.' },
      'Survivor planning': { section: 'About You', text: 'Use the "Will I Be Okay?" button after calculating to see survivor income scenarios across 4 timeframes.' },
      'Timing my retirement right': { section: 'FERS Pension', text: 'Model 62 vs. 63 — the 1.1% multiplier plus one extra year can mean $200+/mo more for life.' },
      'Managing RMDs': { section: 'TSP & Withdrawals', text: 'The RMD schedule in Bearing shows your required distributions by year and flags when RMDs override your planned withdrawal.' },
    };
    if (topConcern && concernMap[topConcern]) {
      recommendations.push({ priority: 'HIGH', section: concernMap[topConcern].section, icon: '🎯', text: `Based on your top concern: ${concernMap[topConcern].text}` });
    }

    return {
      isRetired, stage, stageLabel, stageColor,
      age, retireAge, yos, high3, tsp, totalSavings,
      monthlyPension, ssMonthly, otherMonthly, currentTspWithdrawal,
      totalMonthlyIncome, totalWithTSP,
      expenses, replacementRate, coverageRatio, yearsRunway,
      tspBenchmark, tspPct, scores, overallScore,
      recommendations: recommendations.slice(0, 5),
      preRetirementMonthly, hasSpouse,
    };
  };

  const applyWizardToApp = (r, answers) => {
    const birthYear = new Date().getFullYear() - r.age;
    const isoDate = `${birthYear}-06-15`;
    setPerson1Dob(isoDate);
    setDob(`06/15/${birthYear}`);
    setAlreadyRetired(r.isRetired);
    setFersAmount(Math.round(r.monthlyPension));
    setSsAmount(r.ssMonthly);
    setTspBalance(r.tsp);

    if (r.isRetired) {
      // Retired path — set % withdrawal rate from wizard, enable phased schedule
      const withdrawalPct = parseFloat(answers.currentTspWithdrawal) || 4.0;
      setTspWithdrawalType('percent');
      setTspWithdrawalPercent(withdrawalPct);
      setTspScheduleEnabled(true);
      setTspPhase1Amount(withdrawalPct);
      setTspPhase2Amount(Math.max(2.5, withdrawalPct - 0.5));
      setTspPhase3Amount(Math.max(2.0, withdrawalPct - 1.0));
      setMonthlyGrossPension(Math.round(r.monthlyPension));
    } else {
      // Planning path — set projection inputs
      setRetirementAge(r.retireAge);
      setYearsOfService(r.yos);
      setHigh3Salary(r.high3);
    }

    // Spouse
    const spouseAge = answers.spouseAge || answers.spouseAgePlanning;
    if (r.hasSpouse && spouseAge) {
      setPerson2Enabled(true);
      const spouseBirthYear = new Date().getFullYear() - parseInt(spouseAge);
      setPerson2Dob(`${spouseBirthYear}-06-15`);
    }

    // Rental property
    if (answers.hasRental === 'yes' && answers.rentalMonthlyNetWizard) {
      setRentalMonthlyNet(Number(answers.rentalMonthlyNetWizard) || 0);
    }

    // Other savings → add as Traditional IRA account
    const otherSav = parseFloat(answers.otherSavings) || 0;
    if (otherSav > 0) {
      setOtherAccounts([{
        id: Date.now(),
        type: 'traditional_ira',
        name: 'Other Savings (IRA/Brokerage)',
        balance: otherSav,
        growthRate: 6.5,
        monthlyWithdrawal: 0,
        startAge: 65,
        cola: 2.0,
        color: '#9966FF'
      }]);
    }

    // Budget — split expenses proportionally
    const totalBudget = r.expenses;
    setBudgetHousing(Math.round(totalBudget * 0.35));
    setBudgetFood(Math.round(totalBudget * 0.12));
    setBudgetTransportation(Math.round(totalBudget * 0.12));
    setBudgetHealthcare(Math.round(totalBudget * 0.08));
    setBudgetEntertainment(Math.round(totalBudget * 0.10));
    setBudgetOther(Math.round(totalBudget * 0.23));
    setHasCalculated(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // ── WIZARD UI ─────────────────────────────────────────────────────────────
  const renderWizard = () => {
    const visibleQs = getVisibleQuestions(wizardAnswers);
    const currentQ = visibleQs[wizardStep];
    const isLastStep = wizardStep === visibleQs.length - 1;
    const progress = Math.round(((wizardStep) / visibleQs.length) * 100);

    if (wizardResults) {
      const r = wizardResults;
      const scoreColor = (s) => s >= 75 ? '#5cb85c' : s >= 50 ? '#FF9933' : '#d9534f';
      const scoreLabel = (s) => s >= 75 ? 'Strong' : s >= 50 ? 'On Track' : 'Needs Attention';
      const priorityColor = (p) => p === 'HIGH' ? '#d9534f' : '#FF9933';
      return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {/* Stage badge */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'inline-block', padding: '6px 20px', background: `${r.stageColor}22`, border: `1px solid ${r.stageColor}66`, borderRadius: '20px', color: r.stageColor, fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                {r.stageLabel} Stage
              </div>
              <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', margin: '0 0 6px 0' }}>Your Retirement Assessment</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>Based on your answers — here's where you stand and what to focus on</p>
            </div>

            {/* Overall score */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: '12px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Overall Readiness Score</div>
              <div style={{ fontSize: '64px', fontWeight: '800', color: scoreColor(r.overallScore), lineHeight: 1, marginBottom: '4px', textShadow: `0 0 30px ${scoreColor(r.overallScore)}66` }}>{r.overallScore}</div>
              <div style={{ fontSize: '16px', color: scoreColor(r.overallScore), fontWeight: '600' }}>{scoreLabel(r.overallScore)}</div>
            </div>

            {/* 5 dimension scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {[
                { key: 'pension', label: 'Pension', icon: '🏛️' },
                { key: 'tsp', label: 'TSP vs Peers', icon: '📈' },
                { key: 'replacement', label: 'Replace Rate', icon: '💱' },
                { key: 'coverage', label: 'Expense Cover', icon: '🛡️' },
                { key: 'runway', label: 'Runway', icon: '✈️' },
              ].map(({ key, label, icon }) => {
                const s = r.scores[key];
                return (
                  <div key={key} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${scoreColor(s)}33`, borderRadius: '8px', padding: '12px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: scoreColor(s) }}>{s}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{label}</div>
                    <div style={{ fontSize: '10px', color: scoreColor(s), fontWeight: '600' }}>{scoreLabel(s)}</div>
                  </div>
                );
              })}
            </div>

            {/* Key numbers */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>Your Numbers at a Glance</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {(r.isRetired ? [
                  { label: 'Monthly Pension (OPM)', value: `$${Math.round(r.monthlyPension).toLocaleString()}/mo`, note: 'Gross, as entered' },
                  { label: 'Social Security', value: r.ssMonthly > 0 ? `$${r.ssMonthly.toLocaleString()}/mo` : 'Not started yet', note: r.ssMonthly > 0 ? 'Currently receiving' : 'Delaying = higher benefit' },
                  { label: 'TSP Balance', value: `$${Math.round(r.tsp).toLocaleString()}`, note: `Drawing $${r.currentTspWithdrawal.toLocaleString()}/mo` },
                  { label: 'Monthly Expenses', value: `$${Math.round(r.expenses).toLocaleString()}/mo`, note: 'Your actual expenses' },
                  { label: 'Expense Coverage', value: `${Math.round(r.coverageRatio * 100)}%`, note: r.coverageRatio >= 1 ? 'Income covers expenses ✓' : 'TSP filling the gap' },
                  { label: 'TSP Runway', value: r.yearsRunway >= 99 ? 'Fully covered' : `~${r.yearsRunway} yrs`, note: 'Before savings depleted' },
                ] : [
                  { label: 'Est. FERS Pension', value: `$${Math.round(r.monthlyPension).toLocaleString()}/mo`, note: `${r.yos} yrs × ${r.retireAge >= 62 ? '1.1' : '1.0'}% × High-3` },
                  { label: 'Social Security', value: r.ssMonthly > 0 ? `$${r.ssMonthly.toLocaleString()}/mo` : 'Not entered', note: 'At full retirement age' },
                  { label: 'Total Monthly Income', value: `$${Math.round(r.totalWithTSP).toLocaleString()}/mo`, note: 'Pension + SS + TSP (4%) + other' },
                  { label: 'Monthly Expenses', value: `$${Math.round(r.expenses).toLocaleString()}/mo`, note: 'Your estimate' },
                  { label: 'Income Replacement', value: `${r.replacementRate}%`, note: 'Target: 80%+' },
                  { label: 'TSP vs Fed Average', value: `${r.tspPct}%`, note: `Avg at your stage: $${(r.tspBenchmark/1000).toFixed(0)}k` },
                ]).map(({ label, value, note }) => (
                  <div key={label} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '3px' }}>{label}</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{value}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,153,51,0.2)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: '#FF9933', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', fontWeight: '700' }}>🎯 Where to Focus</div>
              {r.recommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < r.recommendations.length - 1 ? '12px' : 0, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', borderLeft: `3px solid ${priorityColor(rec.priority)}` }}>
                  <div style={{ fontSize: '20px', flexShrink: 0 }}>{rec.icon}</div>
                  <div>
                    <div style={{ fontSize: '11px', color: priorityColor(rec.priority), fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>
                      {rec.priority === 'HIGH' ? '⚡ High Priority' : '📌 Worth Reviewing'} — {rec.section}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>{rec.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => {
                  applyWizardToApp(r, wizardAnswers);
                  setShowWizard(false);
                  setWizardResults(null);
                  setWizardStep(0);
                  setWizardAnswers({});
                }}
                style={{ padding: '16px', background: 'rgba(255,153,51,0.25)', border: '1px solid rgba(255,153,51,0.5)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
              >
                🚀 Load My Data & Explore
              </button>
              <button
                onClick={() => {
                  setShowWizard(false);
                  setWizardResults(null);
                  setWizardStep(0);
                  setWizardAnswers({});
                }}
                style={{ padding: '16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
              >
                Skip — Enter Data Manually
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!currentQ) return null;
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          {/* Progress bar */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1px' }}>RETIREMENT ASSESSMENT</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{wizardStep + 1} of {visibleQs.length}</span>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #FF9933, #CC99CC)', borderRadius: '2px', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', color: '#FF9933', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '600' }}>Question {wizardStep + 1}</div>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '600', lineHeight: '1.4', margin: 0 }}>{currentQ.label}</h2>
          </div>

          {/* Input */}
          <div style={{ marginBottom: '32px' }}>
            {(currentQ.type === 'number' || currentQ.type === 'currency') && (
              <div style={{ position: 'relative' }}>
                {currentQ.type === 'currency' && <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#FF9933', fontSize: '18px', fontWeight: '600' }}>$</span>}
                <input
                  key={currentQ.id}
                  type="number"
                  placeholder={currentQ.placeholder}
                  value={wizardAnswers[currentQ.id] || ''}
                  onChange={e => setWizardAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter' && wizardAnswers[currentQ.id]) {
                    if (isLastStep) { setWizardResults(runWizardAssessment(wizardAnswers)); }
                    else { setWizardStep(s => s + 1); }
                  }}}
                  autoFocus
                  style={{ width: '100%', boxSizing: 'border-box', padding: currentQ.type === 'currency' ? '18px 16px 18px 36px' : '18px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,153,51,0.4)', borderRadius: '8px', color: '#fff', fontSize: '24px', fontWeight: '600', outline: 'none' }}
                />
              </div>
            )}
            {currentQ.type === 'yesno' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['yes', 'no'].map(v => (
                  <button key={v} onClick={() => {
                    const newAnswers = { ...wizardAnswers, [currentQ.id]: v };
                    setWizardAnswers(newAnswers);
                    const nextVis = getVisibleQuestions(newAnswers);
                    if (wizardStep >= nextVis.length - 1) { setWizardResults(runWizardAssessment(newAnswers)); }
                    else { setWizardStep(s => s + 1); }
                  }} style={{ padding: '18px', background: wizardAnswers[currentQ.id] === v ? 'rgba(255,153,51,0.25)' : 'rgba(255,255,255,0.05)', border: `1px solid ${wizardAnswers[currentQ.id] === v ? 'rgba(255,153,51,0.6)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize' }}>
                    {v === 'yes' ? '✓ Yes' : '✕ No'}
                  </button>
                ))}
              </div>
            )}
            {currentQ.type === 'choice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentQ.choices.map(c => (
                  <button key={c} onClick={() => {
                    const newAnswers = { ...wizardAnswers, [currentQ.id]: c };
                    setWizardAnswers(newAnswers);
                    const nextVis = getVisibleQuestions(newAnswers);
                    if (wizardStep >= nextVis.length - 1) { setWizardResults(runWizardAssessment(newAnswers)); }
                    else { setWizardStep(s => s + 1); }
                  }} style={{ padding: '14px 18px', background: wizardAnswers[currentQ.id] === c ? 'rgba(255,153,51,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${wizardAnswers[currentQ.id] === c ? 'rgba(255,153,51,0.5)' : 'rgba(255,255,255,0.12)'}`, borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {wizardStep > 0 && (
              <button onClick={() => setWizardStep(s => s - 1)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
            )}
            <div style={{ flex: 1 }} />
            {(currentQ.type === 'number' || currentQ.type === 'currency') && (
              <button
                onClick={() => {
                  if (!wizardAnswers[currentQ.id] && wizardAnswers[currentQ.id] !== 0) return;
                  if (isLastStep) { setWizardResults(runWizardAssessment(wizardAnswers)); }
                  else { setWizardStep(s => s + 1); }
                }}
                disabled={!wizardAnswers[currentQ.id] && wizardAnswers[currentQ.id] !== 0}
                style={{ padding: '14px 28px', background: 'rgba(255,153,51,0.25)', border: '1px solid rgba(255,153,51,0.5)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', opacity: (!wizardAnswers[currentQ.id] && wizardAnswers[currentQ.id] !== 0) ? 0.4 : 1 }}
              >
                {isLastStep ? 'See My Assessment →' : 'Next →'}
              </button>
            )}
            <button onClick={() => { setShowWizard(false); setWizardStep(0); setWizardAnswers({}); }} style={{ padding: '12px 16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '12px' }}>Skip</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      minHeight: '100vh',
      filter: darkMode ? 'none' : 'invert(1) hue-rotate(180deg)',
      transition: 'filter 0.3s ease'
    }}>
      {showWizard && renderWizard()}
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 153, 51, 0.3)',
        padding: '20px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <svg width="50" height="50" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(204, 153, 204, 0.6)" strokeWidth="3"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(204, 153, 204, 0.4)" strokeWidth="2"/>
            <polygon points="50,5 55,45 50,50 45,45" fill="#FF9933"/>
            <polygon points="95,50 55,55 50,50 55,45" fill="#FF9933"/>
            <polygon points="50,95 45,55 50,50 55,55" fill="#FF9933"/>
            <polygon points="5,50 45,45 50,50 45,55" fill="#FF9933"/>
            <circle cx="50" cy="50" r="5" fill="#FF9933">
              <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <div>
            <h1 style={{ margin: 0, color: '#FF9933', fontSize: '36px', fontWeight: '700', letterSpacing: '1px', textShadow: '0 0 20px rgba(255, 153, 51, 0.5)' }}>
              BEARING
            </h1>
            <div style={{ color: '#CC99CC', fontSize: '14px', letterSpacing: '2px', marginTop: '2px' }}>
              FINANCIAL NAVIGATION SYSTEM
            </div>
            <div style={{ color: '#999', fontSize: '10px', marginTop: '4px', fontStyle: 'italic' }}>
              v3.7.14 — Per-account withdrawals in income chart, portfolio balance chart
            </div>
          </div>
        </div>
        
        {/* Animated Compass Bearing */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 153, 51, 0.3)',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ position: 'relative', width: '40px', height: '40px' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" style={{ 
              animation: 'spin 20s linear infinite',
              filter: 'drop-shadow(0 0 8px rgba(255, 153, 51, 0.6))'
            }}>
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
              <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255, 153, 51, 0.3)" strokeWidth="1"/>
              <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(204, 153, 204, 0.3)" strokeWidth="1"/>
              <line x1="20" y1="4" x2="20" y2="10" stroke="#FF9933" strokeWidth="2" strokeLinecap="round"/>
              <line x1="20" y1="30" x2="20" y2="36" stroke="rgba(255, 153, 51, 0.5)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="4" y1="20" x2="10" y2="20" stroke="rgba(255, 153, 51, 0.5)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="30" y1="20" x2="36" y2="20" stroke="rgba(255, 153, 51, 0.5)" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="3" fill="#FF9933">
                <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <div>
            <div style={{ 
              fontSize: '11px', 
              color: 'rgba(255, 153, 51, 0.8)', 
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              🧭 BEARING
            </div>
            <div style={{ 
              fontSize: '18px', 
              color: '#66FF66', 
              fontWeight: '700',
              letterSpacing: '1px',
              textShadow: '0 0 10px rgba(102, 255, 102, 0.5)'
            }}>
              045° → STABLE
            </div>
          </div>
        </div>
        {/* Assessment wizard launch button */}
        <button
          onClick={() => { setShowWizard(true); setWizardStep(0); setWizardAnswers({}); setWizardResults(null); }}
          style={{
            padding: '10px 18px',
            background: 'rgba(204,153,204,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(204,153,204,0.4)',
            borderRadius: '8px',
            color: '#CC99CC',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            letterSpacing: '0.5px',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(204,153,204,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(204,153,204,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          📋 Take Assessment
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 94px)' }}>
        {/* Left Panel - Inputs */}
        <div style={{
          width: '380px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          overflowY: 'auto',
          borderRight: '1px solid rgba(255, 153, 51, 0.3)',
          padding: '20px',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)'
        }}>
          
          {/* ABOUT YOU SECTION - Standalone at top */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('aboutYou')}
              style={{
                background: openSections.aboutYou 
                  ? 'rgba(204, 153, 204, 0.25)'
                  : 'rgba(204, 153, 204, 0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(204, 153, 204, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '8px',
                fontSize: '15px',
                boxShadow: '0 4px 15px rgba(204, 153, 204, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                if (!openSections.aboutYou) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(204, 153, 204, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(204, 153, 204, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>👤</span>
                About You
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.aboutYou ? '▲' : '▼'}</span>
            </div>
            {openSections.aboutYou && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid rgba(204, 153, 204, 0.3)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                
                <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(204, 153, 204, 0.1)', borderRadius: '6px', border: '1px solid rgba(204, 153, 204, 0.3)' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: '#CC99CC', fontSize: '14px', fontWeight: '600' }}>Person 1</h4>
                  
                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={person1Dob}
                    onChange={(e) => setPerson1Dob(e.target.value)}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginBottom: '15px'
                    }}
                  />

                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                    Sex
                  </label>
                  <select
                    value={person1Sex}
                    onChange={(e) => setPerson1Sex(e.target.value)}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginBottom: '15px'
                    }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>

                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                    Planned Retirement Age
                  </label>
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginBottom: '15px'
                    }}
                  />

                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                    Life Expectancy
                  </label>
                  <input
                    type="number"
                    value={person1LifeExpectancy}
                    onChange={(e) => setPerson1LifeExpectancy(Number(e.target.value))}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '5px', fontStyle: 'italic' }}>
                    Based on actuarial tables. Adjust if needed.
                  </div>
                </div>

                {/* Add Spouse/Partner Button */}
                {!person2Enabled ? (
                  <button
                    onClick={() => setPerson2Enabled(true)}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '12px',
                      background: 'rgba(204, 153, 204, 0.15)',
                      backdropFilter: 'blur(20px)',
                      color: '#ffffff',
                      border: '1px solid rgba(204, 153, 204, 0.3)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    👥 Add Spouse/Partner
                  </button>
                ) : (
                  <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(204, 153, 204, 0.1)', borderRadius: '6px', border: '1px solid rgba(204, 153, 204, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ margin: '0', color: '#CC99CC', fontSize: '14px', fontWeight: '600' }}>Person 2 (Spouse/Partner)</h4>
                      <button
                        onClick={() => setPerson2Enabled(false)}
                        style={{
                          padding: '4px 12px',
                          background: 'rgba(217, 83, 79, 0.15)',
                          color: '#d9534f',
                          border: '1px solid rgba(217, 83, 79, 0.3)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={person2Dob}
                      onChange={(e) => setPerson2Dob(e.target.value)}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        marginBottom: '15px'
                      }}
                    />

                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Sex
                    </label>
                    <select
                      value={person2Sex}
                      onChange={(e) => setPerson2Sex(e.target.value)}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        marginBottom: '15px'
                      }}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>

                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Life Expectancy
                    </label>
                    <input
                      type="number"
                      value={person2LifeExpectancy}
                      onChange={(e) => setPerson2LifeExpectancy(Number(e.target.value))}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                )}

              </div>
            )}
          </div>

          {/* INCOME & ASSETS GROUP */}
          <div style={{ marginBottom: '12px' }}>
            <div
              onClick={() => toggleGroup('incomeAssets')}
              style={{
                background: openGroups.incomeAssets 
                  ? 'linear-gradient(135deg, rgba(255, 153, 51, 0.15) 0%, rgba(255, 153, 51, 0.08) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 153, 51, 0.3)',
                borderRadius: '8px',
                padding: '14px 18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: openGroups.incomeAssets 
                  ? '0 4px 20px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 2px 8px rgba(0, 0, 0, 0.2)',
                marginBottom: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                  color: '#FF9933', 
                  fontWeight: '700', 
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                  textShadow: openGroups.incomeAssets ? '0 0 10px rgba(255, 153, 51, 0.5)' : 'none'
                }}>
                  📊 INCOME & ASSETS
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: 'rgba(255, 153, 51, 0.7)',
                  fontSize: '11px'
                }}>
                  <span style={{ 
                    background: 'rgba(255, 153, 51, 0.2)', 
                    padding: '2px 8px', 
                    borderRadius: '10px',
                    fontWeight: '600'
                  }}>5</span>
                  <span style={{ fontSize: '12px' }}>{openGroups.incomeAssets ? '▲' : '▼'}</span>
                </div>
              </div>
            </div>

            {openGroups.incomeAssets && (
              <div style={{ 
                marginLeft: '12px',
                paddingLeft: '12px',
                borderLeft: '2px solid rgba(255, 153, 51, 0.2)'
              }}>

          {/* Current Employment Section (was Income Sources) */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('income')}
              style={{
                background: openSections.income 
                  ? 'rgba(255, 153, 51, 0.25)'
                  : 'rgba(255, 153, 51, 0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 153, 51, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '8px',
                fontSize: '15px',
                boxShadow: '0 4px 15px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                if (!openSections.income) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 153, 51, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>💼</span>
                Current Employment
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.income ? '▲' : '▼'}</span>
            </div>
            {openSections.income && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                
                {/* Person 1 */}
                <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '2px solid #FF9933', borderRadius: '4px' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#FF9933', fontSize: '16px', fontWeight: '700' }}>
                    👤 Person 1
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={(() => {
                          const parts = dob.split('/');
                          if (parts.length === 3) {
                            const [month, day, year] = parts;
                            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                          }
                          return '';
                        })()}
                        onChange={(e) => {
                          const [year, month, day] = e.target.value.split('-');
                          setDob(`${month}/${day}/${year}`);
                          const birthYear = parseInt(year);
                          const actuarial = getActuarialLifeExpectancy(birthYear, person1Sex);
                          setPerson1LifeExpectancy(actuarial.average);
                        }}
                        style={{
                          width: '100%',
                          padding: '6px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                        Sex (for actuarial)
                      </label>
                      <select
                        value={person1Sex}
                        onChange={(e) => {
                          setPerson1Sex(e.target.value);
                          if (dob) {
                            const birthYear = parseInt(dob.split('/')[2]);
                            const actuarial = getActuarialLifeExpectancy(birthYear, e.target.value);
                            setPerson1LifeExpectancy(actuarial.average);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '6px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                      Life Expectancy (years)
                    </label>
                    <input
                      type="number"
                      value={person1LifeExpectancy}
                      onChange={(e) => setPerson1LifeExpectancy(Number(e.target.value))}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '6px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px'
                      }}
                    />
                    {dob && (() => {
                      const birthYear = parseInt(dob.split('/')[2]);
                      const actuarial = getActuarialLifeExpectancy(birthYear, person1Sex);
                      return (
                        <div style={{ fontSize: '10px', color: '#999', marginTop: '4px', fontStyle: 'italic' }}>
                          Actuarial: Avg {actuarial.average}, 25%→{actuarial.pct25}, 10%→{actuarial.pct10} years
                        </div>
                      );
                    })()}
                  </div>
                  
                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                    Income Entry Mode
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                    <button
                      onClick={() => setIsMonthly(true)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: isMonthly ? '#FF9933' : '#e0e0e0',
                        color: isMonthly ? '#ffffff' : '#666',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '12px'
                      }}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setIsMonthly(false)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: !isMonthly ? '#FF9933' : '#e0e0e0',
                        color: !isMonthly ? '#ffffff' : '#666',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '12px'
                      }}
                    >
                      Yearly
                    </button>
                  </div>

                  <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                    FERS Pension ({isMonthly ? 'Monthly' : 'Yearly'})
                  </label>
                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <span style={{ position: 'absolute', left: '8px', top: '7px', color: '#999', fontSize: '12px' }}>$</span>
                    <input
                      type="number"
                      value={fersAmount}
                      onChange={(e) => setFersAmount(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '6px 6px 6px 20px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                    SRS ({isMonthly ? 'Monthly' : 'Yearly'})
                  </label>
                  <div style={{ position: 'relative', marginBottom: '4px' }}>
                    <span style={{ position: 'absolute', left: '8px', top: '7px', color: '#999', fontSize: '12px' }}>$</span>
                    <input
                      type="number"
                      value={srsAmount}
                      onChange={(e) => setSrsAmount(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '6px 6px 6px 20px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '10px', color: '#999', marginBottom: '12px', fontStyle: 'italic' }}>
                    Until age 62
                  </div>

                  <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                    Social Security ({isMonthly ? 'Monthly' : 'Yearly'})
                  </label>
                  <div style={{ position: 'relative', marginBottom: '4px' }}>
                    <span style={{ position: 'absolute', left: '8px', top: '7px', color: '#999', fontSize: '12px' }}>$</span>
                    <input
                      type="number"
                      value={ssAmount}
                      onChange={(e) => setSsAmount(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '6px 6px 6px 20px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic', marginBottom: '8px' }}>
                    Full benefit amount (at age 67)
                  </div>
                  
                  <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                    Start Social Security at Age
                  </label>
                  <select
                    value={ssStartAge}
                    onChange={(e) => setSsStartAge(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '6px',
                      background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '13px',
                      marginBottom: '8px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value={62}>62 (Early - Reduced 30%)</option>
                    <option value={65}>65 (Reduced 13%)</option>
                    <option value={67}>67 (Full Benefit)</option>
                    <option value={70}>70 (Maximum +24%)</option>
                  </select>
                  
                  {/* SS Breakeven Calculator */}
                  {ssAmount > 0 && ssStartAge !== 67 && (() => {
                    const breakeven = calculateSSBreakeven(isMonthly ? ssAmount : ssAmount / 12, ssStartAge, 67);
                    if (breakeven) {
                      return (
                        <div style={{ backgroundColor: 'rgba(0, 102, 204, 0.15)', padding: '8px', borderRadius: '4px', fontSize: '11px', color: '#88bbff', marginBottom: '12px' }}>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>💡 Start at {ssStartAge} vs 67:</div>
                          <div>• Age {ssStartAge}: {formatCurrency(breakeven.monthly1)}/mo</div>
                          <div>• Age 67: {formatCurrency(breakeven.monthly2)}/mo</div>
                          <div style={{ marginTop: '4px', fontWeight: '600' }}>
                            Breakeven at age {breakeven.breakevenAge}
                          </div>
                          <div style={{ fontSize: '10px', fontStyle: 'italic', marginTop: '2px' }}>
                            {ssStartAge < 67 
                              ? `If you live past ${Math.round(breakeven.breakevenAge)}, waiting pays more total`
                              : `Starting at 70 pays more if you live past ${Math.round(breakeven.breakevenAge)}`
                            }
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div style={{ borderTop: '1px solid #ddd', paddingTop: '12px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '600' }}>
                      FERS Pension Deductions (Monthly)
                    </h4>
                    
                    <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                      Health Insurance
                    </label>
                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                      <span style={{ position: 'absolute', left: '8px', top: '7px', color: '#999', fontSize: '12px' }}>$</span>
                      <input
                        type="number"
                        value={healthInsurance}
                        onChange={(e) => setHealthInsurance(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '6px 6px 6px 20px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                      Federal Life Insurance
                    </label>
                    <div style={{ position: 'relative', marginBottom: '4px' }}>
                      <span style={{ position: 'absolute', left: '8px', top: '7px', color: '#999', fontSize: '12px' }}>$</span>
                      <input
                        type="number"
                        value={lifeInsurance}
                        onChange={(e) => setLifeInsurance(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '6px 6px 6px 20px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '10px', color: '#999', marginBottom: '12px', fontStyle: 'italic' }}>
                      Stops at age 65
                    </div>

                    <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                      Federal Dental Insurance
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '8px', top: '7px', color: '#999', fontSize: '12px' }}>$</span>
                      <input
                        type="number"
                        value={dentalInsurance}
                        onChange={(e) => setDentalInsurance(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '6px 6px 6px 20px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Add Person 2 Button / Person 2 Section */}
                {!person2Enabled ? (
                  <button
                    onClick={() => setPerson2Enabled(true)}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '12px',
                      backgroundColor: '#5bc0de',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    âž• Add Person 2
                  </button>
                ) : (
                  <div style={{ marginBottom: '0', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '2px solid #CC99CC', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3 style={{ margin: '0', color: '#CC99CC', fontSize: '16px', fontWeight: '700' }}>
                        👤 Person 2
                      </h3>
                      <button
                        onClick={() => setPerson2Enabled(false)}
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#dc3545',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={(() => {
                            if (!person2Dob) return '';
                            const parts = person2Dob.split('/');
                            if (parts.length === 3) {
                              const [month, day, year] = parts;
                              return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                            }
                            return '';
                          })()}
                          onChange={(e) => {
                            const [year, month, day] = e.target.value.split('-');
                            setPerson2Dob(`${month}/${day}/${year}`);
                            const birthYear = parseInt(year);
                            const actuarial = getActuarialLifeExpectancy(birthYear, person2Sex);
                            setPerson2LifeExpectancy(actuarial.average);
                          }}
                          style={{
                            width: '100%',
                            padding: '6px',
                            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '13px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                          Sex (for actuarial)
                        </label>
                        <select
                          value={person2Sex}
                          onChange={(e) => {
                            setPerson2Sex(e.target.value);
                            if (person2Dob) {
                              const birthYear = parseInt(person2Dob.split('/')[2]);
                              const actuarial = getActuarialLifeExpectancy(birthYear, e.target.value);
                              setPerson2LifeExpectancy(actuarial.average);
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '6px',
                            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '13px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                        Life Expectancy (years)
                      </label>
                      <input
                        type="number"
                        value={person2LifeExpectancy}
                        onChange={(e) => setPerson2LifeExpectancy(Number(e.target.value))}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '6px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      />
                      {person2Dob && (() => {
                        const birthYear = parseInt(person2Dob.split('/')[2]);
                        const actuarial = getActuarialLifeExpectancy(birthYear, person2Sex);
                        return (
                          <div style={{ fontSize: '10px', color: '#999', marginTop: '4px', fontStyle: 'italic' }}>
                            Actuarial: Avg {actuarial.average}, 25%→{actuarial.pct25}, 10%→{actuarial.pct10} years
                          </div>
                        );
                      })()}
                    </div>

                    <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                      FERS Pension ({isMonthly ? 'Monthly' : 'Yearly'})
                    </label>
                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                      <span style={{ position: 'absolute', left: '8px', top: '7px', color: '#999', fontSize: '12px' }}>$</span>
                      <input
                        type="number"
                        value={person2FersAmount}
                        onChange={(e) => setPerson2FersAmount(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '6px 6px 6px 20px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                      SRS ({isMonthly ? 'Monthly' : 'Yearly'})
                    </label>
                    <div style={{ position: 'relative', marginBottom: '4px' }}>
                      <span style={{ position: 'absolute', left: '8px', top: '7px', color: '#999', fontSize: '12px' }}>$</span>
                      <input
                        type="number"
                        value={person2SrsAmount}
                        onChange={(e) => setPerson2SrsAmount(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '6px 6px 6px 20px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '10px', color: '#999', marginBottom: '12px', fontStyle: 'italic' }}>
                      Until age 62
                    </div>

                    <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                      Social Security ({isMonthly ? 'Monthly' : 'Yearly'})
                    </label>
                    <div style={{ position: 'relative', marginBottom: '4px' }}>
                      <span style={{ position: 'absolute', left: '8px', top: '7px', color: '#999', fontSize: '12px' }}>$</span>
                      <input
                        type="number"
                        value={person2SsAmount}
                        onChange={(e) => setPerson2SsAmount(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '6px 6px 6px 20px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic', marginBottom: '8px' }}>
                      Full benefit amount (at age 67)
                    </div>
                    
                    <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', fontWeight: '500' }}>
                      Start Social Security at Age
                    </label>
                    <select
                      value={person2SsStartAge}
                      onChange={(e) => setPerson2SsStartAge(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '6px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px',
                        marginBottom: '8px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value={62}>62 (Early - Reduced 30%)</option>
                      <option value={65}>65 (Reduced 13%)</option>
                      <option value={67}>67 (Full Benefit)</option>
                      <option value={70}>70 (Maximum +24%)</option>
                    </select>
                    
                    {/* Person 2 SS Breakeven Calculator */}
                    {person2SsAmount > 0 && person2SsStartAge !== 67 && (() => {
                      const breakeven = calculateSSBreakeven(isMonthly ? person2SsAmount : person2SsAmount / 12, person2SsStartAge, 67);
                      if (breakeven) {
                        return (
                          <div style={{ backgroundColor: 'rgba(0, 102, 204, 0.15)', padding: '8px', borderRadius: '4px', fontSize: '11px', color: '#88bbff' }}>
                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>💡 Start at {person2SsStartAge} vs 67:</div>
                            <div>• Age {person2SsStartAge}: {formatCurrency(breakeven.monthly1)}/mo</div>
                            <div>• Age 67: {formatCurrency(breakeven.monthly2)}/mo</div>
                            <div style={{ marginTop: '4px', fontWeight: '600' }}>
                              Breakeven at age {breakeven.breakevenAge}
                            </div>
                            <div style={{ fontSize: '10px', fontStyle: 'italic', marginTop: '2px' }}>
                              {person2SsStartAge < 67 
                                ? `If they live past ${Math.round(breakeven.breakevenAge)}, waiting pays more total`
                                : `Starting at 70 pays more if they live past ${Math.round(breakeven.breakevenAge)}`
                              }
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
                
                {/* FERS Survivor Benefit Rate */}
                {person2Enabled && (
                  <div style={{ marginTop: '15px', padding: '12px', backgroundColor: 'rgba(255, 193, 7, 0.15)', border: '1px solid rgba(255, 193, 7, 0.5)', borderRadius: '4px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#ffc107', fontSize: '12px', fontWeight: '600' }}>
                      FERS Survivor Benefit (% of pension)
                    </label>
                    <input
                      type="number"
                      value={fersSurvivorRate}
                      onChange={(e) => setFersSurvivorRate(Number(e.target.value))}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '6px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px'
                      }}
                    />
                    <div style={{ fontSize: '10px', color: 'rgba(255, 193, 7, 0.8)', marginTop: '4px', fontStyle: 'italic' }}>
                      Typically 50-55%. Surviving spouse receives this % of the deceased's FERS pension.
                    </div>
                  </div>
                )}
              </div>

            )}
          </div>

          {/* FERS Pension & SRS Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('fersPension')}
              style={{
                background: openSections.fersPension
                  ? 'rgba(255, 153, 51, 0.25)'
                  : 'rgba(255, 153, 51, 0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 153, 51, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '8px',
                fontSize: '15px',
                boxShadow: '0 4px 15px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                if (!openSections.fersPension) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 153, 51, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>💰</span>
                FERS Pension & SRS
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.fersPension ? '▲' : '▼'}</span>
            </div>
            {openSections.fersPension && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', padding: '20px', border: '1px solid rgba(255, 153, 51, 0.3)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                
                {/* Already Retired Toggle */}
                <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255, 153, 51, 0.1)', borderRadius: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={alreadyRetired}
                      onChange={(e) => setAlreadyRetired(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>
                      ✅ Already Retired / Drawing Pension
                    </span>
                  </label>
                </div>

                {alreadyRetired ? (
                  /* IF ALREADY RETIRED - Enter from OPM statement */
                  <div>
                    <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(91, 192, 222, 0.1)', borderRadius: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                      💡 Enter amounts from your monthly OPM statement
                    </div>

                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Monthly Gross Pension
                    </label>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={monthlyGrossPension}
                        onChange={(e) => setMonthlyGrossPension(Number(e.target.value))}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '10px 10px 10px 24px',
                          background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Monthly FEHB (Health Insurance)
                    </label>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={monthlyFEHB}
                        onChange={(e) => setMonthlyFEHB(Number(e.target.value))}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '10px 10px 10px 24px',
                          background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Monthly FEGLI (Life Insurance)
                    </label>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={monthlyFEGLI}
                        onChange={(e) => setMonthlyFEGLI(Number(e.target.value))}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '10px 10px 10px 24px',
                          background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Other Monthly Deductions
                    </label>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={monthlyOtherDeductions}
                        onChange={(e) => setMonthlyOtherDeductions(Number(e.target.value))}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '10px 10px 10px 24px',
                          background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ padding: '12px', background: 'rgba(92, 184, 92, 0.1)', borderRadius: '4px', marginTop: '15px' }}>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '5px' }}>Net Monthly Pension:</div>
                      <div style={{ fontSize: '20px', color: '#5cb85c', fontWeight: '700' }}>
                        ${(monthlyGrossPension - monthlyFEHB - monthlyFEGLI - monthlyOtherDeductions).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* IF NOT RETIRED - Calculate from High-3 */
                  <div>
                    <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(91, 192, 222, 0.1)', borderRadius: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                      💡 We'll calculate your estimated pension from your High-3 salary
                    </div>

                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      High-3 Average Salary
                    </label>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={high3Salary}
                        onChange={(e) => setHigh3Salary(Number(e.target.value))}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '10px 10px 10px 24px',
                          background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Years of Service
                    </label>
                    <input
                      type="number"
                      value={yearsOfService}
                      onChange={(e) => setYearsOfService(Number(e.target.value))}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        marginBottom: '15px'
                      }}
                    />

                    <div style={{ padding: '12px', background: 'rgba(92, 184, 92, 0.1)', borderRadius: '4px' }}>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '5px' }}>Estimated Annual Pension (1% x years x High-3):</div>
                      <div style={{ fontSize: '20px', color: '#5cb85c', fontWeight: '700' }}>
                        ${((high3Salary * yearsOfService * 0.01)).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>
                        ${((high3Salary * yearsOfService * 0.01) / 12).toFixed(0).toLocaleString()}/month
                      </div>
                    </div>
                  </div>
                )}

                {/* SRS Section */}
                <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: '#FF9933', fontSize: '14px', fontWeight: '600' }}>
                    Special Retirement Supplement (SRS)
                  </h4>
                  <div style={{ marginBottom: '10px', padding: '8px', background: 'rgba(91, 192, 222, 0.1)', borderRadius: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                    For those who retire before age 62 under special provisions
                  </div>

                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                    Monthly SRS Amount
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                    <input
                      type="number"
                      value={srsAmount}
                      onChange={(e) => setSrsAmount(Number(e.target.value))}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '10px 10px 10px 24px',
                        background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '5px', fontStyle: 'italic' }}>
                    SRS ends when you turn 62 and claim Social Security
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Social Security Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('socialSecurity')}
              style={{
                background: openSections.socialSecurity
                  ? 'rgba(255, 153, 51, 0.25)'
                  : 'rgba(255, 153, 51, 0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 153, 51, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '8px',
                fontSize: '15px',
                boxShadow: '0 4px 15px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                if (!openSections.socialSecurity) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 153, 51, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🏦</span>
                Social Security
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.socialSecurity ? '▲' : '▼'}</span>
            </div>
            {openSections.socialSecurity && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', padding: '20px', border: '1px solid rgba(255, 153, 51, 0.3)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                
                <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255, 153, 51, 0.1)', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: '#FF9933', fontSize: '14px', fontWeight: '600' }}>Person 1</h4>
                  
                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                    Monthly Social Security Benefit
                  </label>
                  <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                    <input
                      type="number"
                      value={ssAmount}
                      onChange={(e) => setSsAmount(Number(e.target.value))}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '10px 10px 10px 24px',
                        background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                    Claiming Age
                  </label>
                  <input
                    type="number"
                    min="62"
                    max="70"
                    value={ssStartAge}
                    onChange={(e) => setSsStartAge(Number(e.target.value))}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '5px', fontStyle: 'italic' }}>
                    Age 62-70. Claiming later increases benefit by ~8%/year
                  </div>
                </div>

                {person2Enabled && (
                  <div style={{ padding: '15px', background: 'rgba(255, 153, 51, 0.1)', borderRadius: '6px' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#FF9933', fontSize: '14px', fontWeight: '600' }}>Person 2</h4>
                    
                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Monthly Social Security Benefit
                    </label>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={person2SsAmount}
                        onChange={(e) => setPerson2SsAmount(Number(e.target.value))}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '10px 10px 10px 24px',
                          background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Claiming Age
                    </label>
                    <input
                      type="number"
                      min="62"
                      max="70"
                      value={person2SsStartAge}
                      onChange={(e) => setPerson2SsStartAge(Number(e.target.value))}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                )}

              </div>
            )}
          </div>

          {/* TSP & Withdrawals Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('tspWithdrawals')}
              style={{
                background: openSections.tspWithdrawals
                  ? 'rgba(255, 153, 51, 0.25)'
                  : 'rgba(255, 153, 51, 0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 153, 51, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '8px',
                fontSize: '15px',
                boxShadow: '0 4px 15px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                if (!openSections.tspWithdrawals) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 153, 51, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>💵</span>
                TSP & Withdrawals
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.tspWithdrawals ? '▲' : '▼'}</span>
            </div>
            {openSections.tspWithdrawals && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', padding: '20px', border: '1px solid rgba(255, 153, 51, 0.3)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  Current TSP Balance
                </label>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                  <input
                    type="number"
                    value={tspBalance}
                    onChange={(e) => setTspBalance(Number(e.target.value))}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px 10px 10px 24px',
                      background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tspGrowthRate}
                  onChange={(e) => setTspGrowthRate(Number(e.target.value))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '20px'
                  }}
                />

                {/* Phased Withdrawal - always percentage based */}
                <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.25)', borderRadius: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  <div style={{ color: '#FF9933', fontWeight: '700', marginBottom: '4px', fontSize: '13px' }}>📐 The 4% Rule</div>
                  Withdraw 4% of your balance annually — historically sustainable over 30+ years. Use phased schedule below to adjust by life stage.
                </div>

                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  Annual COLA on Withdrawals (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tspWithdrawalCola}
                  onChange={(e) => setTspWithdrawalCola(Number(e.target.value))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />

                <div style={{ marginBottom: '15px', padding: '12px', background: 'rgba(255, 153, 51, 0.1)', borderRadius: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={tspCoverTaxes}
                      onChange={(e) => setTspCoverTaxes(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ color: '#fff', fontWeight: '500', fontSize: '13px' }}>
                      Use TSP withdrawals to cover income taxes
                    </span>
                  </label>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '5px', marginLeft: '28px' }}>
                    If checked, TSP will withdraw extra to pay estimated taxes
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(91, 192, 222, 0.1)', borderRadius: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
                  💡 RMDs are applied automatically at age 73. See "Retirement Income Planning" for the full schedule.
                </div>

                {/* TSP Withdrawal Schedule */}
                <div style={{ padding: '15px', background: 'rgba(204, 153, 204, 0.08)', border: '1px solid rgba(204,153,204,0.3)', borderRadius: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '4px' }}>
                    <input
                      type="checkbox"
                      checked={tspScheduleEnabled}
                      onChange={(e) => setTspScheduleEnabled(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ color: '#CC99CC', fontWeight: '700', fontSize: '13px' }}>📅 Use Phased Withdrawal Schedule</span>
                  </label>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: tspScheduleEnabled ? '16px' : '0', marginLeft: '26px', fontStyle: 'italic' }}>
                    Set different monthly amounts for different life stages. RMD minimum always applies at 73+.
                  </div>

                  {tspScheduleEnabled && (
                    <div style={{ marginTop: '12px' }}>
                      {(() => {
                        // Project TSP balance at each phase start age for dollar estimates
                        const projBalanceAtAge = (targetAge) => {
                          // Simple compound growth minus phase 1 withdrawals from phase1Age to targetAge
                          let bal = tspBalance;
                          const p1StartAge = tspPhase1Age;
                          const p1Rate = tspPhase1Amount / 100;
                          const p2Rate = tspPhase2Amount / 100;
                          const g = tspGrowthRate / 100;
                          for (let a = p1StartAge; a < targetAge; a++) {
                            const wd = a >= tspPhase2Age ? (bal * p2Rate) : (bal * p1Rate);
                            bal = bal * (1 + g) - wd;
                            if (bal < 0) bal = 0;
                          }
                          return bal;
                        };
                        const phases = [
                          { label: 'Phase 1', color: '#FF9933', borderColor: 'rgba(255,153,51,0.3)', pct: tspPhase1Amount, setPct: setTspPhase1Amount, age: tspPhase1Age, setAge: setTspPhase1Age, projBal: tspBalance },
                          { label: 'Phase 2', color: '#5bc0de', borderColor: 'rgba(91,192,222,0.3)', pct: tspPhase2Amount, setPct: setTspPhase2Amount, age: tspPhase2Age, setAge: setTspPhase2Age, projBal: projBalanceAtAge(tspPhase2Age) },
                          { label: 'Phase 3', color: '#CC99CC', borderColor: 'rgba(204,153,204,0.3)', pct: tspPhase3Amount, setPct: setTspPhase3Amount, age: tspPhase3Age, setAge: setTspPhase3Age, projBal: projBalanceAtAge(tspPhase3Age) },
                        ];
                        return phases.map((phase, idx) => {
                          const annualWd = phase.projBal * (phase.pct / 100);
                          const monthlyWd = annualWd / 12;
                          const isPhase1 = idx === 0;
                          return (
                            <div key={idx} style={{ marginBottom: '12px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', border: `1px solid ${phase.borderColor}` }}>
                              <div style={{ color: phase.color, fontWeight: '600', fontSize: '12px', marginBottom: '8px' }}>📍 {phase.label}</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div>
                                  <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Start Age</label>
                                  <input type="number" value={phase.age} onChange={(e) => phase.setAge(Number(e.target.value))}
                                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.9)', border: `1px solid ${phase.borderColor}`, borderRadius: '4px', fontSize: '13px' }} />
                                </div>
                                <div>
                                  <label style={{ display: 'block', marginBottom: '4px', color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Annual Rate (%)</label>
                                  <input type="number" step="0.1" value={phase.pct} onChange={(e) => phase.setPct(Number(e.target.value))}
                                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.05)', color: phase.color, border: `1px solid ${phase.borderColor}`, borderRadius: '4px', fontSize: '13px', fontWeight: '600' }} />
                                </div>
                              </div>
                              <div style={{ marginTop: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                                ≈ <strong style={{ color: phase.color }}>${Math.round(monthlyWd).toLocaleString()}/mo</strong>
                                <span style={{ marginLeft: '6px' }}>({isPhase1 ? 'at current balance' : `est. balance $${Math.round(phase.projBal / 1000)}k at age ${phase.age}`})</span>
                              </div>
                            </div>
                          );
                        });
                      })()}

                      {/* Summary */}
                      <div style={{ marginTop: '4px', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>
                        <div>🟠 <strong style={{ color: '#FF9933' }}>Phase 1:</strong> {tspPhase1Amount}% from age {tspPhase1Age} (≈ ${Math.round(tspBalance * tspPhase1Amount / 100 / 12).toLocaleString()}/mo)</div>
                        <div>🔵 <strong style={{ color: '#5bc0de' }}>Phase 2:</strong> {tspPhase2Amount}% from age {tspPhase2Age} (≈ ${Math.round(tspBalance * tspPhase2Amount / 100 / 12).toLocaleString()}/mo)</div>
                        <div>🟣 <strong style={{ color: '#CC99CC' }}>Phase 3:</strong> {tspPhase3Amount}% from age {tspPhase3Age} (≈ ${Math.round(tspBalance * tspPhase3Amount / 100 / 12).toLocaleString()}/mo)</div>
                        <div style={{ marginTop: '6px', color: 'rgba(255,153,51,0.8)', fontStyle: 'italic' }}>⚠️ IRS RMD minimum overrides lower planned amounts at age 73+</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Other Income Section (was Additional Income) */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('additional')}
              style={{
                background: openSections.additional ? 'rgba(255, 153, 51, 0.25)' : 'rgba(255, 153, 51, 0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 153, 51, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '4px',
                fontSize: '15px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>💵</span>
                Other Income
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.additional ? '▲' : '▼'}</span>
            </div>
            {openSections.additional && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                
                {additionalIncome.map(income => (
                  <div key={income.id} style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '12px', 
                    marginBottom: '12px', 
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    boxSizing: 'border-box'
                  }}>
                    <input
                      type="text"
                      placeholder="Income Source Name"
                      value={income.name}
                      onChange={(e) => updateAdditionalIncome(income.id, 'name', e.target.value)}
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '8px',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>
                          Amount
                        </label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '6px', top: '6px', color: '#999', fontSize: '11px', zIndex: 1 }}>$</span>
                          <input
                            type="number"
                            value={income.amount}
                            onChange={(e) => updateAdditionalIncome(income.id, 'amount', Number(e.target.value))}
                            style={{
                              width: '100%',
                              padding: '6px 6px 6px 18px',
                              background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '13px',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>
                          Frequency
                        </label>
                        <select
                          value={income.frequency}
                          onChange={(e) => updateAdditionalIncome(income.id, 'frequency', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px 4px',
                            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '13px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Bi-weekly</option>
                          <option value="semimonthly">Semi-monthly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                      <input
                        type="checkbox"
                        checked={income.afterTax}
                        onChange={(e) => updateAdditionalIncome(income.id, 'afterTax', e.target.checked)}
                        style={{ marginRight: '6px', flexShrink: 0 }}
                      />
                      <span>After-tax (take-home)</span>
                    </label>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>
                          Start Year
                        </label>
                        <input
                          type="number"
                          value={income.startYear}
                          onChange={(e) => updateAdditionalIncome(income.id, 'startYear', Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '6px',
                            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '13px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>
                          End Year
                        </label>
                        <input
                          type="number"
                          value={income.endYear || ''}
                          onChange={(e) => updateAdditionalIncome(income.id, 'endYear', e.target.value ? Number(e.target.value) : null)}
                          placeholder="Never"
                          style={{
                            width: '100%',
                            padding: '6px',
                            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '13px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteAdditionalIncome(income.id)}
                      style={{
                        width: '100%',
                        padding: '6px',
                        backgroundColor: '#dc3545',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        boxSizing: 'border-box'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={addAdditionalIncome}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '12px',
                    backgroundColor: '#5bc0de',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  + Add Income Source
                </button>
              </div>
            )}
          </div>

              </div>
            )}
          </div>

          {/* OTHER INVESTMENT ACCOUNTS SECTION */}
          <div style={{ marginBottom: '15px' }}>
            <div
              onClick={() => toggleSection('otherAccounts')}
              style={{
                background: openSections.otherAccounts ? 'rgba(92, 184, 92, 0.25)' : 'rgba(92, 184, 92, 0.12)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(92, 184, 92, 0.4)',
                padding: '14px 16px', cursor: 'pointer', color: '#ffffff',
                fontWeight: '600', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', borderRadius: '4px', fontSize: '15px'
              }}
            >
              <span>🏦 Other Investment Accounts</span>
              <span style={{ fontSize: '12px' }}>{openSections.otherAccounts ? '▲' : '▼'}</span>
            </div>
            {openSections.otherAccounts && (
              <div style={{ padding: '16px 0 0 0' }}>
                {/* Account type buttons */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {[
                    { type: 'traditional_ira', label: '🏛️ Traditional IRA', color: '#5bc0de' },
                    { type: 'roth_ira', label: '🌱 Roth IRA', color: '#5cb85c' },
                    { type: 'brokerage', label: '📈 Brokerage', color: '#CC99CC' }
                  ].map(({ type, label, color }) => (
                    <button
                      key={type}
                      onClick={() => {
                        const defaults = {
                          traditional_ira: { name: 'Traditional IRA', growthRate: 6.5, monthlyWithdrawal: 500, cola: 2.0, startAge: 65, color: '#5bc0de' },
                          roth_ira: { name: 'Roth IRA', growthRate: 7.0, monthlyWithdrawal: 500, cola: 2.0, startAge: 65, color: '#5cb85c' },
                          brokerage: { name: 'Brokerage Account', growthRate: 6.0, monthlyWithdrawal: 500, cola: 2.0, startAge: 65, color: '#CC99CC' }
                        };
                        setOtherAccounts(prev => [...prev, { id: Date.now(), type, balance: 0, ...defaults[type] }]);
                      }}
                      style={{
                        padding: '8px 14px', background: `rgba(${color === '#5bc0de' ? '91,192,222' : color === '#5cb85c' ? '92,184,92' : '204,153,204'},0.2)`,
                        border: `1px solid ${color}`, borderRadius: '6px', color: '#fff',
                        cursor: 'pointer', fontSize: '12px', fontWeight: '600'
                      }}
                    >
                      + {label}
                    </button>
                  ))}
                </div>

                {otherAccounts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                    Add IRAs or brokerage accounts to include them in your projections
                  </div>
                )}

                {otherAccounts.map((acc, idx) => (
                  <div key={acc.id} style={{
                    background: 'rgba(255,255,255,0.05)', border: `1px solid ${acc.color}44`,
                    borderRadius: '8px', padding: '14px', marginBottom: '12px'
                  }}>
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <input
                        value={acc.name}
                        onChange={e => setOtherAccounts(prev => prev.map((a, i) => i === idx ? { ...a, name: e.target.value } : a))}
                        style={{
                          background: 'transparent', border: 'none', borderBottom: `1px solid ${acc.color}88`,
                          color: acc.color, fontWeight: '700', fontSize: '14px', width: '60%', outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => setOtherAccounts(prev => prev.filter((_, i) => i !== idx))}
                        style={{ background: 'rgba(220,53,69,0.3)', border: '1px solid #dc3545', borderRadius: '4px', color: '#dc3545', cursor: 'pointer', padding: '2px 8px', fontSize: '11px' }}
                      >✕ Remove</button>
                    </div>

                    {/* Tax treatment note */}
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px', fontStyle: 'italic' }}>
                      {acc.type === 'traditional_ira' ? '⚠️ Withdrawals taxed as ordinary income' :
                       acc.type === 'roth_ira' ? '✅ Withdrawals tax-free' :
                       '📊 Capital gains treatment (simplified)'}
                    </div>

                    {/* Fields grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Current Balance ($)</label>
                        <input type="number" value={acc.balance}
                          onChange={e => setOtherAccounts(prev => prev.map((a, i) => i === idx ? { ...a, balance: Number(e.target.value) } : a))}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Growth Rate (%)</label>
                        <input type="number" step="0.1" value={acc.growthRate}
                          onChange={e => setOtherAccounts(prev => prev.map((a, i) => i === idx ? { ...a, growthRate: Number(e.target.value) } : a))}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Monthly Withdrawal ($)</label>
                        <input type="number" value={acc.monthlyWithdrawal}
                          onChange={e => setOtherAccounts(prev => prev.map((a, i) => i === idx ? { ...a, monthlyWithdrawal: Number(e.target.value) } : a))}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Start Withdrawal Age</label>
                        <input type="number" value={acc.startAge}
                          onChange={e => setOtherAccounts(prev => prev.map((a, i) => i === idx ? { ...a, startAge: Number(e.target.value) } : a))}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Annual COLA on Withdrawals (%)</label>
                        <input type="number" step="0.1" value={acc.cola}
                          onChange={e => setOtherAccounts(prev => prev.map((a, i) => i === idx ? { ...a, cola: Number(e.target.value) } : a))}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {otherAccounts.length > 0 && (
                  <div style={{ background: 'rgba(92,184,92,0.1)', border: '1px solid rgba(92,184,92,0.3)', borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                    <strong style={{ color: '#5cb85c' }}>Total Balance: </strong>
                    ${otherAccounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                    <span style={{ marginLeft: '16px' }}>
                      <strong style={{ color: '#5cb85c' }}>Combined Monthly: </strong>
                      ${otherAccounts.reduce((sum, a) => sum + a.monthlyWithdrawal, 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SPENDING & TAXES GROUP */}
          <div style={{ marginBottom: '12px' }}>
            <div
              onClick={() => toggleGroup('spendingTaxes')}
              style={{
                background: openGroups.spendingTaxes 
                  ? 'linear-gradient(135deg, rgba(91, 192, 222, 0.15) 0%, rgba(91, 192, 222, 0.08) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(91, 192, 222, 0.3)',
                borderRadius: '8px',
                padding: '14px 18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: openGroups.spendingTaxes 
                  ? '0 4px 20px rgba(91, 192, 222, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 2px 8px rgba(0, 0, 0, 0.2)',
                marginBottom: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                  color: '#5bc0de', 
                  fontWeight: '700', 
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                  textShadow: openGroups.spendingTaxes ? '0 0 10px rgba(91, 192, 222, 0.5)' : 'none'
                }}>
                  💳 SPENDING & TAXES
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: 'rgba(91, 192, 222, 0.7)',
                  fontSize: '11px'
                }}>
                  <span style={{ 
                    background: 'rgba(91, 192, 222, 0.2)', 
                    padding: '2px 8px', 
                    borderRadius: '10px',
                    fontWeight: '600'
                  }}>3</span>
                  <span style={{ fontSize: '12px' }}>{openGroups.spendingTaxes ? '▲' : '▼'}</span>
                </div>
              </div>
            </div>

            {openGroups.spendingTaxes && (
              <div style={{ 
                marginLeft: '12px',
                paddingLeft: '12px',
                borderLeft: '2px solid rgba(91, 192, 222, 0.2)'
              }}>

          {/* Expenses Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('expenses')}
              style={{
                background: openSections.expenses ? 'rgba(255, 153, 51, 0.25)' : 'rgba(255, 153, 51, 0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 153, 51, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '4px',
                fontSize: '15px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>💳</span>
                Expenses
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.expenses ? '▲' : '▼'}</span>
            </div>
            {openSections.expenses && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                {expenses.map(exp => (
                  <div key={exp.id} style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    marginBottom: '12px',
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: '4px'
                  }}>
                    <input
                      type="text"
                      placeholder="Expense name"
                      value={exp.name}
                      onChange={(e) => updateExpense(exp.id, 'name', e.target.value)}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '8px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        fontSize: '14px'
                      }}
                    />
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input
                        type="number"
                        placeholder="Year"
                        value={exp.year}
                        onChange={(e) => updateExpense(exp.id, 'year', Number(e.target.value))}
                        style={{
                          flex: 1,
                          padding: '8px',
                          boxSizing: 'border-box',
                          minWidth: 0,
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Amount ($)"
                        value={exp.amount}
                        onChange={(e) => updateExpense(exp.id, 'amount', Number(e.target.value))}
                        style={{
                          flex: 1,
                          padding: '8px',
                          boxSizing: 'border-box',
                          minWidth: 0,
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={exp.repeat}
                        onChange={(e) => updateExpense(exp.id, 'repeat', e.target.checked)}
                        style={{ marginRight: '8px' }}
                      />
                      Repeat every
                      <input
                        type="number"
                        value={exp.repeatYears}
                        onChange={(e) => updateExpense(exp.id, 'repeatYears', Number(e.target.value))}
                        disabled={!exp.repeat}
                        style={{
                          width: '60px',
                          padding: '4px 8px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          marginLeft: '8px',
                          marginRight: '8px',
                          fontSize: '13px'
                        }}
                      />
                      year(s)
                    </label>
                    
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '8px',
                        backgroundColor: '#dc3545',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={addExpense}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '12px',
                    backgroundColor: '#5bc0de',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  + Add Expense
                </button>
              </div>
            )}
          </div>

          {/* Medical / Long Term Care Placeholder */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px dashed rgba(255,153,51,0.35)',
              padding: '14px 16px', borderRadius: '4px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'not-allowed', opacity: 0.6
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: '600', fontSize: '15px' }}>
                <span style={{ fontSize: '18px' }}>🏥</span>
                Medical / Long Term Care
              </span>
              <span style={{ fontSize: '11px', background: 'rgba(255,153,51,0.2)', border: '1px solid rgba(255,153,51,0.4)', borderRadius: '10px', padding: '2px 8px', color: 'rgba(255,153,51,0.9)', fontWeight: '600' }}>
                Coming Soon
              </span>
            </div>
          </div>

          {/* Budget Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('budget')}
              style={{
                background: openSections.budget ? 'rgba(255, 153, 51, 0.25)' : 'rgba(255, 153, 51, 0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 153, 51, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '4px',
                fontSize: '15px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🏠</span>
                Monthly Budget
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.budget ? '▲' : '▼'}</span>
            </div>
            {openSections.budget && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                
                {/* Housing */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Housing
                    </label>
                    <button
                      onClick={() => toggleBudgetMode('housing')}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        backgroundColor: '#e0e0e0',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      {budgetMode.housing === 'simple' ? 'Break down ▼' : 'Simplify ▲'}
                    </button>
                  </div>
                  
                  {budgetMode.housing === 'simple' ? (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={budgetHousing}
                        onChange={(e) => setBudgetHousing(Number(e.target.value))}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '10px 10px 10px 24px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {budgetHousingDetails.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateBudgetSubcategory(item.id, 'name', e.target.value, budgetHousingDetails, setBudgetHousingDetails)}
                            placeholder="Subcategory"
                            style={{
                              flex: 1,
                              padding: '6px 8px',
                              fontSize: '12px',
                              border: '1px solid #ddd',
                              borderRadius: '3px'
                            }}
                          />
                          <span style={{ color: '#999', fontSize: '12px' }}>$</span>
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => updateBudgetSubcategory(item.id, 'amount', Number(e.target.value), budgetHousingDetails, setBudgetHousingDetails)}
                            style={{
                              width: '100px',
                              padding: '6px 8px',
                              fontSize: '12px',
                              border: '1px solid #ddd',
                              borderRadius: '3px'
                            }}
                          />
                          <button
                            onClick={() => deleteBudgetSubcategory(item.id, budgetHousingDetails, setBudgetHousingDetails)}
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              backgroundColor: '#dc3545',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addBudgetSubcategory('housing', setBudgetHousingDetails)}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '6px',
                          fontSize: '12px',
                          backgroundColor: '#5bc0de',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          marginTop: '4px'
                        }}
                      >
                        + Add Subcategory
                      </button>
                      <div style={{ 
                        marginTop: '8px', 
                        paddingTop: '8px', 
                        borderTop: '1px solid #ddd',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}>
                        Total: ${calculateCategoryTotal(budgetHousingDetails).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Food */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Food
                    </label>
                    <button
                      onClick={() => toggleBudgetMode('food')}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        backgroundColor: '#e0e0e0',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      {budgetMode.food === 'simple' ? 'Break down ▼' : 'Simplify ▲'}
                    </button>
                  </div>
                  
                  {budgetMode.food === 'simple' ? (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={budgetFood}
                        onChange={(e) => setBudgetFood(Number(e.target.value))}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '10px 10px 10px 24px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {budgetFoodDetails.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateBudgetSubcategory(item.id, 'name', e.target.value, budgetFoodDetails, setBudgetFoodDetails)}
                            placeholder="Subcategory"
                            style={{
                              flex: 1,
                              padding: '6px 8px',
                              fontSize: '12px',
                              border: '1px solid #ddd',
                              borderRadius: '3px'
                            }}
                          />
                          <span style={{ color: '#999', fontSize: '12px' }}>$</span>
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => updateBudgetSubcategory(item.id, 'amount', Number(e.target.value), budgetFoodDetails, setBudgetFoodDetails)}
                            style={{
                              width: '100px',
                              padding: '6px 8px',
                              fontSize: '12px',
                              border: '1px solid #ddd',
                              borderRadius: '3px'
                            }}
                          />
                          <button
                            onClick={() => deleteBudgetSubcategory(item.id, budgetFoodDetails, setBudgetFoodDetails)}
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              backgroundColor: '#dc3545',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addBudgetSubcategory('food', setBudgetFoodDetails)}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '6px',
                          fontSize: '12px',
                          backgroundColor: '#5bc0de',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          marginTop: '4px'
                        }}
                      >
                        + Add Subcategory
                      </button>
                      <div style={{ 
                        marginTop: '8px', 
                        paddingTop: '8px', 
                        borderTop: '1px solid #ddd',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}>
                        Total: ${calculateCategoryTotal(budgetFoodDetails).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Similar pattern for Transportation, Healthcare, Entertainment, Other - I'll create a shortened version to save space */}
                
                {/* Transportation */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>Transportation</label>
                    <button onClick={() => toggleBudgetMode('transportation')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '3px', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {budgetMode.transportation === 'simple' ? 'Break down ▼' : 'Simplify ▲'}
                    </button>
                  </div>
                  {budgetMode.transportation === 'simple' ? (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input type="number" value={budgetTransportation} onChange={(e) => setBudgetTransportation(Number(e.target.value))} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 24px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {budgetTransportationDetails.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input type="text" value={item.name} onChange={(e) => updateBudgetSubcategory(item.id, 'name', e.target.value, budgetTransportationDetails, setBudgetTransportationDetails)} placeholder="Subcategory" style={{ flex: 1, padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <span style={{ color: '#999', fontSize: '12px' }}>$</span>
                          <input type="number" value={item.amount} onChange={(e) => updateBudgetSubcategory(item.id, 'amount', Number(e.target.value), budgetTransportationDetails, setBudgetTransportationDetails)} style={{ width: '100px', padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <button onClick={() => deleteBudgetSubcategory(item.id, budgetTransportationDetails, setBudgetTransportationDetails)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                      <button onClick={() => addBudgetSubcategory('transportation', setBudgetTransportationDetails)} style={{ width: '100%', boxSizing: 'border-box', padding: '6px', fontSize: '12px', backgroundColor: '#5bc0de', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '4px' }}>+ Add Subcategory</button>
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' }}>Total: ${calculateCategoryTotal(budgetTransportationDetails).toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {/* Healthcare */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>Healthcare</label>
                    <button onClick={() => toggleBudgetMode('healthcare')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '3px', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {budgetMode.healthcare === 'simple' ? 'Break down ▼' : 'Simplify ▲'}
                    </button>
                  </div>
                  {budgetMode.healthcare === 'simple' ? (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input type="number" value={budgetHealthcare} onChange={(e) => setBudgetHealthcare(Number(e.target.value))} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 24px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {budgetHealthcareDetails.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input type="text" value={item.name} onChange={(e) => updateBudgetSubcategory(item.id, 'name', e.target.value, budgetHealthcareDetails, setBudgetHealthcareDetails)} placeholder="Subcategory" style={{ flex: 1, padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <span style={{ color: '#999', fontSize: '12px' }}>$</span>
                          <input type="number" value={item.amount} onChange={(e) => updateBudgetSubcategory(item.id, 'amount', Number(e.target.value), budgetHealthcareDetails, setBudgetHealthcareDetails)} style={{ width: '100px', padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <button onClick={() => deleteBudgetSubcategory(item.id, budgetHealthcareDetails, setBudgetHealthcareDetails)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                      <button onClick={() => addBudgetSubcategory('healthcare', setBudgetHealthcareDetails)} style={{ width: '100%', boxSizing: 'border-box', padding: '6px', fontSize: '12px', backgroundColor: '#5bc0de', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '4px' }}>+ Add Subcategory</button>
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' }}>Total: ${calculateCategoryTotal(budgetHealthcareDetails).toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {/* Entertainment */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>Entertainment</label>
                    <button onClick={() => toggleBudgetMode('entertainment')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '3px', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {budgetMode.entertainment === 'simple' ? 'Break down ▼' : 'Simplify ▲'}
                    </button>
                  </div>
                  {budgetMode.entertainment === 'simple' ? (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input type="number" value={budgetEntertainment} onChange={(e) => setBudgetEntertainment(Number(e.target.value))} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 24px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {budgetEntertainmentDetails.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input type="text" value={item.name} onChange={(e) => updateBudgetSubcategory(item.id, 'name', e.target.value, budgetEntertainmentDetails, setBudgetEntertainmentDetails)} placeholder="Subcategory" style={{ flex: 1, padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <span style={{ color: '#999', fontSize: '12px' }}>$</span>
                          <input type="number" value={item.amount} onChange={(e) => updateBudgetSubcategory(item.id, 'amount', Number(e.target.value), budgetEntertainmentDetails, setBudgetEntertainmentDetails)} style={{ width: '100px', padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <button onClick={() => deleteBudgetSubcategory(item.id, budgetEntertainmentDetails, setBudgetEntertainmentDetails)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                      <button onClick={() => addBudgetSubcategory('entertainment', setBudgetEntertainmentDetails)} style={{ width: '100%', boxSizing: 'border-box', padding: '6px', fontSize: '12px', backgroundColor: '#5bc0de', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '4px' }}>+ Add Subcategory</button>
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' }}>Total: ${calculateCategoryTotal(budgetEntertainmentDetails).toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {/* Other */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>Other</label>
                    <button onClick={() => toggleBudgetMode('other')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '3px', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {budgetMode.other === 'simple' ? 'Break down ▼' : 'Simplify ▲'}
                    </button>
                  </div>
                  {budgetMode.other === 'simple' ? (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input type="number" value={budgetOther} onChange={(e) => setBudgetOther(Number(e.target.value))} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 24px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {budgetOtherDetails.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input type="text" value={item.name} onChange={(e) => updateBudgetSubcategory(item.id, 'name', e.target.value, budgetOtherDetails, setBudgetOtherDetails)} placeholder="Subcategory" style={{ flex: 1, padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <span style={{ color: '#999', fontSize: '12px' }}>$</span>
                          <input type="number" value={item.amount} onChange={(e) => updateBudgetSubcategory(item.id, 'amount', Number(e.target.value), budgetOtherDetails, setBudgetOtherDetails)} style={{ width: '100px', padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <button onClick={() => deleteBudgetSubcategory(item.id, budgetOtherDetails, setBudgetOtherDetails)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                      <button onClick={() => addBudgetSubcategory('other', setBudgetOtherDetails)} style={{ width: '100%', boxSizing: 'border-box', padding: '6px', fontSize: '12px', backgroundColor: '#5bc0de', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '4px' }}>+ Add Subcategory</button>
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' }}>Total: ${calculateCategoryTotal(budgetOtherDetails).toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {/* Grand Total */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '12px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  marginTop: '15px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>Monthly Total:</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: '600' }}>
                      {formatCurrency(
                        (budgetMode.housing === 'detailed' ? calculateCategoryTotal(budgetHousingDetails) : budgetHousing) +
                        (budgetMode.food === 'detailed' ? calculateCategoryTotal(budgetFoodDetails) : budgetFood) +
                        (budgetMode.transportation === 'detailed' ? calculateCategoryTotal(budgetTransportationDetails) : budgetTransportation) +
                        (budgetMode.healthcare === 'detailed' ? calculateCategoryTotal(budgetHealthcareDetails) : budgetHealthcare) +
                        (budgetMode.entertainment === 'detailed' ? calculateCategoryTotal(budgetEntertainmentDetails) : budgetEntertainment) +
                        (budgetMode.other === 'detailed' ? calculateCategoryTotal(budgetOtherDetails) : budgetOther)
                      )}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>Annual Total:</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: '600' }}>
                      {formatCurrency((
                        (budgetMode.housing === 'detailed' ? calculateCategoryTotal(budgetHousingDetails) : budgetHousing) +
                        (budgetMode.food === 'detailed' ? calculateCategoryTotal(budgetFoodDetails) : budgetFood) +
                        (budgetMode.transportation === 'detailed' ? calculateCategoryTotal(budgetTransportationDetails) : budgetTransportation) +
                        (budgetMode.healthcare === 'detailed' ? calculateCategoryTotal(budgetHealthcareDetails) : budgetHealthcare) +
                        (budgetMode.entertainment === 'detailed' ? calculateCategoryTotal(budgetEntertainmentDetails) : budgetEntertainment) +
                        (budgetMode.other === 'detailed' ? calculateCategoryTotal(budgetOtherDetails) : budgetOther)
                      ) * 12)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Taxes Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('taxes')}
              style={{
                background: openSections.taxes ? 'rgba(255, 153, 51, 0.25)' : 'rgba(255, 153, 51, 0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 153, 51, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '4px',
                fontSize: '15px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>📋</span>
                Taxes
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.taxes ? '▲' : '▼'}</span>
            </div>
            {openSections.taxes && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  Federal Taxes Withheld (Monthly)
                </label>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                  <input
                    type="number"
                    value={federalWithheld}
                    onChange={(e) => setFederalWithheld(Number(e.target.value))}
                    placeholder="Amount withheld from FERS"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px 10px 10px 24px',
                      background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  Tax Bracket (%)
                </label>
                <select
                  value={taxBracket}
                  onChange={(e) => setTaxBracket(Number(e.target.value))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value={10}>10% - Up to $23,200</option>
                  <option value={12}>12% - $23,200 to $94,300</option>
                  <option value={22}>22% - $94,300 to $201,050</option>
                  <option value={24}>24% - $201,050 to $383,900</option>
                  <option value={32}>32% - $383,900 to $487,450</option>
                  <option value={35}>35% - $487,450 to $731,200</option>
                  <option value={37}>37% - Over $731,200</option>
                </select>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '8px', fontStyle: 'italic' }}>
                  Based on 2024 tax brackets (Married Filing Jointly)
                </div>
              </div>
            )}
          </div>
              </div>
            )}
          </div>

          {/* SETTINGS GROUP */}
          <div style={{ marginBottom: '12px' }}>
            <div
              onClick={() => toggleGroup('settingsGroup')}
              style={{
                background: openGroups.settingsGroup 
                  ? 'linear-gradient(135deg, rgba(204, 153, 204, 0.15) 0%, rgba(204, 153, 204, 0.08) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(204, 153, 204, 0.3)',
                borderRadius: '8px',
                padding: '14px 18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: openGroups.settingsGroup 
                  ? '0 4px 20px rgba(204, 153, 204, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 2px 8px rgba(0, 0, 0, 0.2)',
                marginBottom: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                  color: '#CC99CC', 
                  fontWeight: '700', 
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                  textShadow: openGroups.settingsGroup ? '0 0 10px rgba(204, 153, 204, 0.5)' : 'none'
                }}>
                  ⚙️ SETTINGS
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: 'rgba(204, 153, 204, 0.7)',
                  fontSize: '11px'
                }}>
                  <span style={{ 
                    background: 'rgba(204, 153, 204, 0.2)', 
                    padding: '2px 8px', 
                    borderRadius: '10px',
                    fontWeight: '600'
                  }}>1</span>
                  <span style={{ fontSize: '12px' }}>{openGroups.settingsGroup ? '▲' : '▼'}</span>
                </div>
              </div>
            </div>

            {openGroups.settingsGroup && (
              <div style={{
                marginLeft: '12px',
                paddingLeft: '12px',
                borderLeft: '2px solid rgba(204, 153, 204, 0.2)'
              }}>

          {/* Settings Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('settings')}
              style={{
                background: openSections.additional ? 'rgba(255, 153, 51, 0.25)' : 'rgba(255, 153, 51, 0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 153, 51, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '4px',
                fontSize: '15px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>⚙️</span>
                Settings
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.settings ? '▲' : '▼'}</span>
            </div>
            {openSections.settings && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  Inflation Rate (%) - For Budget & Deductions
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />
                
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  FERS COLA (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fersCola}
                  onChange={(e) => setFersCola(Number(e.target.value))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />
                
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  SRS COLA (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={srsCola}
                  onChange={(e) => setSrsCola(Number(e.target.value))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />

                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  Social Security COLA (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={ssCola}
                  onChange={(e) => setSsCola(Number(e.target.value))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />

                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  TSP Withdrawal COLA (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tspWithdrawalCola}
                  onChange={(e) => setTspWithdrawalCola(Number(e.target.value))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />

                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  Projection Years
                </label>
                <input
                  type="number"
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(Number(e.target.value))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}
          </div>

              </div>
            )}
          </div>

          {/* Rental Property Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('rental')}
              style={{
                background: openSections.rental ? 'rgba(255, 153, 51, 0.25)' : 'rgba(255, 153, 51, 0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 153, 51, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '4px',
                fontSize: '15px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🏠</span>
                Rental Property
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.rental ? '▲' : '▼'}</span>
            </div>
            {openSections.rental && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '15px', fontStyle: 'italic' }}>
                  Track income and expenses for your rental property (2025-2027)
                </p>
                
                <div style={{ marginBottom: '15px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>Fixed Monthly Expenses</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Mortgage</label>
                      <input type="number" value={rentalMortgage} onChange={(e) => setRentalMortgage(Number(e.target.value))} style={{ width: '100%', padding: '4px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Property Tax</label>
                      <input type="number" value={rentalPropertyTax} onChange={(e) => setRentalPropertyTax(Number(e.target.value))} style={{ width: '100%', padding: '4px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Insurance</label>
                      <input type="number" value={rentalInsurance} onChange={(e) => setRentalInsurance(Number(e.target.value))} style={{ width: '100%', padding: '4px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>HOA</label>
                      <input type="number" value={rentalHOA} onChange={(e) => setRentalHOA(Number(e.target.value))} style={{ width: '100%', padding: '4px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Internet</label>
                      <input type="number" value={rentalInternet} onChange={(e) => setRentalInternet(Number(e.target.value))} style={{ width: '100%', padding: '4px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Maintenance</label>
                      <input type="number" value={rentalMaintenance} onChange={(e) => setRentalMaintenance(Number(e.target.value))} style={{ width: '100%', padding: '4px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Landscaping</label>
                      <input type="number" value={rentalLandscaping} onChange={(e) => setRentalLandscaping(Number(e.target.value))} style={{ width: '100%', padding: '4px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Pest Control</label>
                      <input type="number" value={rentalPestControl} onChange={(e) => setRentalPestControl(Number(e.target.value))} style={{ width: '100%', padding: '4px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Other</label>
                      <input type="number" value={rentalOther} onChange={(e) => setRentalOther(Number(e.target.value))} style={{ width: '100%', padding: '4px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <p style={{ fontSize: '10px', color: '#999', marginTop: '8px', fontStyle: 'italic' }}>PM Fee (20%) calculated automatically from income</p>
                </div>
                
                <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px', fontWeight: '600' }}>📝 Monthly Income & Variable Expenses:</p>
                <p style={{ fontSize: '10px', color: '#999', marginBottom: '10px', fontStyle: 'italic' }}>
                  Enter rental income and utilities for each month (2025-2027)
                </p>
                
                {/* Year tabs for monthly data entry */}
                {[
                  { year: 2025, income: rentalIncome2025, setIncome: setRentalIncome2025, utilities: rentalUtilities2025, setUtilities: setRentalUtilities2025 },
                  { year: 2026, income: rentalIncome2026, setIncome: setRentalIncome2026, utilities: rentalUtilities2026, setUtilities: setRentalUtilities2026 },
                  { year: 2027, income: rentalIncome2027, setIncome: setRentalIncome2027, utilities: rentalUtilities2027, setUtilities: setRentalUtilities2027 }
                ].map(({ year, income, setIncome, utilities, setUtilities }) => (
                  <details key={year} style={{ marginBottom: '10px', backgroundColor: '#fff', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '8px' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: '600', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {year} Monthly Data
                    </summary>
                    <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '11px' }}>
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                        <div key={idx} style={{ padding: '6px', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', borderRadius: '3px' }}>
                          <div style={{ fontWeight: '600', marginBottom: '3px', fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>{month}</div>
                          <div style={{ marginBottom: '3px' }}>
                            <label style={{ fontSize: '9px', color: '#999' }}>Income</label>
                            <input
                              type="number"
                              value={income[idx]}
                              onChange={(e) => {
                                const newIncome = [...income];
                                newIncome[idx] = Number(e.target.value);
                                setIncome(newIncome);
                              }}
                              placeholder="0"
                              style={{ width: '100%', padding: '3px', fontSize: '11px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '2px', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '9px', color: '#999' }}>Utils</label>
                            <input
                              type="number"
                              value={utilities[idx]}
                              onChange={(e) => {
                                const newUtilities = [...utilities];
                                newUtilities[idx] = Number(e.target.value);
                                setUtilities(newUtilities);
                              }}
                              placeholder="0"
                              style={{ width: '100%', padding: '3px', fontSize: '11px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '2px', boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
                
                {/* Big Picture Integration */}
                <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#FF9933', fontWeight: '700' }}>📊 Big Picture (Retirement Projections)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Est. Monthly Net (income minus all costs — use negative for a loss)</label>
                      <input type="text" inputMode="numeric" value={rentalMonthlyNet} onChange={(e) => { const v = e.target.value; if (v === '' || v === '-' || !isNaN(Number(v))) setRentalMonthlyNet(v === '' || v === '-' ? v : Number(v)); }}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', fontSize: '13px', background: 'rgba(255,255,255,0.08)', color: rentalMonthlyNet < 0 ? '#dc3545' : 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,153,51,0.4)', borderRadius: '4px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Purchase Price ($)</label>
                      <input type="number" value={rentalPurchasePrice} onChange={(e) => setRentalPurchasePrice(Number(e.target.value))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', fontSize: '13px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Remaining Mortgage Balance ($)</label>
                      <input type="number" value={rentalCurrentBalance} onChange={(e) => setRentalCurrentBalance(Number(e.target.value))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', fontSize: '13px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Est. Sale Year (0 = never)</label>
                      <input type="number" value={rentalSaleYear} onChange={(e) => setRentalSaleYear(Number(e.target.value))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', fontSize: '13px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '3px', color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Est. Sale Price ($)</label>
                      <input type="number" value={rentalSalePrice} onChange={(e) => setRentalSalePrice(Number(e.target.value))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', fontSize: '13px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                    </div>
                  </div>
                  {rentalSaleYear > 0 && rentalSalePrice > 0 && (
                    <div style={{ marginTop: '10px', padding: '8px 10px', background: 'rgba(40,167,69,0.15)', border: '1px solid rgba(40,167,69,0.3)', borderRadius: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
                      📈 Est. net proceeds in {rentalSaleYear}: <strong style={{ color: '#28a745' }}>${Math.max(0, rentalSalePrice - rentalCurrentBalance).toLocaleString()}</strong>
                      {rentalPurchasePrice > 0 && <span style={{ marginLeft: '12px' }}>Est. gain: <strong style={{ color: '#5bc0de' }}>${Math.max(0, rentalSalePrice - rentalPurchasePrice).toLocaleString()}</strong></span>}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setRentalView(true)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '12px',
                    backgroundColor: '#5bc0de',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    marginTop: '10px'
                  }}
                >
                  📊 View Rental Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Will I Be Okay Modal */}
          {showWillIOkay && ReactDOM.createPortal(
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.8)', zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(6px)', padding: '20px'
            }} onClick={() => setShowWillIOkay(false)}>
              <div onClick={e => e.stopPropagation()} style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid rgba(92,184,92,0.4)',
                borderRadius: '16px', padding: '32px',
                width: '100%', maxWidth: '860px',
                maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
              }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>🧭</div>
                  <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#fff' }}>Will I Be Okay?</h2>
                  <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                    Survivor income scenarios if primary account holder passes away
                  </p>
                </div>

                {/* Scenario Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  {[5, 10, 15, 20].map(years => {
                    const s = calculateSurvivorScenario(years);
                    if (!s) return null;
                    return (
                      <div key={years} style={{
                        background: s.verdictBg,
                        border: `1px solid ${s.verdictColor}44`,
                        borderRadius: '12px', padding: '20px',
                        position: 'relative'
                      }}>
                        {/* Timeframe header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                          <div>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>In {years} Years</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{s.deathYear} · Age {s.deathAge}</div>
                          </div>
                          <div style={{
                            background: s.verdictBg, border: `1px solid ${s.verdictColor}`,
                            borderRadius: '20px', padding: '4px 12px',
                            fontSize: '12px', fontWeight: '700', color: s.verdictColor
                          }}>
                            {s.verdict}
                          </div>
                        </div>

                        {/* Coverage score */}
                        <div style={{ marginBottom: '14px', padding: '12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Income covers expenses</span>
                            <span style={{ fontSize: '20px', fontWeight: '800', color: s.verdictColor }}>{s.coverageRatio}%</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '6px' }}>
                            <div style={{ background: s.verdictColor, borderRadius: '4px', height: '6px', width: `${Math.min(s.coverageRatio, 100)}%`, transition: 'width 0.5s ease' }} />
                          </div>
                          <div style={{ marginTop: '6px', fontSize: '12px', color: s.monthlyNet >= 0 ? '#5cb85c' : '#dc3545', fontWeight: '600' }}>
                            {s.monthlyNet >= 0 ? '+' : ''}{formatCurrency(s.monthlyNet)}/mo surplus
                          </div>
                        </div>

                        {/* Income breakdown */}
                        <div style={{ fontSize: '12px', marginBottom: '12px' }}>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Annual Survivor Income</div>
                          {s.survivorFers > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', color: 'rgba(255,255,255,0.8)' }}>
                              <span>FERS ({fersSurvivorRate}%)</span><span style={{ color: '#FF9933' }}>{formatCurrency(s.survivorFers)}</span>
                            </div>
                          )}
                          {s.survivorSs > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', color: 'rgba(255,255,255,0.8)' }}>
                              <span>Social Security</span><span style={{ color: '#9999FF' }}>{formatCurrency(s.survivorSs)}</span>
                            </div>
                          )}
                          {s.survivorTspWithdrawal > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', color: 'rgba(255,255,255,0.8)' }}>
                              <span>TSP Withdrawal</span><span style={{ color: '#5bc0de' }}>{formatCurrency(s.survivorTspWithdrawal)}</span>
                            </div>
                          )}
                          {s.survivorOtherIncome > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', color: 'rgba(255,255,255,0.8)' }}>
                              <span>Other Accounts</span><span style={{ color: '#5cb85c' }}>{formatCurrency(s.survivorOtherIncome)}</span>
                            </div>
                          )}
                          {s.rentalAtDeath !== 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', color: 'rgba(255,255,255,0.8)' }}>
                              <span>Rental Net</span><span style={{ color: s.rentalAtDeath < 0 ? '#dc3545' : '#5cb85c' }}>{formatCurrency(s.rentalAtDeath)}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '6px', marginTop: '6px', fontWeight: '700', color: '#fff' }}>
                            <span>Total Income</span><span style={{ color: '#28a745' }}>{formatCurrency(s.survivorTotalIncome)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', color: '#dc3545' }}>
                            <span style={{ fontWeight: '700' }}>Expenses</span><span style={{ fontWeight: '700' }}>-{formatCurrency(s.projectedExpenses)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '6px', marginTop: '6px', fontWeight: '800', fontSize: '13px' }}>
                            <span style={{ color: '#fff' }}>Remaining</span>
                            <span style={{ color: s.monthlyNet >= 0 ? '#5cb85c' : '#dc3545' }}>
                              {formatCurrency(s.survivorTotalIncome - s.projectedExpenses)}/yr
                              <span style={{ fontSize: '11px', fontWeight: '600', marginLeft: '6px', opacity: 0.8 }}>
                                ({formatCurrency(s.monthlyNet)}/mo)
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Investment nest egg */}
                        <div style={{ padding: '10px', background: 'rgba(91,192,222,0.1)', borderRadius: '6px', fontSize: '12px' }}>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Investment Nest Egg</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>
                            <span>TSP Balance</span><span style={{ color: '#5bc0de' }}>{formatCurrency(s.tspAtDeath)}</span>
                          </div>
                          {s.otherAtDeath > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>
                              <span>Other Accounts</span><span style={{ color: '#5cb85c' }}>{formatCurrency(s.otherAtDeath)}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px', marginTop: '4px', fontWeight: '700' }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Total</span>
                            <span style={{ color: '#fff' }}>{formatCurrency(s.totalInvestmentsAtDeath)}</span>
                          </div>
                        </div>

                        {/* Key concern */}
                        <div style={{ marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
                          💡 {s.concern}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer note */}
                <div style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '20px' }}>
                  Estimates based on your current projections. SS survivor benefit shown as higher of two SS amounts.
                </div>

                {/* Close button */}
                <button onClick={() => setShowWillIOkay(false)} style={{
                  width: '100%', padding: '14px', background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                  color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '14px'
                }}>
                  Close
                </button>
              </div>
            </div>,
            document.body
          )}

          {/* Scenario Picker Modal */}
          {showScenarioPicker && ReactDOM.createPortal(
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.75)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid rgba(255,153,51,0.4)',
                borderRadius: '12px', padding: '30px',
                maxWidth: '680px', width: '90%', maxHeight: '85vh', overflowY: 'auto',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ margin: 0, color: '#FF9933', fontSize: '22px', fontWeight: '700' }}>🧭 Choose a Starting Point</h2>
                    <p style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                      Load a pre-built scenario or start from scratch. You can customize everything after loading.
                    </p>
                  </div>
                  <button onClick={() => setShowScenarioPicker(false)} style={{
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '16px'
                  }}>✕</button>
                </div>

                {/* Blank Canvas */}
                <div style={{ marginBottom: '20px' }}>
                  <button onClick={() => loadScenario('blank')} style={{
                    width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
                    cursor: 'pointer', textAlign: 'left', color: '#fff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '28px' }}>📋</span>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '15px', color: '#fff' }}>Blank Canvas</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Start fresh — all zeros, ready for your real numbers</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Federal Employee Scenarios */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#FF9933', letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>
                    🏛️ Federal Employee Career Stages
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {['earlyCareerFed', 'midCareerCouple', 'preRetirementFed', 'justRetiredFed'].map(key => {
                      const s = starterScenarios[key];
                      return (
                        <button key={key} onClick={() => loadScenario(key)} style={{
                          padding: '14px', background: 'rgba(255,255,255,0.05)',
                          border: `1px solid ${s.color}44`, borderRadius: '8px',
                          cursor: 'pointer', textAlign: 'left', color: '#fff',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = `${s.color}22`}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                          <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
                          <div style={{ fontWeight: '700', fontSize: '13px', color: s.color }}>{s.label.replace(/^.*? /, '')}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '3px', lineHeight: '1.4' }}>{s.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* General Demographics */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#CC99CC', letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>
                    👥 General Demographics (US Averages)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    {['young25', 'married40', 'emptyNest55'].map(key => {
                      const s = starterScenarios[key];
                      return (
                        <button key={key} onClick={() => loadScenario(key)} style={{
                          padding: '14px', background: 'rgba(255,255,255,0.05)',
                          border: `1px solid ${s.color}44`, borderRadius: '8px',
                          cursor: 'pointer', textAlign: 'left', color: '#fff'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = `${s.color}22`}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                          <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
                          <div style={{ fontWeight: '700', fontSize: '13px', color: s.color }}>{s.label.replace(/^.*? /, '')}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '3px', lineHeight: '1.4' }}>{s.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,153,51,0.1)', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                  💡 All scenarios use approximate US average data for illustration purposes. Customize all values after loading.
                </div>
              </div>
            </div>,
            document.body
          )}

          {/* Retirement Income Planning Section - NEW FOR v3.1.0 */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('withdrawalStrategy')}
              style={{
                background: openSections.withdrawalStrategy
                  ? 'rgba(204, 153, 204, 0.25)'
                  : 'rgba(204, 153, 204, 0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(204, 153, 204, 0.4)',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: '600',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '8px',
                fontSize: '15px',
                boxShadow: '0 4px 15px rgba(204, 153, 204, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                if (!openSections.withdrawalStrategy) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(204, 153, 204, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(204, 153, 204, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>📈</span>
                Retirement Income Planning
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.withdrawalStrategy ? '▲' : '▼'}</span>
            </div>
            {openSections.withdrawalStrategy && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid rgba(204,153,204,0.3)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>

                {/* RMD Schedule */}
                {(() => {
                  const currentYear = new Date().getFullYear();
                  const person1BirthYear = person1Dob ? parseInt(person1Dob.split('-')[0]) : (currentYear - 62);
                  const currentAge = currentYear - person1BirthYear;
                  const startAge = Math.max(73, currentAge);
                  const lifeExpectancyTable = {
                    73:26.5,74:25.5,75:24.6,76:23.7,77:22.9,78:22.0,79:21.1,80:20.2,
                    81:19.4,82:18.5,83:17.7,84:16.8,85:16.0,86:15.2,87:14.4,88:13.7,
                    89:12.9,90:12.2,91:11.5,92:10.8,93:10.1,94:9.5,95:8.9,96:8.4,
                  };

                  // Project TSP balance to age 73 using simple growth
                  let projBalance = tspBalance;
                  const yearsToRmd = Math.max(0, 73 - currentAge);
                  for (let i = 0; i < yearsToRmd; i++) {
                    const monthlyWd = tspScheduleEnabled
                      ? (i + currentAge >= tspPhase3Age ? tspPhase3Amount : i + currentAge >= tspPhase2Age ? tspPhase2Amount : tspPhase1Amount)
                      : (tspWithdrawalType === 'amount' ? tspWithdrawalAmount : 0);
                    projBalance = projBalance * (1 + tspGrowthRate / 100) - (monthlyWd * 12);
                    projBalance = Math.max(0, projBalance);
                  }

                  const rmdRows = [];
                  let bal = projBalance;
                  for (let age = startAge; age <= Math.min(95, startAge + 15); age++) {
                    const factor = lifeExpectancyTable[age] || 6.4;
                    const rmd = bal / factor;
                    const monthlyRmd = rmd / 12;
                    // planned withdrawal this age
                    let planned = tspScheduleEnabled
                      ? (age >= tspPhase3Age ? tspPhase3Amount : age >= tspPhase2Age ? tspPhase2Amount : tspPhase1Amount) * 12
                      : (tspWithdrawalType === 'amount' ? tspWithdrawalAmount * 12 : bal * (tspWithdrawalPercent / 100));
                    const rmdApplies = rmd > planned;
                    const actualWd = rmdApplies ? rmd : planned;
                    rmdRows.push({ age, year: currentYear + (age - currentAge), balance: Math.round(bal), factor, rmd: Math.round(rmd), monthlyRmd: Math.round(monthlyRmd), planned: Math.round(planned), rmdApplies, actualWd: Math.round(actualWd) });
                    bal = bal * (1 + tspGrowthRate / 100) - actualWd;
                    bal = Math.max(0, bal);
                  }

                  return (
                    <div>
                      {currentAge < 73 && (
                        <div style={{ padding: '10px 14px', background: 'rgba(255,153,51,0.1)', border: '1px solid rgba(255,153,51,0.3)', borderRadius: '6px', marginBottom: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                          ⏳ You are <strong style={{ color: '#FF9933' }}>{73 - currentAge} years</strong> away from RMDs (age 73). Table below shows projected RMD schedule based on current TSP balance and growth rate.
                        </div>
                      )}
                      {currentAge >= 73 && (
                        <div style={{ padding: '10px 14px', background: 'rgba(217,83,79,0.1)', border: '1px solid rgba(217,83,79,0.3)', borderRadius: '6px', marginBottom: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                          ⚠️ <strong style={{ color: '#d9534f' }}>RMDs are active.</strong> IRS requires minimum distributions each year. Missing an RMD triggers a 25% excise tax on the shortfall.
                        </div>
                      )}

                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                        📋 RMD Schedule — IRS Uniform Lifetime Table
                      </div>

                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                              {['Age', 'Year', 'TSP Balance', 'Factor', 'RMD Required', 'RMD/mo', 'Status'].map(h => (
                                <th key={h} style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', textAlign: h === 'Age' || h === 'Year' ? 'center' : 'right', whiteSpace: 'nowrap' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rmdRows.map((row, i) => (
                              <tr key={row.age} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: row.rmdApplies ? 'rgba(255,153,51,0.06)' : 'transparent' }}>
                                <td style={{ padding: '6px 8px', color: '#fff', fontWeight: '600', textAlign: 'center' }}>{row.age}</td>
                                <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{row.year}</td>
                                <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.8)', textAlign: 'right' }}>${row.balance.toLocaleString()}</td>
                                <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>{row.factor}</td>
                                <td style={{ padding: '6px 8px', color: row.rmdApplies ? '#FF9933' : 'rgba(255,255,255,0.6)', fontWeight: row.rmdApplies ? '700' : '400', textAlign: 'right' }}>${row.rmd.toLocaleString()}</td>
                                <td style={{ padding: '6px 8px', color: row.rmdApplies ? '#FF9933' : 'rgba(255,255,255,0.6)', textAlign: 'right' }}>${row.monthlyRmd.toLocaleString()}</td>
                                <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                                  {row.rmdApplies
                                    ? <span style={{ color: '#FF9933', fontWeight: '700', fontSize: '11px' }}>⚡ RMD OVERRIDES</span>
                                    : <span style={{ color: '#5cb85c', fontSize: '11px' }}>✓ Plan OK</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                        Projections assume {tspGrowthRate}% annual growth. RMD calculated on prior year-end balance per IRS rules. Consult a tax advisor for your specific situation.
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}
          </div>

          {/* Scenario Starter Button */}
          {/* Scenario Starter Button */}
          <button
            onClick={() => setShowScenarioPicker(true)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '14px',
              background: 'rgba(91, 192, 222, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#ffffff',
              border: '1px solid rgba(91, 192, 222, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '10px',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 15px rgba(91, 192, 222, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(91, 192, 222, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(91, 192, 222, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(91, 192, 222, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.background = 'rgba(91, 192, 222, 0.15)';
            }}
          >
            🧭 Load Starter Scenario
          </button>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '18px',
              background: 'rgba(255, 153, 51, 0.2)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 153, 51, 0.4)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '16px',
              letterSpacing: '1px',
              boxShadow: '0 4px 20px rgba(255, 153, 51, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              marginBottom: '15px',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(255, 153, 51, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.background = 'rgba(255, 153, 51, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 153, 51, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(255, 153, 51, 0.2)';
            }}
          >
            🧭 CALCULATE
          </button>

          {/* Data Management Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
            <button
              onClick={exportData}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(91, 192, 222, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                color: '#ffffff',
                border: '1px solid rgba(91, 192, 222, 0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
              title="Download your data as a file"
            >
              💾 Export
            </button>
            
            <label
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(92, 184, 92, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                color: '#ffffff',
                border: '1px solid rgba(92, 184, 92, 0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                textAlign: 'center',
                display: 'block',
                boxSizing: 'border-box'
              }}
              title="Import data from a file"
            >
              🔁 Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: 'none' }}
              />
            </label>
            
            <button
              onClick={clearAllData}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(217, 83, 79, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                color: '#ffffff',
                border: '1px solid rgba(217, 83, 79, 0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
              title="Clear all data and start fresh"
            >
              🗑️ Clear
            </button>
          </div>
          
          {importSuccessMsg && (
            <div style={{
              padding: '10px 14px', borderRadius: '6px', marginBottom: '10px',
              background: importSuccessMsg.startsWith('✅') ? 'rgba(92,184,92,0.15)' : 'rgba(217,83,79,0.15)',
              border: `1px solid ${importSuccessMsg.startsWith('✅') ? 'rgba(92,184,92,0.4)' : 'rgba(217,83,79,0.4)'}`,
              color: '#fff', fontSize: '13px', fontWeight: '500', textAlign: 'center'
            }}>
              {importSuccessMsg}
            </div>
          )}

          {showClearConfirm && (
            <div style={{
              padding: '14px', borderRadius: '6px', marginBottom: '10px',
              background: 'rgba(217,83,79,0.15)', border: '1px solid rgba(217,83,79,0.4)',
              fontSize: '13px', color: '#fff'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '10px' }}>⚠️ Clear all data? This cannot be undone.</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={confirmClearData} style={{ flex: 1, padding: '8px', background: 'rgba(217,83,79,0.4)', border: '1px solid rgba(217,83,79,0.6)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Yes, Clear Everything</button>
                <button onClick={() => setShowClearConfirm(false)} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ 
            fontSize: '11px', 
            color: '#999', 
            textAlign: 'center',
            fontStyle: 'italic',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            💡 Your data is auto-saved in your browser. Use Export to back up across devices.
          </div>

          {/* Reset to Demo Data Button */}
          <button
            onClick={resetToDemo}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '14px',
              background: 'rgba(255, 153, 51, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 153, 51, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '15px',
              boxShadow: '0 4px 15px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 153, 51, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(255, 153, 51, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 153, 51, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.background = 'rgba(255, 153, 51, 0.15)';
            }}
            title="Reset all fields to demo data"
          >
            🔄 Reset to Demo Data
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px',
              background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px', color: '#ffffff',
              cursor: 'pointer', fontWeight: '600', fontSize: '13px',
              marginTop: '8px'
            }}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

        </div>

        {/* Right Panel - Results */}
        <div style={{
          flex: 1, background: 'transparent',
          overflowY: 'auto',
          padding: '30px'
        }}>
          
          {!hasCalculated ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#999'
            }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ marginBottom: '30px' }}>
                <rect x="20" y="60" width="25" height="50" fill="#00aa00" />
                <rect x="50" y="40" width="25" height="70" fill="#cc0000" />
                <rect x="80" y="20" width="25" height="90" fill="#0066cc" />
              </svg>
              <h2 style={{ fontSize: '28px', fontWeight: '300', marginBottom: '10px', color: '#aaa' }}>
                Ready to Navigate
              </h2>
              <p style={{ fontSize: '16px', color: '#bbb' }}>
                Click Calculate to see your projections
              </p>
            </div>
          ) : (
            <>
              {/* Main View Toggle - Retirement vs Rental */}
              <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setRentalView(false)}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: !rentalView 
                      ? 'rgba(255, 153, 51, 0.25)'
                      : 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    color: '#ffffff',
                    border: !rentalView 
                      ? '2px solid rgba(255, 153, 51, 0.6)'
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '15px',
                    boxShadow: !rentalView
                      ? '0 4px 15px rgba(255, 153, 51, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📊 RETIREMENT
                </button>
                <button
                  onClick={() => setRentalView(true)}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: rentalView 
                      ? 'rgba(255, 153, 51, 0.25)'
                      : 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    color: '#ffffff',
                    border: rentalView 
                      ? '2px solid rgba(255, 153, 51, 0.6)'
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '15px',
                    boxShadow: rentalView
                      ? '0 4px 15px rgba(255, 153, 51, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🏠 RENTAL
                </button>
              </div>

              {/* Will I Be Okay Button */}
              {!rentalView && (
                <button
                  onClick={() => setShowWillIOkay(true)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, rgba(92,184,92,0.25), rgba(92,184,92,0.12))',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    color: '#ffffff', border: '2px solid rgba(92,184,92,0.5)',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: '700',
                    fontSize: '15px', marginBottom: '16px',
                    boxShadow: '0 4px 15px rgba(92,184,92,0.2)',
                    letterSpacing: '0.5px'
                  }}
                >
                  💚 Will I Be Okay?
                </button>
              )}

              {!rentalView ? (
                <>
                  {/* View Toggle */}
                  <div style={{ marginBottom: '25px', display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setViewMode('table')}
                      style={{
                        padding: '12px 24px',
                        background: viewMode === 'table' 
                          ? 'rgba(255, 153, 51, 0.25)'
                          : 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        color: '#ffffff',
                        border: viewMode === 'table'
                          ? '2px solid rgba(255, 153, 51, 0.6)'
                          : '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        boxShadow: viewMode === 'table'
                          ? '0 4px 15px rgba(255, 153, 51, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      TABLE VIEW
                    </button>
                    <button
                      onClick={() => setViewMode('chart')}
                      style={{
                        padding: '12px 24px',
                        background: viewMode === 'chart' 
                          ? 'rgba(255, 153, 51, 0.25)'
                          : 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        color: '#ffffff',
                        border: viewMode === 'chart'
                          ? '2px solid rgba(255, 153, 51, 0.6)'
                          : '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        boxShadow: viewMode === 'chart'
                          ? '0 4px 15px rgba(255, 153, 51, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      CHART VIEW
                    </button>
                    <button
                      onClick={() => setViewMode('monte')}
                      style={{
                        padding: '12px 24px',
                        background: viewMode === 'monte' 
                          ? 'rgba(204, 153, 204, 0.25)'
                          : 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        color: '#ffffff',
                        border: viewMode === 'monte'
                          ? '2px solid rgba(204, 153, 204, 0.6)'
                          : '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        boxShadow: viewMode === 'monte'
                          ? '0 4px 15px rgba(204, 153, 204, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🎲 MONTE CARLO
                    </button>
                  </div>

              {viewMode === 'monte' ? (
                /* ─── MONTE CARLO VIEW ─── */
                <div>
                  {/* Monte Carlo Explanation */}
                  <div style={{ background: 'rgba(91, 192, 222, 0.1)', border: '1px solid rgba(91, 192, 222, 0.3)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#5bc0de', fontSize: '16px', fontWeight: '700' }}>📚 What is Monte Carlo Simulation?</h3>
                    <p style={{ margin: '0 0 12px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                      A Monte Carlo simulation runs <strong>thousands of "what-if" scenarios</strong> to test how your retirement plan holds up under different market conditions.
                    </p>
                    <p style={{ margin: '0 0 12px 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                      Instead of assuming the market returns exactly {tspGrowthRate}% every year (which never happens in real life), we simulate 5,000 different futures where:
                    </p>
                    <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.6' }}>
                      <li>Some years the market is up 20%</li>
                      <li>Some years it's down 15%</li>
                      <li>Most years it's somewhere in between</li>
                      <li>The sequence of good and bad years is randomized (this matters!)</li>
                    </ul>
                    <p style={{ margin: '0', color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                      <strong>Why this matters:</strong> If you retire right before a market crash (2008, 2022), you're forced to sell shares when they're down, which permanently reduces your portfolio. Monte Carlo shows you the <em>probability</em> your plan survives both good and bad market timing.
                    </p>
                  </div>

                  {/* Settings Bar */}
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(204,153,204,0.3)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#CC99CC', fontSize: '16px', fontWeight: '700' }}>🎲 Monte Carlo Simulation Settings</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'end' }}>
                      <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>Portfolio Risk Profile</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {Object.entries(riskProfiles).map(([key, profile]) => (
                            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: mcRiskProfile === key ? profile.color : 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                              <input type="radio" name="riskProfile" value={key} checked={mcRiskProfile === key}
                                onChange={() => { setMcRiskProfile(key); setMcStdDevOverride(null); }}
                                style={{ accentColor: profile.color }} />
                              <span>{profile.label}</span>
                              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>σ={profile.stdDev}%</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>Custom Std Dev (optional)</label>
                        <input type="number" step="0.5" min="1" max="40"
                          value={mcStdDevOverride ?? ''}
                          onChange={(e) => setMcStdDevOverride(e.target.value ? Number(e.target.value) : null)}
                          placeholder={`Auto: ${riskProfiles[mcRiskProfile].stdDev}%`}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#fff', fontSize: '13px' }} />
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Override the automatic σ for this simulation</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>Simulation: 5,000 runs</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Using log-normal return distribution<br/>Mean: {tspGrowthRate}% | σ: {mcStdDevOverride ?? riskProfiles[mcRiskProfile].stdDev}%</div>
                        {/* What's being simulated summary */}
                        <div style={{ background: 'rgba(204,153,204,0.08)', border: '1px solid rgba(204,153,204,0.25)', borderRadius: '6px', padding: '10px', marginBottom: '12px', fontSize: '11px' }}>
                          <div style={{ color: 'rgba(204,153,204,0.9)', fontWeight: '700', marginBottom: '6px' }}>📊 Simulating these assets:</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', marginBottom: '3px' }}>
                            <span>TSP</span><span style={{ color: '#5bc0de' }}>${tspBalance.toLocaleString()}</span>
                          </div>
                          {otherAccounts.map((acc, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', marginBottom: '3px' }}>
                              <span>{acc.name}</span><span style={{ color: acc.color }}>${acc.balance.toLocaleString()}</span>
                            </div>
                          ))}
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '6px', paddingTop: '6px', fontWeight: '700', color: '#fff' }}>
                            <span>Total</span>
                            <span style={{ color: '#28a745' }}>${(tspBalance + otherAccounts.reduce((s, a) => s + a.balance, 0)).toLocaleString()}</span>
                          </div>
                        </div>
                        <button onClick={runMonteCarlo} disabled={monteCarloRunning}
                          style={{ width: '100%', padding: '12px 12px 8px 12px', background: monteCarloRunning ? 'rgba(204,153,204,0.3)' : 'linear-gradient(135deg, rgba(204,153,204,0.8), rgba(204,153,204,0.5))', color: '#fff', border: 'none', borderRadius: '6px', cursor: monteCarloRunning ? 'wait' : 'pointer', fontWeight: '700', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                          <span>{monteCarloRunning ? '⏳ Running...' : '🎲 Test Your Plan'}</span>
                          <span style={{ fontSize: '10px', fontWeight: '400', opacity: '0.7' }}>{monteCarloRunning ? '5,000 scenarios' : 'Monte Carlo Simulation'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {!monteCarloResults && !monteCarloRunning && (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎲</div>
                      <div style={{ fontSize: '18px', marginBottom: '12px', color: 'rgba(255,255,255,0.6)' }}>Ready to Test Your Plan</div>
                      <div style={{ fontSize: '13px', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
                        Click <strong>"Run Simulation"</strong> above to see how your retirement plan performs across 5,000 different market scenarios.
                        <br/><br/>
                        <strong style={{ color: '#5bc0de' }}>💡 Tip:</strong> Make sure you've clicked <strong>Calculate</strong> first to set your baseline projection.
                      </div>
                    </div>
                  )}

                  {monteCarloResults && (() => {
                    const mc = monteCarloResults;
                    const scoreColor = getScoreColor(mc.probabilityScore);
                    const scoreLabel = getScoreLabel(mc.probabilityScore);
                    
                    return (
                      <div>
                        {/* Hero Score Card */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                          {/* Main Probability Gauge */}
                          <div style={{ gridColumn: '1 / 2', background: `linear-gradient(135deg, ${scoreColor}22, ${scoreColor}11)`, border: `2px solid ${scoreColor}`, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>Success Rate</div>
                            <div style={{ fontSize: '56px', fontWeight: '900', color: scoreColor, lineHeight: 1, marginBottom: '4px' }}>{mc.probabilityScore}%</div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: scoreColor, marginBottom: '8px' }}>{scoreLabel}</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', fontWeight: '500' }}>
                              Money lasts to age {mc.lifeExpAge}
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', lineHeight: '1.4' }}>
                              {mc.probabilityScore}% of scenarios succeeded
                            </div>
                            {/* Mini gauge bar */}
                            <div style={{ marginTop: '12px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${mc.probabilityScore}%`, background: scoreColor, borderRadius: '4px', transition: 'width 1s ease' }} />
                            </div>
                          </div>

                          {/* Supporting stats */}
                          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Money Lasts to {mc.lifeExpAge + 5}</div>
                            <div style={{ fontSize: '36px', fontWeight: '800', color: getScoreColor(mc.probabilityPlus5) }}>{mc.probabilityPlus5}%</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Success rate (life exp. +5)</div>
                          </div>

                          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Money Lasts to {mc.lifeExpAge + 10}</div>
                            <div style={{ fontSize: '36px', fontWeight: '800', color: getScoreColor(mc.probabilityPlus10) }}>{mc.probabilityPlus10}%</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Success rate (life exp. +10)</div>
                          </div>

                          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Money Lasts to 100</div>
                            <div style={{ fontSize: '36px', fontWeight: '800', color: getScoreColor(mc.probabilityTo100 || 0) }}>{mc.probabilityTo100 || 0}%</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Success rate (age 100)</div>
                          </div>
                        </div>

                        {/* Explanation panel */}
                        <div style={{ background: 'rgba(91, 192, 222, 0.08)', border: '1px solid rgba(91, 192, 222, 0.2)', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                            <strong style={{ color: '#5bc0de' }}>💡 How to read these numbers:</strong>
                            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: 'rgba(255,255,255,0.7)' }}>
                              <li><strong>Success Rate:</strong> {mc.probabilityScore}% of the 5,000 scenarios had money remaining at age {mc.lifeExpAge}</li>
                              <li><strong>Extended Success:</strong> {mc.probabilityPlus5}% made it to age {mc.lifeExpAge + 5}, {mc.probabilityPlus10}% made it to age {mc.lifeExpAge + 10}, and {mc.probabilityTo100}% made it to age 100</li>
                              <li><strong>Key insight:</strong> These percentages show how likely your plan is to succeed under different market conditions and lifespans</li>
                            </ul>
                          </div>
                        </div>

                        {/* Score interpretation bar */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Score guide:</span>
                          {[['≥90%', '#28a745', 'Excellent'], ['80–89%', '#5cb85c', 'Strong'], ['70–79%', '#FF9933', 'Moderate'], ['60–69%', '#fd7e14', 'Caution'], ['<60%', '#dc3545', 'At Risk']].map(([range, color, label]) => (
                            <div key={range} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{range} {label}</span>
                            </div>
                          ))}
                          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                            {mc.numSims.toLocaleString()} simulations · σ={mc.stdDev}% · {riskProfiles[mc.riskProfile]?.label ?? 'Custom'}
                          </span>
                        </div>

                        {/* Fan Chart */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '700' }}>📊 TSP Balance — Probability Fan Chart</h3>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
                              {[['rgba(40,167,69,0.25)', 'rgba(40,167,69,0.7)', '10th–90th %ile (outer)'],
                                ['rgba(255,153,51,0.3)', 'rgba(255,153,51,0.8)', '25th–75th %ile (inner)'],
                                ['#fff', '#fff', 'Median (50th)']].map(([bg, border, label]) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <div style={{ width: '14px', height: '4px', background: border, borderRadius: '2px' }} />
                                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <ResponsiveContainer width="100%" height={360}>
                            <ComposedChart data={mc.chartData}>
                              <defs>
                                <linearGradient id="outerBand" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#28a745" stopOpacity={0.15}/>
                                  <stop offset="95%" stopColor="#28a745" stopOpacity={0.05}/>
                                </linearGradient>
                                <linearGradient id="innerBand" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#FF9933" stopOpacity={0.25}/>
                                  <stop offset="95%" stopColor="#FF9933" stopOpacity={0.1}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                              <XAxis dataKey="age" stroke="rgba(255,255,255,0.4)" style={{ fontSize: '11px' }}
                                label={{ value: 'Age', position: 'insideBottom', offset: -2, fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                              <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: '11px' }} domain={[() => 0, () => 5000000]}
                                tickFormatter={v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`} />
                              <Tooltip
                                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,153,51,0.3)', borderRadius: '8px', fontSize: '12px' }}
                                labelStyle={{ color: '#FF9933', fontWeight: '700' }}
                                labelFormatter={v => `Age ${v}`}
                                formatter={(value, name) => [formatCurrency(value), name]}
                              />
                              {/* Life expectancy reference line */}
                              <ReferenceLine x={mc.lifeExpAge} stroke="rgba(204,153,204,0.6)" strokeDasharray="6 3"
                                label={{ value: `Life exp. ${mc.lifeExpAge}`, position: 'top', fill: '#CC99CC', fontSize: 10 }} />
                              {/* Outer band (10–90) */}
                              <Area type="monotone" dataKey="pct90" stroke="rgba(40,167,69,0.4)" fill="url(#outerBand)" name="90th %ile" strokeWidth={1} />
                              <Area type="monotone" dataKey="pct10" stroke="rgba(40,167,69,0.4)" fill="#1a1a2e" name="10th %ile" strokeWidth={1} />
                              {/* Inner band (25–75) */}
                              <Area type="monotone" dataKey="pct75" stroke="rgba(255,153,51,0.5)" fill="url(#innerBand)" name="75th %ile" strokeWidth={1} />
                              <Area type="monotone" dataKey="pct25" stroke="rgba(255,153,51,0.5)" fill="#1a1a2e" name="25th %ile" strokeWidth={1} />
                              {/* Median line */}
                              <Line type="monotone" dataKey="pct50" stroke="#ffffff" strokeWidth={2.5} name="Median" dot={false} />
                            </ComposedChart>
                          </ResponsiveContainer>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: '8px', fontStyle: 'italic' }}>
                            Green outer band = 80% of outcomes (10th–90th percentile) · Orange inner band = middle 50% (25th–75th) · White line = median
                          </div>
                        </div>

                        {/* Key Age Summary Table */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
                          <h3 style={{ margin: '0 0 16px 0', color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '700' }}>📋 TSP Balance at Key Ages</h3>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid rgba(255,153,51,0.4)' }}>
                                {['Age', 'Year', '10th %ile', '25th %ile', 'Median', '75th %ile', '90th %ile', '% Surviving'].map(h => (
                                  <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Age' || h === 'Year' ? 'left' : 'right', color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {mc.keyAgeSummary.map((row, idx) => {
                                const isLifeExp = row.age === mc.lifeExpAge;
                                const survColor = getScoreColor(row.survivalRate);
                                return (
                                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: isLifeExp ? 'rgba(204,153,204,0.08)' : 'transparent' }}>
                                    <td style={{ padding: '12px', fontWeight: isLifeExp ? '700' : '400' }}>
                                      {row.age} {isLifeExp && <span style={{ fontSize: '10px', color: '#CC99CC', marginLeft: '4px' }}>← life exp.</span>}
                                    </td>
                                    <td style={{ padding: '12px', color: 'rgba(255,255,255,0.5)' }}>{row.year}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: '#dc3545' }}>{formatCurrency(row.pct10)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: '#FF9933' }}>{formatCurrency(row.pct25)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: '#fff', fontWeight: '600' }}>{formatCurrency(row.pct50)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: '#5bc0de' }}>{formatCurrency(row.pct75)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: '#28a745' }}>{formatCurrency(row.pct90)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                      <span style={{ background: `${survColor}22`, color: survColor, padding: '3px 8px', borderRadius: '12px', fontWeight: '700', fontSize: '12px' }}>
                                        {row.survivalRate}%
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Methodology note */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.7' }}>
                          <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Methodology:</strong> {mc.numSims.toLocaleString()} independent simulations using log-normal annual returns with mean {tspGrowthRate}% and σ={mc.stdDev}% (based on historical {riskProfiles[mc.riskProfile]?.label ?? 'custom'} portfolio data).
                          Each year's return is independently sampled — sequence-of-returns risk is captured. FERS pension, SRS, and Social Security are treated as deterministic (fixed with COLA); only TSP portfolio returns are randomized.
                          This simulation is for educational purposes and does not constitute financial advice.
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : viewMode === 'table' ? (
                <div style={{ 
                  overflowX: 'auto', 
                  background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <table style={{
                    width: '100%', boxSizing: 'border-box',
                    borderCollapse: 'collapse',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '12px',
                    tableLayout: 'auto'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(255, 153, 51, 0.15)', borderBottom: '2px solid #FF9933' }}>
                        <th style={{ padding: '10px 6px', textAlign: 'left', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Year</th>
                        <th style={{ padding: '10px 6px', textAlign: 'left', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Age</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>FERS (Net)</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Deductions</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>SRS</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Soc Sec</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>TSP W/D</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Add'l Income</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Est. Taxes</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Est. TSP Taxes</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Budget</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Expenses</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Total Income</th>
                        <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>TSP Balance</th>
                        {otherAccounts.length > 0 && <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Other Accts</th>}
                        {(rentalMonthlyNet !== 0 || rentalSaleYear > 0) && <th style={{ padding: '10px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', fontSize: '12px' }}>Rental Net</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {projections.map((proj, idx) => (
                        <React.Fragment key={idx}>
                          {/* Main Row - clickable */}
                          <tr 
                            onClick={() => toggleRowExpansion(proj.year)}
                            style={{
                              backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                              borderBottom: '1px solid rgba(255,255,255,0.08)',
                              cursor: 'pointer'
                            }}
                          >
                            <td style={{ padding: '8px 6px', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>
                              {expandedRows.has(proj.year) ? '▼' : '▶'} {proj.year}
                            </td>
                            <td style={{ padding: '8px 6px', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{proj.age}</td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>
                              {formatCurrency(proj.fers)}
                            </td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: '#dc3545', whiteSpace: 'nowrap' }}>
                              {formatCurrency(proj.deductions)}
                            </td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{formatCurrency(proj.srs)}</td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{formatCurrency(proj.ss)}</td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{formatCurrency(proj.tspWithdrawal)}</td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: '#28a745', whiteSpace: 'nowrap' }}>{formatCurrency(proj.additionalIncome)}</td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: '#dc3545', whiteSpace: 'nowrap' }}>{formatCurrency(proj.estimatedTaxes)}</td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: '#dc3545', whiteSpace: 'nowrap' }}>{formatCurrency(proj.estimatedTspTaxes)}</td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>
                              {formatCurrency(proj.budget)}
                            </td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{formatCurrency(proj.expenses)}</td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{formatCurrency(proj.totalIncome)}</td>
                            <td style={{ padding: '8px 6px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>{formatCurrency(proj.tspBalance)}</td>
                            {otherAccounts.length > 0 && (
                              <td style={{ padding: '8px 6px', textAlign: 'right', color: '#5cb85c', whiteSpace: 'nowrap' }}>
                                {formatCurrency((proj.otherAccountsBalances || []).reduce((s, b) => s + b, 0))}
                              </td>
                            )}
                            {(rentalMonthlyNet !== 0 || rentalSaleYear > 0) && (
                              <td style={{ padding: '8px 6px', textAlign: 'right', whiteSpace: 'nowrap', color: proj.rentalSaleProceeds > 0 ? '#28a745' : proj.rentalNet < 0 ? '#dc3545' : 'rgba(255,255,255,0.9)' }}>
                                {proj.rentalSaleProceeds > 0 ? `+${formatCurrency(proj.rentalSaleProceeds)} 🏠` : formatCurrency(proj.rentalNet)}
                              </td>
                            )}
                          </tr>
                          
                          {/* Expanded Row Details */}
                          {expandedRows.has(proj.year) && (
                            <tr style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                              <td colSpan="14" style={{ padding: '15px 20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                  {/* Income Details */}
                                  <div>
                                    <h4 style={{ margin: '0 0 10px 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '600' }}>
                                      📊 Income Details
                                    </h4>
                                    <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>FERS (Gross):</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.fersGross)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>FERS (Net):</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.fers)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>SRS:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.srs)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Social Security:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.ss)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>TSP Withdrawal:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.tspWithdrawal)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Additional Income:</span>
                                        <span style={{ fontWeight: '600', color: '#28a745' }}>{formatCurrency(proj.additionalIncome)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Deduction Details */}
                                  <div>
                                    <h4 style={{ margin: '0 0 10px 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '600' }}>
                                      💳 Deduction Details
                                    </h4>
                                    <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Health Insurance:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.deductionDetails.health)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Life Insurance:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.deductionDetails.life)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Dental Insurance:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.deductionDetails.dental)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '5px', marginTop: '5px' }}>
                                        <span>Total:</span>
                                        <span style={{ fontWeight: '600', color: '#dc3545' }}>{formatCurrency(proj.deductions)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Budget Details */}
                                  <div>
                                    <h4 style={{ margin: '0 0 10px 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '600' }}>
                                      🏠 Budget Details
                                    </h4>
                                    <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Housing:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.budgetDetails.housing)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Food:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.budgetDetails.food)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Transportation:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.budgetDetails.transportation)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Healthcare:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.budgetDetails.healthcare)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Entertainment:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.budgetDetails.entertainment)}</span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Other:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.budgetDetails.other)}</span>
                                      </div>
                                      {proj.expenses > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FF9933' }}>
                                          <span>One-Time Expenses:</span>
                                          <span style={{ fontWeight: '600' }}>{formatCurrency(proj.expenses)}</span>
                                        </div>
                                      )}
                                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '5px', marginTop: '5px' }}>
                                        <span>Total:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.budget + proj.expenses)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  {/* Chart 1: Total Income with Toggles */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3 style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontWeight: '600', fontSize: '16px' }}>Total Income Overview</h3>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={showIncomeStreams.fers} onChange={(e) => setShowIncomeStreams({...showIncomeStreams, fers: e.target.checked})} />
                          FERS
                        </label>
                        <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={showIncomeStreams.srs} onChange={(e) => setShowIncomeStreams({...showIncomeStreams, srs: e.target.checked})} />
                          SRS
                        </label>
                        <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={showIncomeStreams.ss} onChange={(e) => setShowIncomeStreams({...showIncomeStreams, ss: e.target.checked})} />
                          Soc Sec
                        </label>
                        <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={showIncomeStreams.tspWithdrawal} onChange={(e) => setShowIncomeStreams({...showIncomeStreams, tspWithdrawal: e.target.checked})} />
                          TSP W/D
                        </label>
                        {otherAccounts.map((acc, i) => (
                          <label key={i} style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={showIncomeStreams[`otherAccount_${i}`] || false} onChange={(e) => setShowIncomeStreams({...showIncomeStreams, [`otherAccount_${i}`]: e.target.checked})} />
                            {acc.name}
                          </label>
                        ))}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={projections}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="year" stroke="#999" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#999" style={{ fontSize: '12px' }} domain={[() => 0, () => 250000]} />
                        <Tooltip 
                          contentStyle={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', fontSize: '12px' }}
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend wrapperStyle={{ fontSize: '13px' }} />
                        <Line type="monotone" dataKey="totalIncome" stroke="#28a745" strokeWidth={3} name="Total Income" />
                        {showIncomeStreams.fers && <Line type="monotone" dataKey="fers" stroke="#FF9933" name="FERS" strokeWidth={2} />}
                        {showIncomeStreams.srs && <Line type="monotone" dataKey="srs" stroke="#CC99CC" name="SRS" strokeWidth={2} />}
                        {showIncomeStreams.ss && <Line type="monotone" dataKey="ss" stroke="#9999FF" name="Social Security" strokeWidth={2} />}
                        {showIncomeStreams.tspWithdrawal && <Line type="monotone" dataKey="tspWithdrawal" stroke="#5bc0de" name="TSP Withdrawal" strokeWidth={2} />}
                        {otherAccounts.map((acc, i) => showIncomeStreams[`otherAccount_${i}`] && (
                          <Line key={i} type="monotone" dataKey={d => d.otherAccountsWithdrawals?.[i] ?? 0} stroke={acc.color} name={`${acc.name} (withdrawal)`} strokeWidth={2} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Chart 2: Portfolio Balance Over Time */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h3 style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '12px', fontWeight: '600', fontSize: '16px' }}>Portfolio Balance Over Time</h3>
                    {/* Balance toggles */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '15px', fontSize: '13px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>
                        <input type="checkbox" checked={showBalances.tsp !== false} onChange={(e) => setShowBalances({...showBalances, tsp: e.target.checked})} />
                        <span style={{ color: '#5bc0de' }}>■</span> TSP Balance
                      </label>
                      {otherAccounts.map((acc, i) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>
                          <input type="checkbox" checked={showBalances[`acc_${i}`] !== false} onChange={(e) => setShowBalances({...showBalances, [`acc_${i}`]: e.target.checked})} />
                          <span style={{ color: acc.color || '#5cb85c' }}>■</span> {acc.name}
                        </label>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={projections}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="year" stroke="#999" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#999" style={{ fontSize: '12px' }} domain={[() => 0, 'auto']} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
                        <Tooltip 
                          contentStyle={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', fontSize: '12px' }}
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend wrapperStyle={{ fontSize: '13px' }} />
                        {showBalances.tsp !== false && <Line type="monotone" dataKey="tspBalance" stroke="#5bc0de" strokeWidth={3} name="TSP Balance" />}
                        {otherAccounts.map((acc, i) => showBalances[`acc_${i}`] !== false && (
                          <Line key={i} type="monotone" dataKey={d => d.otherAccountsBalances?.[i] ?? 0} stroke={acc.color || '#5cb85c'} strokeWidth={2} name={acc.name} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Chart 3: Expenses Breakdown */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h3 style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '15px', fontWeight: '600', fontSize: '16px' }}>Expenses Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={projections}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="year" stroke="#999" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', fontSize: '12px' }}
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend wrapperStyle={{ fontSize: '13px' }} />
                        <Line type="monotone" dataKey="budget" stroke="#dc3545" name="Budget (Monthly)" strokeWidth={2} />
                        <Line type="monotone" dataKey="expenses" stroke="#ff6b6b" name="Major Expenses" strokeWidth={2} />
                        <Line type="monotone" dataKey={(data) => data.budget + data.expenses} stroke="#8B0000" strokeWidth={3} name="Total Expenses" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Chart 4: Cash Flow Summary */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '15px', fontWeight: '600', fontSize: '16px' }}>Cash Flow Summary</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={projections}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="year" stroke="#999" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', fontSize: '12px' }}
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend wrapperStyle={{ fontSize: '13px' }} />
                        <Line type="monotone" dataKey="totalIncome" stroke="#28a745" strokeWidth={3} name="Total Income" />
                        <Line type="monotone" dataKey={(data) => data.budget + data.expenses + data.estimatedTaxes + data.estimatedTspTaxes} stroke="#dc3545" strokeWidth={3} name="Total Outflows" />
                        <Line type="monotone" dataKey={(data) => data.totalIncome - (data.budget + data.expenses + data.estimatedTaxes + data.estimatedTspTaxes)} stroke="#007bff" strokeWidth={3} name="Net Cash Flow" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              </>
            ) : (
              /* Rental Property Dashboard */
              <div>
                <h2 style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px', fontWeight: '600', fontSize: '20px' }}>
                  🏠 Rental Property Analysis (2025-2027)
                </h2>
                
                {/* Breakeven Target Calculator */}
                <div style={{ 
                  backgroundColor: 'rgba(91, 192, 222, 0.1)', 
                  border: '2px solid rgba(91, 192, 222, 0.5)',
                  borderRadius: '4px',
                  padding: '15px',
                  marginBottom: '25px'
                }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#5bc0de', fontWeight: '600' }}>
                    📊 Breakeven Analysis
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', fontSize: '13px' }}>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', marginBottom: '4px' }}>Fixed Monthly Costs</div>
                      <div style={{ fontWeight: '700', color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
                        {formatCurrency(calculateRentalTargets().fixedCosts)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', marginBottom: '4px' }}>Current Running Total</div>
                      <div style={{ fontWeight: '700', fontSize: '16px', color: calculateRentalTargets().currentRunningTotal >= 0 ? '#28a745' : '#dc3545' }}>
                        {formatCurrency(calculateRentalTargets().currentRunningTotal)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', marginBottom: '4px' }}>Remaining Months</div>
                      <div style={{ fontWeight: '700', color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
                        {calculateRentalTargets().remainingMonths}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', marginBottom: '4px' }}>Target per Month to Break Even</div>
                      <div style={{ fontWeight: '700', color: calculateRentalTargets().targetPerMonth > 0 ? '#ff9933' : '#28a745', fontSize: '16px' }}>
                        {calculateRentalTargets().targetPerMonth > 0 
                          ? formatCurrency(calculateRentalTargets().targetPerMonth)
                          : "Already profitable! 🎉"}
                      </div>
                    </div>
                  </div>
                  {calculateRentalTargets().targetPerMonth > 0 && (
                    <div style={{ marginTop: '10px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>
                      💡 To break even by end of 2027, you need to average {formatCurrency(calculateRentalTargets().targetPerMonth)}/month for the remaining {calculateRentalTargets().remainingMonths} months.
                    </div>
                  )}
                </div>
                
                {/* Monthly Table */}
                <div style={{ 
                  overflowX: 'auto', 
                  background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  marginBottom: '30px'
                }}>
                  <table style={{
                    width: '100%', boxSizing: 'border-box',
                    borderCollapse: 'collapse',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '12px'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(255, 153, 51, 0.15)', borderBottom: '2px solid #FF9933' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Month</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Income</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>PM Fee</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Utilities</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Total Expenses</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Net</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Running Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculateRentalProperty().map((row, idx) => (
                        <tr key={idx} style={{
                          backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                          borderBottom: '1px solid rgba(255,255,255,0.08)'
                        }}>
                          <td style={{ padding: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: row.monthIndex === 0 ? '600' : 'normal' }}>{row.month}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: '#28a745' }}>{formatCurrency(row.income)}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: '#dc3545' }}>{formatCurrency(row.pmFee)}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.7)' }}>{formatCurrency(row.utilities)}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: '#dc3545' }}>{formatCurrency(row.totalExpenses)}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: row.netIncome >= 0 ? '#28a745' : '#dc3545', fontWeight: '600' }}>
                            {formatCurrency(row.netIncome)}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'right', color: row.runningTotal >= 0 ? '#28a745' : '#dc3545', fontWeight: '600' }}>
                            {formatCurrency(row.runningTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bar Chart */}
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                  <h3 style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '15px', fontWeight: '600', fontSize: '16px' }}>Monthly Cash Flow</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={calculateRentalProperty()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                      <XAxis dataKey="month" stroke="#999" style={{ fontSize: '10px' }} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', fontSize: '12px' }}
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Legend wrapperStyle={{ fontSize: '13px' }} />
                      {/* Breakeven line - shows fixed monthly costs */}
                      <Line 
                        type="monotone" 
                        dataKey={() => rentalMortgage + rentalPropertyTax + rentalInsurance + rentalHOA + rentalInternet + rentalMaintenance + rentalLandscaping + rentalPestControl + rentalOther} 
                        stroke="#999" 
                        strokeDasharray="5 5"
                        name="Fixed Costs (Breakeven)" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line type="monotone" dataKey="income" stroke="#28a745" name="Income" strokeWidth={2} />
                      <Line type="monotone" dataKey="totalExpenses" stroke="#dc3545" name="Total Expenses" strokeWidth={2} />
                      <Line type="monotone" dataKey="runningTotal" stroke="#007bff" name="Running Total" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>Total Income (3 years)</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#28a745' }}>
                      {formatCurrency(calculateRentalProperty().reduce((sum, row) => sum + row.income, 0))}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>Total Expenses (3 years)</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#dc3545' }}>
                      {formatCurrency(calculateRentalProperty().reduce((sum, row) => sum + row.totalExpenses, 0))}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '15px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>Net Profit/Loss (3 years)</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: calculateRentalProperty()[calculateRentalProperty().length - 1].runningTotal >= 0 ? '#28a745' : '#dc3545' }}>
                      {formatCurrency(calculateRentalProperty()[calculateRentalProperty().length - 1].runningTotal)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default BearingApp;
