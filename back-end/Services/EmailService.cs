using System.Net;
using back_end.Options;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace back_end.Services;

public class EmailService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly LinkGenerator _linkGenerator;
    private readonly EmailOptions _emailOptions;
    private readonly string _frontUrl;

    public EmailService(
        IHttpContextAccessor httpContextAccessor,
        LinkGenerator linkGenerator,
        IOptions<EmailOptions> emailOptions,
        IConfiguration configuration)
    {
        _httpContextAccessor = httpContextAccessor;
        _linkGenerator = linkGenerator;
        _emailOptions = emailOptions.Value;
        _frontUrl = configuration.GetValue<string>("FrontEndUrl")!;
    }

    public async Task SendConfirmationEmail(string email, string name, string token)
    {
        var confirmationUrl = $"{_frontUrl}/verify-email";
        
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_emailOptions.EmailName, _emailOptions.User));
        message.Sender = new MailboxAddress(_emailOptions.EmailName, _emailOptions.User);
        message.To.Add(new MailboxAddress(name, email));
        message.Subject = "Email Confirmation";
        message.Body = new TextPart("html")
        {
            Text = $"""
                        <h1>Hello {name}! Welcome to our shop.</h1>
                        <br>
                        <p>Click on the link below to confirm your email.<p>
                        <a href="{confirmationUrl}">Confirm Email</a>
                    """
        };
        
        using var client = new SmtpClient();
        await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        
        await client.AuthenticateAsync(_emailOptions.User, _emailOptions.Password);
        await client.SendAsync(message);
        
        await client.DisconnectAsync(true);
    }
}