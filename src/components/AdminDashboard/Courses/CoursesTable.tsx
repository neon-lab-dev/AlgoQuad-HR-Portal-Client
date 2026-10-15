/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiFile, FiTablet, FiTrash2 } from "react-icons/fi";
import Table from "../../Reusable/Table/Table";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import Button from "../../Reusable/Button/Button";
import DashboardContainer from "../../Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import SearchInput from "../../Reusable/SearchInput/SearchInput";
import { useNavigate } from "react-router-dom";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "../../../redux/Features/Course/courseApi";
import { formatDate } from "../../../utils/formatDate";
import type { TCourse } from "../../../types/course.types";
import Dropdown from "../../Reusable/Dropdown/Dropdown";
import {
  useDeleteCourseBundleMutation,
  useGetAllCourseBundlesQuery,
  useGetSingleCourseBundleByIdQuery,
} from "../../../redux/Features/CourseBundle/courseBundleApi";
import type { TCourseBundle } from "../../../types/courseBundle.types";
import CreateOrEditBundleForm from "./CreateOrEditBundleForm";
import { MdOutlineAssignment } from "react-icons/md";

const Courses = () => {
  const [selectedBundleId, setSelectedBundleId] = useState<string>("");
  const [modalType, setModalType] = useState<string>("");
  const [isCourseBundleModalOpen, setIsCourseBundleModalOpen] =
    useState<boolean>(false);
  const [deleteCourse] = useDeleteCourseMutation();
  const [deleteCourseBundle] = useDeleteCourseBundleMutation();
  const [type, setType] = useState<string>("Single Courses");
  const [searchValue, setSearchValue] = useState("");
  const { data, isLoading, isFetching } = useGetAllCoursesQuery({
    keyword: searchValue,
  });
  const {
    data: courseBundle,
    isLoading: isCourseBundleLoading,
    isFetching: isCourseBundleFetching,
  } = useGetAllCourseBundlesQuery({
    keyword: searchValue,
  });

  const {
    data: singleBundleData,
    isLoading: isSingleBundleLoading,
    isFetching: isSingleBundleFetching,
  } = useGetSingleCourseBundleByIdQuery(selectedBundleId);

  const [page, setPage] = useState(1);

  const allCourses = data?.data?.courses || [];

  const navigate = useNavigate();

  // Table rows
  const allCoursesData = allCourses?.map((course: TCourse) => {
    return {
      _id: course._id,
      title: course.title,
      category: course.category,
      accessType: course.accessType,
      price: (
        <>
          <span className="line-through text-gray-400">
            ₹{course.basePrice}
          </span>{" "}
          <span className="text-green-600 font-semibold">
            ₹{course.discountedPrice}
          </span>
        </>
      ),
      duration: course.duration,
      createdAt: formatDate(course?.createdAt),
    };
  });

  // Table rows
  const courseBundleData = courseBundle?.data?.bundles?.map(
    (bundle: TCourseBundle) => {
      return {
        _id: bundle._id,
        name: (
          <div className="flex items-center gap-2">
            <img
              src={bundle.imageUrl}
              alt={bundle.name}
              className="size-12 rounded"
            />
            <p className="capitalize">{bundle.name}</p>
          </div>
        ),
        bundleSize: `${bundle.courseId?.length} Courses`,
        price: (
          <>
            <span className="text-green-600 font-semibold">
              ₹{bundle.price}
            </span>
          </>
        ),
        createdAt: formatDate(bundle?.createdAt),
      };
    }
  );

  const courseColumns = [
    { key: "_id", label: "Course ID" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "accessType", label: "Access Type" },
    { key: "price", label: "Price" },
    { key: "duration", label: "Duration" },
    { key: "createdAt", label: "Created At" },
  ];

  const courseBundleColumns = [
    { key: "_id", label: "Course ID" },
    { key: "name", label: "Name" },
    { key: "bundleSize", label: "Bundle Size" },
    { key: "price", label: "Price" },
    { key: "createdAt", label: "Created At" },
  ];

  const handleDeleteCourse = async (id: string) => {
    toast.promise(deleteCourse(id).unwrap(), {
      loading: "Deleting course...",
      success: "Course deleted successfully.",
      error: (err: any) => err?.data?.message || "Something went wrong!",
    });
  };

  const handleDeleteCourseBundle = async (id: string) => {
    toast.promise(deleteCourseBundle(id).unwrap(), {
      loading: "Deleting bundle...",
      success: "Bundle deleted successfully.",
      error: (err: any) => err?.data?.message || "Something went wrong!",
    });
  };

  const courseActions = [
    {
      icon: <FiTablet />,
      label: "Update",
      onClick: (row: any) => {
        navigate(`/dashboard/admin/manage-course`, {
          state: { id: row?._id, action: "update" },
        });
      },
    },
    {
      icon: <FiFile />,
      label: "Manage Lectures",
      onClick: (row: any) => {
        navigate(`/dashboard/admin/manage-lectures/${row?._id}`, {
          state: { id: row?._id },
        });
      },
    },
    {
      icon: <MdOutlineAssignment />,
      label: "Manage Exam",
      onClick: (row: any) => {
        navigate(`/dashboard/admin/manage-exam/${row?._id}`, {
          state: { id: row?._id },
        });
      },
    },
    {
      icon: <FiTrash2 />,
      label: "Delete",
      onClick: (row: any) => handleDeleteCourse(row?._id),
      className: "text-red-600",
    },
  ];

  const courseBundleActions = [
    {
      icon: <FiTablet />,
      label: "Update",
      onClick: (row: any) => {
        setModalType("edit");
        setSelectedBundleId(row?._id);
        setIsCourseBundleModalOpen(true);
      },
    },
    {
      icon: <FiTrash2 />,
      label: "Delete",
      onClick: (row: any) => handleDeleteCourseBundle(row?._id),
      className: "text-red-600",
    },
  ];

  // Export
  const handleExportCourses = () => {
    if (!allCourses || allCourses.length === 0) return;

    const exportData = allCourses.map((course: TCourse) => ({
      _id: course._id,
      "Image URL": course.imageUrl,
      Title: course.title,
      Subtitle: course.subtitle,
      Tagline: course.tagline,
      Benefits: course.benefits?.join(", "),
      "Access Type": course.accessType,
      Category: course.category,
      "Base Price": course.basePrice,
      "Discounted Price": course.discountedPrice,
      Duration: course.duration || "",
      "Created At": formatDate(course.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "courses.xlsx");
  };

  return (
    <div className="mt-6 font-Montserrat">
      <DashboardContainer>
        <div className="font-Montserrat flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-neutral-40">
                {type === "Single Courses" ? "Courses" : "Bundle Courses"}
              </h1>
              <p className="text-neutral-65">
                Manage all{" "}
                {type === "Single Courses" ? "courses" : "bundle courses"}
              </p>
            </div>
            <div className="flex justify-between items-center gap-4 flex-wrap">
              {/* Filters */}
              <div className="flex items-start md:items-center flex-wrap gap-3 md:gap-0">
                <SearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search courses..."
                />
                <Dropdown
                  className="py-1 px-3 w-60"
                  value={type}
                  onChange={setType}
                  options={[
                    { value: "Single Courses", label: "Single Courses" },
                    { value: "Bundle Courses", label: "Bundle Courses" },
                  ]}
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    navigate("/dashboard/admin/manage-course", {
                      state: { action: "add" },
                    });
                  }}
                  label="Add Course"
                  classNames="py-2 px-3"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          {type === "Single Courses" ? (
            <Table
              columns={courseColumns}
              data={allCoursesData}
              actions={courseActions}
              rowKey="_id"
              isLoading={isLoading || isFetching}
              page={page}
              totalPages={data?.data?.pagination?.totalPages}
              onPageChange={setPage}
            />
          ) : (
            <Table
              columns={courseBundleColumns}
              data={courseBundleData}
              actions={courseBundleActions}
              rowKey="_id"
              isLoading={isCourseBundleLoading || isCourseBundleFetching}
              page={page}
              totalPages={data?.data?.pagination?.totalPages}
              onPageChange={setPage}
            />
          )}

          <div className="flex items-center justify-between">
            <p className="text-neutral-140 leading-5">
              Create a new{" "}
              <button
                onClick={() => {
                  setModalType("add");
                  setIsCourseBundleModalOpen(true);
                }}
                className="text-primary-20 font-semibold hover:underline cursor-pointer"
              >
                Course Bundle
              </button>
            </p>

            <Button
              variant="primary"
              onClick={handleExportCourses}
              label="Export"
              classNames="w-fit self-end py-2 px-4"
              disabled={type !== "Single Courses"}
            />
          </div>
        </div>
      </DashboardContainer>

      <CreateOrEditBundleForm
        modalType={modalType}
        isCourseBundleModalOpen={isCourseBundleModalOpen}
        setIsCourseBundleModalOpen={setIsCourseBundleModalOpen}
        allCoursesData={allCoursesData}
        setType={setType}
        defaultValues={modalType === "edit" ? singleBundleData?.data : {}}
        isLoading={isSingleBundleLoading || isSingleBundleFetching}
      />
    </div>
  );
};

export default Courses;
