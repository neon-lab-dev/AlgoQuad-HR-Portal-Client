import { useState, useEffect } from "react";
import { useGetSingleProductByIdQuery } from "../../../redux/Features/Product/productApi";
import Loader from "../../Shared/Loader/Loader";
import type { TProduct } from "../../../types/product.types";

const ProductPreview = ({ productId }: { productId: string }) => {
  const { data, isLoading } = useGetSingleProductByIdQuery(productId);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const product: TProduct | undefined = data?.data;

  useEffect(() => {
    if (product?.imageUrls && product?.imageUrls?.length > 0) {
      setSelectedImage(product.imageUrls[0]);
    }
    if (product?.colors && product?.colors?.length > 0) {
      setSelectedColor(product.colors[0].colorName);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-64 text-red-500">
        Product not found
      </div>
    );
  }

  const currentColor =
    product?.colors &&
    product?.colors.find((color) => color?.colorName === selectedColor);
  const availableSizes = currentColor?.sizes || [];

  return (
    <div className="max-w-4xl mx-auto p-6 font-Montserrat">
      <div className="flex flex-col gap-8">
        {/* Image Gallery Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product?.imageUrls?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product?.imageUrls?.map((url: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(url)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === url
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={url}
                    alt={`${product?.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product?.name}</h1>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-500 capitalize">
                <strong>Category:</strong> {product?.category} |{" "}
                <strong>Product ID:</strong> {product?.productId}
              </p>
              {product?.madeIn && (
                <p className="text-sm text-gray-500">
                  <strong>Made in</strong> {product?.madeIn}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product?.description}
            </p>
          </div>

          {/* Color Selection */}
          {product?.colors?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product?.colors?.map((color) => (
                  <button
                    key={color.colorName}
                    onClick={() => setSelectedColor(color.colorName)}
                    className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                      selectedColor === color.colorName
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {color.colorName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size and Price Grid */}
          {availableSizes.length > 0 ? (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                Available Sizes & Prices
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableSizes?.map((size, index) => (
                  <div
                    key={`${size.size}-${index}`}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-900">
                        {size?.size}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {size?.quantity} in stock
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-green-600">
                        ₹{size?.discountedPrice}
                      </span>
                      {size?.discountedPrice < size?.basePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{size?.basePrice}
                        </span>
                      )}
                      {size?.discountedPrice < size?.basePrice && (
                        <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                          Save ₹
                          {(size?.basePrice - size?.discountedPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No sizes available for selected color
            </p>
          )}

          {/* Additional Details */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            {product?.clothDetails && (
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-1">
                  Fabric Details
                </h4>
                <p className="text-gray-600 text-sm">{product?.clothDetails}</p>
              </div>
            )}

            {product?.productStory && (
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-1">
                  Product Story
                </h4>
                <p className="text-gray-600 text-sm">{product?.productStory}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
