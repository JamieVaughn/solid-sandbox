import { Component } from "solid-js";

const RepoCard: Component<{name: string, stars: number, language: string}> = (props) => {
  
  return ( 
    <div>
      <h1>{props.name}</h1>
      <p>{props.stars} - {props.language}</p>
    </div>
  );
};

export default RepoCard
