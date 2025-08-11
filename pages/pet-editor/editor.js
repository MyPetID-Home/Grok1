async function saveDog() {
  const user = await auth0Client.getUser();
  const users = await fetchJson('data/users.json') || [];
  const userData = users.find(u => u.auth0Id === user.sub);
  const maxDogs = { free: 1, basic: 1, platinum: 1, gold: 2, diamond: 2 }[userData.patreonTier];
  const dogs = await fetchJson('data/dogs.json') || [];
  const userDogs = dogs.filter(d => d.auth0Id === user.sub);
  if (userDogs.length >= maxDogs) {
    showToast({ title: 'Error', description: `Max ${maxDogs} dog(s) allowed for ${userData.patreonTier} tier` });
    return;
  }
  const dogId = `dog-${Date.now()}`;
  const profileUrl = `${window.location.origin}/pages/pet-profile?dogId=${dogId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(profileUrl)}&size=200x200`;
  const dogData = {
    auth0Id: user.sub,
    dogId,
    name: document.getElementById('dog-name').value,
    breed: document.getElementById('dog-breed').value,
    description: document.getElementById('dog-description').value,
    sex: document.getElementById('dog-sex').value,
    neutered: document.getElementById('dog-neutered').value,
    age: document.getElementById('dog-age').value,
    weight: document.getElementById('dog-weight').value,
    nfcTagId: document.getElementById('dog-nfc').value,
    profileUrl,
    qrCodeUrl
  };
  await pushToGitHub('data/dogs.json', JSON.stringify([...dogs, dogData]), `Add dog ${dogData.name} for ${user.email}`);
  showToast({ title: 'Success', description: 'Pet saved' });
  navigate('dashboard');
}
