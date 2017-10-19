USE [iwantv4-sit]
GO

/****** Object:  StoredProcedure [dbo].[cb_ref_services_retrieve_duration_hours]    Script Date: 10/19/2017 4:09:49 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cb_ref_services_retrieve_duration_hours]
	@ServiceId INT
AS
BEGIN
SELECT DURATIONHRS from CB_REF_SERVICES WITH (NOLOCK)
END
GO


