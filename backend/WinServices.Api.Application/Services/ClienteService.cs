using WinServices.Api.Application.Common;
using WinServices.Api.Application.DTOs;
using WinServices.Api.Application.Interfaces;

namespace WinServices.Api.Application.Services;

public sealed class ClienteService : IClienteService
{
    private const int TERMINO_MIN_LENGTH = 3;
    private const int TERMINO_MAX_LENGTH = 100; // = @Termino VARCHAR(100) del SP
    private const int LIMITE_MIN = 1;
    private const int LIMITE_MAX = 50;

    private readonly IClienteRepository _repository;

    public ClienteService(IClienteRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IEnumerable<ClienteDto>>> BuscarAsync(string termino, int limite, CancellationToken ct = default)
    {
        var terminoLimpio = termino?.Trim() ?? string.Empty;

        if (terminoLimpio.Length < TERMINO_MIN_LENGTH)
        {
            return Result<IEnumerable<ClienteDto>>.Failure(
                $"El término debe tener al menos {TERMINO_MIN_LENGTH} caracteres.");
        }

        if (terminoLimpio.Length > TERMINO_MAX_LENGTH)
        {
            return Result<IEnumerable<ClienteDto>>.Failure(
                $"El término no puede superar {TERMINO_MAX_LENGTH} caracteres.");
        }

        if (limite < LIMITE_MIN || limite > LIMITE_MAX)
        {
            return Result<IEnumerable<ClienteDto>>.Failure(
                $"El límite debe estar entre {LIMITE_MIN} y {LIMITE_MAX}.");
        }

        var clientes = await _repository.BuscarAsync(terminoLimpio, limite, ct);

        return Result<IEnumerable<ClienteDto>>.Success(clientes);
    }
}
