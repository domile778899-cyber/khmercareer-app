import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validate?: (value: string) => string | undefined;
  required?: boolean;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  autoComplete?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  validate,
  required = false,
  placeholder,
  error,
  touched = false,
  disabled = false,
  icon,
  className = '',
  autoComplete,
}: FormFieldProps) {
  const [internalTouched, setInternalTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | undefined>(undefined);
  const [isFocused, setIsFocused] = useState(false);

  const isTouched = touched || internalTouched;
  const displayError = error || internalError;
  const showError = isTouched && displayError;
  const showSuccess = isTouched && value && !displayError && validate;

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setInternalTouched(true);
    if (validate) {
      const validationError = validate(value);
      setInternalError(validationError);
    }
    onBlur?.();
  }, [validate, value, onBlur]);

  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
      if (internalTouched && validate) {
        const validationError = validate(newValue);
        setInternalError(validationError);
      }
      // Clear external error on change
      if (error) {
        onChange(newValue);
      }
    },
    [onChange, internalTouched, validate, error]
  );

  const borderColor = showError
    ? 'border-coral focus:border-coral focus:ring-coral/20'
    : showSuccess
    ? 'border-emerald focus:border-emerald focus:ring-emerald/20'
    : isFocused
    ? 'border-gold focus:border-gold focus:ring-gold/30'
    : 'border-sand focus:border-gold focus:ring-gold/30';

  const bgColor = disabled ? 'bg-sand/30' : 'bg-cream/50';

  return (
    <div className={`${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-charcoal mb-1.5"
      >
        {label}
        {required && <span className="text-coral ml-0.5">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none z-10">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${name}-error` : undefined}
          className={`
            w-full rounded-lg py-3 text-charcoal placeholder:text-warm-gray/60
            transition-all duration-200 outline-none
            ${icon ? 'pl-11' : 'pl-4'} pr-10
            border ${borderColor} ${bgColor}
            focus:ring-2
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
        />

        {/* Status indicator */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              <div className="w-5 h-5 rounded-full bg-emerald flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </motion.div>
          )}

          {showError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              <div className="w-5 h-5 rounded-full bg-coral flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {showError && (
          <motion.p
            id={`${name}-error`}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-coral text-xs mt-1.5 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
