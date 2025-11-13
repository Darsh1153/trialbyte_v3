# trialbyte-backend-v1

## Database migrations

Run the therapeutic logs/notes migration after pulling recent changes:

```bash
npm run migrate:logs-notes
```

The script will add the missing `internal_note` column on `therapeutic_logs` and migrate `therapeutic_notes` to use JSONB for notes, attachments and source metadata.