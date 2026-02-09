import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SliderInputField } from "../SliderInputField";

describe("SliderInputField", () => {
  const defaultProps = {
    id: "test-field",
    label: "Test Label",
    value: 50,
    onChange: vi.fn(),
    min: 0,
    max: 100,
    step: 1,
  };

  it("should render with label and display value", () => {
    render(<SliderInputField {...defaultProps} displayValue="R$ 50,00" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("R$ 50,00")).toBeInTheDocument();
  });

  it("should render input with correct value", () => {
    render(<SliderInputField {...defaultProps} />);

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("50");
  });

  it("should call onChange when input value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SliderInputField {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "75");

    expect(onChange).toHaveBeenCalled();
  });

  it("should use default display value when not provided", () => {
    render(<SliderInputField {...defaultProps} />);

    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("should apply custom input step", () => {
    render(<SliderInputField {...defaultProps} inputStep="0.5" />);

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.step).toBe("0.5");
  });

  it("should apply custom className", () => {
    render(
      <SliderInputField {...defaultProps} inputClassName="custom-class" />,
    );

    const input = screen.getByRole("spinbutton");
    expect(input.className).toContain("custom-class");
  });

  it("should render custom children when provided", () => {
    render(
      <SliderInputField {...defaultProps}>
        <div>Custom Content</div>
      </SliderInputField>,
    );

    expect(screen.getByText("Custom Content")).toBeInTheDocument();
  });

  it("should render slider with correct attributes", () => {
    const { container } = render(<SliderInputField {...defaultProps} />);

    const slider = container.querySelector('[role="slider"]');
    expect(slider).toBeInTheDocument();
  });

  it("should handle zero value", () => {
    render(<SliderInputField {...defaultProps} value={0} />);

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("0");
  });

  it("should apply default font-mono className to input", () => {
    render(<SliderInputField {...defaultProps} />);

    const input = screen.getByRole("spinbutton");
    expect(input.className).toContain("font-mono");
  });
});
