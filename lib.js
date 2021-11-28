import lodash from 'https://unpkg.com/lodash-es'
import { prng_alea } from 'https://unpkg.com/esm-seedrandom'

const rng = prng_alea(null, {
    global: true,
    state: true,
    // state: {
    //     c: 1,
    //     s0: 0.40706299943849444,
    //     s1: 0.19002798269502819,
    //     s2: 0.31966522987931967,
    // },
})
const savedState = rng.state()
console.log(savedState)

export const random = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(rng() * (max - min + 1) + min)
}

export const channel = (index) => 144 + index

export const transpose = (pattern, n = 12) =>
    pattern.map(([note, velocity]) => [note + n, velocity])

export const useMidi = async () => {
    const midi = await navigator.requestMIDIAccess()
    return midi.outputs.values().next().value
}

export const zip = lodash.zip
export const range = lodash.range
export const _ = lodash
