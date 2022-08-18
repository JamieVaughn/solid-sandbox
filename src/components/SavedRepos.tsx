import { Component, createSignal, For } from "solid-js";
import RepoCard from "./RepoCard";

const reposLocalStore = JSON.parse(localStorage.getItem("savedRepos") || "[]")
const [savedRepos, setSavedRepos] = createSignal(reposLocalStore)

const SavedRepos: Component<{}> = (props) => {
  
  return (
    <section class="text-gray-700 p-8">
      <h1 class="text-2xl font-bold">Your Saved Repos ({savedRepos().length})</h1>
      <For each={savedRepos()}>
        { repo => <RepoCard data={repo} saved={true} />}
      </For>
    </section>
  )
};

export { savedRepos, setSavedRepos }
export default SavedRepos
