import { Component, splitProps } from "solid-js";
import { setSavedRepos } from "./SavedRepos";
import type { Repo } from "../pages/repos";

const RepoCard: Component<{data: Repo, saved?: boolean}> = (props) => {
  const [local, others] = splitProps(props.data, ['stargazers_count', 'name', 'description', 'html_url', 'owner']);

  const toggleSavedRepo = (repo: Repo) => {
    if(props.saved) {
      setSavedRepos(state => {
        const filtered = state.filter(item => item.id !== repo.id)
        localStorage.setItem('savedRepos', JSON.stringify(filtered))
        return filtered
      })
    } else {
      setSavedRepos(state => {
        const saved = state.concat(repo)
        localStorage.setItem('savedRepos', JSON.stringify(saved))
        return saved
      })
    }
  }

  return ( 
    <div class="p-2 bg-indigo-800 items-center text-indigo-100 leading-none rounded flex lg:inline-flex m-2" role="alert">
      <div class='flex flex-col gap-3'>
        <div class="rounded-full border bg-indigo-300 uppercase px-2 py-1 text-xs text-center text-slate-700 font-bold mr-3">
          {local.stargazers_count} ⭐
        </div>
        <span 
        class="cursor-pointer rounded-full bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-900 uppercase px-2 py-1 text-xs font-bold mr-3"
        onClick={() => toggleSavedRepo(props.data)}
        >
          {props.saved ? '🚫unsave' : '➕save'}
        </span>
      </div>
      <span class="font-semibold mr-2 text-left flex-auto w-48">
        <h3 class="text-slate-100">
          <a href={local.html_url} class="text-decoration-none" target="_blank" rel="noreferrer">
            <strong>{local.owner.login}</strong>/{local.name}
          </a>
        </h3>
        <div class="font-semibold text-sm text-slate-400">{local.description}</div>
      </span>
      
    </div>
  );
};

export default RepoCard
