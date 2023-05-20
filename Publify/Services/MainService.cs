namespace Template.Services;

public class MainService
{
    readonly IServiceProvider _ServiceProvider;

    readonly ILogger<MainService> _Logger;

    public MainService(IServiceProvider serviceProvider, ILogger<MainService> logger)
    {
        //Used to create scope for dal service 
        _ServiceProvider = serviceProvider;

        _Logger = logger;
    }

    public async Task StartAsync()
    {
        _Logger.LogInformation("Starting Server...");

        _Logger.LogInformation("Server Started.");
    }

    public async Task StopAsync()
    {
        _Logger.LogInformation("Server Shutting Down...");

        _Logger.LogInformation("Server Shut Down.");
    }
}