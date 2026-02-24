# Task: specific - Implement Bulk Upload Backend & Frontend

- [x] Refactor Text Extraction:
  - [x] Move text extraction logic from `upload_file_endpoint` in `backend/main.py` to a helper function `extract_text_from_upload` in `backend/ai_model.py` (or new `utils.py`, but `ai_model` is fine for now).
- [x] Create New Endpoint in `backend/main.py`:
  - [x] `POST /api/check-file-plagiarism`:
    - [x] Accepts `file: UploadFile`.
    - [x] Accepts `language`, `category` (form data).
    - [x] Uses helper to extract text.
    - [x] Calls `analyze_with_groq_api`.
    - [x] Returns `PlagiarismResult`.
- [x] Update `lib/api.ts`:
  - [x] Add `checkFilePlagiarism(file, language, category)`.
- [x] Connect Frontend `app/dashboard/bulk-upload/page.tsx`:
  - [x] Update `startBulkCheck` to iterate and call `checkFilePlagiarism`.
  - [x] Handle success/error states with real data.
  - [x] Update progress bar based on real processing (simulate 0-100 or use indeterminate). <!-- id: 13 -->
