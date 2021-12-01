using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PriorityCulturalResourcesService;
using PriorityCulturalResourcesService.EntityModels;
using PriorityCulturalResourcesWeb.Identity;
using static PriorityCulturalResourcesWeb.Identity.HttpAuthRoleGroupConstants;

namespace PriorityCulturalResourcesWeb
{

    [Route("api/Resource")]
    [ApiController]
    public class ResourceApiController : ControllerBase
    {


        private readonly ResourceService ResourceService = new ResourceService();

        public ResourceApiController()
        {
            LogHelper.Debug("Instantiating ResourceAPIController");
        }

        [HttpGet]
        [Route("GetResources")]
        public string GetResources()
        {
            LogHelper.Debug("Requesting Resource Row Data from Service.");
            List<ResourceRow> rows = ResourceService.GetResources();

            var rval = JsonConvert.SerializeObject(rows);

            return rval;  
   
        }

        //[AuthorizeRoles(AccessLevel = HTTP_ROLE_GROUP_ALL)]
        //public List<ResourceRow> GetResources()
        //{
        //    LogHelper.Debug("Requesting Resource Row Data from Service.");

        //    return ResourceService.GetResources();
        //}

        [HttpPost]
        [Route("UpdateResource")]
        [AuthorizeRoles(AccessLevel = HTTP_ROLE_GROUP_ALL)]
        public IActionResult UpdateResource([FromBody] ResourceRow resourceRow)
        {
            JObject jObj = new JObject(new JProperty("rval", "return value"));
            LogHelper.Debug("Updating Resource Row Data from Grid.");
            //ResourceRow.ModifiedBy = User.Identity.Name;
            //ResourceService.UpdateResource(ResourceRow);

            return new JsonResult(jObj, null);
        }
        [HttpPost]
        [Route("CreateResource")]
        [AuthorizeRoles(AccessLevel = HTTP_ROLE_GROUP_ALL)]
        public void CreateResource(ResourceRow resourceRow)
        {
            LogHelper.Debug("Creating Resource Row Data from Grid.");
            //ResourceRow.ModifiedBy = User.Identity.Name;
            //ResourceService.CreateResource(ResourceRow);
        }

        [HttpGet]
        [Route("DeactivateResource")]
        [AuthorizeRoles(AccessLevel = HTTP_ROLE_GROUP_ALL)]
        public void DeactivateResource(int resourceId)
        {
            LogHelper.Debug("Deactivating Resource Row Data from Grid (Setting to inactive).");

            //ResourceService.SetResourceActiveStatus(ResourceID, User.Identity.Name, false);
        }

        [HttpGet]
        [Route("GetResourceTypes")]
        public List<ResourceType> GetResourceTypes()
        {
            LogHelper.Debug("Requesting Resource Row Data from Service.");
            return ResourceService.GetResourceTypes();

        }

        [HttpGet]
        [Route("GetResourceClasses")]
        public List<ResourceClass> GetResourceClasses()
        {
            LogHelper.Debug("Requesting Resource Row Data from Service.");
            return ResourceService.GetResourceClasses();

        }

        [HttpGet]
        [Route("GetDesignationStatuses")]
        public List<DesignationStatus> GetDesignationStatuses()
        {
            LogHelper.Debug("Requesting Resource Row Data from Service.");
            return ResourceService.GetDesignationStatuses();

        }


        [HttpGet]
        [Route("GetParentDistricts")]
        public List<ParentDistrict> GetParentDistricts()
        {
            LogHelper.Debug("Requesting Resource Row Data from Service.");
            return ResourceService.GetParentDistricts();

        }

        [HttpGet]
        [Route("GetParentParentSensitivityZone")]
        public List<ParentSensitivityZone> GetParentParentSensitivityZone()
        {
            LogHelper.Debug("Requesting Resource Row Data from Service.");
            return ResourceService.GetParentParentSensitivityZone();

        }

    }
}