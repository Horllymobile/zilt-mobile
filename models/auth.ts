export interface ForgotPasswordDto {
  phone?: string;
  email?: string;
  redirect: string;
}

export interface LoginDto {
  phone?: string;
  email?: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  phone?: string;
  password: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}
