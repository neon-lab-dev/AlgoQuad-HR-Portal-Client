/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import Table from "../../../components/Reusable/Table/Table";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import Button from "../../Reusable/Button/Button";
import { useNavigate } from "react-router-dom";
import DashboardContainer from "../../Dashboard/SharedComponents/DashboardContainer/DashboardContainer";
import Dropdown from "../../Reusable/Dropdown/Dropdown";
import SearchInput from "../../Reusable/SearchInput/SearchInput";
// import ProductPreview from "./ProductPreview";
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../../redux/Features/Product/productApi";
import type { TProduct } from "../../../types/product.types";
import { formatDate } from "../../../utils/formatDate";
import ProductPreview from "./ProductPreview";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Category/categoryApi";
import type { TCategory } from "../../../types/category.types";

const Products = () => {
    const [deleteProduct] = useDeleteProductMutation();
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("");
  const [isProductPreviewOpen, setIsProductPreviewOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetAllProductsQuery({
    keyword: searchValue,
    category,
    page,
  });

  const allProducts = data?.data?.products as TProduct[];

   const { data: categories } = useGetAllCategoriesQuery({});
   const allCategories =
  [
    { label: "All", value: "" },
    ...(categories?.data?.categories?.map((category: TCategory) => ({
      label: category?.name,
      value: category?.name,
    })) ?? []),
  ];


  const allProductsData =
  allProducts?.map((product: any) => {
    // Total stock across all colors and sizes
    const totalStock = product?.colors?.reduce(
      (sum: number, color: any) =>
        sum + color.sizes.reduce((sSum: number, s: any) => sSum + s.quantity, 0),
      0
    );

    const statusColor =
      totalStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

    // Price component for each color
    const PriceWithColors = () => {
      const [selectedColorIdx, setSelectedColorIdx] = useState(0);
      const [selectedSize, setSelectedSize] = useState(product.colors[0].sizes[0]);

      const handleColorChange = (idx: number) => {
        setSelectedColorIdx(idx);
        setSelectedSize(product.colors[idx].sizes[0]);
      };

      return (
        <div className="flex flex-col gap-2">
          {/* Colors */}
          <div className="flex gap-2">
            {product.colors.map((color: any, idx: number) => (
              <span
                key={idx}
                className={`cursor-pointer px-2 py-1 text-[11px] rounded border ${
                  selectedColorIdx === idx
                    ? "border-green-600 font-semibold"
                    : "border-gray-300"
                }`}
                onClick={() => handleColorChange(idx)}
              >
                {color.colorName}
              </span>
            ))}
          </div>

          {/* Sizes */}
          <div className="flex gap-2">
            {product.colors[selectedColorIdx].sizes.map((s: any) => (
              <span
                key={s.size}
                className={`cursor-pointer underline ${
                  selectedSize.size === s.size ? "font-semibold text-green-600" : ""
                } ${s.quantity === 0 ? "text-red-600 line-through cursor-not-allowed" : ""}`}
                onClick={() => s.quantity > 0 && setSelectedSize(s)}
              >
                {s.size}
              </span>
            ))}
          </div>

          {/* Price display */}
          <div className="flex items-center gap-2">
            {selectedSize.discountedPrice && selectedSize.discountedPrice < selectedSize.basePrice ? (
              <>
                <span className="line-through text-gray-400">₹{selectedSize.basePrice}</span>
                <span className="text-green-600 font-semibold">₹{selectedSize.discountedPrice}</span>
              </>
            ) : (
              <span>₹{selectedSize.basePrice}</span>
            )}
          </div>
        </div>
      );
    };

    // Available stock display
    const stockDisplay = product.colors.map((color: any, cIdx: number) => (
      <div key={cIdx}>
        <strong>{color.colorName}:</strong>{" "}
        {color.sizes.map((s: any, idx: number) => (
          <span key={s.size}>
            {s.size}(
            {s.quantity === 0 ? <span className="text-red-600">{s.quantity}</span> : s.quantity})
            {idx < color.sizes.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    ));

    return {
      image: (
        <img
          src={product.imageUrls?.[0]}
          alt={product.name}
          className="size-20 object-cover rounded"
        />
      ),
      _id: product._id,
      productId: product.productId,
      name: product.name,
      category: (<p className="capitalize">{product.category}</p>),
      createdAt: formatDate(product.createdAt),
      availableStock: <span>{stockDisplay}</span>,
      status: (
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}
        >
          {totalStock > 0 ? "Available" : "Out of Stock"}
        </span>
      ),
      price: <PriceWithColors />,
      colors: product.colors.map((c: any) => c.colorName).join(", "),
      // sizes: product.colors.flatMap((c: any) => c.sizes.map((s: any) => s.size)).join(", "),
    };
  }) || [];

const productColumns = [
  { key: "image", label: "Image" },
  { key: "productId", label: "Product ID" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "availableStock", label: "Available Stock" },
  { key: "status", label: "Status" },
  { key: "price", label: "Price" },
  { key: "colors", label: "Colors" },
  // { key: "sizes", label: "Sizes" },
  { key: "createdAt", label: "Added At" },
];




  const handleDeleteProduct = async (id: string) => {
    toast.promise(deleteProduct(id).unwrap(), {
      loading: "Deleting product...",
      success: "Product deleted successfully.",
      error: (err: any) => err?.data?.message || "Something went wrong!",
    });
  };

  const productActions = [
    {
      icon: <FiEye />,
      label: "View",
      onClick: (row: any) => {
        setSelectedProductId(row?._id);
        setIsProductPreviewOpen(true);
      },
    },
    {
      icon: <FiEdit />,
      label: "Update",
      onClick: (row: any) =>
        navigate("/dashboard/admin/add-or-edit-product", {
          state: { id: row?._id, action: "update" },
        }),
    },
    {
      icon: <FiTrash2 />,
      label: "Delete",
      onClick: (row: any) => handleDeleteProduct(row?._id),
      className: "text-red-600",
    },
  ];

  return (
    <div className="mt-6 font-Montserrat">
      <DashboardContainer>
        <div className="font-Montserrat flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-neutral-40">Products</h1>
              <p className="text-neutral-65">Manage your products</p>
            </div>
            <div className="flex justify-between items-center gap-4 flex-wrap">
              {/* Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <SearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search products..."
                />
                <Dropdown
                  className="py-1"
                  value={category}
                  onChange={setCategory}
                  options={allCategories || []}
                />

                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/dashboard/admin/add-or-edit-product")
                  }
                  label="Add Product"
                  classNames="w-fit py-2 "
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <Table
            columns={productColumns}
            data={allProductsData}
            actions={productActions}
            rowKey="_id"
            isLoading={isLoading || isFetching}
            page={page}
            onPageChange={setPage}
            totalPages={data?.data?.pagination?.totalPages}
          />
          {/* <Button
            variant="primary"
            onClick={handleExportProducts}
            label="Export"
            classNames="w-fit self-end py-2 px-4 "
          /> */}
        </div>
      </DashboardContainer>
      <ConfirmationModal
        isConfirmationModalOpen={isProductPreviewOpen}
        setIsConfirmationModalOpen={setIsProductPreviewOpen}
        isCrossVisible={true}
        heading="Product Details"
      >
        <ProductPreview productId={selectedProductId} />
      </ConfirmationModal>
    </div>
  );
};

export default Products;