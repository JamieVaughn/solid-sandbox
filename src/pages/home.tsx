import { createSignal, For } from 'solid-js'

export default function Home() {
  const [count, setCount] = createSignal(0)
  const [filenames, setFilenames] = createSignal([])
  const [hovering, setHovering] = createSignal(false)

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
            return <li>{file.name}</li>
          }}
        </For>
      </ul>
    </section>
  )
}
