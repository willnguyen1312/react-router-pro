import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLoaderData,
  useRevalidator,
  Link,
  Form,
  useActionData,
  useNavigation,
} from "react-router-dom";

let router = createBrowserRouter([
  {
    // path: "/",
    Component: Layout,
    loader: async ({ request }) => {
      const response = await fetch("/users", {
        signal: request.signal,
      });
      return response.json();
    },
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "new",
        Component: NewUser,
        action: async ({ request }) => {
          let formData = await request.formData();

          let user = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
          };

          await fetch("/users", {
            method: "POST",
            signal: request.signal,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });

          // return redirect("/");
          return {
            ok: true,
          };
        },
      },
    ],
  },
  {
    path: "/else",
    Component: () => <p>Else where</p>,
  },
]);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}

export default function App() {
  return <RouterProvider router={router} />;
}

function Layout() {
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

function Home() {
  return <p>Welcome to the home page</p>;
}

function NewUser() {
  const navigation = useNavigation();
  const actionData = useActionData();

  console.log({ actionData });

  const isPending =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <Form method="post">
      <label>
        First Name:
        <input type="text" name="firstName" />
      </label>

      <label>
        Last Name:
        <input type="text" name="lastName" />
      </label>

      {isPending && <p>Loading...</p>}

      <button type="submit">Create User</button>
    </Form>
  );
}
