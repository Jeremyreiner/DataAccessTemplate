using Microsoft.EntityFrameworkCore;
using Publify.Shared.Services;
using Template.Shared.Entities;

namespace Template.Database.Infrastructure.MySql
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            //TODO: Change from Dev
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        public DbSet<UserEntity> Teachers { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the many-to-many relationship between User and UserFollow
            modelBuilder.Entity<UserEntity>()
                .HasMany(u => u.Followers)
                .WithMany(u => u.Following)
                .UsingEntity(j => j.ToTable("UserFollows"));

            modelBuilder.Entity<UserEntity>()
                .HasMany(u => u.Following)
                .WithMany(u => u.Followers)
                .UsingEntity(j => j.ToTable("UserFollows"));

            for (var i = 0; i < 10; i++)
            {
                var teacher = new UserEntity
                {
                    PrivateId = Guid.NewGuid(),
                    PublicId = Guid.NewGuid(),
                    FirstName = $"{Faker.Name.First()}",
                    LastName = $"{Faker.Name.Last()}",
                    Email = $"t{i}@gmail.com",
                    Password = "qwerty".Hash()
                };

                modelBuilder.Entity<UserEntity>().HasData(teacher);
            }
        }
    }
}