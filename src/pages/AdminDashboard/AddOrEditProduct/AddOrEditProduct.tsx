/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray, FormProvider } from "react-hook-form"; // Import FormProvider
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import Button from "../../../components/Reusable/Button/Button";
import Textarea from "../../../components/Reusable/TextArea/TextArea";
import SubscriptionStatus from "../../../components/Dashboard/SubscriptionStatus/SubscriptionStatus";
import { FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { TProduct } from "../../../types/product.types";
import {
  useAddProductMutation,
  useGetSingleProductByIdQuery,
  useUpdateProductMutation,
} from "../../../redux/Features/Product/productApi";
import toast from "react-hot-toast";
import Loader from "../../../components/Shared/Loader/Loader";
import ColorAndSizesField from "./ColorAndSizesField";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Category/categoryApi";
import SelectDropdown from "../../../components/Reusable/SelectDropdown/SelectDropdown";

const AddOrEditProduct = () => {
  const location = useLocation();
  const { id, action } = location.state || {};
  const { data: singleProduct, isLoading: productLoading } =
    useGetSingleProductByIdQuery(id);
  const { data: categories } = useGetAllCategoriesQuery({});

  const allCategories =
    categories?.data?.categories?.map(
      (category: TCategory) => category?.name
    ) ?? [];

  const [addProduct, { isLoading }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const navigate = useNavigate();
  const [previews, setPreviews] = useState<string[]>([]);

  const methods = useForm<TProduct>({
    defaultValues: {
      colors: [
        {
          colorName: "",
          sizes: [{ size: "", quantity: 0, basePrice: 0, discountedPrice: 0 }],
        },
      ],
      imageUrls: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control,
    name: "colors",
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "imageUrls",
  });

  useEffect(() => {
    if (singleProduct?.data) {
      setValue("name", singleProduct.data.name);
      setValue("category", singleProduct.data.category);
      setValue("clothDetails", singleProduct.data.clothDetails);
      setValue("madeIn", singleProduct.data.madeIn);
      setValue("description", singleProduct.data.description);
      setValue("productStory", singleProduct.data.productStory);
      setValue(
        "colors",
        singleProduct.data.colors && singleProduct.data.colors.length > 0
          ? singleProduct.data.colors
          : [
              {
                colorName: "",
                sizes: [
                  { size: "", quantity: 0, basePrice: 0, discountedPrice: 0 },
                ],
              },
            ]
      );
      if (singleProduct.data.imageUrls?.length) {
        setPreviews([]);
        setValue(
          "imageUrls",
          singleProduct.data.imageUrls.map((url: string) => ({ file: url }))
        );
        setPreviews(singleProduct.data.imageUrls);
      } else {
        setValue("imageUrls", [""]);
      }
    } else {
      setValue("colors", [
        {
          colorName: "",
          sizes: [{ size: "", quantity: 0, basePrice: 0, discountedPrice: 0 }],
        },
      ]);
      setValue("imageUrls", [""]);
      setPreviews([]);
    }
  }, [setValue, singleProduct]);

  const handleSubmitProduct = async (
    data: TProduct & { imageUrls?: { file?: File | string }[] }
  ) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("category", data.category);
    if (data.clothDetails) formData.append("clothDetails", data.clothDetails);
    if (data.madeIn) formData.append("madeIn", data.madeIn);
    formData.append("description", data.description);
    if (data.productStory) formData.append("productStory", data.productStory);

    data.colors?.forEach((color, colorIndex) => {
      formData.append(`colors[${colorIndex}][colorName]`, color.colorName);
      color.sizes.forEach((size, sizeIndex) => {
        formData.append(
          `colors[${colorIndex}][sizes][${sizeIndex}][size]`,
          size.size
        );
        formData.append(
          `colors[${colorIndex}][sizes][${sizeIndex}][quantity]`,
          size.quantity.toString()
        );
        formData.append(
          `colors[${colorIndex}][sizes][${sizeIndex}][basePrice]`,
          size.basePrice.toString()
        );
        formData.append(
          `colors[${colorIndex}][sizes][${sizeIndex}][discountedPrice]`,
          size.discountedPrice.toString()
        );
      });
    });

    data.imageUrls?.forEach((imgObj) => {
      if (imgObj.file instanceof File) {
        formData.append("files", imgObj.file);
      }
    });

    try {
      if (action === "update") {
        const response = await updateProduct({ data: formData, id }).unwrap();
        toast.success(
          response?.data?.message || "Product updated successfully!"
        );
        navigate("/dashboard/admin/products");
      } else {
        const response = await addProduct(formData).unwrap();
        toast.success(response?.data?.message || "Product added successfully!");
        navigate("/dashboard/admin/products");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue(`imageUrls.${index}.file`, file);
    const newPreviews = [...previews];
    newPreviews[index] = URL.createObjectURL(file);
    setPreviews(newPreviews);
  };

  return (
    <div className="font-Montserrat min-h-screen">
      {productLoading ? (
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <SubscriptionStatus>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(handleSubmitProduct)}
              className="flex flex-col gap-4 mt-6 w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <TextInput
                  label="Product Name"
                  placeholder="Enter product name"
                  error={errors.name}
                  {...register("name", {
                    required: "Product name is required",
                  })}
                />

                {/* Category */}
                <SelectDropdown
                  label="Category"
                  {...register(`category`, {
                    required: "Category is required",
                  })}
                  error={errors?.category}
                  options={allCategories || []}
                />

                {/* Cloth Details */}
                <TextInput
                  label="Cloth Details"
                  placeholder="E.g., Cotton, Polyester"
                  error={errors.clothDetails}
                  {...register("clothDetails")}
                  isRequired={false}
                />

                {/* Made In */}
                <TextInput
                  label="Made In"
                  placeholder="E.g., India"
                  error={errors.madeIn}
                  {...register("madeIn")}
                  isRequired={false}
                />
              </div>
              {/* Description */}
              <Textarea
                label="Description"
                placeholder="Write product description..."
                rows={4}
                error={errors.description}
                {...register("description", {
                  required: "Description is required",
                })}
              />

              {/* Product Story */}
              <Textarea
                label="Product Story"
                placeholder="Tell your product story..."
                rows={4}
                error={errors.productStory}
                {...register("productStory")}
                isRequired={false}
              />
              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-neutral-10 leading-[18px] text-[15px] font-medium tracking-[-0.16] ">
                  Product Images (max 4)
                </h3>
                {imageFields.map((field, index) => {
                  const isExistingUrl = typeof field.file === "string";
                  const previewSource = isExistingUrl
                    ? field.file
                    : previews[index];

                  return (
                    <div key={field.id} className="flex flex-col md:flex-row items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        className="border border-neutral-95 rounded-lg p-2 w-[300px]"
                        onChange={(e) => handleFileChange(e, index)}
                      />

                      {/* Show preview */}
                      {previewSource && (
                        <img
                          src={previewSource}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-md border border-neutral-90"
                        />
                      )}

                      {imageFields.length > 1 && (
                        <FiTrash2
                          className="cursor-pointer size-5 text-primary-10"
                          onClick={() => {
                            removeImage(index);
                            const newPreviews = previews.filter(
                              (_, i) => i !== index
                            );
                            setPreviews(newPreviews);
                          }}
                        />
                      )}
                    </div>
                  );
                })}

                {imageFields.length < 4 && (
                  <Button
                    variant="primary"
                    type="button"
                    label="Add Image"
                    classNames="py-2 px-4"
                    onClick={() => appendImage({ file: undefined })}
                  />
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Colors & Sizes</h3>

                {colorFields.map((color, colorIndex) => (
                  <ColorAndSizesField
                    key={color.id}
                    colorIndex={colorIndex}
                    removeColor={removeColor}
                  />
                ))}

                <Button
                  variant="primary"
                  type="button"
                  label="Add Color"
                  classNames="py-2 px-4"
                  onClick={() =>
                    appendColor({
                      colorName: "",
                      sizes: [
                        {
                          size: "",
                          quantity: 0,
                          basePrice: 0,
                          discountedPrice: 0,
                        },
                      ],
                    })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="custom"
                  label="Cancel"
                  type="button"
                  classNames="py-2 px-3"
                  onClick={() => {
                    navigate("/dashboard/admin/products");
                  }}
                />
                <Button
                  variant="primary"
                  label="Save Product"
                  type="submit"
                  classNames="py-2 px-3"
                  isLoading={isLoading || isUpdating}
                />
              </div>
            </form>
          </FormProvider>
        </SubscriptionStatus>
      )}
    </div>
  );
};

export default AddOrEditProduct;
