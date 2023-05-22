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

        public DbSet<UserEntity> Users { get; set; } = null!;
        
        public DbSet<PostEntity> Posts { get; set; } = null!;

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

            modelBuilder.Entity<PostEntity>()
                .HasMany(p => p.Follows)
                .WithMany(u => u.Posts)
                .UsingEntity(j => j.ToTable("UserPosts"));

            for (var i = 0; i < 100; i++)
            {
                var user = new UserEntity
                {
                    PrivateId = Guid.NewGuid(),
                    PublicId = Guid.NewGuid(),
                    FirstName = Faker.Name.First(),
                    LastName = Faker.Name.Last(),
                    Bio = Faker.Lorem.Paragraph(),
                    Email = Faker.Internet.Email(),
                    Password = "qwerty".Hash(),
                    CreatedOnDt = DateTime.Now
                };

                modelBuilder.Entity<UserEntity>().HasData(user);
            }
        }
    }
}