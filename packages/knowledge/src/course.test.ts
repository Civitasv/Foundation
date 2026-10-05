import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assertPresentationCourse } from "./course";

const courseRoot = new URL("../../../content/courses/machine-learning/", import.meta.url);

function readCourse() {
  const value: unknown = JSON.parse(readFileSync(new URL("course.json", courseRoot), "utf8"));
  assertPresentationCourse(value);
  return value;
}

describe("presentation course", () => {
  it("keeps one continuous Chinese draft backed by its Python source", () => {
    const course = readCourse();
    expect(course.id).toBe("machine-learning");
    expect(course.status).toBe("ai-draft");
    expect(course.presentationLocale).toBe("zh-CN");
    expect(course.presentationTrace).toBe("machine_learning");
    expect(course.sections[0]?.id).toBe("problem-data");
    expect(new Set(course.sections.flatMap((section) => section.sourceWeeks))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7]));
    expect(existsSync(new URL(`${course.presentationTrace}.py`, courseRoot))).toBe(true);
  });

  it("rejects missing translations, unsafe trace paths and duplicate section identities", () => {
    const course = readCourse();
    expect(() => assertPresentationCourse({ ...course, title: { "zh-CN": "课程" } })).toThrow(/localized/);
    expect(() => assertPresentationCourse({ ...course, presentationTrace: "../machine_learning" })).toThrow(/trace/);
    expect(() => assertPresentationCourse({ ...course, sections: [course.sections[0], course.sections[0]] })).toThrow(/duplicate/);
    expect(() => assertPresentationCourse({ ...course, sections: [] })).toThrow(/section/);
    expect(() => assertPresentationCourse({ ...course, status: "published" })).toThrow(/status/);
  });

  it("rejects malformed section metadata before rendering", () => {
    const course = readCourse();
    const section = course.sections[0];
    expect(() => assertPresentationCourse({ ...course, sections: [{ ...section, summary: { en: "Summary" } }] })).toThrow(/localized/);
    expect(() => assertPresentationCourse({ ...course, sections: [{ ...section, sourceWeeks: [0, 1.5] }] })).toThrow(/weeks/);
  });

});
