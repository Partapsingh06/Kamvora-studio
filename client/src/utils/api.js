import axios from 'axios';

// Parse and normalize API baseURL & backendOrigin
const getApiConfig = () => {
  const envUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim();
  if (!envUrl) {
    return { baseURL: '/api', backendOrigin: '' };
  }

  const cleanUrl = envUrl.replace(/\/+$/, '');
  let baseURL = cleanUrl;
  let backendOrigin = '';

  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    try {
      const parsed = new URL(cleanUrl);
      backendOrigin = parsed.origin;
      baseURL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
    } catch {
      backendOrigin = '';
    }
  } else {
    baseURL = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  }

  return { baseURL, backendOrigin };
};

export const { baseURL, backendOrigin } = getApiConfig();

/**
 * Resolves an image URL safely:
 * - External (Cloudinary, Unsplash, HTTPS): returned as is
 * - Local /uploads/*: prepended with backendOrigin in production, or relative in local dev
 * - Empty / null: returns the fallback artisan placeholder image
 */
export const getImageUrl = (
  url,
  fallback = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
) => {
  if (!url) return fallback;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  if (backendOrigin) {
    return `${backendOrigin}${cleanPath}`;
  }
  return cleanPath;
};

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Recursively resolve /uploads/ relative paths to absolute backend origin URLs
const resolveUploadUrls = (obj) => {
  if (!obj || typeof obj !== 'object' || !backendOrigin) return obj;
  if (Array.isArray(obj)) {
    return obj.map(resolveUploadUrls);
  }
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string' && (val.startsWith('/uploads/') || val.startsWith('uploads/'))) {
      obj[key] = getImageUrl(val);
    } else if (val && typeof val === 'object') {
      resolveUploadUrls(val);
    }
  }
  return obj;
};

// Intercept requests to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kamvora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for unified error messages and automatic upload URL resolution
api.interceptors.response.use(
  (response) => {
    if (response.data && backendOrigin) {
      resolveUploadUrls(response.data);
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
