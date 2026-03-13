from __future__ import annotations

from pydantic import BaseModel, Field


class BulkExportRequest(BaseModel):
	format: str = Field(default="csv", pattern="^(csv|json)$")
	status: str | None = None
	from_date: str | None = Field(default=None, alias="fromDate")
	to_date: str | None = Field(default=None, alias="toDate")


class BulkExportResponse(BaseModel):
	job_id: str = Field(alias="jobId")
	status: str
	export_url: str | None = Field(default=None, alias="exportUrl")
