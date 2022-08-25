import { Component, onMount, onCleanup, createSignal } from 'solid-js'
import * as d3 from 'd3'

const grid: Component<{}> = (props) => {
  let canvas, ctx, svgEl
  const data = d3.range(5000).map((i) => ({ value: i }))
  let width = 750,
    height = 400,
    groupSpacing = 4,
    cellSpacing = 2,
    offsetTop = height / 5,
    cellSize = Math.floor((width - 11 * groupSpacing) / 100) - cellSpacing

  onMount(() => {
    ctx = canvas.getContext('2d')
    databind(d3.range(data))
    let timer = d3.timer((elapsed) => {
      draw()
      if (elapsed > 300) timer.stop()
    })
  })
  const databind = (data) => {
    let svg = d3.select(svgEl)
    let colorScale = d3.scaleSequential(d3.interpolateSpectral).domain(d3.extent(data, (d) => d))
    let join = svg.selectAll('svg.rect').data(data)
    var enterSel = join
      .enter()
      .append('rect')
      .attr('class', 'rect')
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
      .attr('fillStyle', function (d) {
        return colorScale(d)
      })
    let exitSel = join.exit().transition().attr('width', 0).attr('height', 0).remove()
  }

  const draw = () => {
    ctx.clearRect(0, 0, width, height)
    let els = svgEl.selectAll('rect.rect')
    els.each(function (d, i) {
      let node = d3.select(this)
      ctx.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'))
    })
  }
  return (
    <div class='p-5'>
      <h3>Colored Grids</h3>
      <label for='cells'>Set number of cells (1-10k)</label>
      <input id='cells' type='number' value='5000' min='1' max='10000' />
      <canvas ref={canvas} height={height} width={width} />
      <svg ref={svgEl} class='rect'></svg>
    </div>
  )
}

export default grid
