// ============================================
// @ludo-nexus/ui - Form Components
// ============================================

import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    fullWidth = true,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={cn('w-full', fullWidth && 'w-full')}>
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-slate-200 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl bg-white/5 border transition-all duration-200',
              'text-white placeholder-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-cyan-400/50',
              leftIcon ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              'py-3',
              error 
                ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50'
                : 'border-slate-500/30 focus:border-cyan-400',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p 
            id={errorId} 
            className="mt-1.5 text-sm text-red-400" 
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p 
            id={helperId} 
            className="mt-1.5 text-sm text-slate-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    fullWidth = true,
    id,
    rows = 4,
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className={cn('w-full', fullWidth && 'w-full')}>
        {label && (
          <label 
            htmlFor={textareaId} 
            className="block text-sm font-medium text-slate-200 mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full rounded-xl bg-white/5 border transition-all duration-200',
            'text-white placeholder-slate-500 p-4 resize-y min-h-[100px]',
            'focus:outline-none focus:ring-2 focus:ring-cyan-400/50',
            error 
              ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50'
              : 'border-slate-500/30 focus:border-cyan-400',
            props.disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {error && (
          <p 
            id={errorId} 
            className="mt-1.5 text-sm text-red-400" 
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p 
            id={helperId} 
            className="mt-1.5 text-sm text-slate-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    options, 
    placeholder,
    fullWidth = true,
    id,
    ...props 
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className={cn('w-full', fullWidth && 'w-full')}>
        {label && (
          <label 
            htmlFor={selectId} 
            className="block text-sm font-medium text-slate-200 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full rounded-xl bg-white/5 border transition-all duration-200',
              'text-white',
              'focus:outline-none focus:ring-2 focus:ring-cyan-400/50',
              'pl-4 pr-10 py-3 appearance-none',
              error 
                ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50'
                : 'border-slate-500/30 focus:border-cyan-400',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p 
            id={errorId} 
            className="mt-1.5 text-sm text-red-400" 
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p 
            id={helperId} 
            className="mt-1.5 text-sm text-slate-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${checkboxId}-error`;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'w-5 h-5 rounded border-2 transition-all duration-200',
              'appearance-none cursor-pointer',
              'bg-white/5 border-slate-500/30',
              'checked:bg-gradient-to-r checked:from-sky-500 checked:to-cyan-500 checked:border-transparent',
              'checked:after:content-[""] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-y-1/2 checked:after:-translate-x-1/2 checked:after:w-1.5 checked:after:h-3 checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45',
              'focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-black',
              error && 'border-red-400/50',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label 
                htmlFor={checkboxId} 
                className="text-sm font-medium text-slate-200 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            )}
            {error && (
              <p id={errorId} className="mt-1 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  options: Array<{ value: string; label: string; description?: string }>;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioProps>(
  ({ className, label, description, error, options, id, ...props }, ref) => {
    const groupId = id || `radiogroup-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${groupId}-error`;

    return (
      <div 
        ref={ref}
        className={cn('space-y-3', className)}
        role="radiogroup"
        aria-label={label}
        aria-describedby={error ? errorId : description ? `${groupId}-desc` : undefined}
        {...props}
      >
        {label && (
          <label className="block text-sm font-medium text-slate-200 mb-2">
            {label}
          </label>
        )}
        {description && (
          <p id={`${groupId}-desc`} className="text-sm text-slate-500 mb-3">
            {description}
          </p>
        )}
        <div className="space-y-2">
          {options.map((option) => (
            <label 
              key={option.value} 
              className="flex items-start gap-3 cursor-pointer"
            >
              <div className="relative flex items-center">
                <input
                  type="radio"
                  name={groupId}
                  value={option.value}
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-all duration-200',
                    'appearance-none cursor-pointer',
                    'bg-white/5 border-slate-500/30',
                    'checked:border-cyan-400 checked:bg-gradient-to-r checked:from-sky-500 checked:to-cyan-500',
                    'checked:after:content-[""] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-y-1/2 checked:after:-translate-x-1/2 checked:after:w-2 checked:after:h-2 checked:after:rounded-full checked:after:bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-black',
                    error && 'border-red-400/50',
                    props.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-invalid={error ? 'true' : 'false'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-200">
                  {option.label}
                </span>
                {option.description && (
                  <p className="text-sm text-slate-500 mt-0.5">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
        {error && (
          <p id={errorId} className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${switchId}-error`;

    return (
      <div className="flex items-center gap-3">
        <div className="relative inline-flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            role="switch"
            className={cn(
              'peer w-11 h-6 rounded-full transition-all duration-200',
              'appearance-none cursor-pointer',
              'bg-white/10 border border-slate-500/30',
              'peer-checked:bg-gradient-to-r peer-checked:from-sky-500 peer-checked:to-cyan-500 peer-checked:border-transparent',
              'peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-400/50 peer-focus:ring-offset-2 peer-focus:ring-offset-black',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              error && 'border-red-400/50',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          <span className={cn(
            'absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white',
            'transition-transform duration-200',
            'peer-checked:translate-x-full',
            'shadow-md'
          )} aria-hidden="true" />
        </div>
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label 
                htmlFor={switchId} 
                className="text-sm font-medium text-slate-200 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            )}
            {error && (
              <p id={errorId} className="mt-1 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField = ({ 
  className, 
  label, 
  error, 
  helperText, 
  required,
  children 
}: FormFieldProps) => {
  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label 
          className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-400" aria-hidden="true">*</span>}
        </label>
      )}
      {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement<any>, {
        id: (children.props as any).id || fieldId,
        error: error || (children.props as any).error,
        helperText: helperText || (children.props as any).helperText,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': [error ? errorId : null, helperText ? helperId : null].filter(Boolean).join(' ') || undefined,
      }) : children}
      {error && (
        <p 
          id={errorId} 
          className="mt-1.5 text-sm text-red-400" 
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p 
          id={helperId} 
          className="mt-1.5 text-sm text-slate-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-sm font-medium text-slate-200 mb-2 flex items-center gap-1',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-400" aria-hidden="true">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';