import generateApiKey from 'generate-api-key';

const API_KEY_CHARACTER_POOL =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const API_KEY_PART_DELIMITER = '.';

const calculateChecksum = (value: string): number => {
  let checksum = 0;
  for (let i = 0; i < value.length; i++) {
    checksum += value.charCodeAt(i);
  }
  return checksum;
};

export const generateSecureApiKey = (): string => {
  const prefix = generateApiKey({
    method: 'string',
    length: 6,
    batch: 1,
  })[0];

  const newApiKey = generateApiKey({
    prefix: prefix,
    min: 16,
    max: 32,
    pool: API_KEY_CHARACTER_POOL,
    batch: 1,
  })[0];

  const apiKeyWithChecksum = `${newApiKey}${API_KEY_PART_DELIMITER}${calculateChecksum(newApiKey)}`;
  return apiKeyWithChecksum;
};

export const validateApiKey = (key: string | null) => {
  const parts = key?.split(API_KEY_PART_DELIMITER);
  if (parts?.length !== 3) {
    throw new Error('Invalid API key format');
  }
  const apiKeyPart = parts[0] + parts[1];
  const providedChecksum = parseInt(parts[2]);
  const calculatedChecksum = calculateChecksum(apiKeyPart);
  if (providedChecksum !== calculatedChecksum) {
    throw new Error('Invalid API key checksum');
  }
};
