/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiUploadCloud, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";

import DashboardContainer from "../../../../components/Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import TextInput from "../../../../components/Reusable/TextInput/TextInput";
import SelectDropdown from "../../../../components/Reusable/SelectDropdown/SelectDropdown";
import Button from "../../../../components/Reusable/Button/Button";
import {
  useAddEmployeeMutation,
  useGetSingleEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from "../../../../redux/Features/Employee/employeeApi";
import { DEPARTMENT_OPTIONS } from "../../JobManagement/AddOrEditJob/AddOrEditJob";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../../redux/Features/Auth/authSlice";
import type { TUser } from "../../../../types/user.types";

// ---- Options ----
const EMPLOYMENT_TYPE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Intern",
];
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const HR_ROLE_OPTIONS = ["hr", "employee"];
const ADMIN_ROLE_OPTIONS = ["admin", "hr", "employee"];

export type TEmployeeFormValues = {
  // User fields
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  role: string;

  // Employee fields
  department: string;
  designation: string;
  joiningDate: string;
  employmentType: string;
  accountStatus: string;
};

const EMPTY: TEmployeeFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  gender: "",
  city: "",
  state: "",
  country: "",
  role: "employee",
  department: "",
  designation: "",
  joiningDate: new Date().toISOString().split("T")[0], // Defaults to today
  employmentType: "Full-time",
  accountStatus: "Active",
};

const AddOrEditEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const loggedInUser = useSelector(useCurrentUser) as TUser;

  // ---- Fetch single employee (edit mode only) ----
  const { data: empData, isLoading: isLoadingEmp } =
    useGetSingleEmployeeByIdQuery(id as string, { skip: !isEdit });
  const employee = empData?.data;
  const user = employee?.userId;

  // ---- Mutations ----
  const [addEmployee, { isLoading: isCreating }] = useAddEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();
  const isSubmitting = isCreating || isUpdating;

  // ---- Profile Picture State ----
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---- Form ----
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TEmployeeFormValues>({ defaultValues: EMPTY });

  // ---- Set default values ----
  useEffect(() => {
    if (!isEdit) {
      reset(EMPTY);
      return;
    }
    if (employee && user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        gender: user.gender ?? "",
        city: user.city ?? "",
        state: user.state ?? "",
        country: user.country ?? "",
        role: user.role ?? "employee",
        department: employee.department ?? "",
        designation: employee.designation ?? "",
        joiningDate: employee.joiningDate
          ? new Date(employee.joiningDate).toISOString().split("T")[0]
          : "",
        employmentType: employee.employmentType ?? "Full-time",
        accountStatus: employee.accountStatus ?? "Active",
      });

      if (user.profilePicture) {
        setPreviewUrl(user.profilePicture);
      }
    }
  }, [isEdit, employee, user, reset]);

  // ---- Handle File Change ----
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file)); // Show preview instantly
    }
  };

  // ---- Submit ----
  const handleFormSubmit = async (data: TEmployeeFormValues) => {
    // We must use FormData because we are sending a file
    const formData = new FormData();

    // Append all text fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append profile picture if selected
    if (profilePic) {
      formData.append("file", profilePic);
    }

    try {
      if (isEdit && id) {
        await updateEmployee({ id, data: formData }).unwrap();
        toast.success("Employee updated successfully.");
      } else {
        await addEmployee(formData).unwrap();
        toast.success("Employee created successfully.");
      }
      navigate("/dashboard/admin/employees");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong.");
    }
  };

  // ---- Loading state ----
  if (isEdit && isLoadingEmp) {
    return (
      <div className="font-Montserrat flex items-center justify-center py-20 text-neutral-65 text-sm">
        Loading employee details…
      </div>
    );
  }

  return (
    <div className="font-Montserrat">
      {/* ---- Back ---- */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-neutral-40 hover:text-neutral-30 text-sm"
        >
          <FiArrowLeft />
          Back to Employees
        </button>
      </div>

      <DashboardContainer>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-neutral-40">
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </h1>
          <p className="text-sm text-neutral-65 mt-1">
            {isEdit
              ? "Update employee details and manage portal access."
              : "Create a new employee account and assign portal access."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-8"
        >
          {/* ================= SECTION 1: Profile Picture ================= */}
          <Section title="Profile Picture">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-neutral-30 overflow-hidden bg-neutral-105 flex items-center justify-center shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={32} className="text-neutral-50" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="profile-picture"
                />
                <label
                  htmlFor="profile-picture"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-98 rounded-lg text-sm font-medium text-neutral-40 hover:bg-neutral-105 cursor-pointer transition-colors"
                >
                  <FiUploadCloud size={16} />
                  {previewUrl ? "Change Picture" : "Upload Picture"}
                </label>
                <p className="text-xs text-neutral-65 mt-2">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>
          </Section>

          {/* ================= SECTION 2: Personal Information ================= */}
          <Section title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Full Name"
                placeholder="e.g. Arjun Sharma"
                error={errors.name}
                isRequired
                {...register("name", { required: "Name is required" })}
              />
              <TextInput
                label="Email"
                type="email"
                placeholder="e.g. arjun@algoquad.com"
                error={errors.email}
                isRequired
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@algoquad\.com$/i,
                    message: "Must be a valid @algoquad.com email address",
                  },
                })}
              />
              <TextInput
                label="Phone Number"
                placeholder="e.g. +919876543210"
                error={errors.phoneNumber}
                isRequired
                {...register("phoneNumber", { required: "Phone is required" })}
              />
              <SelectDropdown
                label="Gender"
                {...register("gender", { required: "Gender is required" })}
                error={errors.gender}
                options={GENDER_OPTIONS}
              />
              <SelectDropdown
                label="Role"
                {...register("role", { required: "Role is required" })}
                error={errors.role}
                options={
                  loggedInUser?.role === "hr"
                    ? HR_ROLE_OPTIONS
                    : ADMIN_ROLE_OPTIONS
                }
              />
              <TextInput
                label="City"
                placeholder="e.g. Bengaluru"
                error={errors.city}
                {...register("city")}
              />
              <TextInput
                label="State"
                placeholder="e.g. Karnataka"
                error={errors.state}
                {...register("state")}
              />
              <TextInput
                label="Country"
                placeholder="e.g. India"
                error={errors.country}
                {...register("country")}
              />
            </div>
          </Section>

          {/* ================= SECTION 3: Employment Details ================= */}
          <Section title="Employment Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectDropdown
                label="Department"
                {...register("department", {
                  required: "Department is required",
                })}
                error={errors.department}
                options={DEPARTMENT_OPTIONS}
              />
              <TextInput
                label="Designation"
                placeholder="e.g. Senior Frontend Developer"
                error={errors.designation}
                isRequired
                {...register("designation", {
                  required: "Designation is required",
                })}
              />
              <TextInput
                label="Joining Date"
                type="date"
                error={errors.joiningDate}
                isRequired
                {...register("joiningDate", {
                  required: "Joining date is required",
                })}
              />
              <SelectDropdown
                label="Employment Type"
                {...register("employmentType", {
                  required: "Employment type is required",
                })}
                error={errors.employmentType}
                options={EMPLOYMENT_TYPE_OPTIONS}
              />
              <SelectDropdown
                label="Account Status"
                {...register("accountStatus", {
                  required: "Status is required",
                })}
                error={errors.accountStatus}
                options={["Active", "Inactive"]}
              />
            </div>
            {!isEdit && (
              <p className="text-xs text-neutral-65 mt-2">
                Note: A default password <strong>12345678</strong> will be
                generated. The employee will be prompted to change it on first
                login.
              </p>
            )}
          </Section>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-end gap-4 mt-2 pt-4 border-t border-neutral-98">
            <Button
              variant="custom"
              label="Cancel"
              type="button"
              classNames="py-2 px-4"
              onClick={() => navigate("/dashboard/admin/employees")}
            />
            <Button
              variant="primary"
              label={isEdit ? "Save Changes" : "Create Employee"}
              type="submit"
              classNames="py-2 px-4"
              isLoading={isSubmitting}
            />
          </div>
        </form>
      </DashboardContainer>
    </div>
  );
};

export default AddOrEditEmployee;

/* ============================================================
 * Section — Reusable UI wrapper
 * ============================================================ */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-baseline gap-3 pb-2 border-b border-neutral-98">
      <h2 className="text-sm font-semibold text-neutral-40 uppercase tracking-wide">
        {title}
      </h2>
    </div>
    {children}
  </section>
);
