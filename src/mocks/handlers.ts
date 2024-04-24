// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

const users: User[] = Array.from({ length: 3 }, () => ({
  id: faker.string.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
}));

export const handlers = [
  http.get("/users", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return HttpResponse.json({
      users,
    });
  }),

  http.post("/users", async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const { firstName, lastName } = (await request.json()) as {
      firstName: string;
      lastName: string;
    };

    const newUser: User = {
      id: faker.string.uuid(),
      firstName,
      lastName,
    };

    users.push(newUser);

    return HttpResponse.json({
      newUser,
    });
  }),

  http.delete("/users/:id", async ({ params }) => {
    const { id } = params;

    const userIndex = users.findIndex((user) => user.id === id);

    users.splice(userIndex, 1);

    return HttpResponse.json({
      users,
    });
  }),

  http.put("/users/:id", async ({ params, request }) => {
    const { id } = params;
    const { firstName, lastName } = (await request.json()) as {
      firstName: string;
      lastName: string;
    };

    const userIndex = users.findIndex((user) => user.id === id);

    users[userIndex] = {
      ...users[userIndex],
      firstName,
      lastName,
    };

    return HttpResponse.json({
      users,
    });
  }),
];
