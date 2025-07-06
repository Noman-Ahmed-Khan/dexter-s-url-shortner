// let csrfTokenCache = null;

// export const getCsrfToken = async () => {
//   if (csrfTokenCache) return csrfTokenCache;
//   try {
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/csrf-token`, {
//       credentials: 'include'
//     });

//     if (!res.ok) {
//       throw new Error(`Failed to fetch CSRF token: ${res.status}`);
//     }

//     const data = await res.json();
//     csrfTokenCache = data.csrfToken;
//     return csrfTokenCache;

//   } catch (err) {
//     throw err;
//   }
// };

// export const resetCsrfToken = () => {
//   csrfTokenCache = null;
// };

export const fetchUser = async () => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 403) csrfTokenCache = null; // reset token
      const errorText = await response.text();
      throw new Error(`User fetch failed: ${errorText}`);
    }

    const data = await response.json();
    return data.user;

  } catch (err) {
    throw err;
  }
};

