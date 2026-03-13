from __future__ import annotations

from datetime import timedelta

from minio import Minio


class ImageService:
	def __init__(
		self,
		endpoint: str,
		access_key: str,
		secret_key: str,
		bucket_name: str,
		secure: bool,
		presign_expiry_seconds: int,
	) -> None:
		self._bucket_name = bucket_name
		self._presign_expiry_seconds = presign_expiry_seconds
		self._client = Minio(endpoint, access_key=access_key, secret_key=secret_key, secure=secure)

	def ensure_bucket(self) -> None:
		if not self._client.bucket_exists(self._bucket_name):
			self._client.make_bucket(self._bucket_name)

	def generate_presigned_upload_url(self, product_id: str, filename: str) -> dict[str, str]:
		object_name = f"products/{product_id}/{filename}"
		url = self._client.presigned_put_object(
			self._bucket_name,
			object_name,
			expires=timedelta(seconds=self._presign_expiry_seconds),
		)
		return {"uploadUrl": url, "objectKey": object_name}
