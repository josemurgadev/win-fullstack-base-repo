namespace WinServices.Api.Application.DTOs;

public sealed record ClienteDto(
    int Id,
    string TipoDocumento,
    string NumeroDocumento,
    string RazonSocial,
    string Segmento,
    string Correo
);
