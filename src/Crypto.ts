import CryptoJS, { AES } from "crypto-js";

export function encrypt(plaintext: string): string {
  const ciphertext = plaintext.split("").reverse().join("");
  return AES.encrypt(ciphertext, "crypto").toString();
}

export function decrypt(ciphertext: string): string {
  const plaintext = AES.decrypt(ciphertext, "crypto").toString(
    CryptoJS.enc.Utf8
  );
  return plaintext.split("").reverse().join("");
}
