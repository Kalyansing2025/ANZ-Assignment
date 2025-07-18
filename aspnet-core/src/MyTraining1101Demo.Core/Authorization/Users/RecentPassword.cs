using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp;
using System.ComponentModel.DataAnnotations;

namespace MyTraining1101Demo.Authorization.Users
{
    public class RecentPassword : CreationAuditedEntity<Guid>, IMayHaveTenant
    {
        public virtual int? TenantId { get; set; }

        [Required]
        public virtual long UserId { get; set; }

        [Required]
        public virtual string Password { get; set; }

        public RecentPassword()
        {
            Id = SequentialGuidGenerator.Instance.Create();
        }

    }
}
