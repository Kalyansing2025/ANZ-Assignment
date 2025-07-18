using Abp.EntityFrameworkCore;
using MyTraining1101Demo.EntityFrameworkCore;
using MyTraining1101Demo.EntityFrameworkCore.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyTraining1101Demo.Authorization.Users
{
    public class UserRepository : MyTraining1101DemoRepositoryBase<User, long>, IUserRepository
    {
        public UserRepository(IDbContextProvider<MyTraining1101DemoDbContext> dbContextProvider)
            : base(dbContextProvider)
        {
        }

        public List<long> GetPasswordExpiredUserIds(DateTime passwordExpireDate)
        {
            var context = GetContext();

            var users = GetAll().ToList();
            var recentPasswords = context.RecentPasswords.ToList().Cast<RecentPassword>().ToList(); // Explicit cast

            return (
                from user in users
                let lastRecentPasswordOfUser = recentPasswords
                    .Where(rp => rp.UserId == user.Id && rp.TenantId == user.TenantId)
                    .OrderByDescending(rp => rp.CreationTime)
                    .FirstOrDefault()
                where user.IsActive && !user.ShouldChangePasswordOnNextLogin &&
                      (
                          (lastRecentPasswordOfUser != null &&
                           lastRecentPasswordOfUser.CreationTime <= passwordExpireDate) ||
                          (lastRecentPasswordOfUser == null && user.CreationTime <= passwordExpireDate)
                      )
                select user.Id
            ).Distinct().ToList();
        }





        public void UpdateUsersToChangePasswordOnNextLogin(List<long> userIdsToUpdate)
        {
            var context = GetContext();

            var usersToUpdate = GetAll()
                .Where(user =>
                    user.IsActive &&
                    !user.ShouldChangePasswordOnNextLogin &&
                    userIdsToUpdate.Contains(user.Id)
                ).ToList();

            foreach (var user in usersToUpdate)
            {
                user.ShouldChangePasswordOnNextLogin = true;
            }

            context.SaveChanges();
        }

    }
}
