import type { Metadata } from "next";
import { CoursePresentations } from "../../../../components/course-presentations";
import course from "../../../../../../content/courses/machine-learning/course.json";

export const metadata: Metadata = {
  title: `${course.title.en} — Foundation`,
  description: course.description.en
};

export default function Page() {
  return <CoursePresentations locale="en" />;
}
