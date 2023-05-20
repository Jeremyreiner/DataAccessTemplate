using Publify.Shared.Exceptions;
using Template.Shared.Exceptions;

namespace Template.Shared.Extensions
{
    public static class ExceptionExtensions
    {
        public static NotFoundException NotFound(this Records.Records.PublicId publicId) =>
            new($"UnRegistered ID- {publicId}");

        public static DuplicateException DuplicatedEntry(this Records.Records.PublicId publicId) =>
            new($"Duplicated ID - {publicId}");

        public static NotImplementedException NotImplemented(this Records.Records.PublicId publicId) =>
            new($"UnRegistered Implementation For ID - {publicId}");

        public static GuidException ConversionError(this Records.Records.GuidId guidId) =>
            new($"Cannot convert string to guid - {guidId}");
    }
}
