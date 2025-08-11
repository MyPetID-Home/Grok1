async function loadDashboard() {
  const user = await auth0Client.getUser();
  if (user) {
    showLoggedInState();
    document.getElementById('user-info').textContent = `Welcome, ${user.name} (${user.email})`;
    const users = await fetchJson('data/users.json');
    const userData = users.find(u => u.auth0Id === user.sub);
    const dogs = await fetchJson('data/dogs.json') || [];
    const userDogs = dogs.filter(d => d.auth0Id === user.sub);
    const tbody = document.getElementById('pets-table');
    tbody.innerHTML = userDogs.map(dog => `
      <tr>
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td><a href="/pages/pet-profile?dogId=${dog.dogId}">View</a></td>
        <td><img src="${dog.qrCodeUrl}" alt="QR Code" width="100"></td>
      </tr>
    `).join('');
    const locations = await fetchJson('data/locations.json') || [];
    const latestLocation = locations.filter(l => l.auth0Id === user.sub && l.dogId).slice(-1)[0];
    if (latestLocation) {
      updateMap({ latitude: latestLocation.latitude, longitude: latestLocation.longitude });
    }
  }
}
document.addEventListener('DOMContentLoaded', loadDashboard);
