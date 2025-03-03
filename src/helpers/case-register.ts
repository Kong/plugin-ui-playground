import type { Case } from '../types/case'

const cases: Case[] = []

export const register = (c: Case) => {
  cases.push(c)
}

export const getCases = () => {
  console.log(cases)
  return cases
}
