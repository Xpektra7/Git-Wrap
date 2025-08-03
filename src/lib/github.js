export async function fetchEvents(username) {
  const res = await fetch(`https://api.github.com/users/${`Xpektra7`}/events`)
  return res.json()
}
