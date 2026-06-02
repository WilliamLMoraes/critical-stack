import { useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";

import {
  useApi,
  useForm,
  Container,
  CardContainer,
  Form,
  Button,
  EMAIL_REGEX,
  NOTIFICATIONS,
  ROUTES,
  LogoComponent,
} from "../../../index";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

import Styles from "./style.module.css";
import {
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "../../../config";

interface RegisterFormData {
  [key: string]: unknown;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const { registerUser } = useApi();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { send, setValue } = useForm<RegisterFormData>({
    validations: {
      username: (name: string) =>
        name && name.length >= MIN_USERNAME_LENGTH
          ? ""
          : `O nome de usuário deve ter pelo menos ${MIN_USERNAME_LENGTH} caracteres`,
      email: (email: string) =>
        email && EMAIL_REGEX.test(email) ? "" : "Formato de e-mail inválido",
      password: (password: string) =>
        password && password.length >= MIN_PASSWORD_LENGTH
          ? ""
          : `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`,
      confirmPassword: (_confirmPassword: string, formData?: RegisterFormData) =>
        _confirmPassword && _confirmPassword === (formData?.password ?? "")
          ? ""
          : "As senhas não conferem",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmVisibility = () => {
    setShowConfirm(!showConfirm);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("password", e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { data: formData, errors: formErrors } = send();

    if (Object.keys(formErrors).length > 0 || !formData) {
        const firstError = Object.values(formErrors).find((msg) => msg);
        toast.error(firstError || NOTIFICATIONS.VALIDATION_FORM_ERRORS);
        return;
    }

    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast.success(NOTIFICATIONS.USER_CREATED);
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error("Erro ao criar usuário");
    }
  };

  const selectedTheme = localStorage.getItem("theme");
  if (selectedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.setAttribute("data-theme", "light");
  }

  return (
    <main>
      <Container>
        <div className={Styles.logoWrapper}>
          <div className={Styles.registerContainer}>
            <CardContainer type={"default"}>
              <div className={Styles.formContainer}>
                <h1>Cadastro</h1>
                <Form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    id="username"
                    placeholder="Nome de usuário"
                    onChange={(e) => setValue("username", e.target.value)}
                  />
                  <input
                    type="email"
                    id="email"
                    placeholder="E-mail"
                    onChange={(e) => setValue("email", e.target.value)}
                  />
                  <div className={Styles.passwordContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Senha"
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className={Styles.passwordToggle}
                    >
                      {showPassword ? (
                        <FaRegEye size={18} />
                      ) : (
                        <FaRegEyeSlash size={18} />
                      )}
                    </button>
                  </div>
                  <div className={Styles.passwordContainer}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirme sua senha"
                      onChange={(e) =>
                        setValue("confirmPassword", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmVisibility}
                      className={Styles.passwordToggle}
                    >
                      {showConfirm ? (
                        <FaRegEye size={18} />
                      ) : (
                        <FaRegEyeSlash size={18} />
                      )}
                    </button>
                  </div>
                  <Button variant="primary" type="submit">Cadastrar</Button>
                </Form>
                <p>
                  Ja possui conta? <Link to={ROUTES.LOGIN}>Faça o login</Link>
                </p>
              </div>
              <div className={Styles.background}>
                  <div className={Styles.logoContainer}>
                      <LogoComponent />
                  </div>
              </div>
            </CardContainer>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default RegisterPage;
