import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.label<ContainerProps>`
  ${props =>
    props.isFilled &&
    css`
      color: green;
    `}

  ${props =>
    props.isFocused &&
    css`
      color: orange;
    `}
`;
