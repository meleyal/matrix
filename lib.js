import { prng_alea } from 'https://unpkg.com/esm-seedrandom'

const rng = prng_alea(null, {
  global: true,
  state: true,
  state: {
    c: 1,
    s0: 0.8634394553955644,
    s1: 0.31969695654697716,
    s2: 0.6573936773929745,
  },
})
const savedState = rng.state()
console.log(rng())
console.log(savedState)

export const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(rng() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}
