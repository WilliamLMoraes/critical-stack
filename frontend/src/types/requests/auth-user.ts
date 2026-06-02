export default interface AuthUserRequest {
    [key: string]: unknown;
    email: string;
    password: string;
}