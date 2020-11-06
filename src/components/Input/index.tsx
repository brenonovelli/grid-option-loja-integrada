import React, {
  InputHTMLAttributes,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useField } from '@unform/core';
import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

const Input: React.FC<InputProps> = ({ name, label, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container
      isFocused={isFocused}
      isFilled={isFilled}
      htmlFor={name}
      className={`
        gridOptionsB9__label
        ${isFilled ? ' gridOptionsB9__label_filled' : ''}
        ${isFocused ? ' gridOptionsB9__label_focused' : ''}
      `}
    >
      <span className="gridOptionsB9__optionName">{label}</span>

      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="gridOptionsB9__input"
        size={6}
        type={rest.type}
        defaultValue={defaultValue}
        {...rest}
        ref={inputRef}
        id={name}
      />
    </Container>
  );
};

export default Input;
