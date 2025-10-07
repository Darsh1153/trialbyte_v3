"use client";

import { useState, useEffect, useCallback } from "react";

export interface DrugNameOption {
  value: string;
  label: string;
  source: 'drug_name' | 'generic_name' | 'other_name' | 'custom';
}

export const useDrugNames = () => {
  const [drugNames, setDrugNames] = useState<DrugNameOption[]>([]);

  // Load drug names from localStorage on mount
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const stored = localStorage.getItem('drugNames');
        if (stored) {
          const parsed = JSON.parse(stored);
          setDrugNames(parsed);
          console.log('Loaded drug names from localStorage:', parsed);
        } else {
          // Initialize with some sample data if empty
          const initialDrugs: DrugNameOption[] = [
            { value: "Aspirin", label: "Aspirin", source: 'custom' },
            { value: "Ibuprofen", label: "Ibuprofen", source: 'custom' },
            { value: "Paracetamol", label: "Paracetamol", source: 'custom' },
          ];
          setDrugNames(initialDrugs);
          localStorage.setItem('drugNames', JSON.stringify(initialDrugs));
          console.log('Initialized with sample drug names:', initialDrugs);
        }
      } catch (error) {
        console.error('Error loading drug names from localStorage:', error);
        setDrugNames([]);
      }
    };

    loadFromLocalStorage();
  }, []);

  // Save drug names to localStorage whenever they change
  useEffect(() => {
    if (drugNames.length > 0) {
      try {
        localStorage.setItem('drugNames', JSON.stringify(drugNames));
        console.log('Saved drug names to localStorage:', drugNames);
      } catch (error) {
        console.error('Error saving drug names to localStorage:', error);
      }
    }
  }, [drugNames]);

  const addDrugName = useCallback((name: string, source: DrugNameOption['source']) => {
    if (!name.trim()) return;

    const trimmedName = name.trim();
    
    // Check if drug name already exists
    const exists = drugNames.some(drug => 
      drug.value.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!exists) {
      const newDrug: DrugNameOption = {
        value: trimmedName,
        label: trimmedName,
        source
      };

      setDrugNames(prev => {
        const updated = [...prev, newDrug];
        console.log('Added new drug name:', newDrug, 'Total drugs:', updated.length);
        return updated;
      });
    } else {
      console.log('Drug name already exists:', trimmedName);
    }
  }, [drugNames]);

  const getPrimaryNameOptions = useCallback(() => {
    return drugNames.map(drug => ({
      value: drug.value,
      label: drug.label
    }));
  }, [drugNames]);

  const getPrimaryDrugsOptions = useCallback(() => {
    return drugNames.map(drug => ({
      value: drug.value,
      label: drug.label
    }));
  }, [drugNames]);

  const clearAllDrugNames = useCallback(() => {
    setDrugNames([]);
    localStorage.removeItem('drugNames');
    console.log('Cleared all drug names');
  }, []);

  const logCurrentDrugNames = useCallback(() => {
    console.log('Current drug names:', drugNames);
  }, [drugNames]);

  const refreshFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('drugNames');
      if (stored) {
        const parsed = JSON.parse(stored);
        setDrugNames(parsed);
        console.log('Refreshed drug names from localStorage:', parsed);
      }
    } catch (error) {
      console.error('Error refreshing drug names from localStorage:', error);
    }
  }, []);

  return {
    drugNames,
    addDrugName,
    getPrimaryNameOptions,
    getPrimaryDrugsOptions,
    clearAllDrugNames,
    logCurrentDrugNames,
    refreshFromLocalStorage
  };
};
