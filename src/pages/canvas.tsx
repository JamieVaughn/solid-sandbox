import { Component, onMount, onCleanup, createSignal, createEffect } from "solid-js";

const [mousedown, setMousedown] = createSignal(false);

const Canvas: Component<{}> = (props) => {
  // canvas for drawing app
  const [painting, setPainting] = createSignal(false);
  let canvas
  let ctx
  const handleGlobalMouseDown = (e) => setMousedown(true)
  const handleGlobalMouseUp = (e) => setMousedown(false)
  onMount(() => {
      document.addEventListener('mousedown', handleGlobalMouseDown)
      document.addEventListener('mouseup', handleGlobalMouseUp)
      ctx = canvas.getContext("2d");  
      ctx.strokeStyle = 'white'
      // ctx.fillRect(100,100,300,300)
      // ctx.beginPath();
      // ctx.moveTo(100,100)
      // ctx.lineTo(200,100)
      // ctx.lineTo(200,150)
      // ctx.closePath()
      // ctx.stroke()
  })

  onCleanup(() => {
    document.removeEventListener('mousedown', handleGlobalMouseDown)
    document.removeEventListener('mouseup', handleGlobalMouseUp)
  })

  const draw = (e) => {
    if(!painting()) return
    ctx.lineWidth = 10
    ctx.lineCap = "round"
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

  createEffect(() => {
    console.log('painting', painting())
  })

  return (
    <div>
      <h1>Canvas</h1>
      <canvas 
      ref={canvas} 
      style={{border: '1px solid white'}}
      class='canvas' 
      width={500} 
      height={300} 
      onMouseDown={(e) => startPainting(e)}
      onMouseUp={() => endPainting()}
      onMouseLeave={() => endPainting()}
      onMouseEnter={(e) => {if(mousedown()) startPainting(e)}}
      onMouseMove={draw}
      />
    </div>
  )
};

export default Canvas
