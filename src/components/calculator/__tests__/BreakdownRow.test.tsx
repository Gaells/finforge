import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BreakdownRow } from "../BreakdownRow";

describe("BreakdownRow", () => {
  it("should render with label and value", () => {
    render(<BreakdownRow label="Capital Inicial" value="R$ 10.000,00" />);

    expect(screen.getByText("Capital Inicial")).toBeInTheDocument();
    expect(screen.getByText("R$ 10.000,00")).toBeInTheDocument();
  });

  it("should render with border by default", () => {
    const { container } = render(<BreakdownRow label="Test" value="Value" />);

    const row = container.firstChild as HTMLElement;
    expect(row.className).toContain("border-b");
  });

  it("should render without border when showBorder is false", () => {
    const { container } = render(
      <BreakdownRow label="Test" value="Value" showBorder={false} />,
    );

    const row = container.firstChild as HTMLElement;
    expect(row.className).not.toContain("border-b");
  });

  it("should apply default value className", () => {
    render(<BreakdownRow label="Test" value="Value" />);

    const value = screen.getByText("Value");
    expect(value.className).toContain("font-medium");
  });

  it("should apply custom value className", () => {
    render(
      <BreakdownRow
        label="Test"
        value="Value"
        valueClassName="custom-class text-success"
      />,
    );

    const value = screen.getByText("Value");
    expect(value.className).toContain("custom-class");
    expect(value.className).toContain("text-success");
  });

  it("should render label with muted color", () => {
    render(<BreakdownRow label="Test Label" value="Value" />);

    const label = screen.getByText("Test Label");
    expect(label.className).toContain("text-muted-foreground");
  });

  it("should handle long labels", () => {
    const longLabel = "This is a very long label that might wrap";
    render(<BreakdownRow label={longLabel} value="Value" />);

    expect(screen.getByText(longLabel)).toBeInTheDocument();
  });

  it("should handle percentage values", () => {
    render(<BreakdownRow label="Return" value="+15.50%" />);

    expect(screen.getByText("+15.50%")).toBeInTheDocument();
  });

  it("should handle currency values", () => {
    render(<BreakdownRow label="Amount" value="R$ 1.234.567,89" />);

    expect(screen.getByText("R$ 1.234.567,89")).toBeInTheDocument();
  });

  it("should maintain flex layout", () => {
    const { container } = render(<BreakdownRow label="Test" value="Value" />);

    const row = container.firstChild as HTMLElement;
    expect(row.className).toContain("flex");
    expect(row.className).toContain("justify-between");
  });

  it("should have proper spacing", () => {
    const { container } = render(<BreakdownRow label="Test" value="Value" />);

    const row = container.firstChild as HTMLElement;
    expect(row.className).toContain("py-2");
  });
});
