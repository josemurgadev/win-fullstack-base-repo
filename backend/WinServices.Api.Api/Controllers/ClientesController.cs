using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using WinServices.Api.Application.Interfaces;

namespace WinServices.Api.Api.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/clientes")]
[ApiVersion(1.0)]
public sealed class ClientesController : ControllerBase
{
    private readonly IClienteService _service;

    public ClientesController(IClienteService service)
    {
        _service = service;
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> Buscar(
        [FromQuery(Name = "q")] string termino = "",
        [FromQuery(Name = "limit")] int limite = 10,
        CancellationToken ct = default)
    {
        if (limite <= 0)
        {
            return BadRequest(new { error = "El limite debe ser mayor que cero." });
        }

        var result = await _service.BuscarAsync(termino, limite, ct);
        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        return Ok(result.Value);
    }
}
