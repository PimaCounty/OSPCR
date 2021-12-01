using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityCulturalResourcesService.EntityModels
{
    [Table("Config_DesignationStatus")]
    public partial class DesignationStatus : ReferenceType
    {
        [Key]
        [Column("DesignationStatusId")]
        public int Id { get; set; }

        [StringLength(50)]
        [Column("DesignationStatusName")]
        public string Name { get; set; }

        [StringLength(500)]
        public string DesignationStatusDescription { get; set; }
    }
}
