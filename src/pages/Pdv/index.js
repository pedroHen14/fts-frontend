import React, { useState } from "react";

import {
  ButtonRegister,
  Container,
  ContainerImage,
  ContainerInput,
  ContainerScreen,
  ContainerForm,
  FormRegister,
  ContainerSubTotalDiscount,
  Content,
  Header,
  IconUser,
  ImageLogo,
  Screen,
  ContainerFormModal,
  FormRegisterModal,
} from "./styles";
import imageLogo from "../../assets/FTS.png";
import shoppingCart from "../../assets/shopping-cart.png";
import Modal from "../../components/Modal";
import { FormControl, Input, InputLabel } from "@material-ui/core";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import formatCpf from "@brazilian-utils/format-cpf";
import { useEffect } from "react";

function Pdv() {
  const [code, setCode] = useState("");
  const [openModalDiscount, setOpenModalDiscount] = useState(false);
  const [openModalAddUser, setOpenModalAddUser] = useState(false);
  const [register, setRegister] = useState({
    costumer_name: "",
    cpf: "",
  });

  const [productList, setProductList] = useState([]);

  const handleProducts = async (e) => {
    e.preventDefault();

    try {
      const response = await api.get(`/product/barCode/${code}`);

      if (productList.find((p) => p.bar_code == code)) {
        setProductList(
          productList.map((p) => {
            if (p.bar_code == code) {
              p.total += 1;
              p.cost_total = p.cost_per_item * p.total;
            }
            return p;
          })
        );
      } else {
        const product = response.data;

        product.total = 1;
        product.cost_total = product.cost_per_item;

        setProductList([...productList, product]);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleInput = (e) => {
    e.preventDefault();

    setCode(e.target.value);
  };

  const notify = () => {
    toast.success("Usuário cadastrado com sucesso!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  document.addEventListener("keydown", (e) => {
    const key = e.key;

    switch (key) {
      case "d":
        setOpenModalDiscount(true);
        break;
      case "Escape":
        setOpenModalDiscount(false);
        break;
      case "c":
        setOpenModalAddUser(true);
        break;
      default:
        break;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/costumer", {
        costumer_name: register.costumer_name,
        cpf: register.cpf,
      });

      notify();
    } catch (error) {
      alert(error);
    }
  };

  const handleInputRegister = (e) => {
    setRegister({ ...register, [e.target.id]: e.target.value });
  };

  const arrayTotal = [];

  return (
    <>
      <Container>
        {openModalDiscount && (
          <Modal
            title="Desconto"
            handleClose={() => setOpenModalDiscount(false)}
          />
        )}
        {openModalAddUser && (
          <Modal
            title="Adicionar Cliente"
            handleClose={() => setOpenModalAddUser(false)}
          >
            <ContainerFormModal>
              <FormRegisterModal onSubmit={handleSubmit}>
                <FormControl>
                  <InputLabel htmlFor="costumer_name">
                    Nome do cliente
                  </InputLabel>
                  <Input
                    id="costumer_name"
                    label="Nome"
                    type="text"
                    variant="outlined"
                    value={register.costumer_name}
                    onChange={handleInputRegister}
                    required
                  />
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="cpf">CPF</InputLabel>
                  <Input
                    id="cpf"
                    variant="outlined"
                    label="CPF"
                    type="text"
                    value={formatCpf(register.cpf)}
                    onChange={handleInputRegister}
                    required
                    inputProps={{ maxLength: "14" }}
                  />
                </FormControl>
                <ButtonRegister
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: "var(--dark)",
                    color: "var(--white)",
                  }}
                >
                  Cadastrar
                </ButtonRegister>
              </FormRegisterModal>
            </ContainerFormModal>
          </Modal>
        )}
        <Header>
          <ImageLogo src={imageLogo} />
          <h1>Caixa aberto</h1>
          <IconUser>
            <FaUserPlus />
          </IconUser>
        </Header>
        <Content>
          <div className="container">
            <ContainerInput onSubmit={handleProducts}>
              <FormControl>
                <InputLabel htmlFor="code">Código do produto</InputLabel>
                <Input
                  id="code"
                  label="Código do produto"
                  type="text"
                  variant="outlined"
                  value={code}
                  onChange={handleInput}
                  required
                />
              </FormControl>
              <div className="unit-value">
                <h2>Valor unitário</h2>
                <p>R$ 0,00</p>
              </div>
              <div className="total-value">
                <h2>Total do item</h2>
                <p>R$ 0,00</p>
              </div>
            </ContainerInput>

            <ContainerImage>
              <img src={shoppingCart} />
            </ContainerImage>
          </div>
          <div className="container">
            <ContainerScreen>
              <Screen>
                <header className="header">
                  <h2>Lista de produtos</h2>
                </header>
                <table>
                  <tr>
                    <td>
                      <h4>N° item</h4>
                    </td>
                    <td>
                      <h4>Código</h4>
                    </td>
                    <td>
                      <h4>Descrição</h4>
                    </td>
                    <td>
                      <h4>Qtd</h4>
                    </td>
                    <td>
                      <h4>Vlr. unit.</h4>
                    </td>
                    <td>
                      <h4>Total</h4>
                    </td>
                  </tr>
                  {productList &&
                    productList.map((p, index) => {
                      arrayTotal.push(parseInt(p.cost_total));

                      return (
                        <tr key={index}>
                          <td>{p.id}</td>
                          <td>{p.bar_code}</td>
                          <td>{p.product_name}</td>
                          <td>{p.total ? p.total : 1}</td>
                          <td>
                            R${" "}
                            {parseInt(p.cost_per_item)
                              .toFixed(2)
                              .replace(".", ",")}
                          </td>
                          <td>
                            R${" "}
                            {p.cost_total
                              ? parseInt(p.cost_total)
                                  .toFixed(2)
                                  .replace(".", ",")
                              : 0.0}
                          </td>
                        </tr>
                      );
                    })}
                </table>
              </Screen>
              <ContainerSubTotalDiscount>
                <div className="sub-total-discount">
                  <header className="header">
                    <h2>SubTotal</h2>
                  </header>
                  <h3>
                    R${" "}
                    {arrayTotal.length === 0
                      ? "0,00"
                      : parseInt(
                          arrayTotal.reduce(
                            (total, currentElement) => total + currentElement
                          )
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                  </h3>
                </div>
                <div className="sub-total-discount">
                  <header className="header">
                    <h2>Desconto</h2>
                  </header>
                  <h3>10%</h3>
                </div>
              </ContainerSubTotalDiscount>
            </ContainerScreen>
          </div>
        </Content>
      </Container>
    </>
  );
}

export default Pdv;