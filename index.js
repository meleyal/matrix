import { zip, range, random, transpose, channel, useMidi, _ } from './lib.js'

const initialModel = {
    interval: 100,
    tick: -1,
    tracks: [
        {
            pattern: [],
            step: -1,
            resolution: 1,
        },
        {
            pattern: [],
            step: -1,
            resolution: 1,
        },
        {
            pattern: [],
            step: -1,
            resolution: 1,
        },
    ],
}

const generate = (length) => {
    //   const notes = _.range(8).map((i) => _.random(21, 128))
    const notes = range(length).map(() => random(60, 72))
    const velocities = range(length).map(() => random(60, 127))
    const pattern = zip(notes, velocities)
    return pattern
}

const update = (msg, model) => {
    switch (msg) {
        case 'init':
            const pattern = generate(8)
            model.tracks[0].pattern = pattern
            model.tracks[1].pattern = transpose(pattern)
            model.tracks[2].pattern = transpose(pattern, -12)
            break
        case 'tick':
            if (model.tick % 2 === 0) {
                // console.log('beat')
                model.tracks = model.tracks.map((track) => {
                    const step = (track.step + 1) % track.pattern.length
                    return {
                        ...track,
                        step,
                    }
                })
            }
            model.tick += 1
            break
    }
    // console.log(model)
    return model
}

let prevModel = initialModel
const render = (midi, model) => {
    const { tick, tracks } = model

    // console.log(model.tracks[0].step, prevModel.tracks[0].step)
    // console.log(model.tracks[0].step === prevModel.tracks[0].step)

    // TODO: skip rendering if step has not changed
    tracks.forEach((track, index) => {
        // console.log(prevModel.tracks[index].step, track.step)
        if (track.step !== prevModel.tracks[index].step) {
            // console.log(track.step)
            // console.log(track.pattern[track.step])
            // const [note, velocity] = track.pattern[tick % track.pattern.length]
            const [note, velocity] = track.pattern[track.step]
            midi.send([channel(index), note, velocity])
        }
    })
    // prevStep = model.tracks[0].step
    prevModel = { ...model }
}

const main = async () => {
    const midi = await useMidi()
    const model = update('init', initialModel)
    // setInterval(() => {
    //     const updatedModel = update('tick', model)
    //     render(midi, updatedModel)
    // }, model.interval)

    const worker = new Worker('./worker.js')
    worker.onmessage = (e) => {
        // console.log('got message', e.data)
        const updatedModel = update('tick', model)
        render(midi, updatedModel)
    }
}

main()
