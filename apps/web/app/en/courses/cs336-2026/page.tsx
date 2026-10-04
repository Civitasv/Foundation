import type { Metadata } from "next";
import { CourseJournal } from "../../../../components/course-journal";
import course from "../../../../../../content/courses/cs336-2026/course.json";

export const metadata: Metadata = {
  title: `${course.title["en"]} — Foundation`,
  description: course.description["en"]
};

export default function Page() {
  return <CourseJournal locale="en" />;
}
