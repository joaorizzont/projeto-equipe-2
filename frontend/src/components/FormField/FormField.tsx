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
    disabled?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, type = 'text', placeholder, value, onChange, error, required, icon, disabled }, ref) => {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative flex items-center">
                    {icon && (
                        <div className="absolute left-4 text-slate-400 flex items-center justify-center pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                            error ? 'border-red-500' : 'border-slate-200'
                        }`}
                    />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);
