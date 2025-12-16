import { Card, Row, Col, ProgressBar } from "react-bootstrap";
import type { Game } from "../api/games";

function safeNumber(n: unknown): n is number {
  return typeof n === "number" && !Number.isNaN(n);
}

function computeSummary(games: Game[]) {
  const total = games.length;

  const playing = games.filter((g) => g.status === "playing").length;
  const completed = games.filter((g) => g.status === "completed").length;

  const rated = games.filter((g) => safeNumber(g.rating) && g.rating >= 1);
  const avgRating =
    rated.length === 0
      ? null
      : Math.round(
          (rated.reduce((sum, g) => sum + (g.rating ?? 0), 0) / rated.length) *
            10
        ) / 10;

  const completionPercent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    playing,
    completed,
    avgRating,
    ratedCount: rated.length,
    completionPercent,
  };
}

export default function DashboardSummary({ games }: { games: Game[] }) {
  const {
    total,
    playing,
    completed,
    avgRating,
    ratedCount,
    completionPercent,
  } = computeSummary(games);

  return (
    <>
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="text-muted small">Total Games</div>
              <div className="fs-3 fw-semibold">{total}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="text-muted small">Playing</div>
              <div className="fs-3 fw-semibold">{playing}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="text-muted small">Completed</div>
              <div className="fs-3 fw-semibold">{completed}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="text-muted small">Average Rating</div>
              <div className="fs-3 fw-semibold">
                {avgRating === null ? "—" : `${avgRating}/10`}
              </div>
              <div className="text-muted small">
                {ratedCount === 0
                  ? "No rated games yet"
                  : `Based on ${ratedCount} rated game${
                      ratedCount === 1 ? "" : "s"
                    }`}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">
                  Completion Progress
                </span>
                <span className="fw-semibold">
                  {completionPercent}%
                </span>
              </div>

              <ProgressBar
                now={completionPercent}
                variant={
                  completionPercent === 100
                    ? "success"
                    : completionPercent >= 70
                    ? "info"
                    : completionPercent >= 30
                    ? "warning"
                    : "danger"
                }
                style={{ height: "10px" }}
              />

              <div className="text-muted small mt-2">
                {completed} of {total} games completed
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
