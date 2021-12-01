using System.DirectoryServices.AccountManagement;
using System.Runtime.Versioning;

namespace PriorityCulturalResourcesService
{
    public static class SecurityService
    {
        [SupportedOSPlatform("windows")]
        public static ADUser SearchActiveDirectory(string userName)
        {
            using var context = new PrincipalContext(ContextType.Domain, "central");
            PrincipalSearcher searcher = new(new UserPrincipal(context))
            {
                QueryFilter = new UserPrincipal(context)
                {
                    SamAccountName = userName
                }
            };

            var result = searcher.FindOne();

            if (result != null)
            {
                return new ADUser()
                {
                    UserName = result.SamAccountName,
                    DisplayName = result.DisplayName
                };
            }
            else
            {
                return null;
            }
        }
    }
}
