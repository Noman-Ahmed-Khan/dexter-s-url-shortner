let csrfTokenCache = null;

const getCsrfToken = async () => {
    if (csrfTokenCache) return csrfTokenCache;
   const res = await fetch(`${import.meta.env.VITE_API_URL}/api/csrf-token`, {
      credentials: 'include'
    });
    const data = await res.json();
    csrfTokenCache = data.csrfToken;
    return csrfTokenCache;
};

export default getCsrfToken;
