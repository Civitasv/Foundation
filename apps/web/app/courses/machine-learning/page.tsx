import type { Metadata } from "next";
import { CoursePresentations } from "../../../components/course-presentations";
import course from "../../../../../content/courses/machine-learning/course.json";

export const metadata: Metadata = {
  title: `${course.title["zh-CN"]} — Foundation`,
  description: course.description["zh-CN"]
};

export default function Page() {
  return <CoursePresentations locale="zh-CN" />;
}
