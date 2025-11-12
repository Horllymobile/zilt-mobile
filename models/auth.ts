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

export interface VerifyOtpDto {
  email: string;
  token: string;
}

export interface ResetPasswordDto {
  password: string;
}

export interface LoginOtpDto {
  // phone?: string;
  email?: string;
  // redirect: string;
}
