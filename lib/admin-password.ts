import crypto from "node:crypto";

const PASSWORD_HASH_ALGORITHM = "scrypt";
const PASSWORD_HASH_PARAMS = "N=16384,r=8,p=1";
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
} as const;

function timingSafeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(firstBuffer, secondBuffer);
}

export function hashAdminPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto
    .scryptSync(password, salt, 64, SCRYPT_OPTIONS)
    .toString("base64url");

  return [
    PASSWORD_HASH_ALGORITHM,
    PASSWORD_HASH_PARAMS,
    salt,
    hash,
  ].join("$");
}

export function verifyAdminPassword(password: string, passwordHash: string) {
  const [algorithm, params, salt, expectedHash] = passwordHash.split("$");

  if (
    algorithm !== PASSWORD_HASH_ALGORITHM ||
    params !== PASSWORD_HASH_PARAMS ||
    !salt ||
    !expectedHash
  ) {
    return false;
  }

  const computedHash = crypto
    .scryptSync(password, salt, 64, SCRYPT_OPTIONS)
    .toString("base64url");

  return timingSafeEqual(computedHash, expectedHash);
}
