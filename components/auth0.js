let auth0Client;

async function initializeAuth0() {
  auth0Client = await createAuth0Client({
    domain: 'YOUR_AUTH0_DOMAIN.auth0.com', // Replace with your Auth0 domain
    clientId: 'YOUR_CLIENT_ID', // Replace with your Auth0 client ID
    redirectUri: window.location.origin.includes('localhost') ? 'http://localhost:5500/oauth/auth0-callback.html' : 'https://mypetid-home.github.io/oauth/auth0-callback.html',
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
  });
}

async function registerUser() {
  if (!document.getElementById('agreement-checkbox').checked) {
    showToast({ title: 'Error', description: 'You must agree to the terms and privacy policy' });
    return;
  }
  try {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  } catch (error) {
    showToast({ title: 'Error', description: 'Failed to initiate registration' });
  }
}

async function loginUser() {
  try {
    await auth0Client.loginWithRedirect();
  } catch (error) {
    showToast({ title: 'Error', description: 'Failed to initiate login' });
  }
}

async function handleCallback() {
  try {
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    if (user) {
      const userData = {
        auth0Id: user.sub,
        email: user.email,
        patreonTier: 'free',
        timestamp: Date.now(),
        role: 'user'
      };
      await pushToGitHub('data/users.json', JSON.stringify([...(await fetchJson('data/users.json') || []), userData]), `Register user ${user.email}`);
      showLoggedInState();
      navigate('dashboard');
    }
  } catch (error) {
    showToast({ title: 'Error', description: 'Authentication callback failed' });
  }
}

async function logoutUser() {
  await auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin.includes('localhost') ? 'http://localhost:5500' : 'https://mypetid-home.github.io',
    },
  });
  showLoggedOutState();
  navigate('home');
}

async function fetchJson(path) {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/MyPetID-Home/MyPetID-Home.github.io/main/${path}`);
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function pushToGitHub(path, content, message) {
  const existing = await fetch(`https://api.github.com/repos/MyPetID-Home/MyPetID-Home.github.io/contents/${path}`, {
    headers: { 'Authorization': `token ${localStorage.getItem('github_token') || 'YOUR_GITHUB_TOKEN'}` }
  }).then(res => res.json());
  const sha = existing.sha;
  await fetch(`https://api.github.com/repos/MyPetID-Home/MyPetID-Home.github.io/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${localStorage.getItem('github_token') || 'YOUR_GITHUB_TOKEN'}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: btoa(content),
      sha,
      committer: { name: 'MyPetID Bot', email: 'bot@mypetid.com' }
    })
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await initializeAuth0();
  if (window.location.search.includes('code=')) {
    await handleCallback();
  }
});
