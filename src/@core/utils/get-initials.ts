import { uppercaseFirstLetters } from "src/helpers/functions";

// ** Returns initials from string
export const getInitials = (string: string) =>
  uppercaseFirstLetters(string?.split(/\s/).reduce((response, word) => (response += word?.slice(0, 1)), ''))
