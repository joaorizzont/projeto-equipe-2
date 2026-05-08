import { forwardRef } from 'react';
import type { ReactNode } from 'react';

interface FormFieldProps {
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    icon?: ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, type = 'text', placeholder, value, onChange, error, required, icon }, ref) => {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-black">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative flex items-center">
                    {icon && (
                        <div className="absolute left-4 text-gray-400 flex items-center justify-center pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} bg-white border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            error ? 'border-red-500' : 'border-gray-200'
                        }`}
                    />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);