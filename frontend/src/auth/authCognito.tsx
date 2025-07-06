import { useAuth } from "react-oidc-context";

export const AuthCognito = () => {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "2624i7473vacjrqr90a4km7hde";
    const logoutUri = window.location.origin; // Redirect to the home page after logout
    const cognitoDomain = "https://studysurf.auth.ap-southeast-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div className="flex flex-row-reverse justify-right w-full gap-5">
        <p> {auth.user?.profile.email} </p>
        {/* <pre> ID Token: {auth.user?.id_token} </pre> */}
        {/* <pre> Access Token: {auth.user?.access_token} </pre> */}
        {/* <pre> Refresh Token: {auth.user?.refresh_token} </pre> */}

        <button onClick={() => { auth.removeUser(); signOutRedirect() }}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse justify-right w-full gap-5">
      <button onClick={() => auth.signinRedirect()} className="text-[var(--highlight-text)]">Sign In</button>
    </div>
  );
}
