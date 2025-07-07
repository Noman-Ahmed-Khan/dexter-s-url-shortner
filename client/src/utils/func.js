let csrfTokenCache = null;

export const getCsrfToken = async () => {
  if (csrfTokenCache) return csrfTokenCache;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/csrf-token`, {
      credentials: 'include'
    });


    if (!res.ok) {
      throw new Error(`Failed to fetch CSRF token: ${res.status}`);
    }

    const data = await res.json();
    csrfTokenCache = data.csrfToken;
    console.log(csrfTokenCache,"CSRF")
    return csrfTokenCache;

  } catch (err) {
    throw err;
  }
};

export const resetCsrfToken = () => {
  csrfTokenCache = null;
};
export const fetchUser = async () => {
  try {
    const csrfToken = await getCsrfToken();
    console.log('Fetching user with CSRF token:', csrfToken);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      credentials: 'include',
    });

    console.log('fetchUser response status:', response.status);
    console.log('fetchUser response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('fetchUser error response:', errorText);
      if (response.status === 403) csrfTokenCache = null;
      throw new Error(`User fetch failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('fetchUser data:', data);
    return data.user;
    
  } catch (err) {
    console.error('fetchUser catch error:', err);
    throw err;
  }
};
