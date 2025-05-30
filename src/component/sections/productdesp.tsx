"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from "next/image";
import { ArrowLeft, ShoppingCart } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  images: { optimizeUrl: string }[];
  category: { name: string };
}

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  useEffect(() => {
    if (!productId) {
      console.error('❌ No product ID found');
      setError('Product ID not found');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await axios.get('https://glore-bd-backend-node-mongo.vercel.app/api/product');
        const products: Product[] = res.data.data || res.data;
  
        const found = products.find(p => p._id === productId);
        if (found) {
          setProduct(found);
        } else {
          console.error('❌ Product not found');
          setError('Product not found');
        }
      } catch (err) {
        console.error('❌ Failed to fetch product details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [productId]);
  

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Product not found'}</p>
          <button 
            onClick={() => router.back()}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 p-6">
              <div className="aspect-square rounded-xl overflow-hidden bg-amber-100 mb-4">
                <Image
                  src={product.images?.[selectedImageIndex]?.optimizeUrl || '/fallback.jpg'}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-amber-600' 
                          : 'border-gray-200 hover:border-amber-400'
                      }`}
                    >
                      <Image
                        src={image.optimizeUrl}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              <div className="space-y-6">
                {/* Category Badge */}
                <div className="inline-block">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="text-3xl font-bold text-amber-600">
                  ${product.price}
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>

                {/* Product Info List */}
                <div className="space-y-3 bg-amber-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                    <span className="font-medium text-gray-700">Product ID:</span>
                    <span className="text-gray-600 font-mono text-sm">{product._id}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="text-gray-600">{product.category?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Images:</span>
                    <span className="text-gray-600">{product.images?.length || 0} available</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  <button className="w-full bg-amber-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart size={24} />
                    Add to Cart
                  </button>
                  
                  <button className="w-full border-2 border-amber-600 text-amber-600 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-amber-50 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}