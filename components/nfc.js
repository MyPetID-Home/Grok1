async function readNfcTag() {
  if (!('NDEFReader' in window)) {
    showToast({ title: 'Error', description: 'Web NFC is not supported. Use Chrome on Android.' });
    return;
  }
  try {
    const ndef = new NDEFReader();
    await ndef.scan();
    ndef.onreading = async ({ serialNumber }) => {
      const nfcTagId = serialNumber;
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      const user = await auth0Client.getUser();
      const dogs = await fetchJson('data/dogs.json') || [];
      const dog = dogs.find(d => d.nfcTagId === nfcTagId);
      const locationData = {
        auth0Id: user.sub,
        dogId: dog?.dogId,
        latitude,
        longitude,
        timestamp: Date.now()
      };
      await pushToGitHub('data/locations.json', JSON.stringify([...(await fetchJson('data/locations.json') || []), locationData]), `Update location for ${user.email}`);
      showToast({ title: 'Success', description: 'NFC tag scanned and location updated' });
      updateMap({ latitude, longitude });
    };
  } catch (error) {
    showToast({ title: 'Error', description: 'Failed to read NFC tag' });
  }
}

function updateMap({ latitude, longitude }) {
  const mapFrame = document.getElementById('map');
  if (mapFrame) {
    mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${latitude},${longitude}&zoom=15`;
  }
}
