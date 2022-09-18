import { Component, onMount, onCleanup, createSignal, createEffect } from 'solid-js'

const [mousedown, setMousedown] = createSignal(false)

const Canvas: Component<{}> = (props) => {
  // canvas for drawing app
  const [painting, setPainting] = createSignal(false)
  const [dim, setDim] = createSignal({ width: 800, height: 500 })
  const [color, setColor] = createSignal('black')
  const [opacity, setOpacity] = createSignal(1)
  const [blur, setBlur] = createSignal(false)
  const [lineWidth, setLineWidth] = createSignal(10)
  let canvas
  let ctx
  const handleGlobalMouseDown = (e) => setMousedown(true)
  const handleGlobalMouseUp = (e) => setMousedown(false)
  onMount(() => {
    document.addEventListener('mousedown', handleGlobalMouseDown)
    document.addEventListener('mouseup', handleGlobalMouseUp)
    ctx = canvas.getContext('2d')
    ctx.strokeStyle = color()
    // ctx.beginPath();
    // ctx.moveTo(100,100)
    // ctx.lineTo(200,100)
    // ctx.lineTo(200,150)
    // ctx.closePath()
    // ctx.stroke()
    let mag = 200
    let panX = 2
    let panY = 1.25
    let maxIter = 100

    for (let x = 3; x < dim().width; x++) {
      for (let y = 3; y < dim().height; y++) {
        let m = mandelbrotIter(x / mag - panX, y / mag - panY, maxIter)
        ctx.fillStyle = m === 0 ? '#fff' : 'hsl(0, 100%, ' + (100 - m) + '%)'
        ctx.fillRect(x, y, 1, 1)
      }
    }

    ctx.stroke()
  })

  createEffect(() => {
    ctx.strokeStyle = color()
    ctx.globalAlpha = opacity()
  })

  onCleanup(() => {
    document.removeEventListener('mousedown', handleGlobalMouseDown)
    document.removeEventListener('mouseup', handleGlobalMouseUp)
  })

  const draw = (e) => {
    if (!painting()) return
    ctx.lineWidth = lineWidth()
    ctx.lineCap = 'round'
    ctx.shadowBlur = blur() ? 20 : 0
    ctx.shadowColor = blur() ? ctx.strokeStyle : 'rgba(0, 0, 0)'
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(e.offsetX, e.offsetY)
    // console.log('draw', e)
  }

  const startPainting = (e) => {
    setPainting(true)
    draw(e)
  }
  const endPainting = () => {
    setPainting(false)
    ctx.beginPath()
  }

  const makeitBlack = (context = ctx) => {
    console.log('black', ctx, context, color())
    context.fillStyle = 'black'
    context.fillRect(0, 0, dim().width, dim().height)
    context.stroke()
  }

  return (
    <div>
      <h1>Canvas</h1>
      <div class='flex gap-5'>
        <canvas
          ref={canvas}
          style={{ border: '1px solid white' }}
          class='canvas grow'
          width={dim().width}
          height={dim().height}
          onMouseDown={(e) => startPainting(e)}
          onMouseUp={() => endPainting()}
          onMouseLeave={() => endPainting()}
          onMouseEnter={(e) => {
            if (mousedown()) startPainting(e)
          }}
          onMouseMove={draw}
        />
        <div class='flex flex-col controls'>
          <label for='color'>Color: {color()}</label>
          <input
            id='color'
            type='color'
            class='shrink'
            onInput={(e) => setColor(e.currentTarget.value)}
          />
          <label for='glow'>
            <input
              id='glow'
              type='checkbox'
              onInput={() => setBlur((prev) => !prev)}
            />{' '}
            Glow
          </label>
          <label for='range'>Opacity: {opacity()}</label>
          <input
            id='range'
            type='range'
            value='1'
            min='0'
            max='1'
            step='0.01'
            onInput={(e) => setOpacity(Number(e.currentTarget.value))}
          />
          <label for='range'>Line Width: {lineWidth()}</label>
          <input
            id='range'
            type='range'
            value='10'
            min='1'
            max='20'
            onInput={(e) => setLineWidth(Number(e.currentTarget.value))}
          />
          <button onClick={() => makeitBlack(ctx)}>Make it Black</button>
        </div>
      </div>
    </div>
  )
}

export default Canvas

function mandelbrotIter(x, y, maxIter) {
  let r = x
  let i = y
  for (let a = 0; a < maxIter; a++) {
    let tmpr = r * r - i * i + x
    let tmpi = 2 * r * i + y

    r = tmpr
    i = tmpi

    if (r * i > 5) {
      return (a / maxIter) * 100
    }
  }

  return 0
}
