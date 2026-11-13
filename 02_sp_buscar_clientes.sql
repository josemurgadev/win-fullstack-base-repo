USE PE_WINET_CRM;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Cliente_Buscar
    @Termino VARCHAR(100),
    @Limite INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        DECLARE @TerminoLike VARCHAR(300) =
            REPLACE(REPLACE(REPLACE(@Termino, '[', '[[]'), '%', '[%]'), '_', '[_]');

        BEGIN TRANSACTION;

        SELECT TOP (@Limite)
            Id,
            TipoDocumento,
            NumeroDocumento,
            RazonSocial,
            Segmento,
            Correo
        FROM dbo.Cliente
        WHERE Activo = 1
          AND (
                NumeroDocumento LIKE @TerminoLike + '%'
                OR RazonSocial LIKE '%' + @TerminoLike + '%'
              )
        ORDER BY RazonSocial ASC;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO
