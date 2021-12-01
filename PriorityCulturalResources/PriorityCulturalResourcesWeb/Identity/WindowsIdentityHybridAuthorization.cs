using System.Threading.Tasks;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using PriorityCulturalResourcesWeb.Models;

namespace PriorityCulturalResourcesWeb.Identity
{
    public class AuthorizeRolesAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private const string UNAUTHORIZED_LOCATION = "~/Security/UnauthorizedUser";

        // Custom property
        public string AccessLevel { get; set; }

        // Because this function is required from the IAuthorizationFilter interface cannot make async
        // and can't use await operator for async functions so use .Result to cause synchronous execution
        public void OnAuthorization(AuthorizationFilterContext filterContext)
        {
            if (!AuthorizeCore(filterContext.HttpContext).Result)
            {
                HandleUnauthorizedRequest(filterContext);
            }
        }

        private async Task<bool> AuthorizeCore(HttpContext httpContext)
        {
            var userManager = httpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();

            string userName = httpContext.User.Identity.Name.Split('\\')[1];

            bool isAuthorized = false;

            var user = await userManager.FindByNameAsync(userName).ConfigureAwait(false);

            if (user != null)
            {
                // get the roles from the custom access level property set from the AuthorizeRolesAttribute attribute
                string[] rolesFromAccessLevel = AccessLevel.Split(",");

                // Want to check if the user is in ANY of the roles. Zero (0) indicates
                // no roles matches (unauthenticated). For each role found, increment by one.
                int roleSum = 0;
                foreach (string role in rolesFromAccessLevel)
                {
                    if (await userManager.IsInRoleAsync(user, role).ConfigureAwait(false))
                    {
                        roleSum++;
                    }
                }

                if (roleSum > 0)
                {
                    isAuthorized = true;
                }
            }

            return isAuthorized;
        }

        private static void HandleUnauthorizedRequest(AuthorizationFilterContext filterContext)
        {
            filterContext.Result = new UnauthorizedResult();
            filterContext.Result = new RedirectResult(UNAUTHORIZED_LOCATION);
        }
    }

    /// <summary>
    /// This class is a custom filter which will check if the incoming request is from the localhost.
    /// If it isn't the response will be an UnauthorizedResult. This is best used when WebAPI REST endpoints
    /// are exposed publicly and Anonymous Authentication is enable on the web server the app is hosted on.
    /// </summary>
    public class RestrictToLocalhostAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!IsLocalRequest(context.HttpContext))
            {
                context.Result = new UnauthorizedResult();

                return;
            }

            base.OnActionExecuting(context);
        }

        private static bool IsLocalRequest(HttpContext context)
        {
            if (context.Connection.RemoteIpAddress.Equals(context.Connection.LocalIpAddress))
            {
                return true;
            }

            if (IPAddress.IsLoopback(context.Connection.RemoteIpAddress))
            {
                return true;
            }

            return false;
        }
    }
}
