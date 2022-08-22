import {createResource, createSignal, Show} from 'solid-js'
import { Cast } from '../components/cast'
import Pagination from '../components/pagination';

export interface CastType {
  id: number;
  name: string;
  slug: string;
  bio: string;
  origin: string;
  eyes: number;
  hobby: string;
  ambulation: string;
  job_title: string;
  dream_job_title: string;
  singing_voice: string;
  favorites: {
    food: string;
    music_genre: string;
    book: string;
    footwear: string;
  };
}

function Stargazers() {
  const [keyword, setKeyword] = createSignal<string>('')
  const [castlist] = createResource<CastType[]>(keyword, async () => {
    return fetch('./cast.json')
      .then(res => res.json())
      .then(data => data.filter(item => item.name.toLowerCase().match(keyword().toLowerCase())))
  })
  return (
  <div class='container p-12'>
    <h1>Stargazers</h1>
    <input type='text' onKeyUp={e => setKeyword(e.currentTarget.value)} />
    <Show when={keyword()} fallback={<p>Cast members await being discovered.</p>}>
      <Cast list={castlist()} keyword={keyword()} />
      <Pagination pagesBuffer={5} totalPages={10} />
    </Show>
  </div>
  )
}

export default Stargazers
