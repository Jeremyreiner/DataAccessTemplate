namespace Template.Shared.Records
{
    public class Records
    {
        public record PublicId(Guid publicId);

        public record GuidId(string guid);
    }
}
