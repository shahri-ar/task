"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from "next/image";
import { ArrowRight, Plus} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  images: { optimizeUrl: string }[];
  category: { name: string };
}

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://glore-bd-backend-node-mongo.vercel.app/api/product');
        setProducts(response.data.data);
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    router.push(`/product_desp/${productId}`);
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  return (
    <section className="py-24 bg-amber-100">
      <div className="container mx-auto 2xl:w-[67%] px-5">
        <div className="my-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative flex flex-col justify-between overflow-hidden group cursor-pointer transform hover:scale-105 transition-transform duration-300"
              onClick={() => handleProductClick(product._id)}
            >
              <div className="bg-amber-200 relative rounded-[15px] before:content-[''] before:absolute before:h-[20px] before:w-[20px] before:top-[16%] before:right-0 before:rounded-full before:[box-shadow:10px_-10px_0_#fef3c7] overflow-hidden"
              >
                <div className="h-[370px] sm:h-[400px] ">
                  <Image
                    src={product.images?.[0]?.optimizeUrl || '/fallback.jpg'}
                    alt={product.name}
                    height={200}
                    width={500}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="absolute w-full h-[45%] bottom-0 rounded-b-xl overflow-hidden group-hover:h-[45%] transition-all duration-300">
                  <div className="relative">
                    <div className="w-full p-7 absolute transform transition-all duration-700 group-hover:-translate-y-[75px] translate-y-[85px] bg-white/10 backdrop-blur">
                      <div className="bg-white w-10 h-10 grid place-content-center rounded-full">
                        <Plus />
                      </div>
                      <div className="pt-7 sm:mb-12 mb-10">
                        <h1 className="text-[28px] font-semibold text-black leading-none">
                          {product.name}
                        </h1>
                      </div>
                      <p className="text-black overflow-hidden text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-black text-sm font-medium">
                        Category: {product.category?.name || 'N/A'}
                      </p>
                      <p className="text-black text-sm font-medium">
                        Price: ${product.price}
                      </p>
                      <div className="mt-3 text-xs text-black/70 hover:text-black transition-colors">
                        Click to view details →
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex absolute top-0 right-0">
                  <div className="relative w-10 after:content-[''] after:absolute after:h-[20px] after:w-[20px] after:right-0 after:top-0 after:rounded-[50%] after:[box-shadow:10px_-10px_0_#fef3c7]">
                  </div>
                  <div className="overflow-hidden relative h-16 w-16 border-b-[10px] border-l-[10px] border-amber-100 rounded-tr-xl rounded-bl-3xl before:absolute before:content-[''] before:h-[25px] before:w-[25px] before:rounded-xl before:[box-shadow:-10px_-10px_0_#fef3c7] after:content-[''] after:absolute after:h-[25px] after:w-[25px] after:bottom-0 after:right-0 after:rounded-xl after:[box-shadow:10px_10px_0_#fef3c7]">
                    <ArrowRight className="p-[3px] text-black absolute top-0 -left-[40px] h-full transition-all duration-500 group-hover:left-[14px]" />
                    <ArrowRight className="p-[3px] text-black absolute top-0 left-[14px] h-full transition-all duration-500 group-hover:left-[55px]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}