import { useSession, signIn, signOut } from "next-auth/react"
import {useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default function Component() {

  const {data: session} = useSession();
  const [list, setList] = useState([]);

  const getMyPlaylists = async () => {
    const res = await fetch('/api/playlists');
    console.log(res);
    const {items} = await res.json();
    setList(items);
    console.log(items);
  };

  if(session) {
    return (
      <>
        Signed in as {session?.token?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <hr />
        <button onClick={() => getMyPlaylists()}>Get all my playlists</button>
        {list.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
            <img src={item.images[0]?.url} width="100" />
          </div>
        ))}
      </>
    );
  }
  return <>
    Not signed in <br/>
    <button onClick={() => signIn("spotify")}>Sign in</button>
  </>
}

function PlaylistList() {
  return <List>

  </List>
}
