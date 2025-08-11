async function loadPetProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const dogId = urlParams.get('dogId');
  const dogs = await fetchJson('data/dogs.json') || [];
  const dog = dogs.find(d => d.dogId === dogId);
  if (dog) {
    document.getElementById('pet-info').innerHTML = `
      <p><strong>Name:</strong> ${dog.name}</p>
      <p><strong>Breed:</strong> ${dog.breed}</p>
      <p><strong>Description:</strong> ${dog.description}</p>
      <p><strong>Sex:</strong> ${dog.sex}</p>
      <p><strong>Neutered:</strong> ${dog.neutered}</p>
      <p><strong>Age:</strong> ${dog.age}</p>
      <p><strong>Weight:</strong> ${dog.weight}</p>
      <img src="${dog.qrCodeUrl}" alt="QR Code" width="200">
    `;
    const locations = await fetchJson('data/locations.json') || [];
    const latestLocation = locations.filter(l => l.dogId === dogId).slice(-1)[0];
    if (latestLocation) {
      updateMap({ latitude: latestLocation.latitude, longitude: latestLocation.longitude });
    }
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const { latitude, longitude } = position.coords;
    const user = await auth0Client.getUser();
    const locationData = {
      auth0Id: user.sub,
      dogId,
      latitude,
      longitude,
      timestamp: Date.now()
    };
    await pushToGitHub('data/locations.json', JSON.stringify([...locations, locationData]), `Update location for dog ${dogId}`);
    updateMap({ latitude, longitude });
  }
}
document.addEventListener('DOMContentLoaded', loadPetProfile);
