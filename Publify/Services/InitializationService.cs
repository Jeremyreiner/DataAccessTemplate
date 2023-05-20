namespace Publify.Services
{
    public class InitializationService : IHostedService
    {
        readonly MainService _MainService;

        public InitializationService(MainService mainService)
        {
            _MainService = mainService;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await _MainService.StartAsync();
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            await _MainService.StopAsync();
        }
    }
}
