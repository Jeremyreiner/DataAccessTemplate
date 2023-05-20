using System.Net;
using Publify.Shared.Exceptions;

namespace Publify.Shared.Results
{
    public class Error
    {
        private readonly Random _Random = new();

        private string GetQuote() => "\n" + _Chicken[_Random.Next(_Chicken.Count)] + ".\n";

        private string _Message;

        public NotFoundException NotFound { get; set; }

        public DuplicateException Duplicated { get; set; }

        public NotImplementedException NotImplemented { get; set; }

        public HttpStatusCode Code { get; set; }

        public static readonly Error None = new();

        public Error() => (_Message, Code) = (GetQuote(), HttpStatusCode.OK);

        public Error(string message)
        {
            _Message = message;
            Code = HttpStatusCode.OK;
        }

        public Error(NotFoundException notFound) : this()
        {
            NotFound = notFound;
            Code = HttpStatusCode.NotFound;
        }

        public Error(DuplicateException duplicated) : this()
        {
            Duplicated = duplicated;
            Code = HttpStatusCode.Ambiguous;
        }

        public Error(NotImplementedException notImplemented) : this()
        {
            NotImplemented = notImplemented;
            Code = HttpStatusCode.NotImplemented;
        }

        private readonly List<string> _Chicken = new()
        {
            "Get your mufffuckin head out your muhhfuckin ass...",
            "You dumb ass muhh fuckka",
            "Yoo granmda can do better than that",
            "Whalluhe ahhkbar",
            "Better to come in the sink, than to sink in the come",
            "My luck is so bad, it could be raining titties, and id still catch dicks",
            "Khef challak",
            "Ring, Ring, the dusty trail is a calling",
            "Great day to sight in a rifle",
            "Your so stupid, I dont know if you'd know to pour the piss out of your left boot",
            "chamdullala chabibitik",
            "When in rome",
            "Is your rifridgerator calling? You better go catch it!!",
            "Stick a candy cane in my ass and call me santa, It must be christmas!!",
            "Well, butter my buns and call me a bisket!",
            "Imagine the situation. Its 4:58, the office is quite, close to the end of the day.\nAnd a young fuckin stalian, Im talking a GodDamn 20 / 10 stands up, licks his finger, sticks it up in the air, and announces for everybody to hear\n,Yeee'up, About that time, the winds are shifting",
            "Holes? you mean, the movie where the shoes fell out of the sky",
            "Best from Head of Jihad",
            "Goooooooooooaaaaaaaaaaat feeereeeeeeeeeeeeeetchhhhhhhhhh sopoooooooooooooooouuuuuuuuup",
            "This is unbeeeeeeeeelieeeevaaable",
            "Im an alabama ni**a and i wanna be free",
            "Ben...\nis that you...?",
            "Ethan...\nis that you...?",
            "Jeremy...\nis that you...?",
            "Joav...\nis that you...?",
            "Howdy, partner. Haven't seen you in this neck of the woods for a while.\nWhat can i do for ya?",
            "Boorsha 911, two thousand and tweeelve",
            "His palms are sweaty, there's vommit on his sweata already\nMoms spaggetti",
            $"Note From Future Self\nIf you are reading this, and it is\n{DateTime.Now.Day} {DateTime.Now.Month} {DateTime.Now.Year} and roughly {DateTime.Now.Hour} : {DateTime.Now.Minute}.\nDon't drink the coffee... Its been poisoned!!\nAwait Further Results",
            "Better to be a warrior in a garden, than a gardener in a war",
            "In prison, your better to be the fucker, than fucked",
            "To friendship to honor. If you cant come in her, come on her",
            "I am americas number wahhaad dush",
            "The greatest victory is that which requires no battle",
            "Victoriorus warriors win first, then go to war, while defeated warriors go to war first then seek to win",
            "In the midst of chaos there is also oportunity",
            "Who that wishes to fight, must first count the cost"
        };
    }
}
