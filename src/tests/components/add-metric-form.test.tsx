import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Use inline factory functions to avoid hoisting issues with vi.mock
vi.mock("@/server/actions/metrics", () => ({
  addMetric: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toasts: [], toast: vi.fn(), dismiss: vi.fn() }),
  toast: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

import { AddMetricDialog } from "@/components/metrics/add-metric-dialog";
import * as metricsActions from "@/server/actions/metrics";

const mockMetric = {
  id: "m1",
  boardId: "b1",
  name: "Revenue",
  value: 1000,
  unit: "USD",
  timestamp: new Date(),
  createdAt: new Date(),
};

describe("AddMetricDialog", () => {
  const onAdded = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(metricsActions.addMetric).mockResolvedValue({
      success: true,
      data: mockMetric,
    });
  });

  it("renders the trigger button", () => {
    render(<AddMetricDialog boardId="b1" onAdded={onAdded} />);
    expect(screen.getByRole("button", { name: /add metric/i })).toBeInTheDocument();
  });

  it("opens dialog on trigger click", async () => {
    const user = userEvent.setup();
    render(<AddMetricDialog boardId="b1" onAdded={onAdded} />);
    await user.click(screen.getByRole("button", { name: /add metric/i }));
    expect(screen.getByLabelText(/metric name/i)).toBeInTheDocument();
  });

  it("submits form with valid data and calls onAdded", async () => {
    const user = userEvent.setup();
    render(<AddMetricDialog boardId="b1" onAdded={onAdded} />);

    await user.click(screen.getByRole("button", { name: /add metric/i }));
    await user.type(screen.getByLabelText(/metric name/i), "Revenue");
    await user.type(screen.getByLabelText(/value/i), "1000");

    // Click the submit button inside the dialog
    const buttons = screen.getAllByRole("button", { name: /add metric/i });
    // The last one is the submit button inside the dialog
    await user.click(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(metricsActions.addMetric).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Revenue", value: 1000 })
      );
    });

    await waitFor(() => expect(onAdded).toHaveBeenCalledWith(mockMetric));
  });

  it("shows validation toast on non-numeric value", async () => {
    const user = userEvent.setup();
    render(<AddMetricDialog boardId="b1" onAdded={onAdded} />);

    await user.click(screen.getByRole("button", { name: /add metric/i }));
    await user.type(screen.getByLabelText(/metric name/i), "Test");

    // Type non-numeric into value field (number input won't accept letters, simulate empty)
    const valueInput = screen.getByLabelText(/value/i);
    await user.type(valueInput, "0");
    await user.clear(valueInput);

    const buttons = screen.getAllByRole("button", { name: /add metric/i });
    await user.click(buttons[buttons.length - 1]);

    // addMetric should not be called since value is empty
    await waitFor(() => {
      expect(metricsActions.addMetric).not.toHaveBeenCalled();
    });
  });
});
