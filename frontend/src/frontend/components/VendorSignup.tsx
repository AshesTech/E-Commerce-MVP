'use client';

import { useState, useRef } from 'react';

export default function VendorSignup() {
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoName, setLogoName] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const [primaryColor, setPrimaryColor] = useState('#4f46e5');
    const [secondaryColor, setSecondaryColor] = useState('#0ea5e9');
    const [accentColor, setAccentColor] = useState('#f59e0b');

    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFile(file: File | null | undefined) {
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        setLogoName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleFile(e.target.files && e.target.files[0]);
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files && e.dataTransfer.files[0]);
    }

    function removeLogo() {
        setLogoPreview(null);
        setLogoName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const payload = {
            businessName,
            description,
            logoName,
            colors: { primaryColor, secondaryColor, accentColor },
        };
        console.log('[v0] Vendor signup submitted:', payload);
        alert('Vendor profile submitted! Check the console for the payload.');
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">
                        Vendor Onboarding
                    </span>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
                        Create your brand storefront
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-500 text-pretty">
                        Set up your vendor profile and customize how your brand appears across the marketplace.
                    </p>
                </div>

                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                    <div className="space-y-8 p-6 sm:p-8">
                        {/* Business Name */}
                        <div>
                            <label
                                htmlFor="businessName"
                                className="block text-sm font-semibold text-slate-900"
                            >
                                Business Name
                            </label>
                            <p className="mt-1 text-sm text-slate-500">
                                The name customers will see on your storefront.
                            </p>
                            <input
                                id="businessName"
                                name="businessName"
                                type="text"
                                required
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="Acme Supplies Co."
                                className="mt-3 block w-full rounded-lg border-0 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-semibold text-slate-900"
                            >
                                Description
                            </label>
                            <p className="mt-1 text-sm text-slate-500">
                                A short summary of what your business offers.
                            </p>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="We provide premium industrial supplies with fast shipping and dedicated support..."
                                className="mt-3 block w-full resize-y rounded-lg border-0 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                            />
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <span className="block text-sm font-semibold text-slate-900">
                                Logo Upload
                            </span>
                            <p className="mt-1 text-sm text-slate-500">
                                PNG, JPG or SVG. Recommended at least 400x400px.
                            </p>

                            {!logoPreview ? (
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                    className={
                                        'mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ' +
                                        (isDragging
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-100')
                                    }
                                >
                                    <svg
                                        className="h-10 w-10 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                        />
                                    </svg>
                                    <p className="mt-3 text-sm font-medium text-slate-700">
                                        <span className="text-indigo-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">Maximum file size 5MB</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="sr-only"
                                    />
                                </div>
                            ) : (
                                <div className="mt-3 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-slate-900">{logoName}</p>
                                        <p className="text-xs text-slate-500">Logo uploaded successfully</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeLogo}
                                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Brand Colors */}
                        <div>
                            <span className="block text-sm font-semibold text-slate-900">Brand Colors</span>
                            <p className="mt-1 text-sm text-slate-500">
                                Choose the colors that represent your brand identity.
                            </p>

                            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <ColorField
                                    label="Primary"
                                    required
                                    value={primaryColor}
                                    onChange={setPrimaryColor}
                                />
                                <ColorField
                                    label="Secondary"
                                    value={secondaryColor}
                                    onChange={setSecondaryColor}
                                />
                                <ColorField
                                    label="Accent"
                                    value={accentColor}
                                    onChange={setAccentColor}
                                />
                            </div>

                            {/* Live preview */}
                            <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <span className="text-xs font-medium text-slate-500">Preview</span>
                                <div className="flex flex-1 items-center gap-2">
                                    <span
                                        className="h-8 flex-1 rounded-md ring-1 ring-inset ring-black/5"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                    <span
                                        className="h-8 flex-1 rounded-md ring-1 ring-inset ring-black/5"
                                        style={{ backgroundColor: secondaryColor }}
                                    />
                                    <span
                                        className="h-8 flex-1 rounded-md ring-1 ring-inset ring-black/5"
                                        style={{ backgroundColor: accentColor }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
                        <button
                            type="button"
                            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                        >
                            Create Vendor Profile
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

function ColorField({
    label,
    value,
    onChange,
    required,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3">
            <label className="block text-xs font-medium text-slate-700">
                {label}
                {required ? <span className="ml-0.5 text-indigo-600">*</span> : null}
            </label>
            <div className="mt-2 flex items-center gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded-md border border-slate-300 bg-white p-0.5"
                    aria-label={label + ' color'}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-md border-0 bg-white px-2 py-1.5 font-mono text-xs uppercase text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                />
            </div>
        </div>
    );
}
