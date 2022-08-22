import { Component, For, createSignal } from "solid-js";

class DefaultProps {
  totalPages: number
  initialCursor?: number = 0
  pagesBuffer?: number = 5
}
interface PaginationProps{
  totalPages: number
  initialCursor?: number
  pagesBuffer?: number
}

const Pagination: Component<PaginationProps> = (props: DefaultProps) => {
  const [cursor, setSafeCursor] = createSignal(props.initialCursor ?? 0);
  const [bufferPad, setBufferPad] = createSignal(props.pagesBuffer ?? 5)
  const buffer = Array.from({length: props.totalPages}).map((_, i) => i)

  console.log('b', props.pagesBuffer, bufferPad())

  if (!props.totalPages) {
    throw new Error('Must provide total pages & pages buffer as prop for Pagination component');
  }

  const setCursor = (newCursor) => {
      if (newCursor >= 0 && newCursor < props.totalPages) {
          setSafeCursor(newCursor);
      }
  };

   return (
      <div class='flex'>
        <style>{`.selected {background-color: dodgerblue}`}</style>
          <button 
           class='mx-12' 
           onClick={() => setCursor(cursor() - 1)} 
           disabled={cursor() === 0}
          >
          ⇦
          </button>
          {cursor() > 3 &&
          <>
            <span 
            class='border-2 mx-2 px-2 rounded hover:bg-blue-900' 
            classList={{selected: 1 === cursor()}} 
            onClick={() => setCursor(1)}
            >
              1
            </span>
            <span>...</span>
          </>
          }
          <For each={
            buffer.slice(
                Math.max(cursor() - 2, 0), 
                Math.max(cursor() + 3, bufferPad())
              )
            }
          >
            {(pos, i) => {

              return pos < props.totalPages ? (
                  <span 
                  class='border-2 mx-2 px-2 rounded hover:bg-blue-900' 
                  classList={{selected: pos === cursor()}} 
                  onClick={() => setCursor(pos)}
                  >
                      {pos + 1}
                  </span>
              ) : null;
            }}
          </For>
          {props.totalPages - cursor() > 3 &&
          <>
            <span>...</span>
            <span 
            class='border-2 mx-2 px-2 rounded hover:bg-blue-900' 
            classList={{selected: props.totalPages === cursor()}} 
            onClick={() => setCursor(props.totalPages - 1)}
            >
              {props.totalPages}
            </span>
          </>
          }
          <button 
            class='mx-12' 
            onClick={() => setCursor(cursor() + 1)} 
            disabled={cursor() === props.totalPages - 1}
          >
          ⇨
          </button>
      </div>
   )
};

export default Pagination
