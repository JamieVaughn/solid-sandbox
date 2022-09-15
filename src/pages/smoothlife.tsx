import { Component, onMount, createSignal, onCleanup } from 'solid-js'

const trunc = (num, decimals = 2) => +num.toFixed(decimals)
const clamp = (num) => (num > 1 ? 1 : num < 0 ? 0 : num)

const smoothlife: Component<{}> = (props) => {
  let cols = 200
  const [cells, setCells] = createSignal(
    Array.from({ length: cols ** 2 }).map((_, i) => ({
      value: i - 1,
      valence: i > 0 && i < 400 ? trunc(Math.random()) : 0,
      nucleus: [0, 0],
    }))
  )
  const [iter, setIter] = createSignal(0)

  let canvas, ctx, input, timer
  let side = 600,
    groupSpacing = 0,
    cellSpacing = 0,
    cellSize = side / cols - cellSpacing,
    limit = 500
  /* 
  Initial Conditions: 
  m, n, o, p, q 
  */
  const initConditions = [
    { m: 0.5, l: 0.75, n: 0.25, o: 0.33, p: 0.35, q: 0.51 }, // snowflakes
    { m: 0.5, l: 0.75, n: 0.15, o: 0.63, p: 0.25, q: 0.951 }, // arrow gliders
  ]
  const nextStatus = (valence, inner: number, outer: number) => {
    const conditions = initConditions[1]
    const center = inner
    const shell = outer
    const m = center < conditions.m
    const l = center > conditions.l
    const n = shell > conditions.n
    const o = shell < conditions.o
    const p = shell > conditions.p
    const q = shell < conditions.q
    const live = (m && n && o) || (!m && p && q)
    return live && inner !== valence && outer !== valence ? clamp(1 - valence ** 0.2) : clamp(valence / 1.4)
  }

  onCleanup(() => (timer ? clearInterval(timer) : null))
  onMount(() => {
    ctx = canvas.getContext('2d')
    drawWithContext(ctx)

    timer = setInterval(() => {
      if (iter() >= limit) {
        return
      } else {
        setIter(iter() + 1)

        const nextCellState = cells().map((cell, i, arr) => {
          const j = i
          const ifactor = 1
          const iinherit = cell.valence
          const inner = [
            arr[j - ifactor]?.valence, // E
            arr[j + ifactor]?.valence, // W
            arr[j - ifactor * cols]?.valence, // N
            arr[j + ifactor * cols]?.valence, // S
            arr[j - cols - ifactor]?.valence, // NW
            arr[j - cols + ifactor]?.valence, // NE
            arr[j + cols - ifactor]?.valence, // SW
            arr[j + cols + ifactor]?.valence, // SE
          ].reduce((acc, cur) => {
            return acc + cur
          }, iinherit)
          const factor = 2
          const inherit = cell.valence
          const outer = [
            arr[j - factor]?.valence, // W
            arr[j - cols - 2]?.valence, // WNW
            arr[j - factor * cols - 2]?.valence, // NW
            arr[j - factor * cols - 1]?.valence, // NNW
            arr[j - factor * cols]?.valence, // N
            arr[j - factor * cols + 1]?.valence, // NNE
            arr[j - factor * cols + 2]?.valence, // NE
            arr[j - cols + 2]?.valence, // ENE
            arr[j + factor]?.valence, // E
            arr[j + cols + 2]?.valence, // ESE
            arr[j + factor * cols + 2]?.valence, // SE
            arr[j + factor * cols + 1]?.valence, // SSE
            arr[j + factor * cols]?.valence, // S
            arr[j + factor * cols - 1]?.valence, // SSW
            arr[j + factor * cols - 2]?.valence, // SW
            arr[j + cols - 2]?.valence, // WSW
          ].reduce((acc, cur) => {
            return acc + cur
          }, inherit)
          return {
            value: cell.value,
            valence: nextStatus(cell.valence, outer, inner),
            nucleus: [clamp(outer), clamp(inner)],
          }
        })
        setCells(nextCellState)
        drawWithContext(ctx)
      }
    }, 100)
  })

  const cellX = (i) => Math.floor(i % cols) * (cellSize + cellSpacing)
  const cellY = (i) => Math.floor(i / cols) * (cellSize + cellSpacing)

  const drawWithContext = (context = ctx) => {
    context.clearRect(0, 0, side, side)
    cells().forEach((d, i) => {
      context.fillRect(cellX(i), cellY(i), cellSize, cellSize)
      context.fillStyle = `rgb(0, 0, 0, ${d.valence})`
      context.stroke()
    })
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Smooth Life in Canvas</h1>
      <h3>Iteration: {iter()}</h3>
      <label for='cells'>
        Cells:{' '}
        <input
          style={{ display: 'inline', width: 'fit-content' }}
          id='cells'
          type='text'
          ref={input}
          value={cells().length}
        />
      </label>
      <canvas
        style={{ border: '1px solid white', background: 'white' }}
        ref={canvas}
        height={side}
        width={side}
      />
    </div>
  )
}

export default smoothlife
