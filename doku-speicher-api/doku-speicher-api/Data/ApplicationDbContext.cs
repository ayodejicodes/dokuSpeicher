using doku_speicher_api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace doku_speicher_api.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<DocumentShareLink> DocumentShareLinks { get; set; }
        public DbSet<DownloadHistory> DownloadHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Fluent API configurations 

        
            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(u => u.LastName).IsRequired().HasMaxLength(100);
                entity.Property(u => u.DateCreated).IsRequired();
                entity.Property(u => u.ProfileLastEditedTime).IsRequired();
                entity.Property(u => u.LastLogin).IsRequired(false); 
            });

            // Document Fluent API Configuration
            modelBuilder.Entity<Document>(entity =>
            {
                entity.HasKey(d => d.DocumentId);
                entity.Property(d => d.UserId).IsRequired();
                entity.Property(d => d.Name).IsRequired().HasMaxLength(255);
                entity.Property(d => d.Type).IsRequired().HasMaxLength(50);
                entity.Property(d => d.UploadDateTime).IsRequired();
                entity.Property(d => d.LastEditedTime).IsRequired();
                entity.Property(d => d.FilePath).IsRequired().HasMaxLength(255);
                entity.Property(d => d.PreviewImagePath).HasMaxLength(255);
                entity.Property(d => d.DownloadCount).IsRequired();

                entity.HasOne(d => d.User)
                      .WithMany(u => u.Documents)
                      .HasForeignKey(d => d.UserId);
            });

            // DocumentShareLink Fluent API Configuration
            modelBuilder.Entity<DocumentShareLink>(entity =>
            {
                entity.HasKey(dsl => dsl.ShareLinkId);
                entity.Property(dsl => dsl.GeneratedLink).IsRequired().HasMaxLength(255);
                entity.Property(dsl => dsl.ExpiryDateTime).IsRequired();
                entity.Property(dsl => dsl.IsActive).IsRequired();

                entity.HasOne(dsl => dsl.Document)
                      .WithMany(d => d.ShareLinks)
                      .HasForeignKey(dsl => dsl.DocumentId);
            });

            // DownloadHistory Fluent API Configuration
            modelBuilder.Entity<DownloadHistory>(entity =>
            {
                entity.HasKey(dh => dh.DownloadId);
                entity.Property(dh => dh.UserId).IsRequired(false); 
                entity.Property(dh => dh.DownloadDateTime).IsRequired();

                entity.HasOne(dh => dh.Document)
                      .WithMany(d => d.DownloadHistories)
                      .HasForeignKey(dh => dh.DocumentId);

                entity.HasOne(dh => dh.User)
                      .WithMany(u => u.DownloadHistories)
                      .HasForeignKey(dh => dh.UserId)
                      .IsRequired(false);
            });


            // DocumentShareLink Fluent API Configuration
            modelBuilder.Entity<DocumentShareLink>(entity =>
            {
                entity.HasKey(dsl => dsl.ShareLinkId);
                entity.Property(dsl => dsl.GeneratedLink).IsRequired().HasMaxLength(255);
                entity.Property(dsl => dsl.ExpiryDateTime).IsRequired();
                entity.Property(dsl => dsl.IsActive).IsRequired();

              
                entity.HasIndex(dsl => dsl.GeneratedLink).IsUnique();

             
                entity.HasOne(dsl => dsl.Document)
                      .WithMany(d => d.ShareLinks)
                      .HasForeignKey(dsl => dsl.DocumentId)
                      .OnDelete(DeleteBehavior.Cascade); 

               
            });

        }


    }
}
