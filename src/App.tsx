import {
  createBrowserRouter,
  RouterProvider,
  Form,
  useActionData,
  useNavigation,
  isRouteErrorResponse,
  useFetcher,
  redirect,
  json,
  useLocation,
  useNavigate,
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

  console.log({ error });

  return null;
}

const CHARS = ["Homer", "Bart", "Marge", "Lisa", "Maggie", "Hank"];

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
    shouldRevalidate: (request) => {
      return request.formAction !== "/data";
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
  {
    path: "/data",
    Component: () => <p>Data place</p>,
    loader: async ({ request }) => {
      // const form = await request.formData();
      const search = new URL(request.url).searchParams.get("idle");
      console.log({ search });

      return {
        data: CHARS,
      };
    },
    action: async ({ request }) => {
      CHARS.push(CHARS.length.toString());
      const form = await request.formData();
      console.log(form.get("idle"));

      return {
        data: CHARS,
      };
    },
  },
]);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}

export default function App() {
  return <RouterProvider router={router} />;
}

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome to the home page</h1>

      <button
        onClick={() => {
          navigate("/new", {
            state: {
              foo: "bar",
            },
          });
        }}
      >
        Navigate to new route
      </button>
    </div>
  );
}

function NewUser() {
  const navigation = useNavigation();
  const location = useLocation();

  // const actionData = useActionData();
  const fetcher = useFetcher();

  console.log(fetcher);

  const isPending =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <div>
      <button
        onClick={() => {
          fetcher.submit({ idle: true }, { method: "get", action: "/data" });
        }}
      >
        Click me
      </button>
    </div>
  );
}
