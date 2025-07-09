import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const generateSlug = customAlphabet(alphabet, 6);
export const generateStatsKey = customAlphabet(alphabet, 12);