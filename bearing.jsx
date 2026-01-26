import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BearingApp = () => {
  const [dob, setDob] = useState('04/29/1964');
  const [isMonthly, setIsMonthly] = useState(true);
  const [fersAmount, setFersAmount] = useState(6650);
  const [srsAmount, setSrsAmount] = useState(1360);
  const [ssAmount, setSsAmount] = useState(2795);
  const [fersCola, setFersCola] = useState(2.6);
  const [srsCola, setSrsCola] = useState(2.6);
  const [ssCola, setSsCola] = useState(2.6);
  const [projectionYears, setProjectionYears] = useState(40);
  
  const [tspBalance, setTspBalance] = useState(500000);
  const [tspGrowthRate, setTspGrowthRate] = useState(7.0);
  const [tspWithdrawalType, setTspWithdrawalType] = useState('amount');
  const [tspWithdrawalAmount, setTspWithdrawalAmount] = useState(0);
  const [tspWithdrawalPercent, setTspWithdrawalPercent] = useState(4.0);
  const [tspWithdrawalCola, setTspWithdrawalCola] = useState(2.6);
  const [tspCoverTaxes, setTspCoverTaxes] = useState(false); // Withdraw additional to cover TSP taxes
  
  // Pension Deductions (monthly amounts)
  const [healthInsurance, setHealthInsurance] = useState(0);
  const [lifeInsurance, setLifeInsurance] = useState(0);
  const [dentalInsurance, setDentalInsurance] = useState(0);
  
  // Budget Categories - can be simple (one value) or detailed (subcategories)
  const [budgetMode, setBudgetMode] = useState({
    housing: 'simple',
    food: 'simple',
    transportation: 'simple',
    healthcare: 'simple',
    entertainment: 'simple',
    other: 'simple'
  });
  
  const [budgetHousing, setBudgetHousing] = useState(0);
  const [budgetHousingDetails, setBudgetHousingDetails] = useState([
    { id: 1, name: 'Mortgage/Rent', amount: 0 },
    { id: 2, name: 'Property Tax', amount: 0 },
    { id: 3, name: 'HOA Fees', amount: 0 },
    { id: 4, name: 'Utilities', amount: 0 },
    { id: 5, name: 'Home Insurance', amount: 0 },
    { id: 6, name: 'Maintenance/Repairs', amount: 0 }
  ]);
  
  const [budgetFood, setBudgetFood] = useState(0);
  const [budgetFoodDetails, setBudgetFoodDetails] = useState([
    { id: 1, name: 'Groceries', amount: 0 },
    { id: 2, name: 'Dining Out', amount: 0 },
    { id: 3, name: 'Coffee/Snacks', amount: 0 }
  ]);
  
  const [budgetTransportation, setBudgetTransportation] = useState(0);
  const [budgetTransportationDetails, setBudgetTransportationDetails] = useState([
    { id: 1, name: 'Car Payment', amount: 0 },
    { id: 2, name: 'Gas', amount: 0 },
    { id: 3, name: 'Auto Insurance', amount: 0 },
    { id: 4, name: 'Maintenance', amount: 0 },
    { id: 5, name: 'Public Transit', amount: 0 }
  ]);
  
  const [budgetHealthcare, setBudgetHealthcare] = useState(0);
  const [budgetHealthcareDetails, setBudgetHealthcareDetails] = useState([
    { id: 1, name: 'Insurance Premiums', amount: 0 },
    { id: 2, name: 'Prescriptions', amount: 0 },
    { id: 3, name: 'Co-pays', amount: 0 },
    { id: 4, name: 'Medical Supplies', amount: 0 }
  ]);
  
  const [budgetEntertainment, setBudgetEntertainment] = useState(0);
  const [budgetEntertainmentDetails, setBudgetEntertainmentDetails] = useState([
    { id: 1, name: 'Streaming Services', amount: 0 },
    { id: 2, name: 'Hobbies', amount: 0 },
    { id: 3, name: 'Activities', amount: 0 },
    { id: 4, name: 'Memberships', amount: 0 }
  ]);
  
  const [budgetOther, setBudgetOther] = useState(0);
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
  const [hasCalculated, setHasCalculated] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [taxBracket, setTaxBracket] = useState(22); // Default to 22% bracket
  const [federalWithheld, setFederalWithheld] = useState(0); // Monthly federal taxes withheld from FERS
  
  // Track expanded rows and cells
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [expandedCells, setExpandedCells] = useState(new Set()); // Format: "year-column"
  
  const [openSections, setOpenSections] = useState({
    income: false,
    accounts: false,
    additional: false,
    expenses: false,
    budget: false,
    taxes: false,
    settings: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
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

  const toggleCellExpansion = (year, column, e) => {
    e.stopPropagation(); // Prevent row expansion when clicking cell
    const cellKey = `${year}-${column}`;
    setExpandedCells(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cellKey)) {
        newSet.delete(cellKey);
      } else {
        newSet.add(cellKey);
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
      const taxes = calculateTaxes(fers, ss, tspWithdrawal);
      
      const totalIncome = fers + srs + ss + tspWithdrawal;
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
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px 30px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        borderBottom: '4px solid #FF9933',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <svg width="50" height="50" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#CC99CC" strokeWidth="3"/>
          <circle cx="50" cy="50" r="35" fill="none" stroke="#CC99CC" strokeWidth="2"/>
          <polygon points="50,5 55,45 50,50 45,45" fill="#FF9933"/>
          <polygon points="95,50 55,55 50,50 55,45" fill="#FF9933"/>
          <polygon points="50,95 45,55 50,50 55,55" fill="#FF9933"/>
          <polygon points="5,50 45,45 50,50 45,55" fill="#FF9933"/>
          <circle cx="50" cy="50" r="5" fill="#FF9933"/>
        </svg>
        <div>
          <h1 style={{ margin: 0, color: '#FF9933', fontSize: '36px', fontWeight: '700', letterSpacing: '1px' }}>
            BEARING
          </h1>
          <div style={{ color: '#CC99CC', fontSize: '14px', letterSpacing: '2px', marginTop: '2px' }}>
            FINANCIAL NAVIGATION SYSTEM
          </div>
          <div style={{ color: '#999', fontSize: '10px', marginTop: '4px', fontStyle: 'italic' }}>
            v1.0.0
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 94px)' }}>
        {/* Left Panel - Inputs */}
        <div style={{
          width: '380px',
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          borderRight: '4px solid #FF9933',
          padding: '20px'
        }}>
          
          {/* Income Sources Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('income')}
              style={{
                backgroundColor: '#FF9933',
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
              <div style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={(() => {
                    // Convert MM/DD/YYYY to YYYY-MM-DD for date input
                    const parts = dob.split('/');
                    if (parts.length === 3) {
                      const [month, day, year] = parts;
                      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    }
                    return '';
                  })()}
                  onChange={(e) => {
                    // Convert YYYY-MM-DD to MM/DD/YYYY for storage
                    const [year, month, day] = e.target.value.split('-');
                    setDob(`${month}/${day}/${year}`);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '20px'
                  }}
                />
                
                <label style={{ display: 'block', marginBottom: '12px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  Income Entry Mode
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setIsMonthly(true)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: isMonthly ? '#FF9933' : '#e0e0e0',
                      color: isMonthly ? '#ffffff' : '#666',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsMonthly(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: !isMonthly ? '#FF9933' : '#e0e0e0',
                      color: !isMonthly ? '#ffffff' : '#666',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Yearly
                  </button>
                </div>

                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  FERS Pension ({isMonthly ? 'Monthly' : 'Yearly'})
                </label>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                  <input
                    type="number"
                    value={fersAmount}
                    onChange={(e) => setFersAmount(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 24px',
                      backgroundColor: '#ffffff',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  SRS ({isMonthly ? 'Monthly' : 'Yearly'})
                </label>
                <div style={{ position: 'relative', marginBottom: '6px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                  <input
                    type="number"
                    value={srsAmount}
                    onChange={(e) => setSrsAmount(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 24px',
                      backgroundColor: '#ffffff',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '20px', fontStyle: 'italic' }}>
                  Until age 62
                </div>

                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  Social Security ({isMonthly ? 'Monthly' : 'Yearly'})
                </label>
                <div style={{ position: 'relative', marginBottom: '6px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                  <input
                    type="number"
                    value={ssAmount}
                    onChange={(e) => setSsAmount(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 24px',
                      backgroundColor: '#ffffff',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic', marginBottom: '30px' }}>
                  Starting at age 62
                </div>

                <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', fontWeight: '600' }}>
                    FERS Pension Deductions (Monthly)
                  </h4>
                  
                  <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                    Health Insurance
                  </label>
                  <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                    <input
                      type="number"
                      value={healthInsurance}
                      onChange={(e) => setHealthInsurance(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 10px 10px 24px',
                        backgroundColor: '#ffffff',
                        color: '#333',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                    Basic Life Insurance
                  </label>
                  <div style={{ position: 'relative', marginBottom: '6px' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                    <input
                      type="number"
                      value={lifeInsurance}
                      onChange={(e) => setLifeInsurance(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 10px 10px 24px',
                        backgroundColor: '#ffffff',
                        color: '#333',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '15px', fontStyle: 'italic' }}>
                    Stops at age 65
                  </div>

                  <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                    Federal Dental Insurance
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                    <input
                      type="number"
                      value={dentalInsurance}
                      onChange={(e) => setDentalInsurance(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 10px 10px 24px',
                        backgroundColor: '#ffffff',
                        color: '#333',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Retirement Accounts Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('accounts')}
              style={{
                backgroundColor: '#FF9933',
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
              <div style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  TSP Balance
                </label>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                  <input
                    type="number"
                    value={tspBalance}
                    onChange={(e) => setTspBalance(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 24px',
                      backgroundColor: '#ffffff',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  Expected Return (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tspGrowthRate}
                  onChange={(e) => setTspGrowthRate(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '20px'
                  }}
                />

                <label style={{ display: 'block', marginBottom: '12px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
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
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                      Monthly Withdrawal
                    </label>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input
                        type="number"
                        value={tspWithdrawalAmount}
                        onChange={(e) => setTspWithdrawalAmount(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 10px 10px 24px',
                          backgroundColor: '#ffffff',
                          color: '#333',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '13px' }}>
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
                backgroundColor: '#FF9933',
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
              <div style={{ 
                backgroundColor: '#fafafa', 
                padding: '40px 20px', 
                border: '1px solid #e0e0e0', 
                borderTop: 'none',
                textAlign: 'center',
                color: '#999',
                fontStyle: 'italic',
                fontSize: '14px'
              }}>
                Coming soon...
              </div>
            )}
          </div>

          {/* Expenses Section */}
          <div style={{ marginBottom: '15px' }}>
            <div 
              onClick={() => toggleSection('expenses')}
              style={{
                backgroundColor: '#FF9933',
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
              <div style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                {expenses.map(exp => (
                  <div key={exp.id} style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    marginBottom: '12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '4px'
                  }}>
                    <input
                      type="text"
                      placeholder="Expense name"
                      value={exp.name}
                      onChange={(e) => updateExpense(exp.id, 'name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#ffffff',
                        color: '#333',
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
                          backgroundColor: '#ffffff',
                          color: '#333',
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
                          backgroundColor: '#ffffff',
                          color: '#333',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: '#666', fontSize: '13px' }}>
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
                          backgroundColor: '#ffffff',
                          color: '#333',
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
                        width: '100%',
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
                    width: '100%',
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
                backgroundColor: '#FF9933',
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
              <div style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                
                {/* Housing */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#666', fontSize: '13px', fontWeight: '500' }}>
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
                        color: '#666'
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
                          width: '100%',
                          padding: '10px 10px 10px 24px',
                          backgroundColor: '#ffffff',
                          color: '#333',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
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
                          width: '100%',
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
                        color: '#333'
                      }}>
                        Total: ${calculateCategoryTotal(budgetHousingDetails).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Food */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#666', fontSize: '13px', fontWeight: '500' }}>
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
                        color: '#666'
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
                          width: '100%',
                          padding: '10px 10px 10px 24px',
                          backgroundColor: '#ffffff',
                          color: '#333',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
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
                          width: '100%',
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
                        color: '#333'
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
                    <label style={{ color: '#666', fontSize: '13px', fontWeight: '500' }}>Transportation</label>
                    <button onClick={() => toggleBudgetMode('transportation')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '3px', cursor: 'pointer', color: '#666' }}>
                      {budgetMode.transportation === 'simple' ? 'Break down ▼' : 'Simplify ▲'}
                    </button>
                  </div>
                  {budgetMode.transportation === 'simple' ? (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input type="number" value={budgetTransportation} onChange={(e) => setBudgetTransportation(Number(e.target.value))} style={{ width: '100%', padding: '10px 10px 10px 24px', backgroundColor: '#ffffff', color: '#333', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {budgetTransportationDetails.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input type="text" value={item.name} onChange={(e) => updateBudgetSubcategory(item.id, 'name', e.target.value, budgetTransportationDetails, setBudgetTransportationDetails)} placeholder="Subcategory" style={{ flex: 1, padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <span style={{ color: '#999', fontSize: '12px' }}>$</span>
                          <input type="number" value={item.amount} onChange={(e) => updateBudgetSubcategory(item.id, 'amount', Number(e.target.value), budgetTransportationDetails, setBudgetTransportationDetails)} style={{ width: '100px', padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <button onClick={() => deleteBudgetSubcategory(item.id, budgetTransportationDetails, setBudgetTransportationDetails)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                      <button onClick={() => addBudgetSubcategory('transportation', setBudgetTransportationDetails)} style={{ width: '100%', padding: '6px', fontSize: '12px', backgroundColor: '#5bc0de', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '4px' }}>+ Add Subcategory</button>
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd', textAlign: 'right', fontWeight: '600', color: '#333' }}>Total: ${calculateCategoryTotal(budgetTransportationDetails).toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {/* Healthcare */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#666', fontSize: '13px', fontWeight: '500' }}>Healthcare</label>
                    <button onClick={() => toggleBudgetMode('healthcare')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '3px', cursor: 'pointer', color: '#666' }}>
                      {budgetMode.healthcare === 'simple' ? 'Break down ▼' : 'Simplify ▲'}
                    </button>
                  </div>
                  {budgetMode.healthcare === 'simple' ? (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input type="number" value={budgetHealthcare} onChange={(e) => setBudgetHealthcare(Number(e.target.value))} style={{ width: '100%', padding: '10px 10px 10px 24px', backgroundColor: '#ffffff', color: '#333', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {budgetHealthcareDetails.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input type="text" value={item.name} onChange={(e) => updateBudgetSubcategory(item.id, 'name', e.target.value, budgetHealthcareDetails, setBudgetHealthcareDetails)} placeholder="Subcategory" style={{ flex: 1, padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <span style={{ color: '#999', fontSize: '12px' }}>$</span>
                          <input type="number" value={item.amount} onChange={(e) => updateBudgetSubcategory(item.id, 'amount', Number(e.target.value), budgetHealthcareDetails, setBudgetHealthcareDetails)} style={{ width: '100px', padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <button onClick={() => deleteBudgetSubcategory(item.id, budgetHealthcareDetails, setBudgetHealthcareDetails)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                      <button onClick={() => addBudgetSubcategory('healthcare', setBudgetHealthcareDetails)} style={{ width: '100%', padding: '6px', fontSize: '12px', backgroundColor: '#5bc0de', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '4px' }}>+ Add Subcategory</button>
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd', textAlign: 'right', fontWeight: '600', color: '#333' }}>Total: ${calculateCategoryTotal(budgetHealthcareDetails).toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {/* Entertainment */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#666', fontSize: '13px', fontWeight: '500' }}>Entertainment</label>
                    <button onClick={() => toggleBudgetMode('entertainment')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '3px', cursor: 'pointer', color: '#666' }}>
                      {budgetMode.entertainment === 'simple' ? 'Break down ▼' : 'Simplify ▲'}
                    </button>
                  </div>
                  {budgetMode.entertainment === 'simple' ? (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input type="number" value={budgetEntertainment} onChange={(e) => setBudgetEntertainment(Number(e.target.value))} style={{ width: '100%', padding: '10px 10px 10px 24px', backgroundColor: '#ffffff', color: '#333', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {budgetEntertainmentDetails.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input type="text" value={item.name} onChange={(e) => updateBudgetSubcategory(item.id, 'name', e.target.value, budgetEntertainmentDetails, setBudgetEntertainmentDetails)} placeholder="Subcategory" style={{ flex: 1, padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <span style={{ color: '#999', fontSize: '12px' }}>$</span>
                          <input type="number" value={item.amount} onChange={(e) => updateBudgetSubcategory(item.id, 'amount', Number(e.target.value), budgetEntertainmentDetails, setBudgetEntertainmentDetails)} style={{ width: '100px', padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <button onClick={() => deleteBudgetSubcategory(item.id, budgetEntertainmentDetails, setBudgetEntertainmentDetails)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                      <button onClick={() => addBudgetSubcategory('entertainment', setBudgetEntertainmentDetails)} style={{ width: '100%', padding: '6px', fontSize: '12px', backgroundColor: '#5bc0de', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '4px' }}>+ Add Subcategory</button>
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd', textAlign: 'right', fontWeight: '600', color: '#333' }}>Total: ${calculateCategoryTotal(budgetEntertainmentDetails).toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {/* Other */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#666', fontSize: '13px', fontWeight: '500' }}>Other</label>
                    <button onClick={() => toggleBudgetMode('other')} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '3px', cursor: 'pointer', color: '#666' }}>
                      {budgetMode.other === 'simple' ? 'Break down ▼' : 'Simplify ▲'}
                    </button>
                  </div>
                  {budgetMode.other === 'simple' ? (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#999', fontSize: '14px' }}>$</span>
                      <input type="number" value={budgetOther} onChange={(e) => setBudgetOther(Number(e.target.value))} style={{ width: '100%', padding: '10px 10px 10px 24px', backgroundColor: '#ffffff', color: '#333', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      {budgetOtherDetails.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input type="text" value={item.name} onChange={(e) => updateBudgetSubcategory(item.id, 'name', e.target.value, budgetOtherDetails, setBudgetOtherDetails)} placeholder="Subcategory" style={{ flex: 1, padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <span style={{ color: '#999', fontSize: '12px' }}>$</span>
                          <input type="number" value={item.amount} onChange={(e) => updateBudgetSubcategory(item.id, 'amount', Number(e.target.value), budgetOtherDetails, setBudgetOtherDetails)} style={{ width: '100px', padding: '6px 8px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '3px' }} />
                          <button onClick={() => deleteBudgetSubcategory(item.id, budgetOtherDetails, setBudgetOtherDetails)} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                      <button onClick={() => addBudgetSubcategory('other', setBudgetOtherDetails)} style={{ width: '100%', padding: '6px', fontSize: '12px', backgroundColor: '#5bc0de', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '4px' }}>+ Add Subcategory</button>
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd', textAlign: 'right', fontWeight: '600', color: '#333' }}>Total: ${calculateCategoryTotal(budgetOtherDetails).toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {/* Grand Total */}
                <div style={{ 
                  backgroundColor: '#ffffff', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  marginTop: '15px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#666', fontSize: '13px' }}>Monthly Total:</span>
                    <span style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>
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
                    <span style={{ color: '#666', fontSize: '13px' }}>Annual Total:</span>
                    <span style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>
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
                backgroundColor: '#FF9933',
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
              <div style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
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
                      width: '100%',
                      padding: '10px 10px 10px 24px',
                      backgroundColor: '#ffffff',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  Tax Bracket (%)
                </label>
                <select
                  value={taxBracket}
                  onChange={(e) => setTaxBracket(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    color: '#333',
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
                backgroundColor: '#e0e0e0',
                padding: '14px 16px',
                cursor: 'pointer',
                color: '#666',
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
              <div style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #e0e0e0', borderTop: 'none' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  Inflation Rate (%) - For Budget & Deductions
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />
                
                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  FERS COLA (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fersCola}
                  onChange={(e) => setFersCola(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />
                
                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  SRS COLA (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={srsCola}
                  onChange={(e) => setSrsCola(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />

                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  Social Security COLA (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={ssCola}
                  onChange={(e) => setSsCola(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />

                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  TSP Withdrawal COLA (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tspWithdrawalCola}
                  onChange={(e) => setTspWithdrawalCola(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />

                <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '13px', fontWeight: '500' }}>
                  Projection Years
                </label>
                <input
                  type="number"
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#FF9933',
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

        </div>

        {/* Right Panel - Results */}
        <div style={{
          flex: 1,
          backgroundColor: '#f5f5f5',
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
                  backgroundColor: '#ffffff', 
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    color: '#333',
                    fontSize: '13px'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f8f8', borderBottom: '2px solid #FF9933' }}>
                        <th style={{ padding: '12px 10px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Year</th>
                        <th style={{ padding: '12px 10px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Age</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>FERS (Net)</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Deductions</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>SRS</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Soc Sec</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>TSP W/D</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Est. Taxes</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Est. TSP Taxes</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Budget</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Expenses</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Total Income</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '600', color: '#666' }}>TSP Balance</th>
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
                            <td style={{ padding: '10px', color: '#333' }}>
                              {expandedRows.has(proj.year) ? '▼' : '▶'} {proj.year}
                            </td>
                            <td style={{ padding: '10px', color: '#333' }}>{proj.age}</td>
                            <td 
                              style={{ padding: '10px', textAlign: 'right', color: '#333', cursor: 'pointer' }}
                              onClick={(e) => toggleCellExpansion(proj.year, 'fers', e)}
                            >
                              {formatCurrency(proj.fers)} {expandedCells.has(`${proj.year}-fers`) ? '▼' : ''}
                            </td>
                            <td 
                              style={{ padding: '10px', textAlign: 'right', color: '#dc3545', cursor: 'pointer' }}
                              onClick={(e) => toggleCellExpansion(proj.year, 'deductions', e)}
                            >
                              {formatCurrency(proj.deductions)} {expandedCells.has(`${proj.year}-deductions`) ? '▼' : ''}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>{formatCurrency(proj.srs)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>{formatCurrency(proj.ss)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>{formatCurrency(proj.tspWithdrawal)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#dc3545' }}>{formatCurrency(proj.estimatedTaxes)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#dc3545' }}>{formatCurrency(proj.estimatedTspTaxes)}</td>
                            <td 
                              style={{ padding: '10px', textAlign: 'right', color: '#333', cursor: 'pointer' }}
                              onClick={(e) => toggleCellExpansion(proj.year, 'budget', e)}
                            >
                              {formatCurrency(proj.budget)} {expandedCells.has(`${proj.year}-budget`) ? '▼' : ''}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>{formatCurrency(proj.expenses)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', color: '#333' }}>{formatCurrency(proj.totalIncome)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>{formatCurrency(proj.tspBalance)}</td>
                          </tr>
                          
                          {/* Expanded Row Details */}
                          {expandedRows.has(proj.year) && (
                            <tr style={{ backgroundColor: '#f9f9f9' }}>
                              <td colSpan="13" style={{ padding: '15px 20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                  {/* Income Details */}
                                  <div>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '13px', fontWeight: '600' }}>
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
                                    </div>
                                  </div>
                                  
                                  {/* Deduction Details */}
                                  <div>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '13px', fontWeight: '600' }}>
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
                                    <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '13px', fontWeight: '600' }}>
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
                          
                          {/* Individual Cell Expansions */}
                          {expandedCells.has(`${proj.year}-fers`) && (
                            <tr style={{ backgroundColor: '#fffbf0' }}>
                              <td colSpan="13" style={{ padding: '10px 20px' }}>
                                <div style={{ fontSize: '12px' }}>
                                  <strong>FERS Breakdown:</strong>
                                  <div style={{ marginLeft: '15px', marginTop: '5px' }}>
                                    Gross FERS: {formatCurrency(proj.fersGross)}<br/>
                                    - Deductions: {formatCurrency(proj.deductions)}<br/>
                                    = Net FERS: {formatCurrency(proj.fers)}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                          
                          {expandedCells.has(`${proj.year}-deductions`) && (
                            <tr style={{ backgroundColor: '#fff0f0' }}>
                              <td colSpan="13" style={{ padding: '10px 20px' }}>
                                <div style={{ fontSize: '12px' }}>
                                  <strong>Deductions Breakdown:</strong>
                                  <div style={{ marginLeft: '15px', marginTop: '5px' }}>
                                    Health Insurance: {formatCurrency(proj.deductionDetails.health)}<br/>
                                    Life Insurance: {formatCurrency(proj.deductionDetails.life)}<br/>
                                    Dental Insurance: {formatCurrency(proj.deductionDetails.dental)}<br/>
                                    Total: {formatCurrency(proj.deductions)}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                          
                          {expandedCells.has(`${proj.year}-budget`) && (
                            <tr style={{ backgroundColor: '#f0f8ff' }}>
                              <td colSpan="13" style={{ padding: '10px 20px' }}>
                                <div style={{ fontSize: '12px' }}>
                                  <strong>Budget Breakdown:</strong>
                                  <div style={{ marginLeft: '15px', marginTop: '5px' }}>
                                    Housing: {formatCurrency(proj.budgetDetails.housing)}<br/>
                                    Food: {formatCurrency(proj.budgetDetails.food)}<br/>
                                    Transportation: {formatCurrency(proj.budgetDetails.transportation)}<br/>
                                    Healthcare: {formatCurrency(proj.budgetDetails.healthcare)}<br/>
                                    Entertainment: {formatCurrency(proj.budgetDetails.entertainment)}<br/>
                                    Other: {formatCurrency(proj.budgetDetails.other)}<br/>
                                    Total: {formatCurrency(proj.budget)}
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
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3 style={{ color: '#666', margin: 0, fontWeight: '600', fontSize: '16px' }}>Total Income Overview</h3>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <label style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={showIncomeStreams.fers} onChange={(e) => setShowIncomeStreams({...showIncomeStreams, fers: e.target.checked})} />
                          FERS
                        </label>
                        <label style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={showIncomeStreams.srs} onChange={(e) => setShowIncomeStreams({...showIncomeStreams, srs: e.target.checked})} />
                          SRS
                        </label>
                        <label style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={showIncomeStreams.ss} onChange={(e) => setShowIncomeStreams({...showIncomeStreams, ss: e.target.checked})} />
                          Soc Sec
                        </label>
                        <label style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
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
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
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
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h3 style={{ color: '#666', marginBottom: '15px', fontWeight: '600', fontSize: '16px' }}>TSP Balance Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={projections}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="year" stroke="#999" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend wrapperStyle={{ fontSize: '13px' }} />
                        <Line type="monotone" dataKey="tspBalance" stroke="#5bc0de" strokeWidth={3} name="TSP Balance" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Chart 3: Expenses Breakdown */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h3 style={{ color: '#666', marginBottom: '15px', fontWeight: '600', fontSize: '16px' }}>Expenses Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={projections}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="year" stroke="#999" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
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
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#666', marginBottom: '15px', fontWeight: '600', fontSize: '16px' }}>Cash Flow Summary</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={projections}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="year" stroke="#999" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
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
          )}

        </div>
      </div>
    </div>
  );
};

export default BearingApp;
