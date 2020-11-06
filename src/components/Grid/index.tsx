import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import axios from 'axios';
import { SubmitHandler, FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { Container } from './styles';
import Input from '../Input';

interface OptionProduct {
  productId: string;
  text: string;
  added: boolean;
}

interface Ammount {
  id: string;
  value: string;
}

const Grid: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();
  const [optionsProduct, setOptionsProduct] = useState<OptionProduct[]>([]);
  const [ammount, setAmmount] = useState<Ammount[]>([]);
  const formRef = useRef<FormHandles>(null);

  const rootOptionsProduct = useMemo(
    () => [
      ...document.querySelectorAll(
        '.produto .atributos .componente ul li .atributo-item'
      ),
    ],
    []
  );

  const getProductIdByOptionID = useCallback((item: HTMLElement) => {
    const element = document.querySelector<HTMLElement>(
      `.acoes-produto[data-variacao-id="${item.dataset.variacaoId}"]`
    );

    return element !== null ? element.dataset.produtoId : null;
  }, []);

  useEffect(() => {
    if (rootOptionsProduct) {
      const optionsList = rootOptionsProduct.map((item: Element) => {
        if (item instanceof HTMLElement) {
          const productId = getProductIdByOptionID(item);

          if (productId) {
            const productData = {
              text: item.innerText,
              productId,
              added: false,
            };

            return productData;
          }
        }

        return { text: '', productId: '', added: false };
      });

      setOptionsProduct([...optionsList]);
      setLoading(false);
    }
  }, [rootOptionsProduct, getProductIdByOptionID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    const hasProductOnList = ammount.find(item => item.id === id);

    const newItem = { id, value };

    if (hasProductOnList) {
      const newState = ammount.map(item => (item.id === id ? newItem : item));

      setAmmount([...newState]);
    } else {
      setAmmount([...ammount, newItem]);
    }
  };

  /**
   *
   * Preparando url para o foreach
   */

  const prepareUrl = (item: Ammount) =>
    `https://www.santjordi.com.br/carrinho/produto/${item.id}/adicionar/${item.value}`;

  /**
   * Função para adicionar cada item ao carrinho.
   * Primeiro ela remove o item se estiver no carrinho e depois adiciona a quantidade escolhida
   */

  const handleAddProductOnCart = useCallback(async (item: Ammount) => {
    await axios.get(
      `https://www.santjordi.com.br/carrinho/produto/${item.id}/remover`
    );

    const response = await axios.get(prepareUrl(item));

    return response;
  }, []);

  // const handleSubmit: SubmitHandler<FormData> = (data) => {

  const handleSubmit: SubmitHandler<FormData> = useCallback(async () => {
    try {
      setLoading(true);

      const responseAll = async () => {
        return Promise.all(
          ammount.map(async item => {
            if (Number(item.value) > 0) {
              const response = await handleAddProductOnCart(item);
              return response;
            }

            return {};
          })
        );
      };

      await responseAll().then(() => {
        window.location.href = 'https://www.santjordi.com.br/carrinho/index';
      });

      setLoading(false);
    } catch (err) {
      console.log(err.message);

      setError('Algo de errado. Cheque o seu carrinho e tente novamente.');

      setLoading(false);
    }
  }, [ammount, handleAddProductOnCart]);

  // https://www.santjordi.com.br/carrinho/produto/69110436/adicionar
  // https://www.santjordi.com.br/carrinho/produto/69110544/adicionar

  return (
    <Container className="gridOptionsB9__container">
      {optionsProduct && (
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className="gridOptionsB9__form"
        >
          {optionsProduct.map(option => (
            <div key={option.productId} className="gridOptionsB9__wrap">
              {option.added ? (
                <span className="gridOptionsB9__added">Adicionado</span>
              ) : (
                <Input
                  label={option.text}
                  name={option.productId}
                  onChange={handleInputChange}
                  type="number"
                  disabled={loading}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="gridOptionsB9__button botao principal"
          >
            {loading ? 'Carregando...' : 'Adicionar ao carrinho'}
          </button>
        </Form>
      )}

      {error && <span className="gridOptionsB9__error">{error}</span>}
    </Container>
  );
};

export default Grid;
