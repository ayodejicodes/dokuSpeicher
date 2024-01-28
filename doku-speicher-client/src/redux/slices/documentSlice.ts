import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import documentService from "../../features/documentManagement/services/documentService";
import { AxiosError } from "axios";

export type Document = {
  documentId: string;
  userId: string;
  name: string;
  type: string;
  uploadDateTime: string;
  lastEditedTime?: string;
  filePath: string;
  previewImagePath?: string;
  downloadCount: number;
  fileSize: number;
  // user?: UserType;
  shareLinks?: ShareLinkResponse[];
  // downloadHistories?: DownloadHistoryType[];
};

export type ShareLinkResponse = {
  shareLinkId: string;
  documentId: string;
  generatedLink: string;
  expiryDateTime: string;
  isActive: boolean;
};

export type ShareDocumentRequest = {
  documentId: string;
  expiryDateTime: string;
};

export type CreateNewDocument = {
  userId: string;
  name: string;
  type: string;
  filePath: string;
};

export type UpdateDocument = {
  documentId: string;
  name?: string;
  type?: string;
  filePath?: string;
};

interface ErrorResponse {
  message?: string;
  error?: string;
}

const getErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ErrorResponse>;
  if (axiosError.response) {
    return (
      axiosError.response.data.message ||
      axiosError.response.data.error ||
      axiosError.response.statusText
    );
  } else if (axiosError.request) {
    return "No response received from the server.";
  } else {
    return axiosError.message || "An unknown error occurred.";
  }
};

export type DocumentsState = {
  documents: Document[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  selectedDocuments: Record<string, boolean>;
  currentDocument: Document | null;
  sharedDocumentLink: ShareLinkResponse | null;
  shouldUpdateDocuments: boolean;
};

// Initial state
const initialState: DocumentsState = {
  documents: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  selectedDocuments: {},
  currentDocument: null,
  sharedDocumentLink: null,
  shouldUpdateDocuments: false,
};

interface DocumentResponse {
  documentId: string;
  userId: string;
  name: string;
  type: string;
  uploadDateTime: string;
  lastEditedTime?: string;
  filePath: string;
  previewImagePath?: string;
  downloadCount: number;
  fileSize: number;
  shareLinks?: string;
}

export type ApiResponse = {
  statusCode: number;
  isSuccess: boolean;
  data: DocumentResponse[];
  errorMessages: string[];
};

interface MyApiErrorResponse {
  errorMessages?: string[];
}

export const createDocument = createAsyncThunk<
  DocumentResponse[],
  FormData,
  { rejectValue: string }
>("documents/create", async (documentData, { rejectWithValue }) => {
  try {
    const response = await documentService.createDocument(documentData);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<MyApiErrorResponse>;
    const errorMessage: string =
      axiosError.response?.data?.errorMessages?.join(", ") ||
      axiosError.message ||
      "An unknown error occurred during the upload.";
    return rejectWithValue(errorMessage);
  }
});

// Async thunk for getting documents
export const getDocuments = createAsyncThunk(
  "documents/getDocuments",
  async (_, thunkAPI) => {
    try {
      return await documentService.getDocuments();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Async thunk for getting one document by ID
export const getDocument = createAsyncThunk(
  "documents/getDocument",
  async (id: string, thunkAPI) => {
    try {
      const response = await documentService.getDocumentById(id);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Async thunk for deleting a document
export const deleteDocument = createAsyncThunk(
  "documents/delete",
  async (id: string, thunkAPI) => {
    try {
      return await documentService.deleteDocument(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Async thunk for downloading a document
export const downloadDocument = createAsyncThunk(
  "documents/blobName",
  async (blobName: string, thunkAPI) => {
    try {
      return await documentService.downloadDocument(blobName);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Async thunk for sharing a document
export const shareDocument = createAsyncThunk(
  "documents/share",
  async (requestData: ShareDocumentRequest, thunkAPI) => {
    try {
      const response = await documentService.shareDocument(requestData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Async thunk for downloading multiple documents
export const downloadMultipleDocuments = createAsyncThunk(
  "documents/downloadMultiple",
  async (blobNames: string[], thunkAPI) => {
    try {
      await documentService.downloadMultipleDocuments(blobNames);
      return { downloaded: true };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    selectDocument: (
      state,
      action: PayloadAction<{ documentId: string; isSelected: boolean }>
    ) => {
      const { documentId, isSelected } = action.payload;
      state.selectedDocuments[documentId] = isSelected;
    },
    toggleSelectAllDocuments: (state, action: PayloadAction<boolean>) => {
      const isSelected = action.payload;

      state.documents.forEach((document) => {
        state.selectedDocuments[document.documentId] = isSelected;
      });
    },
    triggerDocumentUpdate: (state) => {
      state.shouldUpdateDocuments = !state.shouldUpdateDocuments;
    },
    resetDocument: (state) => {
      state.documents = initialState.documents;
      state.isLoading = initialState.isLoading;
      state.isSuccess = initialState.isSuccess;
      state.isError = initialState.isError;
      state.message = initialState.message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const transformedDocuments = action.payload.map((doc) => {
          return {
            ...doc,
            shareLinks: doc.shareLinks ? JSON.parse(doc.shareLinks) : undefined,
          };
        });
        state.documents.push(...transformedDocuments);
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getDocuments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents = action.payload.data;
      })
      .addCase(getDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(deleteDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents.push(action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentDocument = action.payload.data;
      })
      .addCase(getDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(shareDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(shareDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.sharedDocumentLink = action.payload;

        const document = state.documents.find(
          (doc) => doc.documentId === action.payload.documentId
        );
        if (document) {
          document.shareLinks = [
            ...(document.shareLinks || []),
            action.payload,
          ];
        }
      })
      .addCase(shareDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const {
  resetDocument,
  selectDocument,
  toggleSelectAllDocuments,
  triggerDocumentUpdate,
} = documentsSlice.actions;
export default documentsSlice.reducer;
