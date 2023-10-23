import {adjectives, animals, uniqueNamesGenerator} from "unique-names-generator";

export const generateRandomUsername = (): string => {
  return uniqueNamesGenerator({dictionaries: [adjectives, animals]})
}