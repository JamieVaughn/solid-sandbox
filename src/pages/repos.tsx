import { Component, createEffect, createResource, createSignal, For, Show, Suspense } from 'solid-js';
import RepoCard from '../components/RepoCard';
import { debounce } from '../utils';

const url = path => `https://api.github.com/users/${path}/repos?sort=created`;

type Repo = {
  id: string
  node_id: string
  name: string
  language: string
  stargazers_count: number
}

const Repos: Component = () => {
  const [username, setUsername] = createSignal('')

  // bad react pattern - don't do this in solidjs
  // createEffect( async () => {
  //   const res = await fetch(url(username()));
  //   const data = await res.json()
  //   console.log(data)
  // })

  const save = debounce((str) => {
    setUsername(str)
    console.log('str', username())
  })

  const [data, {mutate, refetch}] = createResource<Repo[]>(async () => {
    const res = await fetch(url(username()));
    const data = await res.json()
    console.log('resource', data)
    return data
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
      <Show when={!data()?.length || username().length} fallback={<p>Repo is being searched.</p>} >
        <h3>Github repos for {username()}:</h3>
        <For each={data()}>
          {repo => {
            console.log(repo)
            return <RepoCard name={repo.name} language={repo.language} stars={repo.stargazers_count} />
          }}
        </For>
      </Show>
    </section>
  );
}

export default Repos
