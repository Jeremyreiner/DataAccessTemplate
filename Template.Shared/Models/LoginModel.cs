namespace Template.Shared.Models
{
    public class LoginModel
    {
        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }

    public class ChangePasswordModel : LoginModel
    {
        public string ConfirmedPassword { get; set; } = string.Empty;

        public string NewPassword { get; set; } = string.Empty;
    }
}