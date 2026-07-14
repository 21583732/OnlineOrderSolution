using System.Text.RegularExpressions;

namespace ClientPortal.Api.Helpers
{
    public static class ValidationHelper
    {
        // Accepts Gmail, Outlook, Yahoo, iCloud, Proton,
        // company domains, university domains, etc.
        public static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            email = email.Trim();

            return Regex.IsMatch(
                email,
                @"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$",
                RegexOptions.IgnoreCase);
        }

        public static bool IsStrongPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return false;

            return Regex.IsMatch(
                password,
                @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$");
        }
    }
}