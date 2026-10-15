/* eslint-disable @typescript-eslint/no-explicit-any */
import CourseCard from "../CourseCard/CourseCard";
import Loader from "../../../Shared/Loader/Loader";
import { useGetMyCoursesQuery } from "../../../../redux/Features/Course/courseApi";

const CourseSection = () => {
  const { data: mtCourses, isLoading } = useGetMyCoursesQuery({});  // it's gte my profile api.
  if (mtCourses?.data?.purchasedCourses?.length < 1) {
    return <p>No courses found</p>;
  }

  return (
    <div className="mt-9">
      {isLoading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {mtCourses?.data?.purchasedCourses?.map((course: any) => (
            <CourseCard
              {...course?.courseId}
              isCourseCompleted={course.isCompletedCourse}
              completedPercentage={course.progress?.percentage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseSection;
