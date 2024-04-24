import {
  createBrowserRouter,
  RouterProvider,
  Form,
  useActionData,
  useNavigation,
  isRouteErrorResponse,
} from "react-router-dom";

import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  const is404 = isRouteErrorResponse(error) && error.status === 404;

  if (is404) {
    return (
      <div>
        <p style={{ color: "red", fontSize: "30px" }}>404 Page Not Found</p>
      </div>
    );
  }

  return null;
}

let router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    path: "/",
    lazy: async () => {
      const [{ Layout }] = await Promise.all([
        import("./Layout.tsx"),
        // import("./loader.ts"),
      ]);
      return {
        Component: Layout,
        // loader,
      };
    },
    loader: async ({ request }) => {
      console.log("Loading data");

      await fetch("https://jsonplaceholder.typicode.com/todos/1");
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
      {
        path: "*",
        Component: () => <p>404 place</p>,
      },
      {
        path: ":id",
        Component: () => <p>Id place</p>,
      },
    ],
  },
  {
    path: "/else",
    Component: () => <p>Else where</p>,
  },
  {
    path: "/aa/:id",
    Component: () => <p>Aha place</p>,
  },
]);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}

export default function App() {
  return <RouterProvider router={router} />;
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
