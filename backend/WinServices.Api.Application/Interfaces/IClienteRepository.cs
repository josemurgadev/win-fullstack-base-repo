using WinServices.Api.Application.DTOs;

namespace WinServices.Api.Application.Interfaces;

public interface IClienteRepository
{
    Task<IEnumerable<ClienteDto>> BuscarAsync(
        string termino,
        int limite,
        CancellationToken ct = default);
}