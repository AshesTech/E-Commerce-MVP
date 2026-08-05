"use client";

import React, { useState } from "react";

export default function VendorSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    password: "",
    colorPrimary: "#3b82f6",
    colorSecondary: "#1e293b",
    colorAccent: "#10b981",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [slug, setSlug] = useState("");

  // Auto-generate slug when Business Name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({ ...prev, name }));

    // Generate slug: lowercase and remove special characters
    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    setSlug(generatedSlug);
  };

  // Handle Logo Upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare FormData for file upload & API submission
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("colorPrimary", formData.colorPrimary);
    data.append("colorSecondary", formData.colorSecondary);
    data.append("colorAccent", formData.colorAccent);

    if (logoFile) {
      data.append("logoFile", logoFile);
    }

    console.log("Submitting Form Data:", {
      ...formData,
      slug,
      logoFile: logoFile?.name,
    });

    alert(`Form submitted for ${formData.name}! Check console log.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create Your Vendor Store
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Set up your business, logo, and store branding
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Oppo Store"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
                value={formData.name}
                onChange={handleNameChange}
              />
            </div>

            {/* Subdomain Preview */}
            {slug && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800">
                <strong>Your Store URL will be:</strong>
                <p className="font-mono mt-1 text-blue-900">
                  {slug}.localhost:3000
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe your store..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Email & Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Owner Email *
              </label>
              <input
                type="email"
                required
                placeholder="owner@example.com"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-sm"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            {/* Logo File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Logo
              </label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleLogoChange}
              />
            </div>

            {/* Color Palette Picker (1 to 3 Colors) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Theme Colors (Primary, Secondary, Accent)
              </label>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <input
                    type="color"
                    title="Primary Color"
                    value={formData.colorPrimary}
                    onChange={(e) =>
                      setFormData({ ...formData, colorPrimary: e.target.value })
                    }
                    className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                  />
                  <span className="block text-[10px] text-gray-500 mt-1">
                    Primary
                  </span>
                </div>

                <div className="text-center">
                  <input
                    type="color"
                    title="Secondary Color"
                    value={formData.colorSecondary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        colorSecondary: e.target.value,
                      })
                    }
                    className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                  />
                  <span className="block text-[10px] text-gray-500 mt-1">
                    Secondary
                  </span>
                </div>

                <div className="text-center">
                  <input
                    type="color"
                    title="Accent Color"
                    value={formData.colorAccent}
                    onChange={(e) =>
                      setFormData({ ...formData, colorAccent: e.target.value })
                    }
                    className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                  />
                  <span className="block text-[10px] text-gray-500 mt-1">
                    Accent
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Store
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
