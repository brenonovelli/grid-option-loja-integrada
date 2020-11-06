import styled from 'styled-components';

export const Container = styled.div`
  &.gridOptionsB9 {
    * {
      box-sizing: border-box;
    }

    &__container {
      .gridOptionsB9__form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, auto));
        grid-gap: 16px;
        margin: 0;

        > button:last-child {
          grid-column: span 2;
        }

        .gridOptionsB9__wrap {
          .gridOptionsB9__label {
            display: flex;
            align-items: center;
            height: 16px;

            .gridOptionsB9__optionName {
              padding: 4px 8px;
            }

            .gridOptionsB9__input {
              display: inline-flex;
              padding: 0;
              margin: 0;

              max-width: 100%;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
`;
