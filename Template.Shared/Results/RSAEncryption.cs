using System.Security.Cryptography;
using System.Text;
using System.Xml.Serialization;

namespace Publify.Shared
{
    public class RSAEncryption
    {
        private static RSACryptoServiceProvider csp = new RSACryptoServiceProvider(4096); //4096
        
        private RSAParameters _PrivateKey;
        
        private RSAParameters _PublicKey;
        
        public RSAEncryption()
        {
            _PrivateKey = csp.ExportParameters(true);
            
            _PublicKey = csp.ExportParameters(false);
        }

        public string GetPublicKey()
        {
            var sw = new StringWriter();

            var xs = new XmlSerializer(typeof(RSAParameters));

            xs.Serialize(sw, _PublicKey);

            return sw.ToString();
        }

        public string GetPrivateKey()
        {
            var sw = new StringWriter();

            var xs = new XmlSerializer(typeof(RSAParameters));

            xs.Serialize(sw, _PrivateKey);

            return sw.ToString();
        }

        public string Encrypt(string plainText)
        {
            var publicKey = GetPublicKey();

            csp = new RSACryptoServiceProvider();

            csp.ImportParameters(_PublicKey);

            var data = Encoding.Unicode.GetBytes(plainText);

            var encryptedText = csp.Encrypt(data, false);

            return Convert.ToBase64String(encryptedText);
        }

        public string Decrypt(string encryptedText)
        {
            var data = Convert.FromBase64String(encryptedText);

            csp.ImportParameters(_PrivateKey);

            var decryptedText = csp.Decrypt(data, false);

            return Encoding.Unicode.GetString(decryptedText);
        }

    }
}
