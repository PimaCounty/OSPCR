using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityCulturalResourcesService.EntityModels
{
    [Table("Config_ResourceClass")]
    public partial class ResourceClass : ReferenceType
    {
        [Key]
        [Column("ResourceClassId")]
        public int Id { get; set; }

        [StringLength(50)]
        [Column("ResourceClassName")]
        public string Name { get; set; }

    }
}
