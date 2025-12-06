from pydantic import BaseModel, EmailStr


class ForgotPasswordIn(BaseModel):
    email: EmailStr


class VerifyCodeIn(BaseModel):
    email: EmailStr
    code: str


class ResetPasswordIn(BaseModel):
    reset_token: str
    new_password: str
