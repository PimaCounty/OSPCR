using Microsoft.AspNetCore.Mvc;
using static PriorityCulturalResourcesWeb.Identity.HttpAuthRoleGroupConstants;
using PriorityCulturalResourcesWeb.Identity;

namespace PriorityCulturalResourcesWeb.Controllers
{
    public class HomeController : Controller
    {
        [AuthorizeRoles(AccessLevel = HTTP_ROLE_GROUP_ALL)]
        public IActionResult Index()
        {
            return View();
        }
    }
}
