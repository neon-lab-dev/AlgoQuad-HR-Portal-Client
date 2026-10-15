/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray, useFormContext } from "react-hook-form";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import { FiTrash2 } from "react-icons/fi";
import type { TProduct } from "../../../types/product.types";

type ColorAndSizesFieldProps = {
  colorIndex: number;
  removeColor: (index: number) => void;
};

const ColorAndSizesField = ({
  colorIndex,
  removeColor,
}: ColorAndSizesFieldProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TProduct>();

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: `colors.${colorIndex}.sizes` as const,
  });

  return (
    <div className="border border-neutral-95 p-4 rounded-md space-y-4">
      <div className="flex items-center gap-4">
        <TextInput
          label="Color Name"
          placeholder="Black, White"
          error={errors.colors?.[colorIndex]?.colorName}
          {...register(`colors.${colorIndex}.colorName` as const, {
            required: "Color name is required",
          })}
        />
        <FiTrash2
          className="cursor-pointer text-primary-10 mt-5"
          onClick={() => removeColor(colorIndex)}
        />
      </div>

      <div className="space-y-2">
        {sizeFields.map((size, sizeIndex) => (
          <div
            key={size.id}
            className="flex flex-col md:flex-row gap-4 items-center"
          >
            <TextInput
              label="Size"
              placeholder="M, L, XL"
              error={errors.colors?.[colorIndex]?.sizes?.[sizeIndex]?.size}
              {...register(
                `colors.${colorIndex}.sizes.${sizeIndex}.size` as const,
                { required: "Size is required" }
              )}
            />
            <TextInput
              label="Quantity"
              type="number"
              error={errors.colors?.[colorIndex]?.sizes?.[sizeIndex]?.quantity}
              {...register(
                `colors.${colorIndex}.sizes.${sizeIndex}.quantity` as const,
                {
                  required: "Quantity is required",
                  valueAsNumber: true,
                }
              )}
            />
            <TextInput
              label="Base Price"
              type="number"
              error={errors.colors?.[colorIndex]?.sizes?.[sizeIndex]?.basePrice}
              {...register(
                `colors.${colorIndex}.sizes.${sizeIndex}.basePrice` as const,
                {
                  required: "Base price is required",
                  valueAsNumber: true,
                }
              )}
            />
            <TextInput
              label="Discounted Price"
              type="number"
              error={
                errors.colors?.[colorIndex]?.sizes?.[sizeIndex]?.discountedPrice
              }
              {...register(
                `colors.${colorIndex}.sizes.${sizeIndex}.discountedPrice` as const,
                {
                  required: "Discounted price is required",
                  valueAsNumber: true,
                }
              )}
            />
            <FiTrash2
              className="cursor-pointer text-primary-10 mt-5 text-lg md:text-[65px]"
              onClick={() => removeSize(sizeIndex)}
            />
          </div>
        ))}

        <button
          onClick={() =>
            appendSize({
              size: "",
              quantity: 0,
              basePrice: 0,
              discountedPrice: 0,
            })
          }
          className="text-sm text-primary-10 font-semibold italic underline cursor-pointer"
        >
          Add Size
        </button>
      </div>
    </div>
  );
};

export default ColorAndSizesField;
