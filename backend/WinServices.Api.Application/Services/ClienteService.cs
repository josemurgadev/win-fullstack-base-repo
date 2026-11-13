using WinServices.Api.Application.Common;
using WinServices.Api.Application.DTOs;
using WinServices.Api.Application.Interfaces;

namespace WinServices.Api.Application.Services;

public sealed class ClienteService : IClienteService
{
    private readonly IClienteRepository _repository;

    public ClienteService(IClienteRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<ClienteDto>>> BuscarAsync(string termino, int limite, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(termino) || termino.Trim().Length < 3)
        {
            return Result<IEnumerable<ClienteDto>>.Failure(
                "El término debe tener al menos 3 caracteres.");
        }

        var clientes = await _repository.BuscarAsync(termino.Trim(), limite, ct);

        return Result<IEnumerable<ClienteDto>>.Success(clientes);
    }
}