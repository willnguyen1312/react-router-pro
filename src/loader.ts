export async function loader({ request }: any) {
  console.log("Loading data");

  await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const response = await fetch("/users", {
    signal: request.signal,
  });
  return response.json();
}
