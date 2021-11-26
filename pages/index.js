import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession();
  if(session) {
    return <>
      Signed in as {session.user.name} <br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>
  }
  return <>
    Not signed in <br/>
    <button onClick={() => signIn("spotify", { callbackUrl: "releasify-web-git-dev-jorepstein.vercel.app" })}>Sign in</button>
  </>
}
