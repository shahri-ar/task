"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Monitor, Earth, MapPin, Shapes, DollarSign, Mail } from 'lucide-react';

export default function StoreCreationForm() {
  
  const [domainStatus, setDomainStatus] = useState<null | boolean>(null); // true = taken, false = available
  const [checking, setChecking] = useState(false);
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [error, setError] = useState<{ name: string; domain: string; email: string }>({name: '',domain: '',email: '',});
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    currency: 'BDT',
    country: 'Bangladesh',
    domain: '',
    category: 'Fashion',
    email: '',
  });
  

  const checkDomain = async (domain: string) => {
    if (!domain) return;
    setChecking(true);
  
    try {
      const response = await fetch(
        `https://interview-task-green.vercel.app/task/domains/check/${domain.trim()}.expressitbd.com`
      );
      const json = await response.json();
      const taken = json.data.taken;
      
      setDomainStatus(taken);
      setError(prev => ({ ...prev, domain: '' }));
  
    } catch (err) {
      console.error('❌ Error checking domain:', err);
      setError(prev => ({ ...prev, domain: 'Error checking domain' }));
    } finally {
      setChecking(false);
    }
  };

  const handleDomainBlur = () => {
    checkDomain(formData.domain);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  
    if (field === 'domain') {
      setDomainStatus(null);
      setError(prev => ({ ...prev, domain: '' }));
    }
  
    if (field === 'name') {
      setError(prev => ({
        ...prev,
        name: value.trim().length < 3 ? 'Store name must be at least 3 characters long.' : '',
      }));
    }
  
    if (field === 'email') {
      setError(prev => ({
        ...prev,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.',
      }));
    }
  };
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    const newErrors = {
      name: formData.name.trim().length < 3 ? 'Store name must be at least 3 characters long.' : '',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? '' : 'Please enter a valid email address.',
      domain: domainStatus === true ? 'Domain is already taken. Please choose another.' : '',
    };
  
    setError(newErrors);
  
    if (Object.values(newErrors).some((err) => err !== '')) {
      return;
    }
  
    try {
      const response = await fetch('https://interview-task-green.vercel.app/task/stores/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setSuccess('Store created successfully!');
        setError({ name: '', domain: '', email: '' });
        setFormData({
          name: '',
          currency: 'BDT',
          country: 'Bangladesh',
          domain: '',
          category: 'Fashion',
          email: '',
        });
        setDomainStatus(null);
        router.push('/product')

      } else {
        throw new Error('Failed to create store');
      }
    } catch (err) {
      setSubmitError('Network error. Please try again later.');
      setSuccess('');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create a store</h1>
          <p className="text-gray-600 mb-8 pb-2 border-b-2 border-gray-300/90">Add your basic store information and complete the setup</p>
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{success}</p>
            </div>
          )}
          {submitError  && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{submitError}</p>
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Store Name */}
            <div className="flex items-start space-x-4 flex-col md:flex-row">
              <div className='flex-1 flex flex-col lg:flex-row  gap-4 '>
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <Monitor className="w-4 h-4 text-blue-600" />
                </div>  
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Give your online store a name</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    A great store name is a big part of your success. Make sure it aligns with your brand and products.
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="How'd you like to call your store?"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {error.name && <p className="text-sm text-red-600 mt-1">{error.name}</p>}
              </div>
            </div>

            {/* Subdomain */}
            <div className="flex items-start space-x-4 flex-col md:flex-row">
              <div className='flex-1 flex flex-col lg:flex-row  gap-4 '>
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <Earth className="w-4 h-4 text-blue-600" />
                </div>  
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Your online store subdomain</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    A SEO-friendly store name is a crucial part of your success. Make sure it aligns with your brand and products.
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="enter your domain name"
                    value={formData.domain}
                    onChange={(e) => handleInputChange('domain', e.target.value)}
                    onBlur={handleDomainBlur}
                    required
                    className={`w-full px-4 py-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      domainStatus === true ? 'border-red-500' : 
                      domainStatus === false ? 'border-green-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="px-4 py-3 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                    expressitbd.com
                  </div>
                </div>
                {checking && <p className="text-sm text-gray-500 mt-1">Checking domain...</p>}
                {domainStatus === true && <p className="text-sm text-red-600 mt-1">Domain is already taken.</p>}
                {domainStatus === false && <p className="text-sm text-green-600 mt-1">Domain is available!</p>}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-4 flex-col md:flex-row">
              <div className='flex-1 flex flex-col lg:flex-row  gap-4 '>
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>  
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Where's your store located?</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Set your store's default location so we can optimize store access and speed for your customers.
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full">
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="India">India</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-start space-x-4 flex-col md:flex-row">
              <div className='flex-1 flex flex-col lg:flex-row  gap-4 '>
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <Shapes className="w-4 h-4 text-blue-600" />
                </div>  
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">What's your Category?</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Set your store's default category so that we can optimize store access and speed for your customers.
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full">
              <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="Fashion">Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports & Outdoors">Sports & Outdoors</option>
                  <option value="Books & Media">Books & Media</option>
                  <option value="Health & Beauty">Health & Beauty</option>
                </select>
              </div>
            </div>

            {/* Currency */}
            <div className="flex items-start space-x-4 flex-col md:flex-row">
              <div className='flex-1 flex flex-col lg:flex-row  gap-4 '>
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>  
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Choose store currency</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    This is the main currency you wish to sell in.
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full">
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="BDT">BDT (Taka)</option>
                  <option value="USD">USD (Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (Pound)</option>
                  <option value="INR">INR (Rupee)</option>
                </select>
              </div>
            </div>

            {/* Contact Email */}
            <div className="flex items-start space-x-4 flex-col md:flex-row">
              <div className='flex-1 flex flex-col lg:flex-row  gap-4 '>
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>  
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Store contact email</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    This is the email you'll use to send notifications to and receive orders from customers.
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {error.email && <p className="text-sm text-red-600 mt-1">{error.email}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className=" flex justify-end">
              <button
                type="submit"
                disabled={domainStatus === true || checking}
                className="px-4 py-2 bg-violet-500/50 text-sm text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {checking ? 'Checking...' : 'Create store'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

