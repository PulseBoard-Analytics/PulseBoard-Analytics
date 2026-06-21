import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock server actions used by boards-list
vi.mock("@/server/actions/boards", () => ({
  deleteBoard: vi.fn().mockResolvedValue({ success: true, data: undefined }),
  updateBoard: vi.fn().mockResolvedValue({ success: true, data: undefined }),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock toast
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toasts: [], toast: vi.fn(), dismiss: vi.fn() }),
  toast: vi.fn(),
}));

import { BoardsList } from "@/components/boards/boards-list";
import type { BoardSummary } from "@/lib/types";

const mockBoard: BoardSummary = {
  id: "cltest123",
  name: "Test Board",
  description: "A test board",
  isPublic: true,
  shareToken: "tok-abc",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-06-01"),
  _count: { metrics: 5 },
};

describe("BoardsList", () => {
  it("renders the board name", () => {
    render(<BoardsList boards={[mockBoard]} />);
    expect(screen.getByText("Test Board")).toBeInTheDocument();
  });

  it("shows metric count", () => {
    render(<BoardsList boards={[mockBoard]} />);
    // Count and label may be in separate elements — check for the number
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows Public badge for public boards", () => {
    render(<BoardsList boards={[mockBoard]} />);
    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  it("shows Private badge for private boards", () => {
    render(<BoardsList boards={[{ ...mockBoard, isPublic: false }]} />);
    expect(screen.getByText("Private")).toBeInTheDocument();
  });

  it("renders empty state when no boards", () => {
    render(<BoardsList boards={[]} />);
    expect(screen.getByText("No boards yet")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<BoardsList boards={[mockBoard]} />);
    expect(screen.getByText("A test board")).toBeInTheDocument();
  });
});
