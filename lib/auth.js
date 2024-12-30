import bcrypt from 'bcryptjs';

/**
 * Function to hash the user's password
 * @param {string} password The plain-text password
 * @returns {Promise<string>} The hashed password
 */
export async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds of hashing
  return hashedPassword;
}

/**
 * Function to verify if the entered password matches the stored hashed password
 * @param {string} password The plain-text password entered by the user
 * @param {string} hashedPassword The hashed password from the database
 * @returns {Promise<boolean>} True if the passwords match, false otherwise
 */
export async function verifyPassword(password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword); // Compare the passwords
  return isValid;
}
