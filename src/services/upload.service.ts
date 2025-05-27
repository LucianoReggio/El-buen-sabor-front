import { apiClient } from "./api";

export class UploadService {
  private readonly basePath = "/uploads";

  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    return apiClient.uploadFile<{ url: string; filename: string }>(
      `${this.basePath}/image`,
      file
    );
  }

  async deleteImage(filename: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/image/${filename}`);
  }
}

export const uploadService = new UploadService();
