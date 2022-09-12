import { Component, onMount, createSignal, onCleanup } from 'solid-js'

const conway: Component<{}> = (props) => {
  let cols = 200
  const [cells, setCells] = createSignal(
    Array.from({ length: cols ** 2 }).map((_, i) => ({ value: i - 1, alive: !!(Math.random() > 0.55) }))
  )
  const [iter, setIter] = createSignal(0)

  let canvas, ctx, input, timer
  let side = 600,
    groupSpacing = 0,
    cellSpacing = 1,
    cellSize = side / cols - cellSpacing,
    limit = 100
  console.log(cols)
  /* 
  DEFAULT RULES: 
  Any live cell with 2 or 3 live neighbors => live
  Any dead cell with 3 live neighbors => live
  Any other dead OR live cell => dead 
  */
  const nextStatus = (living, neighbors: number) => {
    switch (neighbors) {
      case 2:
        return living ? true : false
      case 3:
        return true
      // case 4:
      //   return living ? false : true
      // case 5:
      //   return living ? true : false
      // case 6:
      //   return true
      // case 7:
      //   return true
      // case 8:
      //   return true
      // case 9:
      //   return true
      default:
        return false
    }
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
          const neighbors = [
            arr[j - 1]?.alive,
            arr[j + 1]?.alive,
            arr[j - cols]?.alive,
            arr[j - cols - 1]?.alive,
            arr[j - cols + 1]?.alive,
            arr[j + cols]?.alive,
            arr[j + cols - 1]?.alive,
            arr[j + cols + 1]?.alive,
          ].filter((cell) => cell).length
          return { value: cell.value, alive: nextStatus(cell.alive, neighbors) }
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
      context.fillStyle = d.alive ? 'aliceblue' : 'rebeccapurple'
      context.stroke()
    })
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Conway's Game of Life in Canvas</h1>
      <h3>Iteration: {iter()}</h3>
      <input
        type='text'
        ref={input}
        value={cells().length}
      />
      <canvas
        style={{ border: '1px solid white', background: 'indigo' }}
        ref={canvas}
        height={side}
        width={side}
      />
    </div>
  )
}

export default conway
