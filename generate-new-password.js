// Script pour générer le hash SHA-256 du nouveau mot de passe
const password = '5pOl26mEWSm2xYoO';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

hashPassword(password).then(hash => {
  console.log('=== NOUVEAU MOT DE PASSE ADMIN ===');
  console.log('Email: admin@renergy4all.com');
  console.log('Mot de passe:', password);
  console.log('Hash SHA-256:', hash);
  console.log('\n=== COMMANDE SQL ===');
  console.log(`UPDATE users SET password='${hash}' WHERE email='admin@renergy4all.com';`);
});
