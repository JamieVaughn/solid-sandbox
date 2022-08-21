import { createSignal } from 'solid-js';

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <section class="text-gray-300 p-8">
      <h1 class="text-2xl font-bold">Home Page</h1>

      <div class="flex flex-row-reverse items-center space-x-2 w-50 my-0 mx-auto">
        <button
          class="border rounded-lg px-4 border-gray-200 w-min"
          onClick={() => setCount(count() + 1)}
        >
          +
        </button>

        <output class="p-10px w-75 text-center">Count: {count}</output>

        <button
          class="border rounded-lg px-4 border-gray-200 w-min"
          onClick={() => setCount(count() - 1)}
        >
          -
        </button>
      </div>
    </section>
  );
}
