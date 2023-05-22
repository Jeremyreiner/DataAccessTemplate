using System.ComponentModel;
using Publify.Shared.Enums;

namespace Publify.Shared.Extensions
{
    public static class EnumExtensions
    {
        public static string GetDescription(this Enum value)
        {
            var field = value.GetType().GetField(value.ToString());

            var attributes = (DescriptionAttribute[])field!.GetCustomAttributes(typeof(DescriptionAttribute), false);

            return attributes.Length > 0 ? attributes[0].Description : value.ToString();
        }

        /// <summary>
        /// Attempts to turn a string back into its enum value using the private mapping functions
        /// </summary>
        /// <param name="description">string</param>
        /// <returns>Enum</returns>
        public static Enum? GetValue(this string description)
        {
            if (SubjectsMap.TryGetValue(description, out var subjects))
                return subjects;

            return null;
        }

        private static readonly Dictionary<string, Subjects> SubjectsMap =
            Subjects.GetValues(typeof(Subjects))
                .Cast<Subjects>()
                .ToDictionary(e => e.GetDescription(), e => e);
    }
}
