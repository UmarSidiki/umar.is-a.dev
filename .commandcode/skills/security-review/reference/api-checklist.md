# Per-route API checklist (apply to every src/app/api/**/route.ts)

For each exported method (GET/POST/PUT/PATCH/DELETE):
- [ ] Classified: public read | public write | admin-only.
- [ ] Admin-only → `requireAdmin(request)` at the top of the handler, before any DB/storage access.
- [ ] Unsafe method on admin route → Origin check (inside requireAdmin).
- [ ] Public read → only published/approved data; projection excludes emails, IPs, internal fields; may set `Cache-Control: public, s-maxage=<short>, stale-while-revalidate`.
- [ ] Public write → per-IP rate limit, input type/length validation, field whitelist, no privileged fields (approved, featured, status, role, views), honeypot optional.
- [ ] Query/body params used in Mongo queries are strings (reject objects/arrays → 400); ObjectId parsed with `ObjectId.isValid`.
- [ ] Responses for admin/auth/errors: `Cache-Control: private, no-store`.
- [ ] Errors: generic message to client, details only in server logs (no secrets).
- [ ] No `Access-Control-Allow-Origin: *` with credentials or on writes.
- [ ] Uploads: admin, MIME+extension allowlist, size cap, server-generated key, content-type set from allowlist not from client.
- [ ] No debug/test endpoints exposed.
- [ ] next.config.ts headers don't override the above with long public caching for /api/*.
