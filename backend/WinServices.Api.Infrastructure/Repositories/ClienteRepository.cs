using System.Data;
using Dapper;
using WinServices.Api.Application.DTOs;
using WinServices.Api.Application.Interfaces;
using WinServices.Api.Infrastructure.Data;

namespace WinServices.Api.Infrastructure.Repositories;

public sealed class ClienteRepository : BaseRepository, IClienteRepository
{
    public ClienteRepository(IDbConnectionFactory connectionFactory)
        : base(connectionFactory)
    {
    }

    public async Task<IEnumerable<ClienteDto>> BuscarAsync(
        string termino,
        int limite,
        CancellationToken ct = default)
    {
        using var connection = ConnectionFactory.CreateConnection();

        var command = new CommandDefinition(
            commandText: "dbo.usp_Cliente_Buscar",
            parameters: new
            {
                Termino = termino,
                Limite = limite
            },
            commandType: CommandType.StoredProcedure,
            cancellationToken: ct);

        return await connection.QueryAsync<ClienteDto>(command);
    }
}