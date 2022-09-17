import { createSignal, For, Show } from 'solid-js'

export default function Home() {
  const [count, setCount] = createSignal(0)
  const [filenames, setFilenames] = createSignal([])
  const [hovering, setHovering] = createSignal(false)
  const [imgSrc, setImgSrc] = createSignal({})

  const dragEnterHandler = (e) => setHovering(true)
  const dragLeaveHandler = (e) => setHovering(false)
  const dragOverHandler = (e) => {
    e.stopPropagation()
    e.preventDefault()
    return
  }
  const dropHandler = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // access files from clipboard
    const fileList = Array.from(e.dataTransfer.files)
    console.log(fileList)
    setFilenames(filenames().concat(fileList))
  }

  const handleImgLoad = (file) => {
    if (!file.type.includes('image')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImgSrc((prev) => ({ ...prev, [file.name]: e.target.result }))
      console.log('onload', imgSrc())
    }
    const result = reader.readAsDataURL(file)
  }

  const handleUpload = (e) => {
    console.log('input', e)
    const fileList = Array.from(e.target.files)
    setFilenames(filenames().concat(fileList))
  }

  return (
    <section class='text-gray-300 p-8'>
      <h1 class='text-2xl font-bold'>Home Page</h1>

      <div class='flex flex-row-reverse items-center space-x-2 w-50 my-0 mx-auto'>
        <button
          class='border rounded-lg px-4 border-gray-200 w-min'
          onClick={() => setCount(count() + 1)}
        >
          +
        </button>

        <output class='p-10px w-75 text-center'>Count: {count}</output>

        <button
          class='border rounded-lg px-4 border-gray-200 w-min'
          onClick={() => setCount(count() - 1)}
        >
          -
        </button>
      </div>
      <h2>File Uploader:</h2>
      <input
        type='file'
        multiple
        onChange={handleUpload}
      />
      <input
        type='file'
        webkitdirectory={true}
        onChange={handleUpload}
      />
      <div
        classList={{ dropzone: true, draggedOver: hovering() }}
        onDragEnter={dragEnterHandler}
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
        onDragLeave={dragLeaveHandler}
      />
      <ul>
        <For each={filenames()}>
          {(file) => {
            handleImgLoad(file)
            return (
              <>
                {/* <li onClick={() => (file.type.includes('image') && !(file.name in imgSrc()) ? handleImg(file) : null)}> */}
                <li>{file.name}</li>
                <Show when={file.name in imgSrc()}>
                  <li>
                    <img src={imgSrc()[file.name]} />
                  </li>
                </Show>
              </>
            )
          }}
        </For>
      </ul>
    </section>
  )
}
