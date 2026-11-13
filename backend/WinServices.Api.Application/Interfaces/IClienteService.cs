using WinServices.Api.Application.Common;
using WinServices.Api.Application.DTOs;

namespace WinServices.Api.Application.Interfaces;

public interface IClienteService
{
    Task<Result<IEnumerable<ClienteDto>>> BuscarAsync(string termino, int limite, CancellationToken ct = default);
}
