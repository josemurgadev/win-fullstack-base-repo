
namespace WinServices.Api.Application.DTOs;

public record ClienteDto(
    int Id,
    string TipoDocumento,
    string NumeroDocumento,
    string RazonSocial,
    string Segmento,
    string Correo
);