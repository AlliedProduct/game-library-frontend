import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Spinner,
  Alert,
  Button,
  Container,
  Card,
  Badge,
} from "react-bootstrap";
import type { Game } from "../api/games";
import { getGames, deleteGame } from "../api/games";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import DashboardSummary from "../components/DashboardSummary";

function formatStatus(status?: string): string {
  if (!status) return "";
  return status
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function statusVariant(status?: string): string {
  switch (status) {
    case "playing":
      return "success";
    case "completed":
      return "primary";
    case "on_hold":
      return "warning";
    case "dropped":
      return "danger";
    case "planning":
      return "info";
    default:
      return "secondary";
  }
}

function renderStars(rating?: number): string {
  if (!rating || rating < 1) return "";
  const clamped = Math.min(rating, 10);
  const stars = Math.round(clamped / 2); // 1–10 => 1–5 stars
  return "★".repeat(stars);
}

export default function GameListPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function loadGames() {
      try {
        setLoading(true);
        const data = await getGames();
        setGames(data);
      } catch {
        setError("Failed to load games. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    void loadGames();
  }, []);

  async function handleDelete(id: number) {
    if (
      !window.confirm(
        "Are you sure you want to remove this game from your library?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteGame(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
    } catch {
      setError("Failed to delete game. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <AppNavbar />
      <Container>
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <div>
                <h2 className="mb-1">My Game Library</h2>
                <p className="text-muted mb-0 small">
                  Track what you&apos;re playing, planning, and completing.
                </p>
                {user && (
                  <p className="text-muted mb-0 small">
                    Logged in as <strong>{user.username ?? user.email}</strong>
                  </p>
                )}
              </div>
              <Button onClick={() => navigate("/games/new")}>
                + Add Game
              </Button>
            </div>
          </Card.Body>
        </Card>
        {!loading && !error && <DashboardSummary games={games} />}


        {loading && (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {error && (
          <Alert
            variant="danger"
            onClose={() => setError(null)}
            dismissible
            className="shadow-sm"
          >
            {error}
          </Alert>
        )}

        {!loading && games.length === 0 && !error && (
          <Card className="shadow-sm border-0 text-center py-4">
            <Card.Body>
              <p className="mb-2">You don&apos;t have any games yet.</p>
              <p className="text-muted small mb-3">
                Click &quot;Add Game&quot; below to start building your library.
              </p>
              <Button onClick={() => navigate("/games/new")}>
                Add your first game
              </Button>
            </Card.Body>
          </Card>
        )}

        {!loading && games.length > 0 && (
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Table responsive hover className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Platform</th>
                    <th>Genre</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th style={{ width: "140px" }} className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id}>
                      <td className="fw-semibold">{game.title}</td>
                      <td>{game.platform}</td>
                      <td>{game.genre}</td>
                      <td>
                        {game.status ? (
                          <Badge pill bg={statusVariant(game.status)}>
                            {formatStatus(game.status)}
                          </Badge>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {game.rating ? (
                          <>
                            <span className="me-1">{game.rating}/10</span>
                            <span className="text-warning">
                              {renderStars(game.rating)}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted">Not rated</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => navigate(`/games/${game.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(game.id)}
                            disabled={deletingId === game.id}
                          >
                            {deletingId === game.id ? "Removing..." : "Delete"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
