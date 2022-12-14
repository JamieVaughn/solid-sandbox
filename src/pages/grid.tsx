import { Component, onMount, onCleanup, createSignal } from 'solid-js'
import * as d3 from 'd3'

const grid: Component<{}> = (props) => {
  let canvas,
    ctx,
    hiddenCanvas,
    hiddenCtx,
    svgEl,
    tooltip,
    input,
    className = 'rect',
    colorToNode = {}
  const data = d3.range(5000).map((i) => ({ value: i }))
  let width = 750,
    height = 400,
    groupSpacing = 4,
    cellSpacing = 2,
    offsetTop = height / 5,
    cellSize = Math.floor((width - 11 * groupSpacing) / 100) - cellSpacing

  let colorScale = d3.scaleSequential(d3.interpolateSpectral).domain(d3.extent(data, (d) => d.value))
  // const interpolate = d3.scaleSequential(d3.interpolateRgb).domain(d3.extent(data, (d) => d.value))
  // const spectral = d3.scaleDiverging(d3.interpolateSpectral)
  onMount(() => {
    ctx = canvas.getContext('2d')
    hiddenCtx = hiddenCanvas.getContext('2d')

    databind(data)
    // databind(data, hiddenCanvas)
    let timer = d3.timer((elapsed) => {
      draw(canvas, false)
      if (elapsed > 300) timer.stop()
    })
    // draw()
  })
  const databind = (data, curCanvas = canvas) => {
    // let svg = d3.select(svgEl)
    let cnvs = d3.select(curCanvas)
    // let joinsvg = svg.selectAll(className).data(data)
    let join = cnvs.selectAll(`canvas-${className}`).data(data)
    var enterSel = join
      .enter()
      .append(`canvas-${className}`)
      .attr('class', `canvas-${className}`)
      .attr('x', (d, i) => {
        var x0 = Math.floor(i / 100) % 10,
          x1 = Math.floor(i % 10)
        return groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10)
      })
      .attr('y', (d, i) => {
        var y0 = Math.floor(i / 1000),
          y1 = Math.floor((i % 100) / 10)
        return groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10)
      })
      .attr('width', 0)
      .attr('height', 0)

    join
      .merge(enterSel)
      .transition()
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fillStyle', (d) => {
        // console.log('color', d, i)
        // return spectral(d.value)
        // return interpolate(d.value)
        // console.log('data', data, d)
        return d3.scaleSequential(d3.interpolateSpectral).domain(d3.extent(data, (d) => d.value))
      })
      .attr('fillStyleHidden', (d, i) => {
        if (!d.hiddenCol) {
          d.hiddenCol = genColorFromPos(i)
          colorToNode[d.hiddenCol] = d
        }
        return d.hiddenCol
      })
    // console.log('hash', colorToNode)
    let exitSel = join.exit().transition().attr('width', 0).attr('height', 0).remove()

    d3.select(input).on('keydown', (e) => {
      console.log(e)
      if (e.key === 'Enter') {
        if (+e.currentTarget.value < 1 || +e.currentTarget.value > 10000) {
          // If the user goes lower than 1 or higher than 10k...
          alert('Input out of range')
          return
        } else {
          const array = d3.range(+e.currentTarget.value).map((v, i) => ({ value: i }))
          console.log(array)
          databind(array)
          var t = d3.timer(function (elapsed) {
            draw()
            if (elapsed > 300) t.stop()
          })
          draw()
        }
      }
    })

    d3.select(canvas).on('mousemove', (e) => {
      const mouseX = e.offsetX
      const mouseY = e.offsetY
      const color = hiddenCtx.getImageData(mouseX, mouseY, 1, 1).data
      const colorKey = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
      const node = colorToNode[colorKey]
      // console.log('hidden', e, mouseX, mouseY)
      console.log('map', colorKey)
      if (node) {
        // Show the tooltip
        d3.select(tooltip)
          .style('opacity', 0.8)
          .style('top', e.pageY + 5 + 'px')
          .style('left', e.pageX + 5 + 'px')
          .html(colorKey)
      } else {
        // Hide the tooltip
        d3.select(tooltip).style('opacity', 0)
      }
    })
  }

  const draw = (curCanvas = canvas, hidden = false) => {
    // ctx.clearRect(0, 0, width, height)
    // const curCtx = hidden ? hiddenCtx : ctx
    let svg = d3.select(curCanvas)
    let els = svg.selectAll(`canvas-${className}`)
    els.each(function (d, i) {
      let node = d3.select(this)
      ctx.fillStyle = hidden ? node.attr('fillStyleHidden') : node.attr('fillStyle')
      ctx.fillStyle = hidden ? genColorFromPos(i) : colorScale(d.value)
      ctx.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'))
    })
    ctx.stroke()
  }

  // draw(hiddenCanvas, true)

  let numRgbBytes = 16777215
  let rgbBytes = 0xffffff
  // let pixels = d3.range(numRgbBytes)
  // console.log(pixels[200], pixels[2000], pixels[20000])
  // console.log(pixels[200000] % 256, (pixels[200000] / 256) % 256, (pixels[200000] / 65536) % 256) // less performant and yeilds decimals, compared to bitwise below
  // let bits = d3.range(rgbBytes)
  // console.log(bits[200])
  // console.log(pixels[200000] & 0xff, (pixels[200000] & 0xff00) >> 8, (pixels[200000] & 0xff0000) >> 16)

  function genColorFromPos(buffer = 1) {
    let ret = []
    if (buffer < rgbBytes) {
      ret.push(buffer & 0xff) // R
      ret.push((buffer & 0xff00) >> 8) // G
      ret.push((buffer & 0xff0000) >> 16) // B
    }
    return `rgb(${ret.join(',')})`
  }

  return (
    <div class='p-5 relative'>
      <h3>Colored Grids</h3>
      <label for='cells'>Set number of cells (1-10k)</label>
      <input
        ref={input}
        id='cells'
        type='number'
        value='5000'
        min='1'
        max='10000'
      />
      <canvas
        ref={canvas}
        height={height}
        width={width}
        class='custom border'
      />
      <canvas
        ref={hiddenCanvas}
        height={height}
        width={width}
        style={{ display: 'block' }}
      />
      {/* <svg ref={svgEl} height={height} width={width} class='rect'></svg> */}
      <span
        ref={tooltip}
        style={{ position: 'absolute' }}
      >
        .
      </span>
    </div>
  )
}

export default grid
