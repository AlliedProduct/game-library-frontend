import { render, screen } from "@testing-library/react";
import DashboardSummary from "../DashboardSummary";
import type { Game } from "../../api/games";

function makeGame(overrides: Partial<Game>): Game {
  return {
    id: Math.floor(Math.random() * 100000),
    title: "Test",
    platform: "PC",
    genre: "Action",
    status: "planning",
    rating: null,
    ...overrides,
  } as unknown as Game;
}

test("shows totals and completion percentage", () => {
  const games: Game[] = [
    makeGame({ status: "completed", rating: 8 }),
    makeGame({ status: "playing", rating: 6 }),
    makeGame({ status: "planning" }),
  ];

  render(<DashboardSummary games={games} />);

  // total games
  expect(screen.getByText("Total Games")).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();

  // completed count
  expect(screen.getByText("Completed")).toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();

  // completion percent
  expect(screen.getByText("33%")).toBeInTheDocument();

  // average rating should exist
  expect(screen.getByText("7/10")).toBeInTheDocument();
});
