export { ROUTES } from "./routes";

export {
  TOKEN_KEY,
  EXPIRES_AT_KEY,
  API_BASE_URL,
  PASSWORD_MIN_LENGTH,
  mensagemPadrao,
  MIN_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "./constants";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NOTIFICATIONS = {
  VALIDATION_FORM_ERRORS: "Por favor, preencha todos os campos corretamente",
  USER_CREATED: "Usuário criado com sucesso",
  LOGIN_ERROR: "E-mail ou senha incorretos",
  GRID_SAVED: "Grade salva com sucesso",
  GRID_ERROR: "Erro ao salvar grade",
  GRID_CREATED: "Grade criada com sucesso",
  GRID_DELETED: "Grade excluída com sucesso",
  GRID_DELETE_ERROR: "Erro ao excluir grade",
} as const;


