import crypto from 'crypto';

//createHash()
const hash = crypto.createHash('sha256');
hash.update('password1234');
console.log(hash.digest('hex'));

crypto.randomBytes(16, (error, buff) => {
  if (error) throw err;
  console.log(buff.toString('hex'));
})

