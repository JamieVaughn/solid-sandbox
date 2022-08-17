import { Component, createEffect, createResource, createSignal, For, Show } from 'solid-js';

const url = path => `https://api.github.com/users/${path}/repos?sort=created`;

type Repo = {
  id: string
  node_id: string
  name: string
  language: string
}

const Repos: Component = () => {
  const [username, setUsername] = createSignal('JamieVaughn')
  const [ready, setReady] = createSignal(false)

  // createEffect( async () => {
  //   const res = await fetch(url(username()));
  //   const data = await res.json()
  //   console.log(data)
  // })

  const [data] = createResource<Repo[]>(ready, async () => {
    const res = await fetch(url(username()));
    const data = await res.json()
    console.log('resource', data)
    return data
  })

  return (
    <section class="text-gray-700 p-8">
      <h1 class="text-2xl font-bold">Repos</h1>
      <input type="text" value={username()} onKeyUp={e => setUsername(e.currentTarget.value)}/>
      <button onClick={e => setReady(true)}>Submit</button>
      <button onClick={e => {setReady(false); setUsername('')}}>Clear</button>
      <Show when={data()} fallback={<p>Repos await being searched.</p>}>
        <For each={data()}>
          {repo => (
            <div>{repo.name}</div>
          )}
        </For>
      </Show>
    </section>
  );
}

export default Repos
