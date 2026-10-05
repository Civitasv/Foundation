import { describe, expect, it } from "vitest";
import { presentationUrl } from "./presentation-url";

describe("presentation URL", () => {
  it("uses the same static player locally and under the Pages base path", () => {
    expect(presentationUrl("machine-learning", "machine_learning")).toBe("/courses/machine-learning/presentation/?trace=machine_learning");
    expect(presentationUrl("machine-learning", "machine_learning", "/Foundation")).toBe("/Foundation/courses/machine-learning/presentation/?trace=machine_learning");
    expect(presentationUrl("machine-learning", "machine_learning", "/Foundation/")).toBe("/Foundation/courses/machine-learning/presentation/?trace=machine_learning");
  });
});
