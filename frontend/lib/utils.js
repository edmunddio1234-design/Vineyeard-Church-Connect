/**
 * Utility functions for VineyardConnect frontend
 */

/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short',
    });
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Get user initials from first and last name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Two-letter initials
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return `${first}${last}`.toUpperCase();
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Parse comma-separated tags into array
 * @param {string} tagsString - Comma-separated tags
 * @returns {array} Array of trimmed tags
 */
export const parseTags = (tagsString) => {
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};

/**
 * Format tags array back to string
 * @param {array} tags - Array of tags
 * @returns {string} Comma-separated string
 */
export const formatTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.join(', ');
  }
  return tags || '';
};

/**
 * Get color for badge/avatar based on index
 * @param {number} index - Index for color selection
 * @returns {string} Tailwind color class
 */
export const getBadgeColor = (index) => {
  const colors = [
    'bg-primary',
    'bg-primary-light',
    'bg-accent',
    'bg-blue-500',
    'bg-green-500',
    'bg-pink-500',
  ];
  return colors[index % colors.length];
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists in localStorage
 */
export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
};

/**
 * Get stored token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Get stored user from localStorage
 * @returns {object|null} User object or null
 */
export const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

/**
 * Debounce function for search inputs
 * @param {function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Pluralize word based on count
 * @param {string} word - Word to pluralize
 * @param {number} count - Count
 * @returns {string} Singular or plural form
 */
export const pluralize = (word, count) => {
  return count === 1 ? word : `${word}s`;
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const secondsElapsed = Math.floor((now - date) / 1000);

  if (secondsElapsed < 60) return 'just now';
  if (secondsElapsed < 3600) {
    const minutes = Math.floor(secondsElapsed / 60);
    return `${minutes} ${pluralize('minute', minutes)} ago`;
  }
  if (secondsElapsed < 86400) {
    const hours = Math.floor(secondsElapsed / 3600);
    return `${hours} ${pluralize('hour', hours)} ago`;
  }
  if (secondsElapsed < 604800) {
    const days = Math.floor(secondsElapsed / 86400);
    return `${days} ${pluralize('day', days)} ago`;
  }

  return formatDate(dateString);
};
