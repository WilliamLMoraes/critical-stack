import { useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import {
    useApi,
    useForm,
    Button,
    CardContainer,
    Container,
    Form,
    LogoComponent,
    useAuth,
    EMAIL_REGEX,
    NOTIFICATIONS,
    ROUTES,
} from "../../../index";
import Styles from "./style.module.css";
import type { AuthUserRequest } from "../../../index";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { mensagemPadrao, PASSWORD_MIN_LENGTH } from "../../../config";

const LoginPage = () => {


    const { authenticateUser } = useApi();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { send, setValue } = useForm<AuthUserRequest>({
        validations: {
            email: (email: string) => (email && EMAIL_REGEX.test(email) ? "" : mensagemPadrao),
            password: (password: string) => (password && password.length >= PASSWORD_MIN_LENGTH ? "" : mensagemPadrao),
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const { data: formData, errors: formErrors } = send();

        if (Object.keys(formErrors).length > 0  || !formData) {
            const firstError = Object.values(formErrors).find((msg) => msg);
            toast.error(firstError || NOTIFICATIONS.VALIDATION_FORM_ERRORS );
            return;
        }

        try {
            const returnData = await authenticateUser(formData);
            login(returnData.token, returnData.expiresIn);
            toast.success("Login realizado com sucesso!");
            navigate(ROUTES.HOME);
        } catch {
            toast.error(NOTIFICATIONS.LOGIN_ERROR);
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
                <div className={Styles.loginContainer}>
                    <CardContainer style={{ background: "rgba(0, 0, 0, 0.05)" }} type={"default"}>
                        <div className={Styles.background}>
                            <div className={Styles.logoContainer}>
                                <LogoComponent />
                            </div>
                        </div>
                        <div className={Styles.formContainer}>
                            <h2>Login</h2>
                            <Form onSubmit={handleSubmit}>
                                <input type="email" placeholder="Email" onChange={(e) => setValue("email", e.target.value)} />
                                <div className={Styles.passwordContainer}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Senha"
                                        onChange={(e) => setValue("password", e.target.value)}
                                    />
                                    <button type="button" onClick={togglePasswordVisibility} className={Styles.passwordToggle}>
                                        {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                                    </button>
                                </div>
                                <Button variant="primary" type="submit">Entrar</Button>
                            </Form>
                            <p>
                                Não tem cadastro? <Link to={ROUTES.REGISTER}>Cadastre-se</Link>
                            </p>
                        </div>
                    </CardContainer>
                </div>
            </Container>
        </main>
    );
};

export default LoginPage;
