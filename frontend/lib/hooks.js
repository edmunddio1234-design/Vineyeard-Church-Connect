import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthContext';
import api from './api';

/**
 * Hook to protect pages that require authentication
 * Redirects to login if not authenticated
 */
export const useProtectedRoute = () => {
  const router = useRouter();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/');
    }
  }, [token, loading, router]);

  return { isProtected: !!token, loading };
};

/**
 * Hook for fetching data from API
 * @param {string} url - API endpoint
 * @param {array} dependencies - Re-fetch dependencies
 * @returns {object} { data, loading, error, refetch }
 */
export const useFetchData = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(url);
      setData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, ...dependencies, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for form state management
 * @param {object} initialValues - Initial form state
 * @returns {object} { formData, setFormData, handleInputChange, resetForm }
 */
export const useForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
  }, [initialValues]);

  return {
    formData,
    setFormData,
    handleInputChange,
    resetForm,
  };
};

/**
 * Hook for toggling UI state
 * @param {boolean} initialState - Initial state
 * @returns {array} [state, toggle, setValue]
 */
export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);

  const setValue = useCallback((value) => {
    setState(value);
  }, []);

  return [state, toggle, setValue];
};

/**
 * Hook for API POST/PUT/DELETE requests
 * @param {string} url - API endpoint
 * @param {object} options - Request options
 * @returns {object} { execute, loading, error, success }
 */
export const useApiMutation = (method = 'POST') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(async (url, data = null) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      let response;
      if (method === 'POST') {
        response = await api.post(url, data);
      } else if (method === 'PUT') {
        response = await api.put(url, data);
      } else if (method === 'PATCH') {
        response = await api.patch(url, data);
      } else if (method === 'DELETE') {
        response = await api.delete(url, data);
      }

      setSuccess(true);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || `${method} request failed`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [method]);

  return { execute, loading, error, success };
};

/**
 * Hook for polling data at intervals
 * @param {string} url - API endpoint
 * @param {number} interval - Poll interval in ms
 * @param {boolean} enabled - Enable polling
 * @returns {object} { data, loading, error, stop, start }
 */
export const usePolling = (url, interval = 5000, enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(enabled);

  const poll = useCallback(async () => {
    try {
      const response = await api.get(url);
      setData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Polling failed');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!isPolling || !url) return;

    // Initial fetch
    poll();

    // Set up interval
    const intervalId = setInterval(poll, interval);

    return () => clearInterval(intervalId);
  }, [url, interval, isPolling, poll]);

  const stop = useCallback(() => setIsPolling(false), []);
  const start = useCallback(() => setIsPolling(true), []);

  return { data, loading, error, stop, start };
};

/**
 * Hook for managing pagination
 * @param {number} pageSize - Items per page
 * @returns {object} { page, pageSize, nextPage, prevPage, goToPage, reset }
 */
export const usePagination = (pageSize = 10) => {
  const [page, setPage] = useState(1);

  const nextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((pageNum) => {
    setPage(Math.max(1, pageNum));
  }, []);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
    reset,
    offset: (page - 1) * pageSize,
  };
};

/**
 * Hook for managing search with debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {object} { query, setQuery, debouncedQuery }
 */
export const useSearch = (delay = 300) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return { query, setQuery, debouncedQuery };
};

/**
 * Hook for local storage state
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {array} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return initialValue;
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * Hook for debounced values
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {any} Debounced value
 */
export const useDebouncedValue = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
