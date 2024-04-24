import { Link, Outlet, useLoaderData, useRevalidator } from "react-router-dom";

export function Layout() {
  const response = useLoaderData() as any;
  const revalidator = useRevalidator();

  return (
    <main>
      <h1>Sample App</h1>

      <h2>List of users:</h2>

      <ul>
        {response.users.map((user: any) => (
          <li key={user.id}>
            {user.firstName} {user.lastName}
          </li>
        ))}
      </ul>

      <nav>
        <ul>
          <li>
            <Link to="/new">New user</Link>
          </li>
          <li>
            <Link to="/else">Else where</Link>
          </li>
          <li>
            <Link to="/404">404 place</Link>
          </li>
          <li>
            <button onClick={() => revalidator.revalidate()}>
              Revalidate Data
            </button>
          </li>
        </ul>
      </nav>

      <Outlet />
    </main>
  );
}
