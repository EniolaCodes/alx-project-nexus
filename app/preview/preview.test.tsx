import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import PreviewPage from "@/components/preview/Preview";

expect.extend(toHaveNoViolations);

it("should have no accessibility violations", async () => {
  const { container } = render(
    <PreviewPage links={[]} imageUrl={null} email={null} />,
  );

  // Runs the axe accessibility scanner
  const results = await axe(container);

  // If there are violations (like low contrast or missing labels), the test fails
  expect(results).toHaveNoViolations();
});
