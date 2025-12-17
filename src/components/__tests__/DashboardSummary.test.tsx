import { render, screen, within } from "@testing-library/react";
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

  // total games card
  const totalLabel = screen.getByText("Total Games");
  const totalCard = totalLabel.closest(".card") as HTMLElement;
  expect(totalCard).toBeTruthy();
  expect(within(totalCard).getByText("3")).toBeInTheDocument();

  // playing card
  const playingLabel = screen.getByText("Playing");
  const playingCard = playingLabel.closest(".card") as HTMLElement;
  expect(playingCard).toBeTruthy();
  expect(within(playingCard).getByText("1")).toBeInTheDocument();

  // completed card
  const completedLabel = screen.getByText("Completed");
  const completedCard = completedLabel.closest(".card") as HTMLElement;
  expect(completedCard).toBeTruthy();
  expect(within(completedCard).getByText("1")).toBeInTheDocument();

  // completion percent
  expect(screen.getByText("33%")).toBeInTheDocument();

  // average rating
  expect(screen.getByText("7/10")).toBeInTheDocument();
});
