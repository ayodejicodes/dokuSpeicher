import axios, { AxiosResponse } from "axios";
import { http } from "../../../lib/axios/http";
import {
  ApiResponse,
  ShareDocumentRequest,
} from "../../../redux/slices/documentSlice";

const API_URL = "/api/document/";

const createDocument = async (documentData: FormData): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await http.post(`${API_URL}upload`, documentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const getDocuments = async () => {
  try {
    const response = await http.get(API_URL);

    return response.data;
  } catch (error) {
    throw new Error("Documents could not be fetched");
  }
};

const getDocumentById = async (id: string) => {
  try {
    const response = await http.get(`${API_URL}${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Document could not be fetched");
  }
};

const deleteDocument = async (id: string) => {
  const response = await http.delete(`${API_URL}delete/${id}`);

  return response.data;
};

const downloadDocument = async (
  blobName: string
): Promise<AxiosResponse<Blob>> => {
  try {
    const response = await http.get(
      `${API_URL}download?blobNames=${blobName}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    const fileName = blobName.split("-").pop() as string;

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(downloadUrl);
    link.remove();

    return response;
  } catch (error) {
    console.error("Error downloading document:", error);
    throw new Error("Document could not be downloaded");
  }
};

const shareDocument = async (requestData: ShareDocumentRequest) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { documentId, expiryDateTime } = requestData;
  const url = `${baseUrl}/api/documentShareLink/create/${documentId}`;
  const body = { expiryDateTime };
  const response = await axios.post(url, body);
  return response.data;
};

const downloadMultipleDocuments = async (blobNames: string[]) => {
  const queryString = blobNames
    .map((name) => `blobNames=${encodeURIComponent(name)}`)
    .join("&");

  const url = `${API_URL}download?${queryString}`;

  try {
    const response = await http.get(url, {
      responseType: "blob",
    });

    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "documents.zip");
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
    link.remove();
  } catch (error) {
    console.error("Error downloading multiple documents:", error);
    throw new Error("Documents could not be downloaded");
  }
};

const documentService = {
  createDocument,
  getDocuments,

  deleteDocument,
  getDocumentById,
  downloadDocument,
  shareDocument,
  downloadMultipleDocuments,
};

export default documentService;
