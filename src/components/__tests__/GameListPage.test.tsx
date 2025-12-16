import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameListPage from "../../pages/GameListPage.tsx";

// mock API module
vi.mock("../../api/games", () => ({
  getGames: vi.fn(async () => [
    {
      id: 1,
      title: "Halo",
      platform: "Xbox",
      genre: "Shooter",
      status: "playing",
      rating: 8,
    },
  ]),
  deleteGame: vi.fn(async () => {}),
}));

// mock Auth 
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 7, email: "demo@example.com", username: "demo" },
    logout: vi.fn(async () => {}),
    isAuthenticated: true,
    loading: false,
  }),
}));

test("loads and displays games", async () => {
  render(
    <MemoryRouter>
      <GameListPage />
    </MemoryRouter>
  );

  // waits for loaded data to appear
  expect(await screen.findByText("Halo")).toBeInTheDocument();
  expect(screen.getByText("Xbox")).toBeInTheDocument();
  expect(screen.getByText("Shooter")).toBeInTheDocument();
});
