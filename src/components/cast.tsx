import { For } from 'solid-js'
import type { CastType } from '../pages/stargazers'

interface Props {
  list: CastType[];
  keyword: string;
}

export const Cast = (props: Props) => {
  return (
    <div style={{
      display: "grid", 
      "justify-items": "center", 
      "align-items": "center", 
      "grid-template-columns": "1fr 1fr 1fr 1fr", 
      gap: "15px", 
      "text-align": "center"
    }}>
      <label style={{"grid-column": "1 / -1"}}><b>Search for: </b><p>{props.keyword}</p></label>
      <For each={props.list}>
        {item => (
          <article>
            <img src={`https://api.multiavatar.com/${item.name}.png`} alt={item.name} loading='lazy' width={100} />
            <div>{item.name}</div>
          </article>
        )}
      </For>
    </div>
  )
}
