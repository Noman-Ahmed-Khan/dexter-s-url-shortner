 getCsrfToken = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/csrf-token`, {
    credentials: 'include',
  });
  const data = await res.json();
  return data.csrfToken;
};
