  // apiBase.js
(function() {
  const isLocalDev = /localhost|127\.0\.0\.1/.test(window.location.hostname);
  const ADMIN_BASE_ORIGIN = isLocalDev ? 'http://localhost:3005' : 'https://civic-vision-admin.onrender.com';

  // Resolve any image/file path returned by the backend into a full URL.
  // Handles: full URLs (already absolute), relative /uploads/... paths, and empty values.
  window.resolveAdminImageUrl = function(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return `${ADMIN_BASE_ORIGIN}${path}`;
    return `${ADMIN_BASE_ORIGIN}/${path}`;
  };

  if (!window.fetch) return; // Fail-safe

  const originalFetch = window.fetch.bind(window);

  window.fetch = function(resource, init) {
    try {
      if (typeof resource === 'string') {
        if (resource.startsWith('/api/')) {
          resource = `${ADMIN_BASE_ORIGIN}${resource}`;
        } else if (resource.startsWith('api/')) {
          resource = `${ADMIN_BASE_ORIGIN}/${resource}`;
        }
      } else if (resource instanceof Request) {
        let url = resource.url;
        if (url.startsWith('/api/')) {
          url = `${ADMIN_BASE_ORIGIN}${url}`;
          resource = new Request(url, resource);
        } else if (url.startsWith('api/')) {
          url = `${ADMIN_BASE_ORIGIN}/${url}`;
          resource = new Request(url, resource);
        }
      }
    } catch (e) {
      // If something goes wrong, fallback to original fetch without modification
      console.error('[apiBase] Error patching fetch:', e);
    }
    return originalFetch(resource, init);
  };
})();
