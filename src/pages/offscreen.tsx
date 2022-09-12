import { Component, onMount, createSignal, createEffect } from 'solid-js'
import * as d3 from 'd3'

const offscreen: Component<{}> = (props) => {
  const [data, setData] = createSignal(Array.from({ length: 5001 }).map((_, i) => ({ value: i - 1 })))
  const [tooltipContent, setTooltipContent] = createSignal('')
  let canvas,
    ctx,
    hiddenCanvas,
    hiddenCtx,
    tooltip,
    input,
    colorToNode = {}
  let width = 750,
    height = 400,
    groupSpacing = 4,
    cellSpacing = 2,
    cellSize = (width - 11 * groupSpacing) / 100 - cellSpacing

  let colorScale = d3.scaleSequential(d3.interpolateSpectral).domain(d3.extent(data(), (d) => d.value))
  // const interpolate = d3.scaleSequential(d3.interpolateRgb).domain(d3.extent(data, (d) => d.value))
  // const spectral = d3.scaleDiverging(d3.interpolateSpectral)
  onMount(() => {
    ctx = canvas.getContext('2d')
    hiddenCtx = hiddenCanvas.getContext('2d')
    drawWithContext(ctx, false)
    drawWithContext(hiddenCtx, true)
  })

  const colorProviderX = (i) => {
    let x0 = Math.floor(i / 100) % 10,
      x1 = Math.floor(i % 10)
    const cell = groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10)
    return cell
  }
  const colorProviderY = (i) => {
    let y0 = Math.floor(i / 1000),
      y1 = Math.floor((i % 100) / 10)
    const cell = groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10)
    return cell
  }

  const drawWithContext = (context = ctx, hidden = false) => {
    context.clearRect(0, 0, width, height)
    data().forEach((d, i) => {
      context.fillRect(colorProviderX(d.value), colorProviderY(d.value), cellSize, cellSize)
      let color = hidden ? genColorFromPos(d.value) : colorScale(d.value)
      if (hidden) {
        colorToNode[color] = i
      }
      context.fillStyle = color
      context.stroke()
    })
  }

  let numRgbBytes = 16777215
  let rgbBytes = 0xffffff
  // let pixels = d3.range(numRgbBytes)
  // console.log(pixels[200], pixels[2000], pixels[20000])
  // console.log(pixels[200000] % 256, (pixels[200000] / 256) % 256, (pixels[200000] / 65536) % 256) // less performant and yeilds decimals, compared to bitwise below
  // let bits = d3.range(rgbBytes)
  // console.log(bits[200])
  // console.log(pixels[200000] & 0xff, (pixels[200000] & 0xff00) >> 8, (pixels[200000] & 0xff0000) >> 16)

  function genColorFromPos(buffer = 0) {
    let ret = []
    if (buffer < rgbBytes) {
      ret.push(buffer & 0xff) // R
      ret.push((buffer & 0xff00) >> 8) // G
      ret.push((buffer & 0xff0000) >> 16) // B
    }
    return `rgb(${ret.join(',')})`
  }

  const handleEnter = (e) => {
    console.log(e)
    if (e.key === 'Enter') {
      if (+e.currentTarget.value < 1 || +e.currentTarget.value > 10_000) {
        // If the user goes lower than 1 or higher than 10k...
        alert('Input out of range')
        return
      } else {
        setData(Array.from({ length: +e.currentTarget.value + 1 }).map((v, i) => ({ value: i - 1 })))
        console.log(data())

        drawWithContext(ctx, false)
      }
    }
  }

  const handleMouseMove = (e) => {
    const mouseX = e.offsetX
    const mouseY = e.offsetY
    const color = hiddenCtx.getImageData(mouseX, mouseY, 1, 1).data
    const colorKey = `rgb(${color[0]},${color[1]},${color[2]})`
    const node = colorToNode[colorKey]
    // console.log('hidden', e, mouseX, mouseY)
    // console.log('nodeMap', colorKey, node)
    if (node) {
      // Show the tooltip
      tooltip.style.setProperty('opacity', 0.8)
      console.log(mouseX, mouseY)
      // tooltip.style.setProperty('transform', `translate(${mouseX}px, ${mouseY}px)`)
      tooltip.style.transform = `translate(${mouseX + 10}px, ${mouseY + 150}px)`
      setTooltipContent(node)
    } else {
      // Hide the tooltip
      tooltip.style.setProperty('opacity', 0)
    }
  }

  const clearTooltip = () => {
    tooltip.style.setProperty('opacity', 0)
  }

  return (
    <div class='p-5 relative'>
      <style>
        {`.ctx-tooltip {
          position: absolute;
          display: flex;
          opacity: 0;
          justify-content: space-between;
          background: black;
          color: white;
          width: 200px;
        }`}
      </style>
      <div
        ref={tooltip}
        class='ctx-tooltip'
      >
        <span>NodeMap:</span>
        <span>{tooltipContent()}</span>
      </div>
      <h3>Offscreen Canvas for tooltip</h3>
      <label for='cells'>Set number of cells (1-10k)</label>
      <input
        ref={input}
        type='number'
        value='5000'
        min='1'
        max='10000'
        onKeyDown={handleEnter}
      />
      <div class='container'>
        <canvas
          class='custom border'
          ref={canvas}
          height={height}
          width={width}
          onMouseMove={handleMouseMove}
          onMouseOut={clearTooltip}
        />
      </div>
      <canvas
        ref={hiddenCanvas}
        height={height}
        width={width}
      />
    </div>
  )
}

export default offscreen
