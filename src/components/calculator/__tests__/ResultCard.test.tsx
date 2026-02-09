import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultCard } from "../ResultCard";

describe("ResultCard", () => {
  it("should render with label and value", () => {
    render(<ResultCard label="Total Amount" value="R$ 10.000,00" />);

    expect(screen.getByText("Total Amount")).toBeInTheDocument();
    expect(screen.getByText("R$ 10.000,00")).toBeInTheDocument();
  });

  it("should render with default variant", () => {
    const { container } = render(<ResultCard label="Test" value="R$ 100,00" />);

    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });

  it("should apply primary variant styles", () => {
    const { container } = render(
      <ResultCard label="Test" value="R$ 100,00" variant="primary" />,
    );

    const card = container.querySelector(".bg-primary");
    expect(card).toBeInTheDocument();
  });

  it("should apply accent variant styles", () => {
    const { container } = render(
      <ResultCard label="Test" value="R$ 100,00" variant="accent" />,
    );

    const card = container.querySelector(".border-primary\\/30");
    expect(card).toBeInTheDocument();
  });

  it("should render without animation by default", () => {
    render(<ResultCard label="Test" value="R$ 100,00" />);

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
  });

  it("should render with animation when animated prop is true", () => {
    render(
      <ResultCard
        label="Test"
        value="R$ 100,00"
        animated
        animationKey="test-key"
      />,
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should display large value text", () => {
    render(<ResultCard label="Test" value="R$ 100,00" />);

    const valueElement = screen.getByText("R$ 100,00");
    expect(valueElement.className).toContain("text-3xl");
    expect(valueElement.className).toContain("font-bold");
  });

  it("should handle long labels", () => {
    const longLabel = "This is a very long label for testing purposes";
    render(<ResultCard label={longLabel} value="R$ 100,00" />);

    expect(screen.getByText(longLabel)).toBeInTheDocument();
  });

  it("should handle large values", () => {
    render(<ResultCard label="Test" value="R$ 1.000.000.000,00" />);

    expect(screen.getByText("R$ 1.000.000.000,00")).toBeInTheDocument();
  });
});
