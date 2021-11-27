import { random } from './lib.js'
import _ from 'https://unpkg.com/lodash-es'

const channel = (index) => 144 + index

const transpose = (pattern, n = 12) =>
  pattern.map(([note, velocity]) => [note + n, velocity])

const initialModel = {
  interval: 250,
  tick: -1,
  tracks: [],
  patterns: [],
}

const generate = () => {
  //   const notes = [60, 62, 64, 65, 67, 69, 71, 72]
  //   const notes = _.range(8).map((i) => _.random(21, 128))
  const notes = _.range(8).map((i) => random(60, 72))
  //   const velocities = [127, 127, 127, 127, 127, 127, 127, 127]
  const velocities = _.range(8).map((i) => random(60, 127))
  const pattern = _.zip(notes, velocities)
  return pattern
}

const update = (msg, model) => {
  switch (msg) {
    case 'init':
      const pattern = generate()
      model.tracks[0] = pattern
      model.tracks[1] = transpose(pattern)
      break
    case 'tick':
      model.tick += 1
      break
  }
  console.log(model)
  return model
}

const render = (output, model) => {
  const { tick, tracks } = model
  tracks.forEach((track, index) => {
    const [note, velocity] = track[tick % track.length]
    output.send([channel(index), note, velocity])
  })
}

const main = async () => {
  const midi = await navigator.requestMIDIAccess()
  const output = midi.outputs.values().next().value
  const model = update('init', initialModel)
  //   setInterval(() => {
  //     const updatedModel = update('tick', model)
  //     render(output, updatedModel)
  //   }, model.interval)
}

main()
