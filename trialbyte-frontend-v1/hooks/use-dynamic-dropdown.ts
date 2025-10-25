import { useState, useEffect } from 'react';
import { dropdownManagementAPI, DropdownOption, convertToSearchableSelectOptions } from '@/lib/dropdown-management-api';
import { SearchableSelectOption } from '@/components/ui/searchable-select';

interface UseDynamicDropdownOptions {
  categoryName: string;
  fallbackOptions?: SearchableSelectOption[];
}

interface UseDynamicDropdownReturn {
  options: SearchableSelectOption[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to dynamically load dropdown options from the database
 * Falls back to static options if the API fails
 */
export const useDynamicDropdown = ({ 
  categoryName, 
  fallbackOptions = [] 
}: UseDynamicDropdownOptions): UseDynamicDropdownReturn => {
  const [options, setOptions] = useState<SearchableSelectOption[]>(fallbackOptions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dropdownManagementAPI.getOptions(categoryName);
      
      if (response.success && response.data && response.data.length > 0) {
        const dynamicOptions = convertToSearchableSelectOptions(response.data);
        setOptions(dynamicOptions);
      } else {
        // Fall back to static options if API fails or returns empty data
        setOptions(fallbackOptions);
        setError(response.error || 'No options available from API, using fallback options');
      }
    } catch (err) {
      // Fall back to static options if API fails
      setOptions(fallbackOptions);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [categoryName]);

  return {
    options,
    loading,
    error,
    refetch: fetchOptions,
  };
};

/**
 * Hook to load multiple dropdown categories at once
 */
export const useMultipleDynamicDropdowns = (
  categoryConfigs: Array<{
    categoryName: string;
    fallbackOptions?: SearchableSelectOption[];
  }>
) => {
  const [results, setResults] = useState<Record<string, UseDynamicDropdownReturn>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllOptions = async () => {
      setLoading(true);
      const newResults: Record<string, UseDynamicDropdownReturn> = {};

      await Promise.all(
        categoryConfigs.map(async (config) => {
          try {
            const response = await dropdownManagementAPI.getOptions(config.categoryName);
            
            if (response.success && response.data && response.data.length > 0) {
              const dynamicOptions = convertToSearchableSelectOptions(response.data);
              newResults[config.categoryName] = {
                options: dynamicOptions,
                loading: false,
                error: null,
                refetch: async () => {
                  const refetchResponse = await dropdownManagementAPI.getOptions(config.categoryName);
                  if (refetchResponse.success && refetchResponse.data && refetchResponse.data.length > 0) {
                    const refetchOptions = convertToSearchableSelectOptions(refetchResponse.data);
                    setResults(prev => ({
                      ...prev,
                      [config.categoryName]: {
                        ...prev[config.categoryName],
                        options: refetchOptions,
                        loading: false,
                        error: null,
                      }
                    }));
                  }
                }
              };
            } else {
              newResults[config.categoryName] = {
                options: config.fallbackOptions || [],
                loading: false,
                error: response.error || 'No options available from API, using fallback options',
                refetch: async () => {}
              };
            }
          } catch (err) {
            newResults[config.categoryName] = {
              options: config.fallbackOptions || [],
              loading: false,
              error: err instanceof Error ? err.message : 'Unknown error',
              refetch: async () => {}
            };
          }
        })
      );

      setResults(newResults);
      setLoading(false);
    };

    loadAllOptions();
  }, [categoryConfigs]);

  return {
    results,
    loading,
  };
};

/**
 * Utility function to get dropdown options for a specific category
 * This can be used in components that need to get options synchronously
 */
export const getDropdownOptions = async (
  categoryName: string,
  fallbackOptions: SearchableSelectOption[] = []
): Promise<SearchableSelectOption[]> => {
  try {
    const response = await dropdownManagementAPI.getOptions(categoryName);
    
    if (response.success && response.data && response.data.length > 0) {
      return convertToSearchableSelectOptions(response.data);
    } else {
      return fallbackOptions;
    }
  } catch (error) {
    console.error(`Failed to fetch options for ${categoryName}:`, error);
    return fallbackOptions;
  }
};