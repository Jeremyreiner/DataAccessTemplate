﻿using Microsoft.EntityFrameworkCore;
using Publify.Shared.Entities;
using Publify.Shared.Services;

namespace Publify.Database.Infrastructure.MySql
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            //TODO: Change from Dev
            //Database.EnsureDeleted();
            //Database.EnsureCreated();
        }

        public DbSet<TeacherEntity> Teachers { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            for (var i = 0; i < 10; i++)
            {
                var teacher = new TeacherEntity
                {
                    PrivateId = Guid.NewGuid(),
                    PublicId = Guid.NewGuid(),
                    FirstName = $"{Faker.Name.First()}",
                    LastName = $"{Faker.Name.Last()}",
                    Email = $"t{i}@gmail.com",
                    Password = "qwerty".Hash()
                };

                modelBuilder.Entity<TeacherEntity>().HasData(teacher);
            }
        }
    }
}