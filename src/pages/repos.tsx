import { Component, createEffect, createResource, createSignal, For, Show, Suspense } from 'solid-js';
import RepoCard from '../components/RepoCard';
import { debounce } from '../utils';

const url = path => `https://api.github.com/users/${path}/repos?sort=created`;

export type Repo = {
  id: string
  html_url: string
  node_id: string
  name: string
  language: string
  stargazers_count: number
  description: string
  owner: {
    login: string
  }
}

const [username, setUsername] = createSignal('')
const [data, {mutate, refetch}] = createResource<Repo[]>(async () => {
  if(username().length === 0) return []
  const res = await fetch(url(username()));
  const data = await res.json()
  console.log('resource', data)
  return data
})

// TODOS: pagination, filter input for lists, laoding spinner, error handling, feedback msg if no repos found, 

const Repos: Component = () => {

  // obsolete react pattern - don't do this in solidjs
  // createEffect( async () => {
  //   const res = await fetch(url(username()));
  //   const data = await res.json()
  //   console.log(data)
  // })

  const save = debounce((str) => {
    setUsername(str)
  })

  

  // createEffect(() => {
  //   username()
  //   refetch()
  // })

  return (
    <section class="text-gray-700 p-8">
      <h1 class="text-2xl font-bold">Repos</h1>
      <form onSubmit={e => {e.preventDefault(); refetch()}}>
        <input type="text" onKeyUp={e => save(e.currentTarget.value)}/>
        <button disabled={!username().length} type='submit'>Submit</button>
        <button onClick={() => setUsername('')}>Clear</button>
      </form>
      <Show when={data()?.length || username().length} fallback={<p>Repo is being searched.</p>} >
        <h3>Github repos for {username()}:</h3>
        <div 
        class='grid gap-0.5 grid-flow-dense grid-cols-3' 
        // style={{'grid-template-columns': 'repeat(auto-fit, minmax(300px, 1fr))'}}
        >
        <For each={data()}>
          {repo => {
            return <RepoCard data={repo} />
          }}
        </For>
        </div>
      </Show>
    </section>
  );
}

export default Repos
