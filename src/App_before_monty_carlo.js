import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BearingApp = () => {
  // Person 1 (primary) - Demo data defaults
  const [person1Enabled, setPerson1Enabled] = useState(true); // Always enabled
  const [dob, setDob] = useState('04/29/1964');
  const [person1Sex, setPerson1Sex] = useState('male'); // For actuarial tables
  const [person1LifeExpectancy, setPerson1LifeExpectancy] = useState(82);
  const [isMonthly, setIsMonthly] = useState(true);
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
  const [person2FersCola, setPerson2FersCola] = useState(2.6);
  const [person2SrsCola, setPerson2SrsCola] = useState(2.6);
  const [person2SsCola, setPerson2SsCola] = useState(2.6);
  const [fersSurvivorRate, setFersSurvivorRate] = useState(50); // Survivor gets 50% of FERS
  
  const [tspBalance, setTspBalance] = useState(1000000);
  const [tspGrowthRate, setTspGrowthRate] = useState(6.5);
  const [tspWithdrawalType, setTspWithdrawalType] = useState('amount');
  const [tspWithdrawalAmount, setTspWithdrawalAmount] = useState(3000);
  const [tspWithdrawalPercent, setTspWithdrawalPercent] = useState(4.0);
  const [tspWithdrawalCola, setTspWithdrawalCola] = useState(2.6);
  const [tspCoverTaxes, setTspCoverTaxes] = useState(true);
  
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
  
  const [hasCalculated, setHasCalculated] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [taxBracket, setTaxBracket] = useState(22);
  const [federalWithheld, setFederalWithheld] = useState(683);
  
  // Track expanded rows and cells
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  const [openSections, setOpenSections] = useState({
    income: false,
    accounts: false,
    additional: false,
    expenses: false,
    budget: false,
    taxes: false,
    settings: false,
    rental: false
  });

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
    const fullAge = 67;
    
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
      setDob('04/29/1964');
      setIsMonthly(true);
      setFersAmount(6500);
      setSrsAmount(1360);
      setSsAmount(2795);
      setFersCola(2.6);
      setSrsCola(2.6);
      setSsCola(2.6);
      setProjectionYears(40);
      setTspBalance(1000000);
      setTspGrowthRate(6.5);
      setTspWithdrawalType('amount');
      setTspWithdrawalAmount(3000);
      setTspWithdrawalPercent(4.0);
      setTspWithdrawalCola(2.6);
      setTspCoverTaxes(true);
      setHealthInsurance(550);
      setLifeInsurance(65);
      setDentalInsurance(53);
      setBudgetHousing(2000);
      setBudgetFood(500);
      setBudgetTransportation(500);
      setBudgetHealthcare(250);
      setBudgetEntertainment(500);
      setBudgetOther(491);
      setInflationRate(2.6);
      setExpenses([]);
      setTaxBracket(22);
      setFederalWithheld(683);
      setBudgetMode({
        housing: 'simple',
        food: 'simple',
        transportation: 'simple',
        healthcare: 'simple',
        entertainment: 'simple',
        other: 'simple'
      });
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
        tspWithdrawalType: 'amount',
        tspWithdrawalAmount: 3000,
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

  // Auto-save to localStorage whenever inputs change
  React.useEffect(() => {
    const dataToSave = {
      dob,
      isMonthly,
      fersAmount,
      srsAmount,
      ssAmount,
      fersCola,
      srsCola,
      ssCola,
      projectionYears,
      tspBalance,
      tspGrowthRate,
      tspWithdrawalType,
      tspWithdrawalAmount,
      tspWithdrawalPercent,
      tspWithdrawalCola,
      tspCoverTaxes,
      healthInsurance,
      lifeInsurance,
      dentalInsurance,
      budgetHousing,
      budgetFood,
      budgetTransportation,
      budgetHealthcare,
      budgetEntertainment,
      budgetOther,
      inflationRate,
      expenses,
      taxBracket,
      federalWithheld
    };
    localStorage.setItem('bearingData', JSON.stringify(dataToSave));
  }, [dob, isMonthly, fersAmount, srsAmount, ssAmount, fersCola, srsCola, ssCola, projectionYears,
      tspBalance, tspGrowthRate, tspWithdrawalType, tspWithdrawalAmount, tspWithdrawalPercent,
      tspWithdrawalCola, tspCoverTaxes, healthInsurance, lifeInsurance, dentalInsurance,
      budgetHousing, budgetFood, budgetTransportation, budgetHealthcare, budgetEntertainment,
      budgetOther, inflationRate, expenses, taxBracket, federalWithheld]);

  // Load data from localStorage on mount
  React.useEffect(() => {
    const savedData = localStorage.getItem('bearingData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setDob(data.dob || '04/29/1964');
        setIsMonthly(data.isMonthly ?? true);
        setFersAmount(data.fersAmount || 0);
        setSrsAmount(data.srsAmount || 0);
        setSsAmount(data.ssAmount || 0);
        setFersCola(data.fersCola || 2.6);
        setSrsCola(data.srsCola || 2.6);
        setSsCola(data.ssCola || 2.6);
        setProjectionYears(data.projectionYears || 40);
        setTspBalance(data.tspBalance || 0);
        setTspGrowthRate(data.tspGrowthRate || 7.0);
        setTspWithdrawalType(data.tspWithdrawalType || 'amount');
        setTspWithdrawalAmount(data.tspWithdrawalAmount || 0);
        setTspWithdrawalPercent(data.tspWithdrawalPercent || 4.0);
        setTspWithdrawalCola(data.tspWithdrawalCola || 2.6);
        setTspCoverTaxes(data.tspCoverTaxes || false);
        setHealthInsurance(data.healthInsurance || 0);
        setLifeInsurance(data.lifeInsurance || 0);
        setDentalInsurance(data.dentalInsurance || 0);
        setBudgetHousing(data.budgetHousing || 0);
        setBudgetFood(data.budgetFood || 0);
        setBudgetTransportation(data.budgetTransportation || 0);
        setBudgetHealthcare(data.budgetHealthcare || 0);
        setBudgetEntertainment(data.budgetEntertainment || 0);
        setBudgetOther(data.budgetOther || 0);
        setInflationRate(data.inflationRate || 2.6);
        setExpenses(data.expenses || []);
        setTaxBracket(data.taxBracket || 22);
        setFederalWithheld(data.federalWithheld || 0);
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []); // Empty dependency array - only run on mount

  const exportData = () => {
    const dataToExport = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: {
        dob,
        isMonthly,
        fersAmount,
        srsAmount,
        ssAmount,
        fersCola,
        srsCola,
        ssCola,
        projectionYears,
        tspBalance,
        tspGrowthRate,
        tspWithdrawalType,
        tspWithdrawalAmount,
        tspWithdrawalPercent,
        tspWithdrawalCola,
        tspCoverTaxes,
        healthInsurance,
        lifeInsurance,
        dentalInsurance,
        budgetHousing,
        budgetFood,
        budgetTransportation,
        budgetHealthcare,
        budgetEntertainment,
        budgetOther,
        inflationRate,
        expenses,
        taxBracket,
        federalWithheld
      }
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bearing-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        const data = imported.data;
        
        setDob(data.dob || '04/29/1964');
        setIsMonthly(data.isMonthly ?? true);
        setFersAmount(data.fersAmount || 0);
        setSrsAmount(data.srsAmount || 0);
        setSsAmount(data.ssAmount || 0);
        setFersCola(data.fersCola || 2.6);
        setSrsCola(data.srsCola || 2.6);
        setSsCola(data.ssCola || 2.6);
        setProjectionYears(data.projectionYears || 40);
        setTspBalance(data.tspBalance || 0);
        setTspGrowthRate(data.tspGrowthRate || 7.0);
        setTspWithdrawalType(data.tspWithdrawalType || 'amount');
        setTspWithdrawalAmount(data.tspWithdrawalAmount || 0);
        setTspWithdrawalPercent(data.tspWithdrawalPercent || 4.0);
        setTspWithdrawalCola(data.tspWithdrawalCola || 2.6);
        setTspCoverTaxes(data.tspCoverTaxes || false);
        setHealthInsurance(data.healthInsurance || 0);
        setLifeInsurance(data.lifeInsurance || 0);
        setDentalInsurance(data.dentalInsurance || 0);
        setBudgetHousing(data.budgetHousing || 0);
        setBudgetFood(data.budgetFood || 0);
        setBudgetTransportation(data.budgetTransportation || 0);
        setBudgetHealthcare(data.budgetHealthcare || 0);
        setBudgetEntertainment(data.budgetEntertainment || 0);
        setBudgetOther(data.budgetOther || 0);
        setInflationRate(data.inflationRate || 2.6);
        setExpenses(data.expenses || []);
        setTaxBracket(data.taxBracket || 22);
        setFederalWithheld(data.federalWithheld || 0);
        
        alert('Data imported successfully!');
      } catch (e) {
        alert('Error importing data. Please make sure the file is valid.');
        console.error('Import error:', e);
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('bearingData');
      window.location.reload();
    }
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

  const calculateAge = (dobString, year) => {
    const [month, day, birthYear] = dobString.split('/').map(Number);
    return year - birthYear;
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
      if (age > 62) {
        // Full year of SS
        ss = ssAmount * (isMonthly ? 12 : 1) * Math.pow(1 + ssCola / 100, i - (age - 62));
      } else if (age === 62) {
        // Partial year - starts month after birth month
        const monthsOfSS = 12 - birthMonth;
        ss = ssAmount * (isMonthly ? monthsOfSS : (monthsOfSS / 12)) * Math.pow(1 + ssCola / 100, 0);
      }
      
      // TSP calculations
      let tspWithdrawal = 0;
      if (currentTspBalance > 0) {
        if (tspWithdrawalType === 'amount') {
          // If covering taxes, gross up the withdrawal amount
          let baseWithdrawal = currentWithdrawal;
          if (tspCoverTaxes) {
            // Gross-up formula: actualWithdrawal = desiredAmount / (1 - taxRate)
            baseWithdrawal = currentWithdrawal / (1 - taxBracket / 100);
          }
          tspWithdrawal = Math.min(baseWithdrawal, currentTspBalance);
        } else {
          tspWithdrawal = Math.min(currentTspBalance * (tspWithdrawalPercent / 100), currentTspBalance);
        }
        
        // Update balance: growth then withdrawal
        currentTspBalance = currentTspBalance * (1 + tspGrowthRate / 100) - tspWithdrawal;
        currentTspBalance = Math.max(0, currentTspBalance);
        
        // COLA on withdrawal for next year
        if (tspWithdrawalType === 'amount') {
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
      const taxes = calculateTaxes(fers + yearAdditionalIncomeGross, ss, tspWithdrawal);
      
      const totalIncome = fers + srs + ss + tspWithdrawal + yearAdditionalIncomeGross + yearAdditionalIncomeNet;
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
        netIncome: Math.round(totalIncome - yearExpenses)
      });
    }
    
    return projections;
  };

  const projections = hasCalculated ? calculateProjections() : [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      minHeight: '100vh'
    }}>
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
              v2.0.0
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
          
          {/* Income Sources Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('income')}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.8) 0%, rgba(255, 153, 51, 0.6) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.4)',
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
                <span style={{ fontSize: '18px' }}>💰</span>
                Income Sources
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.income ? '▲' : '▼'}</span>
            </div>
            {openSections.income && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                
                {/* Person 1 */}
                <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', border: '2px solid #FF9933', borderRadius: '4px' }}>
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
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
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
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
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
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
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
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
                      background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
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
                        <div style={{ backgroundColor: '#e8f4f8', padding: '8px', borderRadius: '4px', fontSize: '11px', color: '#0066cc', marginBottom: '12px' }}>
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                    ➕ Add Person 2
                  </button>
                ) : (
                  <div style={{ marginBottom: '0', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', border: '2px solid #CC99CC', borderRadius: '4px' }}>
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
                            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.9)',
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
                            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
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
                          <div style={{ backgroundColor: '#e8f4f8', padding: '8px', borderRadius: '4px', fontSize: '11px', color: '#0066cc' }}>
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
                  <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#856404', fontSize: '12px', fontWeight: '600' }}>
                      FERS Survivor Benefit (% of pension)
                    </label>
                    <input
                      type="number"
                      value={fersSurvivorRate}
                      onChange={(e) => setFersSurvivorRate(Number(e.target.value))}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '6px',
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px'
                      }}
                    />
                    <div style={{ fontSize: '10px', color: '#856404', marginTop: '4px', fontStyle: 'italic' }}>
                      Typically 50-55%. Surviving spouse receives this % of the deceased's FERS pension.
                    </div>
                  </div>
                )}
              </div>

            )}
          </div>

          {/* Retirement Accounts Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('accounts')}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.8) 0%, rgba(255, 153, 51, 0.6) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.4)',
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
                <span style={{ fontSize: '18px' }}>📊</span>
                Retirement Accounts
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.accounts ? '▲' : '▼'}</span>
            </div>
            {openSections.accounts && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  TSP Balance
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
                      background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  Expected Return (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tspGrowthRate}
                  onChange={(e) => setTspGrowthRate(Number(e.target.value))}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '20px'
                  }}
                />

                <label style={{ display: 'block', marginBottom: '12px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                  Withdrawal Method
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setTspWithdrawalType('amount')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: tspWithdrawalType === 'amount' ? '#FF9933' : '#e0e0e0',
                      color: tspWithdrawalType === 'amount' ? '#ffffff' : '#666',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Amount
                  </button>
                  <button
                    onClick={() => setTspWithdrawalType('percent')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: tspWithdrawalType === 'percent' ? '#FF9933' : '#e0e0e0',
                      color: tspWithdrawalType === 'percent' ? '#ffffff' : '#666',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Percent
                  </button>
                </div>

                {tspWithdrawalType === 'amount' && (
                  <>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Monthly Withdrawal
                    </label>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={tspWithdrawalAmount}
                        onChange={(e) => setTspWithdrawalAmount(Number(e.target.value))}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '10px 10px 10px 24px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={tspCoverTaxes}
                        onChange={(e) => setTspCoverTaxes(e.target.checked)}
                        style={{ marginRight: '8px' }}
                      />
                      Withdraw additional to cover TSP taxes
                    </label>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '6px', marginLeft: '24px', fontStyle: 'italic' }}>
                      {tspCoverTaxes && tspWithdrawalAmount > 0 
                        ? `Total withdrawal: ${formatCurrency(tspWithdrawalAmount / (1 - taxBracket / 100) * 12)} annually`
                        : 'Uses tax gross-up formula to cover tax liability'}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Additional Income Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('additional')}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.8) 0%, rgba(255, 153, 51, 0.6) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.4)',
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
                Additional Income
              </span>
              <span style={{ fontSize: '12px' }}>{openSections.additional ? '▲' : '▼'}</span>
            </div>
            {openSections.additional && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                
                {additionalIncome.map(income => (
                  <div key={income.id} style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', 
                    padding: '12px', 
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
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
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
                              background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.9)',
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
                            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.9)',
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
                            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.9)',
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
                            background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.9)',
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

          {/* Expenses Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('expenses')}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.8) 0%, rgba(255, 153, 51, 0.6) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.4)',
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
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
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
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={exp.amount}
                        onChange={(e) => updateExpense(exp.id, 'amount', Number(e.target.value))}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
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

          {/* Budget Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('budget')}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.8) 0%, rgba(255, 153, 51, 0.6) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.4)',
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
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
                          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
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
                      <input type="number" value={budgetTransportation} onChange={(e) => setBudgetTransportation(Number(e.target.value))} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 24px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
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
                      <input type="number" value={budgetHealthcare} onChange={(e) => setBudgetHealthcare(Number(e.target.value))} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 24px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
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
                      <input type="number" value={budgetEntertainment} onChange={(e) => setBudgetEntertainment(Number(e.target.value))} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 24px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
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
                      <input type="number" value={budgetOther} onChange={(e) => setBudgetOther(Number(e.target.value))} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 24px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
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
                  background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', 
                  padding: '12px', 
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
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.8) 0%, rgba(255, 153, 51, 0.6) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.4)',
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
                      background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.9)',
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
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
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

          {/* Settings Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('settings')}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.8) 0%, rgba(255, 153, 51, 0.6) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.4)',
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
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
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
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
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
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
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
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
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
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
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
                    background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}
          </div>

          {/* Rental Property Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('rental')}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.8) 0%, rgba(255, 153, 51, 0.6) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.4)',
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

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.8) 0%, rgba(255, 153, 51, 0.6) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.4)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '16px',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              marginBottom: '15px'
            }}
          >
            Calculate
          </button>

          {/* Data Management Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
            <button
              onClick={exportData}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#5bc0de',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
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
                padding: '10px',
                backgroundColor: '#5cb85c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                textAlign: 'center',
                display: 'block'
              }}
              title="Import data from a file"
            >
              📁 Import
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
                padding: '10px',
                backgroundColor: '#d9534f',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
              title="Clear all data and start fresh"
            >
              🗑️ Clear
            </button>
          </div>
          
          <div style={{ 
            fontSize: '11px', 
            color: '#999', 
            textAlign: 'center',
            fontStyle: 'italic',
            padding: '10px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            💡 Your data is automatically saved in your browser and never leaves your device
          </div>

          {/* Reset to Demo Data Button */}
          <button
            onClick={resetToDemo}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.8) 0%, rgba(255, 153, 51, 0.6) 100%)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.4)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '15px'
            }}
            title="Reset all fields to demo data"
          >
            🔄 Reset to Demo Data
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
                    backgroundColor: !rentalView ? '#FF9933' : '#ffffff',
                    color: !rentalView ? '#ffffff' : '#666',
                    border: '2px solid #FF9933',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '15px'
                  }}
                >
                  📊 RETIREMENT
                </button>
                <button
                  onClick={() => setRentalView(true)}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    backgroundColor: rentalView ? '#FF9933' : '#ffffff',
                    color: rentalView ? '#ffffff' : '#666',
                    border: '2px solid #FF9933',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '15px'
                  }}
                >
                  🏠 RENTAL
                </button>
              </div>

              {!rentalView ? (
                <>
                  {/* View Toggle */}
                  <div style={{ marginBottom: '25px', display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setViewMode('table')}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: viewMode === 'table' ? '#FF9933' : '#ffffff',
                        color: viewMode === 'table' ? '#ffffff' : '#666',
                        border: '2px solid #FF9933',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      TABLE VIEW
                    </button>
                    <button
                      onClick={() => setViewMode('chart')}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: viewMode === 'chart' ? '#FF9933' : '#ffffff',
                        color: viewMode === 'chart' ? '#ffffff' : '#666',
                        border: '2px solid #FF9933',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      CHART VIEW
                    </button>
                  </div>

              {viewMode === 'table' ? (
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
                    fontSize: '13px'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f8f8', borderBottom: '2px solid #FF9933' }}>
                        <th style={{ padding: '12px 10px', textAlign: 'left', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Year</th>
                        <th style={{ padding: '12px 10px', textAlign: 'left', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Age</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>FERS (Net)</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Deductions</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>SRS</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Soc Sec</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>TSP W/D</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Add'l Income</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Est. Taxes</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Est. TSP Taxes</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Budget</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Expenses</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Total Income</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>TSP Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projections.map((proj, idx) => (
                        <React.Fragment key={idx}>
                          {/* Main Row - clickable */}
                          <tr 
                            onClick={() => toggleRowExpansion(proj.year)}
                            style={{
                              backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                              borderBottom: '1px solid #eeeeee',
                              cursor: 'pointer'
                            }}
                          >
                            <td style={{ padding: '10px', color: 'rgba(255, 255, 255, 0.9)' }}>
                              {expandedRows.has(proj.year) ? '▼' : '▶'} {proj.year}
                            </td>
                            <td style={{ padding: '10px', color: 'rgba(255, 255, 255, 0.9)' }}>{proj.age}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)' }}>
                              {formatCurrency(proj.fers)}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#dc3545' }}>
                              {formatCurrency(proj.deductions)}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)' }}>{formatCurrency(proj.srs)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)' }}>{formatCurrency(proj.ss)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)' }}>{formatCurrency(proj.tspWithdrawal)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#28a745' }}>{formatCurrency(proj.additionalIncome)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#dc3545' }}>{formatCurrency(proj.estimatedTaxes)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#dc3545' }}>{formatCurrency(proj.estimatedTspTaxes)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)' }}>
                              {formatCurrency(proj.budget)}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)' }}>{formatCurrency(proj.expenses)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' }}>{formatCurrency(proj.totalIncome)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.9)' }}>{formatCurrency(proj.tspBalance)}</td>
                          </tr>
                          
                          {/* Expanded Row Details */}
                          {expandedRows.has(proj.year) && (
                            <tr style={{ backgroundColor: '#f9f9f9' }}>
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
                                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '5px', marginTop: '5px' }}>
                                        <span>Total:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(proj.budget)}</span>
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
                      </div>
                    </div>
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
                        {showIncomeStreams.fers && <Line type="monotone" dataKey="fers" stroke="#FF9933" name="FERS" strokeWidth={2} />}
                        {showIncomeStreams.srs && <Line type="monotone" dataKey="srs" stroke="#CC99CC" name="SRS" strokeWidth={2} />}
                        {showIncomeStreams.ss && <Line type="monotone" dataKey="ss" stroke="#9999FF" name="Social Security" strokeWidth={2} />}
                        {showIncomeStreams.tspWithdrawal && <Line type="monotone" dataKey="tspWithdrawal" stroke="#5bc0de" name="TSP Withdrawal" strokeWidth={2} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Chart 2: TSP Balance */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h3 style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '15px', fontWeight: '600', fontSize: '16px' }}>TSP Balance Over Time</h3>
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
                        <Line type="monotone" dataKey="tspBalance" stroke="#5bc0de" strokeWidth={3} name="TSP Balance" />
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
                  backgroundColor: '#f0f8ff', 
                  border: '2px solid #5bc0de',
                  borderRadius: '4px',
                  padding: '15px',
                  marginBottom: '25px'
                }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#0066cc', fontWeight: '600' }}>
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
                      <tr style={{ backgroundColor: '#f8f8f8', borderBottom: '2px solid #FF9933' }}>
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
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                          borderBottom: '1px solid #eeeeee'
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
