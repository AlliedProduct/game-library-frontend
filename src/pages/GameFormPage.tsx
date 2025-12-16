import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { getGame, createGame, updateGame } from "../api/games";
import AppNavbar from "../components/AppNavbar";

interface GameFormState {
  title: string;
  platform: string;
  genre: string;
  status: string;
  rating: string;
  notes: string;
}

const emptyForm: GameFormState = {
  title: "",
  platform: "",
  genre: "",
  status: "planning",
  rating: "",
  notes: "",
};

const STATUS_OPTIONS = [
  { value: "playing", label: "Playing" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
  { value: "dropped", label: "Dropped" },
  { value: "planning", label: "Planning" },
];

export default function GameFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<GameFormState>(emptyForm);
  const [loading, setLoading] = useState<boolean>(!!isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !id) return;

    async function loadGame() {
      try {
        setLoading(true);
        const game = await getGame(Number(id));
        setForm({
          title: game.title ?? "",
          platform: game.platform ?? "",
          genre: game.genre ?? "",
          status: game.status ?? "planning",
          rating: game.rating?.toString() ?? "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          notes: (game as any).notes ?? "",
        });
      } catch {
        setError("Failed to load game details.");
      } finally {
        setLoading(false);
      }
    }

    void loadGame();
  }, [id, isEdit]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const ratingNumber =
      form.rating.trim() === "" ? undefined : Number(form.rating);

    if (ratingNumber !== undefined && (ratingNumber < 1 || ratingNumber > 10)) {
      setError("Rating must be between 1 and 10.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        platform: form.platform.trim(),
        genre: form.genre.trim(),
        status: form.status,
        rating: ratingNumber,
        notes: form.notes.trim() === "" ? undefined : form.notes.trim(),
      };

      if (isEdit && id) {
        await updateGame(Number(id), payload);
      } else {
        await createGame(payload);
      }

      navigate("/", { replace: true });
    } catch {
      setError("Failed to save game. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AppNavbar />
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Card.Title className="mb-1">
                      {isEdit ? "Edit Game" : "Add New Game"}
                    </Card.Title>
                    <Card.Subtitle className="text-muted small">
                      {isEdit
                        ? "Update the details of your game."
                        : "Add a game to your personal library."}
                    </Card.Subtitle>
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate("/")}
                  >
                    Back to Library
                  </Button>
                </div>

                {error && (
                  <Alert
                    variant="danger"
                    onClose={() => setError(null)}
                    dismissible
                  >
                    {error}
                  </Alert>
                )}

                {loading ? (
                  <p>Loading game...</p>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="E.g., The Witcher 3"
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="platform">
                          <Form.Label>Platform</Form.Label>
                          <Form.Control
                            type="text"
                            name="platform"
                            value={form.platform}
                            onChange={handleChange}
                            required
                            placeholder="E.g., PC, PS5, Xbox"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="genre">
                          <Form.Label>Genre</Form.Label>
                          <Form.Control
                            type="text"
                            name="genre"
                            value={form.genre}
                            onChange={handleChange}
                            required
                            placeholder="E.g., RPG, Action"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="status">
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="rating">
                          <Form.Label>Rating (1–10)</Form.Label>
                          <Form.Control
                            type="number"
                            min={1}
                            max={10}
                            name="rating"
                            value={form.rating}
                            onChange={handleChange}
                            placeholder="Optional"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="notes">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Thoughts, progress, or anything else you want to remember..."
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => navigate("/")}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saving}>
                        {saving
                          ? isEdit
                            ? "Saving..."
                            : "Creating..."
                          : isEdit
                          ? "Save Changes"
                          : "Create Game"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
