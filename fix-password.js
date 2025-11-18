// Script pour générer le hash SHA-256 du mot de passe admin123
const password = 'admin123';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

hashPassword(password).then(hash => {
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL Command:');
  console.log(`UPDATE users SET password='${hash}' WHERE email='admin@renergy4all.com';`);
});
