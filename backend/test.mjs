import { Generator } from './generator.mjs';
import crypto from 'crypto';

const cryptKey = crypto.randomBytes(32);

var a = Generator.encrypt(cryptKey, "Hiii!");
console.log(a);

var b = Generator.decrypt(cryptKey, a);
console.log(b);